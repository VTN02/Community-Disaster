import { useState, useEffect } from 'react';
import { reportsApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DisasterMap from '../../components/map/DisasterMap';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMap = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await reportsApi.getAll({ limit: 500 });
        setReports(res.data.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Incident Map</h1>
          <p className="text-slate-500 text-sm mt-1">
            {reports.length} incidents across Sri Lanka — click markers for details
          </p>
        </div>
        {loading ? (
          <LoadingSpinner message="Loading map data..." />
        ) : (
          <DisasterMap reports={reports} height="calc(100vh - 180px)" />
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminMap;
