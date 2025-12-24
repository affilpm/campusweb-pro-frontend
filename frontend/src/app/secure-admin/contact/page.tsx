'use client';

import { useState, useEffect, FormEvent, useCallback, useRef, memo } from 'react';
import api from '@/lib/api';

interface ContactPageData {
  hero_title: string;
  hero_subtitle: string;
  map_embed_code: string;
  office_hours: string;
  school_hours: string;
}

interface HourRow {
  day: string;
  time: string;
}

// Helper component for editing hours
const HoursEditor = memo(({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
}) => {
  const [rows, setRows] = useState<HourRow[]>([]);
  const isLocalChange = useRef(false);

  // Parse initial value and handle async updates
  useEffect(() => {
    if (!value) {
       // Only set defaults if rows are also empty (initial load)
       if (rows.length === 0) {
          // We mark this as NOT local change, so we accept defaults
          setRows([
            { day: 'Monday - Friday', time: '8:00 AM - 3:00 PM' },
            { day: 'Saturday', time: '8:00 AM - 12:00 PM' },
            { day: 'Sunday', time: 'Closed' }
          ]);
       }
       return;
    }

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
          const stringifiedRows = JSON.stringify(rows);
          const stringifiedParsed = JSON.stringify(parsed);
          
          if (stringifiedParsed === stringifiedRows) {
              // Synced
              isLocalChange.current = false;
              return;
          }
          
          if (isLocalChange.current) {
              // Value differs but we have local changes pending.
              // Likely a stale echo from parent. Ignore.
              return;
          }
          
          setRows(parsed);
      }
    } catch (e) {
      // Ignore parse errors from value
    }
  }, [value, rows]); // Added rows dependency to ensure comparison is fresh

  // Update parent whenever rows change, but DEBOUNCED to prevent rapid re-renders/looping
  useEffect(() => {
    const timer = setTimeout(() => {
        const stringified = JSON.stringify(rows);
        if (stringified !== value) {
            onChange(stringified);
            // After we sync to parent, we can assume consecutive props will match.
            // But we keep isLocalChange true until we see the match in the other effect? 
            // Actually, we don't need isLocalChange as much if we debounce, but let's keep it for safety.
        }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [rows, value, onChange]);

  const addRow = useCallback(() => {
    isLocalChange.current = true;
    setRows(prev => [...prev, { day: '', time: '' }]);
  }, []);

  const removeRow = useCallback((index: number) => {
    isLocalChange.current = true;
    setRows(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateRow = useCallback((index: number, field: keyof HourRow, val: string) => {
    isLocalChange.current = true;
    setRows(prev => {
        const newRows = [...prev];
        newRows[index] = { ...newRows[index], [field]: val };
        return newRows;
    });
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <button 
          type="button" 
          onClick={addRow}
          className="text-xs bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 px-2 py-1 rounded transition-colors"
        >
          + Add Row
        </button>
      </div>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              value={row.day}
              onChange={(e) => updateRow(idx, 'day', e.target.value)}
              placeholder="e.g. Monday - Friday"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <input
              type="text"
              value={row.time}
              onChange={(e) => updateRow(idx, 'time', e.target.value)}
              placeholder="e.g. 8:00 AM - 3:00 PM"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="button"
              onClick={() => removeRow(idx)}
              className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
              title="Remove"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
HoursEditor.displayName = 'HoursEditor';

export default function ContactPageAdmin() {
  const [data, setData] = useState<ContactPageData>({
    hero_title: '',
    hero_subtitle: '',
    map_embed_code: '',
    office_hours: '',
    school_hours: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/admin/content/contact/');
      if (res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Error fetching contact page data:', error);
      setMessage({ type: 'error', text: 'Failed to load data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleHoursChange = useCallback((name: 'school_hours' | 'office_hours', value: string) => {
    setData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await api.put('/api/admin/content/contact/', data);
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
    } catch (error) {
      console.error('Error saving changes:', error);
      setMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Us Page</h1>
          <p className="text-gray-400">Manage contact details, map, and operating hours</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hero Section */}
        <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Hero Section</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Hero Title</label>
              <input
                type="text"
                name="hero_title"
                value={data.hero_title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Hero Subtitle</label>
              <textarea
                name="hero_subtitle"
                rows={2}
                value={data.hero_subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>
        </section>

        {/* Contact Details Info */}
        <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Contact Information</h2>
              <p className="text-sm text-gray-400 max-w-2xl">
                Phone Number, Email, and Address are managed globally in Site Settings. 
                They will automatically appear on the Contact page.
              </p>
            </div>
            <a 
              href="/secure-admin/site-settings" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-purple-400 hover:text-purple-300 rounded-lg text-sm transition-colors border border-purple-500/30"
            >
              Go to Site Settings
            </a>
          </div>
        </section>

        {/* Hours */}
        <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Operating Hours</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <HoursEditor 
               label="School Hours" 
               value={data.school_hours} 
               onChange={(val) => handleHoursChange('school_hours', val)} 
             />
             <HoursEditor 
               label="Office Hours" 
               value={data.office_hours} 
               onChange={(val) => handleHoursChange('office_hours', val)} 
             />
          </div>
        </section>

        {/* Map */}
        <section className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Map Location</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Google Maps Embed Code</label>
            <textarea
              name="map_embed_code"
              rows={4}
              value={data.map_embed_code}
              onChange={handleChange}
              placeholder='<iframe src="https://www.google.com/maps/embed...">'
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm"
            />
            <p className="text-xs text-gray-500">Paste the full iframe code from Google Maps.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
