import { create } from "zustand";

const useSubNexus = create((set) => ({
  selectedSubNexus: [],
  setSelectedSubNexus: (selectedSubNexus) => set({ selectedSubNexus }),
  subNexusList: [],
  setSubNexusList: (subNexusList) => set({ subNexusList }),
}));

export default useSubNexus;
