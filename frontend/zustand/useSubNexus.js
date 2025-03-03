import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSubNexus = create(
  persist(
    (set) => ({
      selectedSubNexus: [],
      setSelectedSubNexus: (selectedSubNexus) => set({ selectedSubNexus }),
      subNexusList: [],
      setSubNexusList: (subNexusList) => set({ subNexusList }),
    }),
    {
      name: "subNexus-storage", 
    }
  )
);

export default useSubNexus;
