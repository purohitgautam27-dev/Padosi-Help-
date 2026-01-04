
import React from 'react';
import { HelpRequest } from '../types';
import RequestCard from './RequestCard';

interface MyRequestsProps {
  requests: HelpRequest[];
  onEdit: (request: HelpRequest) => void;
  onDelete: (id: string) => void;
  onResolve: (id: string) => void;
  onBack: () => void;
}

const MyRequests: React.FC<MyRequestsProps> = ({ 
  requests, 
  onEdit, 
  onDelete, 
  onResolve, 
  onBack 
}) => {
  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100 shadow-sm sm:shadow-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Mera Yogdaan</h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">My Help Activity</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl grayscale opacity-50">📝</span>
          </div>
          <h3 className="text-slate-800 font-bold mb-1">Aapne abhi tak kuch nahi maanga</h3>
          <p className="text-slate-500 text-sm italic mb-6">Jab aapko help chahiye ho, '+' icon par click karein.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-6">
             <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <p className="text-xs font-bold text-slate-700">Aapne total <span className="text-indigo-600 font-black">{requests.length}</span> requests post ki hain.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {requests.sort((a, b) => b.timestamp - a.timestamp).map((req) => (
              <RequestCard 
                key={req.id}
                request={req}
                onHelpClick={() => {}}
                onEdit={onEdit}
                onDelete={onDelete}
                onResolve={onResolve}
                isOwnRequest={true}
              />
            ))}
          </div>
        </div>
      )}
      
      <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-12">
        Help Ke Liye Hum Hai Na! • Safe Neighborhood
      </p>
    </div>
  );
};

export default MyRequests;
