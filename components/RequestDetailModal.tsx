
import React from 'react';
import { HelpRequest } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface RequestDetailModalProps {
  request: HelpRequest;
  onClose: () => void;
  onOfferHelp: (id: string) => void;
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ request, onClose, onOfferHelp }) => {
  const style = CATEGORY_STYLES[request.category] || CATEGORY_STYLES.General;
  const isUrgent = request.priority === 'High' || request.category === 'Emergency';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Urgency Header */}
        {isUrgent && (
          <div className="bg-rose-600 text-white px-6 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            🚨 Emergency Alert: Immediate Help Needed
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${style.color}`}>
                {style.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{request.category}</span>
                <h2 className="text-xl font-black text-slate-800 leading-tight">{request.title}</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Details</h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {request.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Contact Person</h4>
                <p className="font-bold text-slate-800">{request.userName}</p>
                <div className="mt-1 flex items-center gap-1">
                   <span className="text-[9px] text-slate-400 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100 uppercase">Hidden</span>
                </div>
              </div>
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Distance</h4>
                <p className="font-bold text-slate-800">{request.distance?.toFixed(1) || 'Nearby'} km</p>
                <div className="mt-1 flex items-center gap-1">
                   <span className="text-[9px] text-slate-400 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-100 uppercase">Approximate</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
               <p className="text-[10px] font-bold text-amber-700 leading-tight">
                  <span className="font-black uppercase block mb-1">Privacy Guard:</span>
                  Neighbor ka mobile number aur live location tabhi dikhegi jab aap help offer **confirm** karenge.
               </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { onOfferHelp(request.id); onClose(); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                Accept & Confirm Help
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default RequestDetailModal;
