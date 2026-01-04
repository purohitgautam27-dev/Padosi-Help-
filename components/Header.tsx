
import React from 'react';

interface HeaderProps {
  onMenuClick: (view: 'home' | 'post' | 'profile' | 'messages' | 'notifications' | 'my-requests' | 'support') => void;
  onLogout?: () => void;
  activeView: string;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onLogout, 
  activeView, 
  unreadMessagesCount = 0,
  unreadNotificationsCount = 0,
  isAuthenticated = false
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95" onClick={() => onMenuClick('home')}>
        <div className="bg-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-black text-xl">P</span>
        </div>
        <div className="flex flex-col -space-y-1 hidden sm:block">
          <h1 className="text-xl font-black tracking-tighter text-slate-800">Padosi</h1>
          <div className="flex items-center gap-1">
            <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1 rounded uppercase tracking-widest border border-emerald-100">Gov. Approved</span>
          </div>
        </div>
      </div>
      
      {isAuthenticated && (
        <nav className="flex gap-1.5 sm:gap-2">
          <button 
            onClick={() => onMenuClick('home')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${activeView === 'home' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </button>
          
          <button 
            onClick={() => onMenuClick('notifications')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all relative ${activeView === 'notifications' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onMenuClick('messages')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all relative ${activeView === 'messages' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Messages"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onMenuClick('my-requests')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${activeView === 'my-requests' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="My Requests"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </button>

          <button 
            onClick={() => onMenuClick('post')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${activeView === 'post' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="New Request"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
          </button>

          <button 
            onClick={() => onMenuClick('support')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${activeView === 'support' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Sahayata"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>

          <button 
            onClick={() => onMenuClick('profile')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all ${activeView === 'profile' ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100'}`}
            aria-label="Profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>

          <button 
            onClick={onLogout}
            className="p-2 sm:p-2.5 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all ml-1 sm:ml-2"
            aria-label="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
