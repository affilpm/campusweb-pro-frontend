'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { PageSEO } from '@/lib/public-types';

interface PageSEOAdmin extends PageSEO {
  id?: number;
}

export default function SEOPage() {
  const [seoList, setSeoList] = useState<PageSEOAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeo, setCurrentSeo] = useState<Partial<PageSEOAdmin>>({});
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSeoList();
  }, []);

  const fetchSeoList = async () => {
    try {
      const response = await api.get('/api/v1/school-info/admin/seo/');
      setSeoList(response.data);
    } catch (error) {
      console.error('Error fetching SEO list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seo: PageSEOAdmin) => {
    setCurrentSeo(seo);
    setSelectedFile(null);
    setFileInputKey(prev => prev + 1);
    setIsModalOpen(true);
  };

  const requestDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSaving(true);
    
    try {
      await api.delete(`/api/v1/school-info/admin/seo/${deleteId}/`);
      setSeoList(seoList.filter(item => item.id !== deleteId));
    } catch (error) {
      console.error('Error deleting SEO entry:', error);
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('page_slug', currentSeo.page_slug || '');
      formData.append('title', currentSeo.title || '');
      formData.append('meta_description', currentSeo.meta_description || '');
      formData.append('meta_keywords', currentSeo.meta_keywords || '');

      if (selectedFile) {
        formData.append('og_image', selectedFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (currentSeo.id) {
        await api.put(`/api/v1/school-info/admin/seo/${currentSeo.id}/`, formData, config);
      } else {
        await api.post('/api/v1/school-info/admin/seo/', formData, config);
      }
      
      fetchSeoList();
      setIsModalOpen(false);
      setCurrentSeo({});
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving SEO entry:', error);
      alert('Error saving SEO entry. Please ensure the page slug is unique.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">SEO Manager</h1>
          <p className="text-gray-400">Manage Titles, Descriptions, and Images for your pages</p>
        </div>
        <button
          onClick={() => { 
            const newSeo = {};
            setCurrentSeo(newSeo);
            setIsModalOpen(true); 
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Page SEO
        </button>
      </div>


        {/* Missing Pages Alert */}
        {seoList.length > 0 && Array.from(['home', 'about', 'admissions', 'academics', 'contact', 'notices', 'events', 'gallery', 'facilities', 'public-disclosure']).filter(slug => !seoList.some(s => s.page_slug === slug)).length > 0 && (
           <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
             <div className="flex items-start gap-3">
               <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <div>
                 <h3 className="text-amber-500 font-semibold mb-1">Missing SEO Configurations</h3>
                 <p className="text-sm text-amber-200/80 mb-3">
                   The following key pages are using hardcoded defaults. Click a tag to create a custom override:
                 </p>
                 <div className="flex flex-wrap gap-2">
                   {['home', 'about', 'admissions', 'academics', 'contact', 'notices', 'events', 'gallery', 'facilities', 'public-disclosure']
                     .filter(slug => !seoList.some(s => s.page_slug === slug))
                     .map(slug => (
                       <button
                         key={slug}
                         onClick={() => {
                            setCurrentSeo({ page_slug: slug });
                            setIsModalOpen(true);
                         }}
                         className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-sm transition-colors flex items-center gap-1"
                       >
                         <span>+</span>
                         <span className="capitalize">{slug}</span>
                       </button>
                     ))}
                 </div>
               </div>
             </div>
           </div>
        )}

      <div className="grid gap-4">
        {seoList.map((seo) => (
          <div key={seo.id} className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/20 font-mono">
                  /{seo.page_slug}
                </span>
                <h3 className="font-semibold text-white">{seo.title}</h3>
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">{seo.meta_description}</p>
              
              {seo.og_image && (
                <div className="mt-2">
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Custom Social Image Set
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleEdit(seo)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => seo.id && requestDelete(seo.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {seoList.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-slate-800/20 rounded-xl border border-white/5">
            <p className="mb-4">No custom SEO overrides found.</p>
            <div className="flex flex-wrap justify-center gap-2">
                 {['home', 'about', 'admissions', 'academics', 'contact', 'notices', 'events', 'gallery', 'facilities', 'public-disclosure'].map(slug => (
                   <button
                     key={slug}
                     onClick={() => {
                        setCurrentSeo({ page_slug: slug });
                        setIsModalOpen(true);
                     }}
                     className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-sm transition-colors capitalize"
                   >
                     + Add {slug}
                   </button>
                 ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div 
            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {currentSeo.id ? 'Edit Page SEO' : 'New Page SEO'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Page Slug *</label>
                <p className="text-xs text-gray-500">e.g., 'home', 'about', 'contact', 'admissions'</p>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={currentSeo.page_slug || ''}
                  onChange={e => setCurrentSeo(prev => ({ ...prev, page_slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Page Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={currentSeo.title || ''}
                  onChange={e => setCurrentSeo(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Meta Description</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={currentSeo.meta_description || ''}
                  onChange={e => setCurrentSeo(prev => ({ ...prev, meta_description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Meta Keywords</label>
                <p className="text-xs text-gray-500">Separated by commas</p>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={currentSeo.meta_keywords || ''}
                  onChange={e => setCurrentSeo(prev => ({ ...prev, meta_keywords: e.target.value }))}
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-gray-300">Social Share Image (OG Image)</label>
                <div className="flex flex-col gap-2">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {currentSeo.og_image && !selectedFile && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Current Image:</span>
                      <a href={currentSeo.og_image} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">View</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !currentSeo.page_slug || !currentSeo.title}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save SEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl transform scale-100 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete the SEO override for 
              <span className="font-mono text-purple-400 ml-1">/{seoList.find(s => s.id === deleteId)?.page_slug}</span>?
              <br/>
              The page will revert to using default settings.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
