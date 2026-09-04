import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  MapPin,
  MessageSquare,
  User,
  Phone,
  Camera,
  X,
  CheckCircle,
  HelpCircle,
  Upload,
} from 'lucide-react';
import LocationPicker from '../map/LocationPicker';
import Button from '../common/Button';
import Card from '../common/Card';
import { DISASTER_TYPES, SRI_LANKA_DISTRICTS, DISASTER_ICONS } from '../../utils/constants';

const schema = z.object({
  type: z.string().min(1, 'Please select a disaster type.'),
  severity: z.string().min(1, 'Please select a severity level.'),
  description: z.string().min(20, 'Please provide more details (at least 20 characters).'),
  district: z.string().min(1, 'Please select the affected district.'),
  area: z.string().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
});

const severityOptions = [
  {
    id: 'low',
    label: 'Low',
    desc: 'Minor disruption or localized issue',
    color: 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 text-emerald-900',
    activeColor: 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  {
    id: 'medium',
    label: 'Medium',
    desc: 'Significant disruption, properties at risk',
    color: 'border-amber-300 hover:border-amber-500 bg-amber-50/40 text-amber-900',
    activeColor: 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20',
    dot: 'bg-amber-500',
  },
  {
    id: 'high',
    label: 'High',
    desc: 'Severe danger, evacuations needed',
    color: 'border-orange-300 hover:border-orange-500 bg-orange-50/40 text-orange-900',
    activeColor: 'border-orange-600 bg-orange-50 ring-2 ring-orange-500/20',
    dot: 'bg-orange-500',
  },
  {
    id: 'critical',
    label: 'Critical',
    desc: 'Immediate threat to human life',
    color: 'border-red-300 hover:border-red-500 bg-red-50/40 text-red-900',
    activeColor: 'border-red-600 bg-red-50 ring-2 ring-red-500/20',
    dot: 'bg-red-600',
  },
];

const ReportForm = ({ onSubmitReport, submitting = false }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'Flood',
      severity: 'medium',
      district: 'Colombo',
      area: '',
      description: '',
      reporterName: '',
      reporterContact: '',
    },
  });

  const currentType = watch('type');
  const currentSeverity = watch('severity');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleFormSubmit = async (data) => {
    if (!location?.latitude || !location?.longitude) {
      setLocationError('Please pinpoint or select the incident location on the map.');
      return;
    }
    setLocationError('');

    const payload = {
      ...data,
      location,
      imageUrl: selectedImage || null,
      reporterName: isAnonymous ? 'Anonymous Citizen' : data.reporterName || 'Anonymous',
      reporterContact: isAnonymous ? '' : data.reporterContact || '',
    };

    if (onSubmitReport) {
      await onSubmitReport(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 1. Incident Category */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <Card.Title>Incident Category</Card.Title>
              <Card.Description>Select the type of disaster you are observing</Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DISASTER_TYPES.map((type) => {
              const isSelected = currentType === type;
              const icon = DISASTER_ICONS[type] || '⚠️';
              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setValue('type', type)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-2">{icon}</span>
                  <span className="text-xs font-bold leading-tight">{type}</span>
                </button>
              );
            })}
          </div>
          {errors.type && <p className="mt-2 text-xs text-red-600 font-semibold">{errors.type.message}</p>}
        </Card.Content>
      </Card>

      {/* 2. Severity Level */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <Card.Title>Severity & Impact Level</Card.Title>
              <Card.Description>Estimate the current danger to lives and infrastructure</Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="grid sm:grid-cols-2 gap-3">
            {severityOptions.map((opt) => {
              const isSelected = currentSeverity === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setValue('severity', opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 ${
                    isSelected ? opt.activeColor : opt.color
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${opt.dot}`} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">{opt.label}</span>
                    <span className="text-xs opacity-80 mt-0.5 block leading-normal">{opt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.severity && <p className="mt-2 text-xs text-red-600 font-semibold">{errors.severity.message}</p>}
        </Card.Content>
      </Card>

      {/* 3. Location Picker */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <div>
              <Card.Title>Location & Region</Card.Title>
              <Card.Description>Specify the district and tap on the map to pinpoint exact coordinates</Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="label">
                District *
              </label>
              <select
                id="district"
                {...register('district')}
                className={`input-field ${errors.district ? 'input-error' : ''}`}
              >
                <option value="">Select District...</option>
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.district.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="area" className="label">
                Town / Landmark (Optional)
              </label>
              <input
                id="area"
                type="text"
                placeholder="e.g. Near Kadugannawa Junction, Baseline Road"
                {...register('area')}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center justify-between">
              <span>Interactive Map Pin *</span>
              {location && (
                <span className="text-emerald-600 font-bold normal-case text-xs flex items-center gap-1">
                  ✓ Selected ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                </span>
              )}
            </label>
            <LocationPicker value={location} onChange={setLocation} />
            {locationError && (
              <p className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {locationError}
              </p>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* 4. Description & Photos */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </div>
            <div>
              <Card.Title>Situation Details & Media</Card.Title>
              <Card.Description>Provide facts to assist rescue units and first responders</Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="space-y-4">
          <div>
            <label htmlFor="description" className="label">
              Detailed Description *
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe what is occurring: estimated water depth, blocked routes, trapped citizens, structural damage, etc. (minimum 20 characters)"
              {...register('description')}
              className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-600 font-semibold">{errors.description.message}</p>
            )}
          </div>

          {/* Photo upload */}
          <div>
            <label className="label">Incident Photograph (Optional)</label>
            {selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-w-sm">
                <img src={selectedImage} alt="Preview" className="w-full h-44 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/20 text-center">
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Upload an Incident Photo</span>
                <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </label>
            )}
          </div>

          {/* Reporter Contact Info */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Reporter Information</p>
                <p className="text-[11px] text-slate-500">Allows emergency coordinators to follow up if needed</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                  isAnonymous
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isAnonymous ? '✓ Submitting Anonymously' : 'Stay Anonymous'}
              </button>
            </div>

            {!isAnonymous && (
              <div className="grid sm:grid-cols-2 gap-3 animate-fade-in">
                <div>
                  <label htmlFor="reporterName" className="label">
                    Your Name (Optional)
                  </label>
                  <input
                    id="reporterName"
                    type="text"
                    placeholder="e.g. Janaka Silva"
                    {...register('reporterName')}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="reporterContact" className="label">
                    Contact Phone (Optional)
                  </label>
                  <input
                    id="reporterContact"
                    type="tel"
                    placeholder="0771234567"
                    {...register('reporterContact')}
                    className="input-field text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="danger"
          size="lg"
          fullWidth
          loading={submitting}
          icon={AlertTriangle}
          className="shadow-lg shadow-red-600/20 text-base"
        >
          {submitting ? 'Transmitting Emergency Report...' : 'Transmit Disaster Incident Report'}
        </Button>
        <p className="text-[11px] text-center text-slate-400 mt-2.5">
          By transmitting, you confirm this information is accurate to the best of your knowledge.
        </p>
      </div>
    </form>
  );
};

export default ReportForm;
