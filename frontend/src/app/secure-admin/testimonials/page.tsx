'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/image-upload';

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  content: string;
  photo: string | null;
  rating: number;
  order: number;
  is_active: boolean;
}

export default function TestimonialsManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [initialEditingData, setInitialEditingData] = useState<Testimonial | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/v1/school-info/admin/testimonials/');
      setTestimonials(res.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', editing.name);
      formData.append('role', editing.role);
      formData.append('content', editing.content);
      formData.append('rating', editing.rating.toString());
      formData.append('order', editing.order.toString());
      formData.append('is_active', String(editing.is_active));
      
      if (newImage) {
        formData.append('photo', newImage);
      } else if (editing.photo === null && initialEditingData?.photo) {
        // Handle image deletion if backend supports it
        // formData.append('photo', ''); 
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editing.id) {
        await api.put(`/api/v1/school-info/admin/testimonials/${editing.id}/`, formData, config);
      } else {
        await api.post('/api/v1/school-info/admin/testimonials/', formData, config);
      }
      fetchData();
      setShowModal(false);
      setEditing(null);
      setNewImage(null);
      setInitialEditingData(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await api.delete(`/api/v1/school-info/admin/testimonials/${deleteId}/`);
      fetchData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">What Parents Say</h1>
          <p className="text-gray-400">Manage testimonials from parents and community</p>
        </div>
        <button
          onClick={() => {
            const newTestimonial = {
              name: '',
              role: '',
              content: '',
              photo: null,
              rating: 5,
              order: 0,
              is_active: true
            };
            setEditing(newTestimonial);
            setInitialEditingData({ ...newTestimonial });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border border-white/10 shrink-0">
                {testimonial.photo ? (

                  <div className="relative w-full h-full">
                    <Image 
                      src={testimonial.photo} 
                      alt={testimonial.name} 
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white truncate">{testimonial.name}</h3>
                <p className="text-sm text-purple-400 truncate">{testimonial.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-3 h-3 ${i < testimonial.rating ? 'text-amber-400' : 'text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-4 line-clamp-3 italic">&quot;{testimonial.content}&quot;</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className={`px-2 py-1 rounded text-xs border ${
                testimonial.is_active 
                  ? 'bg-green-500/20 text-green-400 border-green-500/20' 
                  : 'bg-red-500/20 text-red-400 border-red-500/20'
              }`}>
                {testimonial.is_active ? 'Active' : 'Inactive'}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(testimonial);
                    setInitialEditingData({ ...testimonial });
                    setShowModal(true);
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => testimonial.id && requestDelete(testimonial.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-white/5">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-500">No testimonials yet. Add your first one!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && editing && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setEditing(null);
              setNewImage(null);
            }
          }}
        >
          <div 
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg flex flex-col max-h-[90vh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-white">
                {editing.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setNewImage(null);
                }} 
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Name *</label>
                  <input
                    type="text"
                    required
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role *</label>
                  <input
                    type="text"
                    required
                    value={editing.role}
                    onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                    placeholder="e.g. Parent of Class X"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Content *</label>
                <textarea
                  required
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editing.rating}
                    onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Order</label>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300">Photo</label>
               <ImageUpload
                    label=""
                    currentImage={editing.photo}
                    onChange={(file) => setNewImage(file)}
                    onRemove={() => {
                      setNewImage(null);
                      setEditing({ ...editing, photo: null });
                    }}
                  />
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-300">Active (Visible on website)</label>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  setNewImage(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving || 
                  !editing.name ||
                  !editing.role ||
                  !editing.content
                }
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transform scale-100 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
