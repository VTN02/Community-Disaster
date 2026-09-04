import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Phone, X, Check } from 'lucide-react';
import { emergencyApi } from '../../services/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { showToast } from '../../components/common/Toast';

const CATEGORIES = ['police', 'fire', 'medical', 'disaster', 'utility', 'other'];

const ContactForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || { name: '', organization: '', phone: '', category: 'police', description: '', order: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.organization || !form.phone || !form.category) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900">{initial?._id ? 'Edit Contact' : 'Add Contact'}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Police Emergency" />
            </div>
            <div>
              <label className="label">Organization *</label>
              <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="input-field" placeholder="e.g. Sri Lanka Police" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone Number *</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="e.g. 119" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-ghost border border-slate-200 flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Check className="w-4 h-4" />
              {initial?._id ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminEmergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editContact, setEditContact] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await emergencyApi.getAllAdmin();
      setContacts(res.data.data);
    } catch {
      showToast('Failed to load contacts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleSave = async (form) => {
    try {
      if (form._id) {
        await emergencyApi.update(form._id, form);
        showToast('Contact updated.', 'success');
      } else {
        await emergencyApi.create(form);
        showToast('Contact added.', 'success');
      }
      setEditContact(null);
      setAdding(false);
      fetchContacts();
    } catch {
      showToast('Failed to save contact.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await emergencyApi.delete(id);
      showToast('Contact deleted.', 'success');
      setDeleteConfirm(null);
      fetchContacts();
    } catch {
      showToast('Failed to delete contact.', 'error');
    }
  };

  return (
    <AdminSidebar>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Emergency Contacts</h1>
            <p className="text-slate-500 text-sm mt-1">{contacts.length} contacts</p>
          </div>
          <button onClick={() => setAdding(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading contacts..." />
        ) : contacts.length === 0 ? (
          <EmptyState title="No emergency contacts" message="Add contacts using the button above." icon={Phone} />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Organization</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Phone</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.organization}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${c.phone}`} className="font-bold text-blue-600 hover:text-blue-800">{c.phone}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-slate-100 text-slate-700 border border-slate-200">{c.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge border ${c.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditContact(c)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(c._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(adding || editContact) && (
        <ContactForm
          initial={editContact || null}
          onSave={handleSave}
          onCancel={() => { setAdding(false); setEditContact(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-slate-900 mb-2">Delete Contact</h3>
            <p className="text-slate-600 text-sm mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-ghost border border-slate-200 flex-1 justify-center">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1 justify-center">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminSidebar>
  );
};

export default AdminEmergency;
