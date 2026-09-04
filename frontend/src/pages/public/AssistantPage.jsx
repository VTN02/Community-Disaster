import { Bot, Shield, Phone, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import ChatView from '../../components/chat/ChatView';

const AssistantPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100/70 py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-3.5 py-1 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI-Powered Emergency Guidance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Disaster Information Assistant
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Ask questions about disaster safety, preparedness, evacuation, and recovery.
            </p>
          </div>

          {/* Emergency Quick Pill */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 sm:px-5 sm:py-3 flex items-center gap-3 self-start md:self-auto">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-900">Life-Threatening Emergency?</p>
              <p className="text-xs text-red-700">
                Call DMC <strong className="text-red-900 underline">117</strong> or Police{' '}
                <strong className="text-red-900 underline">119</strong> immediately
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Chatbot Card + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Area */}
          <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[640px] flex flex-col">
            <ChatView isCompact={false} />
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Sri Lanka Emergency Contacts Card */}
            <div className="card p-5 bg-white border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Sri Lanka Emergency Numbers</span>
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { name: 'Disaster Management Centre', number: '117', desc: 'Disaster relief & coordination' },
                  { name: 'Police Emergency Service', number: '119', desc: 'Law enforcement & immediate aid' },
                  { name: 'Suwa Seriya Ambulance', number: '1990', desc: 'Free 24/7 medical emergency' },
                  { name: 'Fire & Rescue Service', number: '110', desc: 'Firefighting & trapped victims' },
                ].map((item) => (
                  <a
                    key={item.number}
                    href={`tel:${item.number}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all group"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 text-xs group-hover:text-blue-700">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <span className="font-extrabold text-red-600 bg-red-50 group-hover:bg-red-100 px-2 py-1 rounded-lg text-xs">
                      {item.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* AI Scope & Usage Tips */}
            <div className="card p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-slate-700">
              <h3 className="text-sm font-bold text-blue-950 mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <span>What can you ask?</span>
              </h3>
              <ul className="text-xs space-y-2 text-slate-600 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Disasters:</strong> Floods, cyclones, earthquakes, tsunamis, landslides, fires.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Preparedness:</strong> Assembling family emergency kits, first-aid tips.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Evacuation:</strong> When and how to evacuate safely to higher ground.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Recovery:</strong> Post-disaster hygiene, water purification, safety checks.</span>
                </li>
              </ul>
            </div>

            {/* Official Authorities */}
            <div className="card p-5 bg-white border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Official Authorities</h3>
              <div className="space-y-2 text-xs">
                <a
                  href="http://www.dmc.gov.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <span>Disaster Management Centre (DMC)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="http://www.meteo.gov.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <span>Department of Meteorology</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="http://www.nbro.gov.lk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <span>National Building Research Org (NBRO)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
