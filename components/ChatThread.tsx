
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '../types';

interface ChatThreadProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const ChatThread: React.FC<ChatThreadProps> = ({ conversation, onBack, onSendMessage, isTyping = false }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openSharedMap = () => {
    if (conversation.participantLocation) {
      const { lat, lng } = conversation.participantLocation;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-md mx-auto h-[80vh] flex flex-col bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Thread Header */}
      <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
          {conversation.participantInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 leading-tight truncate">{conversation.participantName}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{conversation.requestTitle}</p>
        </div>
      </div>

      {/* Shared Info Alert - New Section */}
      <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <span className="text-emerald-600 bg-white p-1 rounded-md shadow-sm">
               <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Neighbor Details Shared</p>
         </div>
         <div className="flex gap-2">
            {conversation.participantPhone && (
              <a href={`tel:${conversation.participantPhone}`} className="flex-1 bg-white border border-emerald-200 py-2 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.479 5.478l.773-1.547a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                Call: {conversation.participantPhone}
              </a>
            )}
            {conversation.participantLocation && (
              <button onClick={openSharedMap} className="flex-1 bg-white border border-emerald-200 py-2 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                Track Live
              </button>
            )}
         </div>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/30">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm ${
              msg.isMe 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className={`text-[9px] font-bold ${msg.isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {formatTime(msg.timestamp)}
                </span>
                {msg.isMe && (
                   <svg className="w-3 h-3 text-indigo-200" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-indigo-600 text-white p-3.5 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatThread;
