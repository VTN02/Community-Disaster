import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, CheckCircle, User, MessageSquare } from 'lucide-react';
import { reportsApi } from '../../services/api';
import LocationPicker from '../../components/map/LocationPicker';
import { DISASTER_TYPES, SRI_LANKA_DISTRICTS } from '../../utils/constants';

const schema = z.object({
  type: z.string().min(1, 'Please select a disaster type.'),
  severity: z.string().min(1, 'Please select a severity level.'),
  description: z.string().min(20, 'Please provide more information (at least 20 characters).'),
  district: z.string().min(1, 'Please select a district.'),
  area: z.string().optional(),
  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),
});

const ReportPage = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if (!location?.latitude || !location?.longitude) {
      setLocationError('Please select or share the incident location.');
      return;
    }
    setLocationError('');
    setSubmitError('');
    setSubmitting(true);

    try {
      await reportsApi.create({ ...data, location });
      setSubmitted(true);
      reset();
      setLocation(null);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Unable to submit report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="card p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Report Submitted!</h2>
            <p className="text-slate-600 mb-2">
              Thank you for helping keep your community informed.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Your report will be reviewed and verified by our administrators.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary w-full justify-center"
              >
                Submit Another Report
              </button>
              <a href="/disasters" className="btn-outline w-full justify-center">
                View Active Reports
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Report a Disaster</h1>
          </div>
          <p className="text-slate-500">
            Help your community stay safe by reporting local disaster situations. 
            Your report will be reviewed and published after verification.
          </p>
        </div>

        {/* Important notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-red-600 text-xl mt-0.5">⚠️</span>
          <div>
            <p className="font-semibold text-red-800 text-sm">In life-threatening situations</p>
            <p className="text-red-700 text-sm">
              Call <strong>119</strong> (Police), <strong>110</strong> (Fire), or <strong>1990</strong> (Ambulance) immediately.
              This platform is for community information sharing only.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Disaster Type */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Incident Type & Severity
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="type">Disaster Type *</label>
                <select
                  id="type"
                  {...register('type')}
                  className={`input-field ${errors.type ? 'input-error' : ''}`}
                >
                  <option value="">Select type...</option>
                  {DISASTER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1.5 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="label" htmlFor="severity">Severity Level *</label>
                <select
                  id="severity"
                  {...register('severity')}
                  className={`input-field ${errors.severity ? 'input-error' : ''}`}
                >
                  <option value="">Select severity...</option>
                  <option value="low">🟢 Low — Minor inconvenience</option>
                  <option value="medium">🟡 Medium — Significant disruption</option>
                  <option value="high">🟠 High — Danger to people/property</option>
                  <option value="critical">🔴 Critical — Immediate life threat</option>
                </select>
                {errors.severity && <p className="mt-1.5 text-sm text-red-600">{errors.severity.message}</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Incident Location
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label" htmlFor="district">District *</label>
                <select
                  id="district"
                  {...register('district')}
                  className={`input-field ${errors.district ? 'input-error' : ''}`}
                >
                  <option value="">Select district...</option>
                  {SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="mt-1.5 text-sm text-red-600">{errors.district.message}</p>}
              </div>
              <div>
                <label className="label" htmlFor="area">Area / Town (Optional)</label>
                <input
                  id="area"
                  {...register('area')}
                  placeholder="e.g. Gampaha Town"
                  className="input-field"
                />
              </div>
            </div>

            <label className="label">Map Location *</label>
            <LocationPicker value={location} onChange={setLocation} />
            {locationError && <p className="mt-2 text-sm text-red-600">{locationError}</p>}
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <MessageSquare className="w-4 h-4" />
              Description
            </h2>
            <label className="label" htmlFor="description">Describe what is happening *</label>
            <textarea
              id="description"
              {...register('description')}
              rows={5}
              placeholder="Describe the situation clearly. Include details such as: what is happening, how many people are affected, what roads are blocked, water levels, etc."
              className={`input-field resize-none ${errors.description ? 'input-error' : ''}`}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Reporter Info */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <User className="w-4 h-4" />
              Your Information (Optional)
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Your information is optional and will not be shared publicly. It helps administrators follow up if needed.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="reporterName">Your Name</label>
                <input
                  id="reporterName"
                  {...register('reporterName')}
                  placeholder="Anonymous"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label" htmlFor="reporterContact">Phone Number</label>
                <input
                  id="reporterContact"
                  {...register('reporterContact')}
                  placeholder="Optional"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            id="submit-report-btn"
            disabled={submitting}
            className="btn-danger w-full justify-center text-base py-4"
          >
            <AlertTriangle className="w-5 h-5" />
            {submitting ? 'Submitting Report...' : '🚨 Submit Disaster Report'}
          </button>

          <p className="text-center text-xs text-slate-400">
            By submitting, you confirm that this report is accurate to the best of your knowledge.
            False reports may mislead emergency responders.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReportPage;
