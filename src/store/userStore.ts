import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  currentUser: {
    id: string;
    naam: string;
    email: string;
    role: 'admin' | 'accountant' | 'assistant';
    language: 'nl' | 'en';
  } | null;
  setCurrentUser: (user: UserState['currentUser']) => void;
  setLanguage: (language: 'nl' | 'en') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: {
        id: '1',
        naam: 'Harm-Jan Kaspers',
        email: 'harm-jan@kaspersadvies.nl',
        role: 'admin',
        language: 'nl',
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      setLanguage: (language) => 
        set((state) => ({
          currentUser: state.currentUser 
            ? { ...state.currentUser, language }
            : null
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
