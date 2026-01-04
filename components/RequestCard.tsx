
import React, { useState } from 'react';
import { HelpRequest, RequestCategory, RequestStatus } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface RequestCardProps {
  request: HelpRequest;
  onHelpClick: (id: string) => void;
  onEdit?: (request: HelpRequest) => void;
  onDelete?: (id: string) => void;
  onResolve?: (id: string) => void;
  onGiftTokens?: (id: string, amount: number) => void;
  isOwnRequest?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  onHelpClick, 
  onEdit, 
  onDelete,
  onResolve,
  onGiftTokens,
  isOwnRequest = false 
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showGiftOptions, setShowGiftOptions] = useState(false);
  
  const style = CATEGORY_STYLES[request.category] || CATEGORY_STYLES.General;
  const isEmergency = request.category === RequestCategory.EMERGENCY || request.priority === 'High';
  const isLocVisible = request.isLocationVisible !== false;
  const isResolved = request.status === RequestStatus.RESOLVED;

  const handleHelpClick = () => {
    if (request.offeredByMe) return;
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
    } else {
      onHelpClick(request.id);
      setIsConfirming(false);
    }
  };

  const handleGift = (amount: number) => {
    if (onGiftTokens) onGiftTokens(request.id, amount);
    setShowGiftOptions(false);
  };

  return (
    <div className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all relative group flex flex-col ${
      isResolved ? 'opacity-70 bg-slate-50 border-slate-200' :
      request.offeredByMe ? 'border-emerald-100 bg-emerald-50/20' : 
      isEmergency ? 'border-rose-200 ring-2 ring-rose-100 animate-[pulse_3s_infinite]' : 
      isOwnRequest ? 'border-indigo-100 bg-indigo-50/5' : 'border-slate-100'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold ${style.color}`}>
            {style.icon} {request.category}
          </span>
          {isResolved && (
             <span className="bg-slate-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">Resolved</span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{request.title}</h3>
      <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
        {request.description}
      </p>

      {/* Reward Tokens Section - appears on own resolved requests */}
      {isOwnRequest && isResolved && !request.tokensGifted && (
        <div className="mb-4 animate-in zoom-in-95 duration-300">
           {!showGiftOptions ? (
             <button 
               onClick={() => setShowGiftOptions(true)}
               className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
             >
               🪙 Gift Tokens to Neighbor
             </button>
           ) : (
             <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 flex flex-col gap-2">
                <p className="text-[9px] font-black text-amber-700 uppercase text-center mb-1">Select Amount to Gift</p>
                <div className="grid grid-cols-3 gap-2">
                   {[10, 20, 50].map(amt => (
                     <button 
                       key={amt} 
                       onClick={() => handleGift(amt)}
                       className="bg-white border border-amber-200 text-amber-600 font-black py-2 rounded-lg text-xs hover:bg-amber-100 transition-colors"
                     >+{amt}</button>
                   ))}
                </div>
                <button onClick={() => setShowGiftOptions(false)} className="text-[9px] font-bold text-amber-400 mt-1">Not now</button>
             </div>
           )}
        </div>
      )}

      {isOwnRequest && isResolved && request.tokensGifted && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-2">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
             Tokens Gifted!
           </p>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs shadow-sm">
            {request.userName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">{isOwnRequest ? 'You (Me)' : request.userName}</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {(isLocVisible && request.distance) ? `${request.distance.toFixed(1)} km` : 'Nearby'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {isOwnRequest ? (
            !isResolved && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onResolve?.(request.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Resolve
                </button>
                <button onClick={() => onDelete?.(request.id)} className="p-2 text-slate-300 hover:text-rose-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            )
          ) : (
            !isResolved && (
              <button 
                onClick={handleHelpClick}
                disabled={request.offeredByMe}
                className={`text-xs font-bold py-2 px-4 rounded-xl transition-all ${
                  request.offeredByMe 
                    ? 'bg-emerald-500 text-white' 
                    : isConfirming 
                      ? 'bg-amber-500 text-white animate-pulse' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {request.offeredByMe ? 'Offered' : isConfirming ? 'Confirm?' : 'Offer Help'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
