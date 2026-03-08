import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PackagingAnalysisResult } from "@/lib/ers-engine";

interface DigdayaFormData {
  namaUsaha: string; pemilikNama: string; noTelepon: string;
  provinsi: string; kabupaten: string; bahasaDaerah: string;
  namaProduk: string; kategoriHS: string; kapasitasBulanan: string; satuan: string;
  kemasanScore: number | null;
  dokumenJenis: string; dokumenScore: number | null; dokumenPesan: string;
  targetNegara: string;
  kemasanInsights: PackagingAnalysisResult["insights"] | null;
}

interface AssessmentState {
  form: DigdayaFormData;
  updateForm: (updates: Partial<DigdayaFormData>) => void;
  resetForm: () => void;
}

const defaultForm: DigdayaFormData = {
  namaUsaha: "", pemilikNama: "", noTelepon: "", provinsi: "", kabupaten: "", bahasaDaerah: "id",
  namaProduk: "", kategoriHS: "", kapasitasBulanan: "", satuan: "kg",
  kemasanScore: null,
  dokumenJenis: "PIRT", dokumenScore: null, dokumenPesan: "",
  targetNegara: "JP",
  kemasanInsights: null,
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      form: defaultForm,
      updateForm: (updates) => set((state) => ({ form: { ...state.form, ...updates } })),
      resetForm: () => set({ form: defaultForm }),
    }),
    {
      name: "digdaya-assessment-store",
    }
  )
);
