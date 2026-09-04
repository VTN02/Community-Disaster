import { Shield } from 'lucide-react';

const guidelines = [
  {
    type: 'Flood',
    icon: '🌊',
    color: 'border-t-blue-500',
    iconBg: 'bg-blue-50',
    tips: [
      'Move to higher ground immediately if instructed by authorities.',
      'Never walk or drive through floodwater — 6 inches of moving water can knock you down.',
      'Stay away from electrical equipment, panels, and outlets in flooded areas.',
      'Avoid bridges over fast-moving water.',
      'If your car stalls in floodwater, abandon it and move to higher ground.',
      'Follow all evacuation orders from official emergency services.',
    ],
    before: [
      'Know your evacuation routes in advance.',
      'Prepare an emergency kit with food, water, medicines, and documents.',
      'Monitor official weather warnings and alerts.',
    ],
  },
  {
    type: 'Landslide',
    icon: '⛰️',
    color: 'border-t-amber-600',
    iconBg: 'bg-amber-50',
    tips: [
      'Move away from unstable slopes, valleys, and stream channels immediately.',
      'Avoid roads and areas affected by landslides — they may be structurally unstable.',
      'Listen for unusual sounds like cracking trees or boulders knocking together.',
      'Follow evacuation instructions from civil authorities.',
      'Contact emergency services immediately if people are trapped.',
    ],
    before: [
      'Identify if you live in a landslide-prone area.',
      'Avoid building near steep slopes or drainage channels.',
      'Plant ground cover on slopes to prevent soil erosion.',
    ],
  },
  {
    type: 'Heavy Rain & Storm',
    icon: '🌧️',
    color: 'border-t-slate-500',
    iconBg: 'bg-slate-50',
    tips: [
      'Stay indoors and away from windows during heavy rain and storms.',
      'Avoid unnecessary travel — roads may be flooded or blocked.',
      'Stay away from trees, power lines, and metal structures.',
      'Do not use electrical appliances during lightning storms.',
      'Monitor official weather bulletins from the Department of Meteorology.',
      'Keep emergency supplies and a battery-powered radio available.',
    ],
    before: [
      'Secure loose items outside your home before a storm.',
      'Check roof and drainage systems regularly.',
      'Know your local emergency shelter locations.',
    ],
  },
  {
    type: 'Fire',
    icon: '🔥',
    color: 'border-t-red-600',
    iconBg: 'bg-red-50',
    tips: [
      'Call 110 (Fire & Rescue Services) immediately.',
      'Evacuate the building immediately — do not stop to collect belongings.',
      'Stay low if there is smoke — fresh air is near the floor.',
      'Do not use elevators — use stairways only.',
      'Do not re-enter a building that has been on fire without clearance from fire services.',
      'Meet at a pre-planned gathering point outside.',
    ],
    before: [
      'Install and test smoke alarms in your home regularly.',
      'Plan and practise fire escape routes with your family.',
      'Keep fire extinguishers accessible and know how to use them.',
    ],
  },
  {
    type: 'Road Blockage',
    icon: '🚧',
    color: 'border-t-yellow-500',
    iconBg: 'bg-yellow-50',
    tips: [
      'Do not attempt to cross a blocked or flooded road.',
      'Use alternate routes — check Sri Lanka Police traffic updates.',
      'Follow instructions from police officers and road personnel.',
      'Report road blockages using Disaster Management LK to help others.',
      'Keep a safe distance from fallen trees and debris.',
    ],
    before: [],
  },
  {
    type: 'Building Damage',
    icon: '🏚️',
    color: 'border-t-orange-500',
    iconBg: 'bg-orange-50',
    tips: [
      'Do not enter a damaged building — it may collapse without warning.',
      'Evacuate immediately and move to an open, safe location.',
      'Contact emergency services if people are trapped inside.',
      'Stay clear of unstable walls, roofs, and floors.',
      'Turn off electricity, gas, and water supply if safe to do so.',
    ],
    before: [
      'Have your building inspected periodically for structural integrity.',
      'Know how to shut off utilities in an emergency.',
    ],
  },
];

const SafetyPage = () => (
  <div className="min-h-screen bg-slate-50">
    {/* Header */}
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Safety Guidelines</h1>
        <p className="text-slate-300 text-lg">
          What to do before, during, and after common disasters in Sri Lanka.
        </p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {guidelines.map((guide) => (
        <div key={guide.type} className={`card border-t-4 ${guide.color} overflow-hidden`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${guide.iconBg} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
                {guide.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{guide.type}</h2>
                <p className="text-sm text-slate-500">Safety recommendations</p>
              </div>
            </div>

            <div className={`grid ${guide.before.length > 0 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              {/* During / After */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">
                  During an Incident
                </h3>
                <ul className="space-y-2.5">
                  {guide.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Before */}
              {guide.before.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">
                    Before a Disaster
                  </h3>
                  <ul className="space-y-2.5">
                    {guide.before.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* General Preparedness */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <h2 className="text-xl font-bold text-blue-900 mb-4">🎒 General Emergency Preparedness</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '💧', tip: 'Store at least 3 days of drinking water (4 litres per person per day).' },
            { icon: '🍱', tip: 'Keep non-perishable food supplies and a manual can opener.' },
            { icon: '💊', tip: 'Maintain a first aid kit and a supply of essential medications.' },
            { icon: '🔦', tip: 'Have torches, candles, matches, and a battery-powered radio.' },
            { icon: '📄', tip: 'Store copies of important documents in a waterproof bag.' },
            { icon: '📞', tip: 'Know emergency contact numbers and have them memorised.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Resources */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-4">📡 Official Resources</h2>
        <div className="space-y-3">
          {[
            { name: 'Sri Lanka Disaster Management Centre', url: 'https://www.dmc.gov.lk', desc: 'Official disaster management authority' },
            { name: 'Department of Meteorology', url: 'https://www.meteo.gov.lk', desc: 'Weather forecasts and warnings' },
            { name: 'National Building Research Organisation', url: 'https://www.nbro.gov.lk', desc: 'Landslide early warning system' },
          ].map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 hover:border-blue-200 transition-all duration-200 group">
              <div>
                <p className="font-semibold text-slate-800 group-hover:text-blue-700 text-sm">{r.name}</p>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </div>
              <span className="text-slate-400 group-hover:text-blue-500 text-sm">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SafetyPage;
