
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Auth from './components/Auth';
import RequestCard from './components/RequestCard';
import RequestForm from './components/RequestForm';
import UserProfile from './components/UserProfile';
import ChatList from './components/ChatList';
import ChatThread from './components/ChatThread';
import NotificationCenter from './components/NotificationCenter';
import RequestDetailModal from './components/RequestDetailModal';
import MyRequests from './components/MyRequests';
import SupportCenter from './components/SupportCenter';
import { HelpRequest, UserLocation, RequestStatus, RequestCategory, Conversation, Message, AppNotification } from './types';
import { getCurrentLocation, calculateDistance } from './utils/geo';
import { MOCK_REQUESTS, RADIUS_KM, CATEGORY_STYLES } from './constants';

type SortOption = 'Distance' | 'Newest' | 'Priority';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<'home' | 'post' | 'profile' | 'messages' | 'notifications' | 'my-requests' | 'support'>('home');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [requests, setRequests] = useState<HelpRequest[]>(MOCK_REQUESTS);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Distance');
  const [helpToast, setHelpToast] = useState<React.ReactNode | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [focusedRequest, setFocusedRequest] = useState<HelpRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<HelpRequest | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [bankSms, setBankSms] = useState<string | null>(null);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {}
  };

  const playCashSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {}
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('padosi_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    const savedNotifs = localStorage.getItem('padosi_notifications');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    const savedConvs = localStorage.getItem('padosi_conversations');
    if (savedConvs) setConversations(JSON.parse(savedConvs));
    const savedRequests = localStorage.getItem('padosi_requests');
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  useEffect(() => {
    localStorage.setItem('padosi_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('padosi_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('padosi_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setUserLocation(loc);
        if (currentUser) setCurrentUser((prev: any) => ({ ...prev, location: loc }));
      } catch (err) {
        const defaultLoc = { lat: 28.6139, lng: 77.2090 };
        setUserLocation(defaultLoc);
        if (currentUser) setCurrentUser((prev: any) => ({ ...prev, location: defaultLoc }));
      } finally {
        setIsLoadingLocation(false);
      }
    };
    fetchLocation();
  }, [currentUser?.name]);

  const handleLogin = (phone: string, name?: string) => {
    const userData = {
      name: name || 'Neighbor',
      avatarInitials: (name || 'Neighbor').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      bio: 'Ready to help neighbors!',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      helpedCount: 3,
      requestedCount: 1,
      rating: 5.0,
      ratingCount: 3,
      location: userLocation,
      phone: phone,
      isLocationVisible: true,
      tokens: 90 
    };
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('padosi_user', JSON.stringify(userData));
    playNotificationSound();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('padosi_user');
    setView('home');
  };

  const handleSaveRequest = (data: any) => {
    if (editingRequest) {
      setRequests(prev => prev.map(req => req.id === editingRequest.id ? { ...req, ...data } : req));
      setEditingRequest(null);
      setHelpToast(<span className="font-bold">Request Updated! ✨</span>);
    } else {
      const newRequest: HelpRequest = {
        id: Date.now().toString(),
        userId: 'currentUser',
        userName: currentUser.name,
        phone: data.phone,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        timestamp: Date.now(),
        status: RequestStatus.OPEN,
        location: data.location || userLocation || { lat: 28.6139, lng: 77.2090 },
        isLocationVisible: data.isLocationVisible
      };
      setRequests([newRequest, ...requests]);
      setHelpToast(<span className="font-bold">Post is live! 📢</span>);
    }
    setView('home');
    setTimeout(() => setHelpToast(null), 3000);
  };

  const handleResolveRequest = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: RequestStatus.RESOLVED } : req));
    setHelpToast(<span className="font-bold text-emerald-500">Solved! Thank you. ✨</span>);
    setTimeout(() => setHelpToast(null), 3000);
  };

  const handleGiftTokens = (requestId: string, amount: number) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, tokensGifted: true } : req));
    setHelpToast(<span className="font-bold text-amber-500">Gifting {amount} Tokens... 🪙</span>);
    setTimeout(() => setHelpToast(null), 3000);
  };

  const handleWithdrawTokens = (amount: number, method: string, detail: string) => {
    if (!currentUser || currentUser.tokens < amount) return;

    setHelpToast(<span className="font-bold text-indigo-500">Processing Withdrawal... ⌛</span>);
    
    setTimeout(() => {
      const newTokens = currentUser.tokens - amount;
      const updatedUser = { ...currentUser, tokens: newTokens };
      setCurrentUser(updatedUser);
      localStorage.setItem('padosi_user', JSON.stringify(updatedUser));
      
      playCashSound();
      setHelpToast(<span className="font-bold text-emerald-500">Paisa bhej diya gaya! 💸</span>);
      
      const smsMessage = `HDFC Bank: Tume ${amount} rupye credit hua hai. Ref: PAD-${Date.now().toString().slice(-4)}. Bank balance update ho gaya hai. Help ke liye hum hai na!`;
      setBankSms(smsMessage);
      
      setTimeout(() => setBankSms(null), 15000); 
      setTimeout(() => setHelpToast(null), 3000);
    }, 2500);
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversationId) return;
    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      senderId: 'me',
      senderName: currentUser.name,
      text,
      timestamp: Date.now(),
      isMe: true
    };
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessageAt: Date.now() } 
        : conv
    ));
  };

  const handleOfferHelp = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, offeredByMe: true, helperId: 'currentUser', helperName: currentUser.name } : req));
    const target = requests.find(r => r.id === id);
    if (target) {
      const initials = target.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const convId = `conv-${id}`;
      const existing = conversations.find(c => c.id === convId);
      if (!existing) {
        const newConv: Conversation = {
          id: convId,
          requestId: id,
          requestTitle: target.title,
          participantName: target.userName,
          participantPhone: target.phone, // Sharing the phone number now
          participantLocation: target.isLocationVisible ? target.location : undefined, // Sharing location if visible
          participantInitials: initials,
          messages: [{
            id: 'initial',
            senderId: 'me',
            senderName: currentUser.name,
            text: `Hi ${target.userName}, main aapki help kar sakta hoon!`,
            timestamp: Date.now(),
            isMe: true
          }],
          lastMessageAt: Date.now(),
          unreadCount: 0
        };
        setConversations([newConv, ...conversations]);
        setActiveConversationId(newConv.id);
      } else {
        setActiveConversationId(existing.id);
      }
      setView('messages');
    }
  };

  const filteredRequests = useMemo(() => {
    if (!userLocation) return [];
    let result = requests
      .map(req => ({ ...req, distance: calculateDistance(userLocation, req.location) }))
      .filter(req => 
        (req.distance || 0) <= RADIUS_KM && 
        (selectedCategory === 'All' || req.category === selectedCategory) &&
        req.status === RequestStatus.OPEN
      );
    if (sortBy === 'Distance') result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    else if (sortBy === 'Newest') result.sort((a, b) => b.timestamp - a.timestamp);
    return result;
  }, [requests, userLocation, selectedCategory, sortBy]);

  const activeConversation = useMemo(() => conversations.find(c => c.id === activeConversationId), [conversations, activeConversationId]);
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) return (
    <div className="min-h-screen relative">
      <Header activeView="home" onMenuClick={() => {}} isAuthenticated={false} />
      <Auth onLogin={handleLogin} />
    </div>
  );

  return (
    <div className="min-h-screen pb-20 relative">
      <Header 
        activeView={view} 
        isAuthenticated={true}
        onLogout={handleLogout}
        onMenuClick={(v) => { setView(v); setActiveConversationId(null); setEditingRequest(null); }} 
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {bankSms && (
        <div className="fixed top-20 left-4 right-4 z-[110] animate-in slide-in-from-top-full duration-700">
           <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-start gap-4 ring-4 ring-indigo-500/20">
              <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.5 1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-9zM5 15h10v-4H5v4z"></path></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">SMS Message • Now</span>
                </div>
                <p className="text-sm font-black leading-tight text-white mb-1">Bank Alert Received</p>
                <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{bankSms}"</p>
              </div>
              <button onClick={() => setBankSms(null)} className="text-slate-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
           </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🗑️</span></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Delete Post?</h3>
              <p className="text-sm text-slate-500 mb-8">Kya aap is help request ko hatana chahte hain?</p>
              <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => { setRequests(prev => prev.filter(req => req.id !== deleteConfirmation)); setDeleteConfirmation(null); }} className="bg-rose-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Yes, Delete</button>
                 <button onClick={() => setDeleteConfirmation(null)} className="bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
              </div>
           </div>
        </div>
      )}

      {focusedRequest && <RequestDetailModal request={focusedRequest} onClose={() => setFocusedRequest(null)} onOfferHelp={handleOfferHelp} />}
      
      {helpToast && (
        <div className="fixed top-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-4 rounded-[1.5rem] shadow-2xl border border-white/10">{helpToast}</div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {view === 'home' && (
          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <h2 className="text-3xl font-black mb-1 relative z-10">Padosiyon ki Madad Karein!</h2>
              <p className="text-indigo-100 text-sm font-bold italic opacity-90">Real-time neighborhood connection.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', ...Object.values(RequestCategory)].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-3 border rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRequests.map(req => (
                <RequestCard key={req.id} request={req} onHelpClick={handleOfferHelp} onEdit={(r) => { setEditingRequest(r); setView('post'); }} onDelete={(id) => setDeleteConfirmation(id)} onResolve={handleResolveRequest} onGiftTokens={handleGiftTokens} isOwnRequest={req.userId === 'currentUser'} />
              ))}
            </div>
          </div>
        )}

        {view === 'my-requests' && (
          <MyRequests requests={requests.filter(r => r.userId === 'currentUser')} onEdit={(r) => { setEditingRequest(r); setView('post'); }} onDelete={(id) => setDeleteConfirmation(id)} onResolve={handleResolveRequest} onGiftTokens={handleGiftTokens} onBack={() => setView('home')} />
        )}

        {view === 'messages' && (
          activeConversation ? <ChatThread conversation={activeConversation} onBack={() => { setActiveConversationId(null); }} onSendMessage={handleSendMessage} /> : <ChatList conversations={conversations} onSelectChat={(conv) => setActiveConversationId(conv.id)} />
        )}

        {view === 'notifications' && <NotificationCenter notifications={notifications} onNotificationClick={(n) => { setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif)); if (n.relatedId?.startsWith('conv-')) { setActiveConversationId(n.relatedId); setView('messages'); } }} onClearAll={() => setNotifications([])} />}

        {view === 'post' && <RequestForm initialData={editingRequest} onSubmit={handleSaveRequest} onCancel={() => { setView('home'); setEditingRequest(null); }} />}

        {view === 'profile' && (
          <UserProfile 
            user={currentUser} 
            onUpdateProfile={(data) => {
              const updated = { ...currentUser, ...data };
              setCurrentUser(updated);
              localStorage.setItem('padosi_user', JSON.stringify(updated));
            }}
            onWithdraw={handleWithdrawTokens}
          />
        )}

        {view === 'support' && <SupportCenter onBack={() => setView('home')} />}
      </main>
    </div>
  );
};

export default App;
