
import React from 'react';
import { AppNotification, RequestCategory } from '../types';
import { CATEGORY_STYLES } from '../constants';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onNotificationClick: (notification: AppNotification) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  onNotificationClick, 
  onClearAll 
}) => {
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    if (diff < 60000) return 'Just now';
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getIcon = (type: string, category?: string) => {
    if (type === 'NEW_REQUEST' && category) {
      return CATEGORY_STYLES[category]?.icon || '📢';
    }
    switch (type) {
      case 'OFFER_RECEIVED': return '🤝';
      case 'MESSAGE_RECEIVED': return '💬';
      default: return '🔔';
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-indigo-100';
    return CATEGORY_STYLES[category]?.color.split(' ')[0] || 'bg-indigo-100';
  };

  return (
    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Apno Ki Madad</h2>
          <p className="text-xs text-slate-400 font-medium italic">Help ke liye hum hai na!</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-all bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm"
          >
            Clear All
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl grayscale opacity-50">🔔</span>
          </div>
          <h3 className="text-slate-800 font-bold mb-1">Abhi sab theek hai</h3>
          <p className="text-slate-500 text-sm italic">Koi naya message ya request nahi hai.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.sort((a, b) => b.timestamp - a.timestamp).map((notif) => {
            const isUrgent = notif.title.toLowerCase().includes('emergency') || notif.message.toLowerCase().includes('urgent');
            
            return (
              <button
                key={notif.id}
                onClick={() => onNotificationClick(notif)}
                className={`w-full p-5 rounded-[2rem] border transition-all text-left flex gap-4 relative group active:scale-[0.98] ${
                  notif.read 
                    ? 'bg-white border-slate-100' 
                    : `shadow-md ${isUrgent ? 'bg-rose-50/30 border-rose-100 ring-1 ring-rose-100' : 'bg-indigo-50/40 border-indigo-100'}`
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner ${
                  notif.read ? 'bg-slate-100' : getCategoryColor(notif.relatedId?.startsWith('sim') ? 'General' : undefined)
                }`}>
                  {getIcon(notif.type, notif.relatedId?.startsWith('sim') ? 'General' : undefined)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm leading-tight pr-4 ${notif.read ? 'font-bold text-slate-700' : 'font-black text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 bg-slate-50 px-2 py-0.5 rounded-md">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-3 ${notif.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                    {notif.message}
                  </p>
                  
                  {!notif.read && (
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded uppercase tracking-widest">
                         New Activity
                       </span>
                       {isUrgent && (
                         <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                           Urgent
                         </span>
                       )}
                    </div>
                  )}
                </div>
                
                {!notif.read && (
                  <div className={`absolute top-5 right-5 w-2 h-2 rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
