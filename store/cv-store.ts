import { create } from 'zustand';
import { CVData, initialCVData } from '../lib/cv-schema';

interface CVState {
  cvData: CVData;
  isLoading: boolean;
  error: string | null;
  setCVData: (data: Partial<CVData>) => void;
  resetCV: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCVStore = create<CVState>((set) => ({
  cvData: initialCVData,
  isLoading: false,
  error: null,
  setCVData: (data) =>
    set((state) => ({
      cvData: { ...state.cvData, ...data },
    })),
  resetCV: () => set({ cvData: initialCVData, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
