
import React, { useState } from 'react';
import { UserLocation } from '../types';

interface EmergencyContact {
  name: string;
  phone: string;
}

interface UserProfileProps {
  user: {
    name: string;
    avatarInitials: string;
    profileImage?: string; 
    bio: string;
    memberSince: string;
    helpedCount: number;
    requestedCount: number;
    rating: number;
    ratingCount: number;
    emergencyContact?: EmergencyContact;
    location?: UserLocation;
    phone?: string;
    isLocationVisible?: boolean;
    tokens?: number;
  };
  onRate?: (rating: number) => void;
  onUpdateContact?: (contact: EmergencyContact | undefined) => void;
  onUpdateProfile?: (data: any) => void;
  onWithdraw?: (amount: number, method: string, detail: string) => void;
  isOwnProfile?: boolean;
}

export default function UserProfile({ 
  user, 
  onUpdateProfile, 
  onWithdraw,
  isOwnProfile = true 
}: UserProfileProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'PhonePe' | 'Bank'>('PhonePe');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifsc, setIfsc] = useState('');
  
  const tokens = user.tokens || 0;
  const canWithdraw = tokens >= 100;

  const handleWithdrawClick = () => {
    if (!canWithdraw) return;
    setIsWithdrawing(true);
  };

  const submitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onWithdraw) {
      const detail = withdrawMethod === 'PhonePe' 
        ? `UPI: ${upiId}` 
        : `Bank: ${bankName}, A/C: ${accountNumber}, IFSC: ${ifsc}`;
      onWithdraw(100, withdrawMethod, detail);
    }
    setIsWithdrawing(false);
    setUpiId('');
    setAccountNumber('');
    setBankName('');
    setIfsc('');
  };

  const simulateEarning = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ tokens: (user.tokens || 0) + 10 });
    }
  };

  const toggleLocationVisibility = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ isLocationVisible: !user.isLocationVisible });
    }
  };

  const openOwnMap = () => {
    if (user.location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${user.location.lat},${user.location.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">
      
      {/* WITHDRAWAL OVERLAY MODAL */}
      {isWithdrawing && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <form onSubmit={submitWithdrawal} className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2 text-center">Withdraw ₹100</h3>
              <p className="text-xs text-slate-500 font-medium mb-6 text-center">Apne 100 tokens cashout karein.</p>
              
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                 <button 
                  type="button" 
                  onClick={() => setWithdrawMethod('PhonePe')} 
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${withdrawMethod === 'PhonePe' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                 >PhonePe / UPI</button>
                 <button 
                  type="button" 
                  onClick={() => setWithdrawMethod('Bank')} 
                  className={`flex-1 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all ${withdrawMethod === 'Bank' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                 >Bank Transfer</button>
              </div>

              {withdrawMethod === 'PhonePe' ? (
                <div className="space-y-4 mb-8">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">PhonePe UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9876543210@ybl"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all mt-1"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-8 text-left">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Account Number</label>
                    <input 
                      type="text" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account Number bharein"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bank Name & IFSC</label>
                    <input 
                      type="text" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. SBI (SBIN001234)"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all mt-1"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                 <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all"
                 >
                    Confirm Cashout
                 </button>
                 <button 
                    type="button" 
                    onClick={() => setIsWithdrawing(false)} 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all"
                 >
                    Cancel
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* PROFILE CONTENT */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 relative">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="px-8 pb-10 -mt-14 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden p-1">
              <div className="w-full h-full bg-indigo-50 rounded-[1.6rem] flex items-center justify-center">
                <span className="text-4xl text-indigo-600 font-black">{user.avatarInitials}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 leading-tight">{user.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-4 h-4 ${s <= user.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <span className="text-xs font-black text-slate-400">{user.rating.toFixed(1)} Rating</span>
          </div>

          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-3 mb-8">Padosi Member Since {user.memberSince}</p>
          
          {/* LOCATION SETTINGS SECTION */}
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 mb-6 text-left">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Settings</p>
                      <h4 className="text-sm font-bold text-slate-800">Hyper-local Radius</h4>
                   </div>
                </div>
                <button 
                  onClick={toggleLocationVisibility}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${user.isLocationVisible ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`${user.isLocationVisible ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </button>
             </div>
             
             <div className="flex items-center gap-4 pl-1">
                <button 
                  onClick={openOwnMap}
                  className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1.5"
                >
                   <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                   Open Maps
                </button>
                <div className="h-4 w-px bg-slate-200"></div>
                <p className="text-[9px] font-bold text-slate-500">
                  {user.isLocationVisible ? 'Padosi aapko 1-2km mein dekh sakte hain' : 'Aapki location abhi hidden hai'}
                </p>
             </div>
          </div>

          {/* WALLET SECTION */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2.5rem] p-7 text-white text-left relative overflow-hidden shadow-2xl shadow-amber-200/40 mb-8 border border-white/20">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
             
             <div className="flex justify-between items-start mb-8">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-100 opacity-90 mb-1">Apna Wallet</p>
                   <h3 className="text-4xl font-black tracking-tighter flex items-center gap-2">
                     {tokens} 
                     <span className="text-sm font-bold opacity-60 uppercase tracking-widest">Tokens</span>
                   </h3>
                </div>
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg animate-bounce">
                   <span className="text-2xl">🪙</span>
                </div>
             </div>

             <div className="space-y-5">
                <div>
                   <div className="h-2 bg-black/10 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min((tokens / 100) * 100, 100)}%` }}
                      ></div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-wider text-amber-50">
                      {canWithdraw ? 'Target Achieved! Ready to Cashout' : `${100 - tokens} more needed for Bank Transfer`}
                   </p>
                </div>
                
                <div className="flex gap-2">
                   <button 
                      onClick={handleWithdrawClick}
                      disabled={!canWithdraw}
                      className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${canWithdraw ? 'bg-white text-amber-600 shadow-xl active:scale-95' : 'bg-white/20 text-white/40 cursor-not-allowed'}`}
                   >
                      Cashout to Bank
                   </button>
                   {!canWithdraw && (
                     <button 
                        onClick={simulateEarning}
                        className="px-4 py-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all active:scale-95 border border-white/10"
                        title="Add 10 tokens (Demo Mode)"
                     >
                        <span className="text-lg">🎁</span>
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
              <span className="block text-3xl font-black text-indigo-600 mb-1">{user.helpedCount}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo ki Help ki</span>
            </div>
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
              <span className="block text-3xl font-black text-purple-600 mb-1">{user.requestedCount}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Help mangi</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-indigo-50/50 p-5 rounded-[2rem] border border-indigo-100 text-left flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-indigo-100 shadow-lg group-hover:rotate-12 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div>
                    <p className="text-slate-800 font-black text-sm">Wallet Support</p>
                    <p className="text-[10px] text-slate-500 font-bold">Transaction issues? Report here.</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
