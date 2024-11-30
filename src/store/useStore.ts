import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Incident, ThreatFeed } from '../types';

interface NotificationSettings {
  criticalAlerts: boolean;
  systemUpdates: boolean;
  threatIntel: boolean;
  incidents: boolean;
}

interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  notifications: NotificationSettings;
  agreementsAccepted: boolean;
}

interface Store {
  user: User | null;
  users: User[];
  incidents: Incident[];
  threatFeeds: ThreatFeed[];
  settings: AppSettings;
  setUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  addThreatFeed: (feed: ThreatFeed) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      users: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@hdn-cfc.com',
          role: 'admin',
          active: true
        }
      ],
      incidents: [],
      threatFeeds: [],
      settings: {
        theme: 'system',
        notifications: {
          criticalAlerts: true,
          systemUpdates: true,
          threatIntel: true,
          incidents: true
        },
        agreementsAccepted: false
      },
      setUser: (user) => set({ user }),
      addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      addIncident: (incident) =>
        set((state) => ({ incidents: [...state.incidents, incident] })),
      updateIncident: (id, updates) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...updates } : incident
          ),
        })),
      addThreatFeed: (feed) =>
        set((state) => ({ threatFeeds: [...state.threatFeeds, feed] })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      updateNotificationSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: { ...state.settings.notifications, ...newSettings }
          }
        }))
    }),
    {
      name: 'hdn-storage',
    }
  )
);