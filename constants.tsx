
import { HelpRequest, RequestCategory, RequestStatus } from './types';

export const RADIUS_KM = 2;

export const CATEGORY_STYLES: Record<string, { color: string; icon: string }> = {
  Emergency: { color: 'bg-red-500 text-white', icon: '🚨' },
  Medicine: { color: 'bg-emerald-500 text-white', icon: '💊' },
  Tools: { color: 'bg-amber-500 text-white', icon: '🔧' },
  Grocery: { color: 'bg-lime-500 text-white', icon: '🛒' },
  'Senior Care': { color: 'bg-rose-500 text-white', icon: '👴' },
  General: { color: 'bg-indigo-500 text-white', icon: '🤝' },
};

export const MOCK_REQUESTS: HelpRequest[] = [
  {
    id: '1',
    userId: 'currentUser', // Changed from 'u1' to 'currentUser' so the user sees Edit/Delete buttons immediately
    userName: 'Ramesh Uncle',
    phone: '9876543210',
    title: 'Need BP Medicine',
    description: 'Bite and go pharmacy is closed, can someone check if the one near main road is open and pick up my BP meds?',
    category: RequestCategory.MEDICINE,
    timestamp: Date.now() - 3600000,
    status: RequestStatus.OPEN,
    priority: 'High',
    location: { lat: 28.6140, lng: 77.2090 }
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Amit S.',
    phone: '9988776655',
    title: 'Need Drill Machine',
    description: 'Installing a bookshelf, need a drill machine for 30 minutes.',
    category: RequestCategory.TOOLS,
    timestamp: Date.now() - 7200000,
    status: RequestStatus.OPEN,
    priority: 'Low',
    location: { lat: 28.6135, lng: 77.2100 }
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Mrs. Kapoor',
    phone: '9123456789',
    title: 'Help with heavy groceries',
    description: 'Just got back from the market, need help carrying 3 heavy bags to the 2nd floor.',
    category: RequestCategory.GROCERY,
    timestamp: Date.now() - 1800000,
    status: RequestStatus.OPEN,
    priority: 'Medium',
    location: { lat: 28.6145, lng: 77.2110 }
  }
];
