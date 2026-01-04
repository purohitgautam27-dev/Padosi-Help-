
import React, { useState } from 'react';

interface SupportCenterProps {
  onBack: () => void;
}

// Private constant - not rendered in UI
const ADMIN_EMAIL = "purohitgautam27@gmail.com";

const SupportCenter: React.FC<SupportCenterProps> = ({ onBack }) => {
  const [appRating, setAppRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [question, setQuestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Kya mera mobile number sabko dikhega?",
      a: "Nahi, aapka number tabhi dikhta hai jab aap kisi ki help offer accept karte hain ya koi apki post par call karta hai. Yeh safety ke liye hai."
    },
    {
      q: "1-2 KM ka radius kaise kaam karta hai?",
      a: "App aapki GPS location use karke sirf aapke nazdeeki padosiyon ki requests hi dikhata hai taaki help jaldi mil sake."
    },
    {
      q: "Agar koi padosi badtameezi kare toh?",
      a: "Aap unhe block kar sakte hain aur 'Support' number par call karke complain kar sakte hain. Hum verified users hi rakhte hain."
    }
  ];

  const handleRatingSubmit = (star: number) => {
    setAppRating(star);
    // Simulate sending email notification for rating
    triggerEmailSimulation(`User gave ${star} stars rating.`);
  };

  const triggerEmailSimulation = (content: string) => {
    setIsSending(true);
    // Logic simulating sending to ADMIN_EMAIL
    console.log(`[SYSTEM] Sending email to owner regarding: ${content}`);
    
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const messageBody = `Rating: ${appRating || 'Not provided'}\nQuestion: ${question}`;
    triggerEmailSimulation(messageBody);
    setQuestion('');
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100 shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-tight">Sahayata Kendra</h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Support & Feedback</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* APP RATING SECTION */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl text-center relative overflow-hidden">
          {isSending && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Email Bhej rahe hain...</p>
            </div>
          )}

          <h3 className="text-lg font-black text-slate-800 mb-2">Hume Rate Karein</h3>
          <p className="text-xs text-slate-500 font-medium mb-6 italic">Aapko hamari service kaisi lagi?</p>
          
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingSubmit(star)}
                className="transition-transform active:scale-90"
              >
                <svg
                  className={`w-10 h-10 ${
                    star <= (hoverRating || appRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          {appRating > 0 && !isSending && (
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-in zoom-in duration-300">
              Shukriya! Aapne {appRating} star rating di hai. ✨
            </p>
          )}
        </div>

        {/* MAN KE SAWAL FORM */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <h3 className="text-xl font-black mb-1 relative z-10">Man Ke Sawal?</h3>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-6 opacity-80 relative z-10">Hume batayein, hum madad karenge</p>
          
          {isSubmitted ? (
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-center animate-in zoom-in duration-300">
              <span className="text-3xl block mb-2">📩</span>
              <p className="text-sm font-bold">App owner ko aapka message aur rating email kar di gayi hai! Shukriya.</p>
            </div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="space-y-4 relative z-10">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Aap kya puchna chahte hain?"
                className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all min-h-[100px]"
                required
              />
              <button 
                type="submit"
                disabled={isSending}
                className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                {isSending ? 'Bhej rahe hain...' : 'Sawal Bhejein'}
              </button>
            </form>
          )}
        </div>

        {/* FAQ SECTION */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-4">Aksar Puche Jane Wale Sawal</h4>
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center group"
              >
                <span className={`text-sm font-bold transition-colors ${activeFaq === idx ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {faq.q}
                </span>
                <svg className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed border-l-2 border-indigo-100 pl-3">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* OFFICIAL SUPPORT CONTACT */}
        <div className="bg-slate-50 border-2 border-slate-100 border-dashed p-6 rounded-[2rem] text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Direct Contact</p>
          <a href="tel:8347948793" className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
             <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.479 5.478l.773-1.547a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
             </div>
             <span className="text-sm font-black text-indigo-600">8347948793</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
