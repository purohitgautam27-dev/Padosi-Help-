
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (phone: string, name?: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [step, setStep] = useState<'credentials' | 'otp' | 'reset'>('credentials');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [smsNotification, setSmsNotification] = useState<{ show: boolean; otp: string } | null>(null);

  const playSmsSound = () => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {}
  };

  const getSavedUsers = () => {
    const users = localStorage.getItem('padosi_registered_users');
    return users ? JSON.parse(users) : {};
  };

  const generateNewOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    return newOtp;
  };

  const triggerVirtualSms = (otp: string) => {
    setSmsNotification({ show: true, otp });
    playSmsSound();
    setTimeout(() => setSmsNotification(prev => prev ? { ...prev, show: false } : null), 8000);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Kripya sahi 10-digit mobile number bharein.");
      return;
    }

    setIsLoading(true);
    const users = getSavedUsers();

    setTimeout(() => {
      if (mode === 'login') {
        const user = users[phone];
        if (!user) {
          setError("Yeh number registered nahi hai. Signup karein.");
          setIsLoading(false);
          return;
        }
        if (user.password !== password) {
          setError("Galat password! Wahi password dalein jo signup ke waqt dala tha.");
          setIsLoading(false);
          return;
        }
      } else if (mode === 'signup') {
        if (users[phone]) {
          setError("Yeh number pehle se registered hai! Seedha Login karein.");
          setIsLoading(false);
          return;
        }
        if (name.length < 2) {
          setError("Kripya apna pura naam likhein.");
          setIsLoading(false);
          return;
        }
        if (password.length < 4) {
          setError("Password thoda lamba hona chahiye (Min 4 chars).");
          setIsLoading(false);
          return;
        }
      } else if (mode === 'forgot') {
        if (!users[phone]) {
          setError("Yeh number humare database mein nahi hai.");
          setIsLoading(false);
          return;
        }
      }

      const otp = generateNewOtp();
      setIsLoading(false);
      setStep('otp');
      setOtpInput('');
      triggerVirtualSms(otp);
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpInput === generatedOtp) {
      if (mode === 'forgot') {
        setStep('reset');
      } else {
        const users = getSavedUsers();
        let loggedInName = '';

        if (mode === 'signup') {
          users[phone] = { name, password };
          localStorage.setItem('padosi_registered_users', JSON.stringify(users));
          loggedInName = name;
        } else {
          loggedInName = users[phone].name;
        }
        
        onLogin(phone, loggedInName);
      }
    } else {
      setError("Galat OTP! SMS check karein aur sahi code dalein.");
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setError("Naya password kam se kam 4 characters ka hona chahiye.");
      return;
    }

    const users = getSavedUsers();
    if (users[phone]) {
      users[phone].password = newPassword;
      localStorage.setItem('padosi_registered_users', JSON.stringify(users));
      
      // Success feedback then redirect to login
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMode('login');
        setStep('credentials');
        setPassword('');
        setError(null);
        alert("Password reset ho gaya! Ab naye password se login karein.");
      }, 1000);
    }
  };

  const toggleMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setStep('credentials');
    setError(null);
    setOtpInput('');
    setPassword('');
    setPhone('');
    setName('');
    setNewPassword('');
    setSmsNotification(null);
  };

  const maskedPhone = phone.length > 4 
    ? `${phone.slice(0, 2)}******${phone.slice(-2)}`
    : phone;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 relative">
      
      {smsNotification?.show && (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-in slide-in-from-top-full duration-500">
          <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-white/10 flex items-start gap-4">
            <div className="bg-indigo-500 p-2 rounded-2xl shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.5 1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-9zM5 15h10v-4H5v4z"></path></svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Padosi Auth • Now</p>
              <p className="text-sm font-bold">Verification Code: <span className="text-indigo-400 text-lg font-black">{smsNotification.otp}</span></p>
              <p className="text-[10px] text-slate-400">Don't share this code with anyone.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-indigo-600 p-10 text-center text-white relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
          <div className="bg-white/20 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20">
             <span className="text-white font-black text-4xl">P</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-1">Padosi Help</h2>
          <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Sath milkar padosi ki madad</p>
        </div>

        <div className="p-8 sm:p-12">
          {step === 'credentials' ? (
            <div className="animate-in slide-in-from-left-6 duration-500">
              {mode !== 'forgot' && (
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                  <button 
                    onClick={() => toggleMode('login')}
                    className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${mode === 'login' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => toggleMode('signup')}
                    className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {mode === 'forgot' && (
                <div className="mb-6">
                   <button onClick={() => toggleMode('login')} className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 mb-2">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg> Back to Login
                   </button>
                   <h3 className="text-xl font-black text-slate-800">Password Bhul Gaye?</h3>
                   <p className="text-xs text-slate-500 mt-1">Ghabraiye nahi, naya password set karte hain.</p>
                </div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div className="animate-in slide-in-from-top-4 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Apna Pura Naam</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === 'signup'}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="e.g. Gautam Purohit"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); 
                        if (val.length <= 10) setPhone(val);
                      }}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] pl-16 pr-6 py-4 text-sm font-bold tracking-widest focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-2 ml-1">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                      {mode === 'login' && (
                        <button 
                          type="button"
                          onClick={() => toggleMode('forgot')}
                          className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {error && (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 animate-in shake duration-300">
                    <p className="text-rose-600 text-xs font-black flex items-center gap-2">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                       {error}
                    </p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.8rem] shadow-xl transition-all active:scale-[0.97] uppercase tracking-widest text-xs"
                >
                  {isLoading ? 'Cheking Details...' : (mode === 'login' ? 'Log In Karein' : mode === 'signup' ? 'Account Banayein' : 'OTP Bhejein')}
                </button>
              </form>
            </div>
          ) : step === 'otp' ? (
            <div className="animate-in slide-in-from-right-6 duration-500 text-center">
              <h3 className="text-2xl font-black text-slate-800 mb-2">Check Karein</h3>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Humne code bheja hai:<br/>
                <span className="text-slate-800 font-black tracking-widest">{maskedPhone}</span>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <input 
                  type="text" 
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-50 border-3 border-slate-100 rounded-[2.5rem] py-8 text-5xl font-black text-center tracking-[1rem] focus:outline-none focus:border-indigo-500 shadow-inner"
                  placeholder="0000"
                  required
                />

                {error && (
                  <p className="text-rose-500 text-[11px] font-black bg-rose-50 py-3 rounded-xl">
                    {error}
                  </p>
                )}

                <div className="space-y-4">
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2rem] shadow-xl transition-all active:scale-[0.97] uppercase tracking-widest text-sm"
                  >
                    Confirm & Proceed
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const otp = generateNewOtp();
                      triggerVirtualSms(otp);
                    }}
                    className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="animate-in zoom-in duration-500">
               <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800">Naya Password</h3>
                  <p className="text-sm text-slate-500">Ab apna naya password set karein.</p>
               </div>
               
               <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
                      <p className="text-rose-600 text-xs font-black">{error}</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[1.8rem] shadow-xl transition-all active:scale-[0.97] uppercase tracking-widest text-xs"
                  >
                    Update Password
                  </button>
               </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
