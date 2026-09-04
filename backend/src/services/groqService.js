const SYSTEM_PROMPT = `You are a Disaster Information Assistant. Your job is to provide clear, practical, and easy-to-understand information about disasters, emergency preparedness, safety procedures, response, and recovery.

Answer questions related to floods, cyclones, earthquakes, tsunamis, landslides, droughts, fires, storms, extreme weather, emergency preparedness, evacuation, first-aid basics, emergency kits, and post-disaster recovery.

Give concise, practical, step-by-step guidance when appropriate. Use bullet points and bold highlights for readability.

Prioritize human safety. If a situation appears to be an immediate emergency, advise the user to contact local emergency services and follow official instructions from relevant authorities immediately. In Sri Lanka, key emergency numbers are:
- Police Emergency: 119
- Fire & Rescue: 110
- Suwa Seriya Ambulance: 1990
- Disaster Management Centre (DMC): 117
- Sri Lanka Red Cross: 011 269 1095

Do not invent emergency phone numbers, evacuation orders, shelter locations, warnings, or real-time disaster information. When information is location-specific or time-sensitive, clearly tell the user to check official local authorities and emergency alerts (such as the Disaster Management Centre www.dmc.gov.lk and Department of Meteorology www.meteo.gov.lk).

Do not answer unrelated questions as though they are disaster-related. Politely explain that the chatbot is designed specifically for disaster and emergency-related questions.

Do not present yourself as a government authority, emergency responder, doctor, or professional rescue service.

Use simple language suitable for the general public.`;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'qwen/qwen3.8-27b';

/**
 * Call Groq API to generate a disaster safety response
 * @param {string} userMessage 
 * @returns {Promise<{ reply: string }>}
 */
async function generateDisasterResponse(userMessage) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key') {
    const error = new Error('GROQ_API_KEY is not configured on the server. Please check backend .env file.');
    error.statusCode = 500;
    error.isConfigError = true;
    throw error;
  }

  const modelsToTry = [DEFAULT_MODEL];
  if (DEFAULT_MODEL !== FALLBACK_MODEL) {
    modelsToTry.push(FALLBACK_MODEL);
  }

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      // 25-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage.trim() },
          ],
          temperature: 0.4,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.error?.message || `Groq API returned HTTP ${response.status}`;
        const err = new Error(errorMsg);
        err.statusCode = response.status;
        err.groqError = data?.error;

        // If it's a 401, don't try other models - the key itself is wrong
        if (response.status === 401) {
          err.isAuthError = true;
          throw err;
        }

        // If model not found, try fallback
        if (data?.error?.code === 'model_not_found') {
          lastError = err;
          continue;
        }

        throw err;
      }

      const replyContent = data.choices?.[0]?.message?.content;
      if (!replyContent || replyContent.trim() === '') {
        throw new Error('Received an empty response from Groq API.');
      }

      return { reply: replyContent.trim() };
    } catch (err) {
      if (err.name === 'AbortError') {
        const timeoutError = new Error('Request to AI service timed out after 25 seconds. Please try again.');
        timeoutError.statusCode = 504;
        throw timeoutError;
      }
      if (err.isAuthError || err.isConfigError) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate response from Groq API.');
}

module.exports = {
  generateDisasterResponse,
  SYSTEM_PROMPT,
};
