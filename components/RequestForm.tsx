
import React, { useState, useEffect } from 'react';
import { analyzeRequest } from '../services/geminiService';
import { RequestCategory, HelpRequest, UserLocation } from '../types';
import { CATEGORY_STYLES } from '../constants';
import { getCurrentLocation } from '../utils/geo';

interface RequestFormProps {
  onSubmit: (data: { 
    title: string; 
    description: string; 
    category: RequestCategory; 
    priority: 'High' | 'Medium' | 'Low'; 
    phone: string;
    isLocationVisible: boolean;
    location?: UserLocation;
  }) => void;
  initialData?: HelpRequest | null;
  onCancel?: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory>(initialData?.category || RequestCategory.GENERAL);
  const [isLocationVisible, setIsLocationVisible] = useState(initialData?.isLocationVisible ?? true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = Object.values(RequestCategory);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPhone(initialData.phone);
      setSelectedCategory(initialData.category);
      setIsLocationVisible(initialData.isLocationVisible ?? true);
    }
  }, [initialData]);

  const handleManualAIAnalysis = async () => {
    if (description.length < 10) {
      setError("AI use karne ke liye details thoda aur likhein.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeRequest(description);
      if (analysis.category) {
        setSelectedCategory(analysis.category as RequestCategory);
      }
    } catch (e) {
      console.error(e);
      setError("AI categorization failed. Please select manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    setError(null);
    try {
      const loc = await getCurrentLocation();
      setCurrentLocation(loc);
      setIsLocationVisible(true);
    } catch (err) {
      setError("GPS chalu nahi ho paya. Permissions check karein.");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Kripya valid 10-digit mobile number dalein.");
      return;
    }

    if (!title || !description || !phone) {
      setError("Kripya saari jankari bharein.");
      return;
    }
    
    setIsSubmitting(true);
    
    onSubmit({ 
      title, 
      description, 
      phone,
      category: selectedCategory,
      priority: selectedCategory === RequestCategory.EMERGENCY ? 'High' : 'Medium',
      isLocationVisible,
      location: currentLocation || undefined
    });
  };

  const isEmergency = selectedCategory === RequestCategory.EMERGENCY;

  return (
    <div className={`bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border transition-all duration-500 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-6 ${isEmergency ? 'border-rose-200 ring-8 ring-rose-50' : 'border-slate-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Neighborhood Assistance</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {initialData ? 'Edit' : 'Post'} Help Request
          </h2>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-slate-300 hover:text-slate-500 transition-colors p-2 hover:bg-slate-50 rounded-2xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GPS LOCATION TOGGLE */}
        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isLocationVisible ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location Visibility</p>
                <h4 className="text-sm font-bold text-slate-800">Include My Live Location</h4>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => {
                if (!isLocationVisible) handleFetchLocation();
                else setIsLocationVisible(false);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isLocationVisible ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <span className={`${isLocationVisible ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
            </button>
          </div>
          {isLocationVisible && (
            <p className="text-[9px] font-bold text-emerald-600 mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              {currentLocation ? 'GPS Coordinates Added' : 'Fetching live GPS...'}
            </p>
          )}
        </div>

        {/* CATEGORY SELECTION */}
        <div>
          <div className="flex items-center justify-between mb-4 ml-1">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Kis tarah ki help chahiye?</label>
            <button 
              type="button"
              onClick={handleManualAIAnalysis}
              disabled={isAnalyzing || description.length < 10}
              className={`text-[9px] font-black px-3 py-1.5 rounded-full border transition-all uppercase tracking-widest flex items-center gap-1.5 ${
                isAnalyzing ? 'bg-indigo-50 text-indigo-400 border-indigo-100' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <><span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span> Thinking...</>
              ) : (
                <>✨ Suggest with AI</>
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const style = CATEGORY_STYLES[cat];
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex flex-col items-center justify-center p-4 rounded-[1.8rem] border-2 transition-all group relative overflow-hidden ${
                    isActive 
                      ? `${style.color} border-transparent shadow-xl scale-[1.02] ring-4 ring-offset-2 ${cat === 'Emergency' ? 'ring-rose-200' : 'ring-indigo-100'}` 
                      : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-white'
                  }`}
                >
                  <span className={`text-2xl mb-1 transition-transform group-hover:scale-125 ${isActive ? 'animate-bounce' : ''}`}>
                    {style.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Title (Short mein batayein)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              placeholder="e.g. Need BP Medicine immediately"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setPhone(val);
                }}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                placeholder="9876543210"
                required
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-2 ml-1 italic">Yeh number tabhi share hoga jab koi help accept karega.</p>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Details (Puri baat likhein)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-5 py-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all shadow-inner min-h-[120px]"
              placeholder="Aapko exactly kya help chahiye? Padosi ko samjhane ke liye yahan likhein..."
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-xs font-bold animate-in shake duration-300">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          {initialData && (
            <button 
              type="button" 
              onClick={onCancel} 
              disabled={isSubmitting}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black py-4 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting || isFetchingLocation}
            className={`flex-[2] text-white font-black py-5 rounded-[1.8rem] shadow-2xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 ${
              isEmergency 
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            } ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Posting...' : (initialData ? 'Update Request' : 'Post Request Now')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
