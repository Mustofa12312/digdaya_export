"use server";

export async function validateDocumentAction(jenis: string, file: File): Promise<{ valid: boolean; skor: number; pesan: string }> {
  // SIMULASI: Dalam produksi sebenarnya (production), Anda akan mengirim 'file' (Buffer/Blob) 
  // ke API OCR Google Cloud Vision atau API BPOM / Halal MUI menggunakan token dari Server.
  // Untuk saat ini, kita akan menunggu 1.5 detik untuk mensimulasikan waktu pemrosesan jaringan.
  const buffer = await file.arrayBuffer(); // Contoh mendapatkan data file

  return new Promise(resolve => {
    setTimeout(() => {
      const validDocs: Record<string, { skor: number; pesan: string }> = {
        PIRT:  { skor: 85, pesan: "Nomor PIRT terverifikasi aktif di database Dinas Kesehatan" },
        NIE:   { skor: 92, pesan: "NIE BPOM valid dan terdaftar dalam sistem BPOM Online" },
        HALAL: { skor: 90, pesan: "Sertifikat Halal MUI aktif, berlaku s.d. 2027" },
        SNI:   { skor: 88, pesan: "SNI terdaftar dan produk lolos uji standar kualitas" },
        MEREK: { skor: 80, pesan: "Merek terdaftar di DJKI, status: TERDAFTAR" },
      };
      
      const result = validDocs[jenis] || { skor: 70, pesan: "Dokumen diterima dan diverifikasi secara manual oleh Kurator." };
      resolve({ valid: true, skor: result.skor, pesan: result.pesan });
    }, 1500);
  });
}
