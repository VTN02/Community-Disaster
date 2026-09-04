const { generateDisasterResponse } = require('../services/groqService');

// @desc    Handle chat question about disaster preparedness and safety
// @route   POST /api/chat
// @access  Public
const handleChat = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Request body must be a JSON object containing a "message" field.',
      });
    }

    const { message } = req.body;

    // Check if message is missing or not a string
    if (typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be text.',
      });
    }

    const trimmedMessage = message.trim();

    // Check for empty message
    if (trimmedMessage.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty. Please enter your disaster-related question.',
      });
    }

    // Check reasonable length limit
    if (trimmedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message is too long. Please keep your question under 2000 characters.',
      });
    }

    // Generate reply via Groq
    const result = await generateDisasterResponse(trimmedMessage);

    return res.status(200).json({
      success: true,
      reply: result.reply,
    });
  } catch (error) {
    console.error('Chat error:', error.message);

    // Differentiate status codes
    const statusCode = error.statusCode || 500;

    let userMessage = error.message;
    if (error.isConfigError) {
      userMessage = 'Disaster Assistant is currently not configured with an API key. Please check server settings.';
    } else if (error.isAuthError) {
      userMessage = 'Disaster Assistant authentication failed. The Groq API key is invalid or expired.';
    } else if (statusCode === 504) {
      userMessage = 'The Disaster Assistant timed out waiting for a response. Please try again in a moment.';
    } else if (statusCode === 429) {
      userMessage = 'The Disaster Assistant is experiencing high traffic. Please wait a moment and try again.';
    }

    return res.status(statusCode).json({
      success: false,
      error: userMessage,
    });
  }
};

module.exports = {
  handleChat,
};
