export interface MarketOpportunity {
  kode: string;
  negara: string;
  bendera: string;
  demandGrowth: string;
  nilaiImporJutaUsd: number;
  barrierUtama: string[];
  ersMinimum: number;
  peluangScore: number;
  topKomoditas: string[];
  highlight: string;
}

const MARKETS: MarketOpportunity[] = [
  {
    kode: "JP", negara: "Jepang", bendera: "🇯🇵",
    demandGrowth: "+18.3%", nilaiImporJutaUsd: 145.2,
    barrierUtama: ["JAS Labeling", "Phytosanitary Certificate", "Terjemahan Bahasa Jepang"],
    ersMinimum: 70, peluangScore: 88,
    topKomoditas: ["Rempah & Bumbu", "Makanan Organik", "Kopi Specialty"],
    highlight: "Pasar premium — konsumen Jepang sangat menghargai kualitas & keaslian produk",
  },
  {
    kode: "US", negara: "Amerika Serikat", bendera: "🇺🇸",
    demandGrowth: "+14.7%", nilaiImporJutaUsd: 312.8,
    barrierUtama: ["FDA Registration", "US Customs Bond", "Labeling English"],
    ersMinimum: 75, peluangScore: 82,
    topKomoditas: ["Makanan Etnik Asia", "Healthy Snack", "Superfoods"],
    highlight: "Pasar terbesar — komunitas diaspora Indonesia 200k+ sebagai entry point",
  },
  {
    kode: "MY", negara: "Malaysia", bendera: "🇲🇾",
    demandGrowth: "+22.1%", nilaiImporJutaUsd: 98.4,
    barrierUtama: ["Halal Certification JAKIM", "Bahasa Melayu Label", "Import Permit"],
    ersMinimum: 55, peluangScore: 91,
    topKomoditas: ["Produk Halal", "Batik & Kerajinan", "Makanan Tradisional"],
    highlight: "Pasar terdekat — kesamaan budaya dan bahasa mempermudah entry",
  },
  {
    kode: "SA", negara: "Arab Saudi", bendera: "🇸🇦",
    demandGrowth: "+31.0%", nilaiImporJutaUsd: 78.9,
    barrierUtama: ["SASO Certification", "Halal MUI + SFDA", "Arabic Label"],
    ersMinimum: 65, peluangScore: 85,
    topKomoditas: ["Produk Halal Premium", "Kopi & Teh", "Kurma Turunan"],
    highlight: "Potensi besar — 1.8 juta TKI sebagai brand ambassador organik",
  },
  {
    kode: "AU", negara: "Australia", bendera: "🇦🇺",
    demandGrowth: "+11.5%", nilaiImporJutaUsd: 67.3,
    barrierUtama: ["AQIS Biosecurity", "FSANZ Standard", "Country of Origin Label"],
    ersMinimum: 72, peluangScore: 76,
    topKomoditas: ["Tropical Fruits", "Specialty Coffee", "Organic Spices"],
    highlight: "Pasar niche berkembang — tren healthy & ethnic food meningkat pesat",
  },
  {
    kode: "DE", negara: "Jerman", bendera: "🇩🇪",
    demandGrowth: "+9.8%", nilaiImporJutaUsd: 89.1,
    barrierUtama: ["EU Food Law 1169/2011", "DE Import License", "German Labeling"],
    ersMinimum: 78, peluangScore: 73,
    topKomoditas: ["Organic Food", "Fair Trade Coffee", "Batik Premium"],
    highlight: "Gerbang masuk EU — sertifikasi EU membuka akses 27 negara sekaligus",
  },
  {
    kode: "CN", negara: "China", bendera: "🇨🇳",
    demandGrowth: "+28.4%", nilaiImporJutaUsd: 224.7,
    barrierUtama: ["CIFER Registration", "CFDA/NMPA", "Chinese Label Mandatory"],
    ersMinimum: 68, peluangScore: 79,
    topKomoditas: ["Sarang Walet", "Produk Laut", "Kopi Specialty"],
    highlight: "Pasar terbesar — permintaan produk premium Indonesia tumbuh signifikan",
  },
  {
    kode: "GB", negara: "Inggris", bendera: "🇬🇧",
    demandGrowth: "+13.2%", nilaiImporJutaUsd: 54.6,
    barrierUtama: ["UK Food Standards Agency", "UKCA Mark", "Customs Declaration"],
    ersMinimum: 74, peluangScore: 71,
    topKomoditas: ["Ethnic Food", "Specialty Tea", "Handcraft"],
    highlight: "Post-Brexit peluang baru — UK mencari mitra dagang non-EU aktif",
  },
];

export function getMarketOpportunities(): MarketOpportunity[] {
  return MARKETS;
}

export function getMarketByCode(kode: string): MarketOpportunity | undefined {
  return MARKETS.find(m => m.kode === kode);
}
