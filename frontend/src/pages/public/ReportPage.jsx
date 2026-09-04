import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';
import { reportsApi } from '../../services/api';
import ReportForm from '../../components/disaster/ReportForm';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ReportPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (reportData) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await reportsApi.create(reportData);
      if (res.data.success) {
        setSubmittedReport(res.data.data);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Unable to transmit report. Please verify connection and retry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full animate-slide-up">
          <Card className="p-8 text-center bg-white shadow-lg border-emerald-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-2">Report Transmitted!</h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Thank you for providing vital situational intelligence. Your report has been dispatched to
              the emergency management network.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200/80 mb-6 text-xs space-y-1.5">
              <p className="font-bold text-slate-800">
                Incident ID: <span className="font-mono text-blue-600">{submittedReport._id}</span>
              </p>
              <p className="text-slate-600">
                Category: <strong className="text-slate-900">{submittedReport.type}</strong>
              </p>
              <p className="text-slate-600">
                District: <strong className="text-slate-900">{submittedReport.district}</strong>
              </p>
              <p className="text-slate-600">
                Status: <span className="font-semibold text-amber-600">Dispatched for Field Verification</span>
              </p>
            </div>

            <div className="space-y-2.5">
              <Link to="/disasters" className="block">
                <Button variant="primary" fullWidth size="md">
                  View Active Disaster Reports
                </Button>
              </Link>
              <Button
                variant="outline"
                fullWidth
                size="md"
                onClick={() => setSubmittedReport(null)}
              >
                Submit Another Incident
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header navigation & title */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-2xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Report a Disaster Incident
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Report hazards, flood levels, landslides, or blockages to alert local responders.
              </p>
            </div>
          </div>
        </div>

        {/* Life-threatening Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-2xs">
          <span className="text-2xl mt-0.5">🚨</span>
          <div className="text-xs sm:text-sm text-red-900">
            <p className="font-bold">Immediate Life Threat or Rescue Needed?</p>
            <p className="mt-0.5 leading-relaxed text-red-800">
              Do not rely solely on web forms. Call emergency hotlines immediately:{' '}
              <a href="tel:119" className="font-black underline ml-1">119 (Police)</a>,{' '}
              <a href="tel:110" className="font-black underline ml-1">110 (Fire & Rescue)</a>, or{' '}
              <a href="tel:1990" className="font-black underline ml-1">1990 (Ambulance)</a>.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-xs sm:text-sm mb-6 font-semibold">
            {submitError}
          </div>
        )}

        {/* Main 4-step Reporting Form */}
        <ReportForm onSubmitReport={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
};

export default ReportPage;
