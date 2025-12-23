'use client';

import { useEffect, useState, FormEvent } from 'react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/image-upload';

interface PrincipalMessage {
  name: string;
  title: string;
  photo: string | null;
  message: string;
  qualification: string;
}

export default function PrincipalPage() {
  const [data, setData] = useState<PrincipalMessage>({
    name: '',
    title: '',
    photo: null,
    message: '',
    qualification: '',
  });
  const [initialData, setInitialData] = useState<PrincipalMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/admin/content/principal/');
      setData(response.data);
      setInitialData(response.data);
    } catch (error) {
      console.error('Error fetching principal data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('message', data.message);
      formData.append('qualification', data.qualification);
      
      if (newImage) {
        formData.append('photo', newImage);
      }

      const response = await api.put('/api/admin/content/principal/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setData(response.data);
      setNewImage(null);
      setMessage({ type: 'success', text: 'Principal message updated successfully' });
    } catch (error: any) {
      console.error('Error updating principal message:', error);
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
        setMessage({ type: 'error', text: 'Please check the form for errors.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update principal message' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const response = await api.post('/api/admin/content/principal/reset/');
      setData(response.data.data);
      setInitialData(response.data.data);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      console.error('Error resetting principal:', error);
      setMessage({ type: 'error', text: 'Failed to reset principal section' });
    } finally {
      setSaving(false);
      setShowResetModal(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Principal&apos;s Message</h1>
          <p className="text-gray-400">Manage principal information and welcome message</p>
        </div>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
        >
          🗑️ Reset Section
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    errors.name ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="e.g. Dr. Rajesh Kumar"
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    errors.title ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="e.g. Principal"
                />
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Qualifications *</label>
                <input
                  type="text"
                  name="qualification"
                  value={data.qualification}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    errors.qualification ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="e.g. M.Sc., B.Ed., Ph.D."
                />
                {errors.qualification && (
                  <p className="text-xs text-red-400">{errors.qualification[0]}</p>
                )}
              </div>
            </div>

            <div>
              <ImageUpload
                label="Principal's Photo"
                currentImage={data.photo}
                onChange={(file) => setNewImage(file)}
              />
              <p className="mt-2 text-xs text-gray-500">
                Recommended: A professional portrait photo.
              </p>
              {errors.photo && (
                <p className="text-xs text-red-400">{errors.photo[0]}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-gray-300">Message *</label>
            <textarea
              name="message"
              value={data.message}
              onChange={handleChange}
              rows={6}
              required
              className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                errors.message ? 'border-red-500/50' : 'border-white/10'
              }`}
              placeholder="Write the principal's welcome message here..."
            />
            {errors.message && (
              <p className="text-xs text-red-400">{errors.message[0]}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              saving || 
              !data.name ||
              !data.title ||
              !data.message
            }
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Reset Principal Section</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to reset the principal section? This will clear all content including the photo. This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all"
              >
                {saving ? 'Resetting...' : 'Reset Section'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
