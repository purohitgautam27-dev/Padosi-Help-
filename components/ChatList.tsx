
import React from 'react';
import { Conversation } from '../types';

interface ChatListProps {
  conversations: Conversation[];
  onSelectChat: (conv: Conversation) => void;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, onSelectChat }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-black text-slate-800 mb-6 px-1">Messages</h2>
      
      {conversations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl grayscale opacity-50">💬</span>
          </div>
          <h3 className="text-slate-800 font-bold mb-1">No messages yet</h3>
          <p className="text-slate-500 text-sm">When you offer help or neighbors respond to you, chats will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt).map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv)}
              className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all text-left flex items-center gap-4 relative group active:scale-[0.98]"
            >
              <div className="relative">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
                  {conv.participantInitials}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-slate-800 truncate">{conv.participantName}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{formatTime(conv.lastMessageAt)}</span>
                </div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-1 truncate">
                  Regarding: {conv.requestTitle}
                </p>
                <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                  {conv.messages[conv.messages.length - 1]?.text}
                </p>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
