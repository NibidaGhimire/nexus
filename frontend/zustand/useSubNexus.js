import { create } from "zustand";

const useSubNexus = create((set) => ({
  selectedSubNexus: [],
  setselectedSubNexus: (selectedSubNexus) => set({ selectedSubNexus }),
  subNexusList: [],
  setSubNexusList: (subNexusList) => set({ subNexusList }),
}));

export default useSubNexus;
