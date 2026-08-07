import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `
  Nama kamu adalah Bubul, si gelembung biru ceria, cerdas, gaul, dan penuh rasa ingin tahu!
  Kamu adalah asisten literasi digital dari OutBubble yang membantu netizen membedah fenomena media sosial, algoritma, filter bubble, echo chamber, dan dinamika opini masyarakat secara seru, santai, namun sangat tajam & objektif.

  PRINSIP & GAYA BICARA BUBUL (SERU, EKSPLORATIF & ADIL):
  1. **Bahasanya Seru, Santai, & Relatable**:
     - Gunakan gaya bahasa anak muda/netizen yang cair, jenaka, dan ekspresif tapi tetap cerdas & tertata (pakai istilah populer seperti "doomscrolling", "war komen", "FYP", "dopamin hit", "kemakan narasi", "sudut pandang 360 derajat").
     - JANGAN kaku seperti buku teks atau instruktur galak!

  2. **Eksplorasi Dua Sisi Opini Masyarakat ("Kenapa Banyak yang Merasa PAS" vs "Kenapa Banyak yang Merasa GAK PAS")**:
     - JANGAN CUMA JELASKAN FAKTA SINGKAT ATAU KEADAAN STATUS QUO! Setiap kali membahas topik, isu, atau fenomena sosial, WAJIB membedahnya dari 2 kacamata masyarakat:
       * **Kenapa Bagi Sebagian Orang Ini Terasa "PAS" / Masuk Akal / Bermanfaat?** (Contoh: Kepraktisan, merasa dipahami, dapet konten yang relevan dengan hobi, wadah komunitas yang sefrekuensi, atau keuntungan ekonomi buat kreator/UMKM).
       * **Kenapa Bagi Sebagian Orang Ini Terasa "GAK PAS" / Bermasalah / Mengkhawatirkan?** (Contoh: Bikin terisolasi dalam gema opini sendiri, gampang tersulut emosi, hilangnya empati ke kelompok berseberangan, manipulatif, atau memicu perpecahan/polarisasi).
     - Bantu pengguna memahami *mengapa* tiap kelompok masyarakat memiliki sudut pandang tersebut tanpa memvonis salah satu pihak secara dogmatis.

  3. **JANGAN JUALAN MODUL/FITUR TERUS-MENERUS**:
     - DILARANG memaksa menyebutkan "Modul M01", "Tab Materi", atau "Kuis Labirin" di setiap jawaban! Fokus 100% pada substansi diskusi & eksplorasi pemikiran. Hanya sebutkan fitur/materi jika pengguna secara spesifik menanyakannya.

  4. **Akhiri dengan Pertanyaan / Tantangan Eksploratif Seru**:
     - Tutup jawabanmu dengan pertanyaan reflektif atau tantangan seru yang memicu pengguna untuk berpikir lebih jauh dari sudut pandang baru (contoh: "Menurutmu sendiri, di titik mana batasan antara 'rekomendasi yang membantu' dan 'rekomendasi yang mengurung'? 🫧").
`;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// POST API Route for Gemini Proxy
app.post("/api/chat", async (req: any, res: any) => {
  const { contents } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    // Return a smart, Bubul-themed mock reply so the chatbot works immediately after offline download!
    const userMessage = contents && contents.length > 0 
      ? contents[contents.length - 1].parts[0].text 
      : "";
    
    const textLower = userMessage.toLowerCase();
    let responseText = "";

    if (textLower.includes("filter bubble") || textLower.includes("gelembung") || textLower.includes("linimasa")) {
      responseText = `Seru banget kalau kita bedah **Filter Bubble** dari dua sisi mata uang! Di satu sisi ini bikin nyaman, tapi di sisi lain bisa bikin kita 'buta' suasana.

**Kenapa Banyak Orang Merasa Ini "PAS" & Bermanfaat?**
- **Sangat Efisien & Relevan**: Kita gak perlu buang waktu ngeliat konten yang gak kita sukai. Algoritme menyajikan hobi, musik, dan berita yang pas banget sama selera kita.
- **Rasa Dipahami**: Rasanya seperti punya lini masa impian yang selalu setuju dan sefrekuensi sama kita.

**Tapi, Kenapa Banyak yang Merasa Ini "GAK PAS" & Bermasalah?**
- **Terisolasi dari Realita**: Kita jadi lupa bahwa ada jutaan orang lain yang punya sudut pandang berbeda secara radikal.
- **Gampang Kaget & Syok**: Saat ketemu orang luar di dunia nyata yang beda pendapat, kita cenderung langsung melabeli mereka 'aneh' atau 'salah', padahal linimasa kita saja yang terlalu disaring.

Nah, kalau menurut pengalamanmu sendiri, sejauh mana filter bubble di HP-mu bikin hidup lebih praktis, dan di titik mana dia mulai kerasa 'mengurung'? 🫧`;
    } else if (textLower.includes("fyp") || textLower.includes("ads") || textLower.includes("attention") || textLower.includes("adiktif") || textLower.includes("candu") || textLower.includes("doomscrolling") || textLower.includes("sosmed")) {
      responseText = `Waduh, isu **FYP dan Doomscrolling** ini emang relate banget sama kehidupan kita sehari-hari! Kenapa ya fenomena ini bisa memicu perdebatan?

**Kenapa Ada yang Menganggap Ini "PAS" / Normal?**
- **Hiburan Murah & Cepat**: Setelah seharian capek sekolah, kuliah, atau kerja, scroll FYP itu hiburan paling gampang buat melepas penat dan cari ide-ide kreatif.
- **Peluang Ekonomi Kreator**: Buat para pembuat konten, algoritme adiktif ini justru berkah karena karya mereka bisa mendadak viral dan menjangkau pembeli dengan presisi tinggi.

**Sisi Lain: Kenapa Banyak yang Merasa "GAK PAS"?**
- **Eksploitasi Waktu & Dopamin**: Desain *infinite scroll* sengaja memanfaatkan celah psikologis otak kita, bikin kita bilang "satu video lagi ah..." sampai gak sadar udah jam 2 pagi.
- **Fokus Menciut**: Daya tahan konsentrasi kita jadi pendek banget karena terbiasa dengan rangsangan visual cepat bertubi-tubi.

Kira-kira, gimana caramu selama ini menyeimbangkan antara menikmati hiburan FYP tanpa merasa 'terjajah' oleh waktu? 🫧`;
    } else if (textLower.includes("echo chamber") || textLower.includes("ruang gema") || textLower.includes("kubu") || textLower.includes("politik") || textLower.includes("berantem") || textLower.includes("debat") || textLower.includes("netizen") || textLower.includes("komentar") || textLower.includes("war")) {
      responseText = `Fenomena **War Komen & Echo Chamber** ini selalu panas buat dibahas! Kenapa sih dua kelompok netizen bisa sama-sama merasa paling benar?

**Kenapa Bagi Kelompok Dalam, Ini Terasa "PAS"?**
- **Rasa Solidaritas & Validasi**: Berkumpul dengan orang-orang yang sependapat memberikan rasa aman, diterima, dan saling menguatkan keyakinan kelompok.
- **Merasa Membela Kebenaran**: Mereka yakin narasi mereka adalah fakta yang harus diperjuangkan demi kebaikan bersama.

**Kenapa Bagi Masyarakat Luas, Ini Terasa "GAK PAS"?**
- **Hilangnya Empati & Dialog**: Karena di dalam 'ruang gema' cuma suara mereka sendiri yang memantul, pendapat orang luar dianggap jahat, bodoh, atau musuh.
- **Memicu Perpecahan Nyata**: Debat di sosmed seringkali terbawa sampai ke kehidupan sehari-hari, bikin hubungan pertemanan atau keluarga jadi renggang.

Pernah gak kamu tiba-tiba sadar kalau akun yang kamu hujat ternyata punya alasan masuk akal dari sudut pandang mereka sendiri? Gimana perasaannya? 🫧`;
    } else if (textLower.includes("bias") || textLower.includes("konfirmasi") || textLower.includes("hoaks") || textLower.includes("percaya") || textLower.includes("fakta")) {
      responseText = `Duh, **Bias Konfirmasi** itu emang refleks alami otak manusia yang unik banget! Mari kita bongkar kenapa ini terjadi:

**Sisi Alami (Kenapa Otak Kita Merasa Ini "PAS"):**
- **Menghemat Energi Otak**: Otak manusia dirancang mencari jalan pintas. Lebih nyaman dan hemat energi kalau kita percaya informasi yang cocok sama apa yang udah kita yakini sebelumnya.
- **Proteksi Diri**: Mengakui kalau kita salah itu secara psikologis rasanya sakit dan gak enak, jadi otak otomatis membela diri.

**Sisi Bahayanya (Kenapa Ini "GAK PAS"):**
- **Gampang Kemakan Hoaks**: Kalau ada berita bohong yang menjelekkan orang yang tidak kita sukai, kita bakal langsung percaya tanpa cek fakta. Sebaliknya, berita benar tentang kebaikan mereka malah kita curigai!
- **Memicu 'Kabut' Realita**: Kita jadi cuma melihat separuh kebenaran yang kita sukai saja.

Gimana trik andalanmu kalau nemu berita yang rasanya 'terlalu pas' sama opinimu? Langsung sebar atau tahan dulu jempolnya? 🫧`;
    } else if (textLower.includes("algoritma") || textLower.includes("cara kerja") || textLower.includes("rekomendasi") || textLower.includes("data") || textLower.includes("tracker")) {
      responseText = `Membahas **Cara Kerja Algoritme** itu ibarat ngeliat cermin digital yang super canggih sekaligus agak misterius!

**Kenapa Pendekatan Algoritme Dipandang "PAS"?**
- **Personal Asisten yang Genius**: Tanpa perlu ngetik panjang, aplikasi udah tahu kita lagi suka resep masakan apa, lagu genre apa, atau barang apa yang mau dibeli.
- **Mendukung UMKM & Komunitas Kecil**: Algoritme membantu konten spesifik menemukan audiens yang tepat di seluruh dunia.

**Kenapa Pendekatan Ini Bikin Banyak Orang Merasa "GAK PAS"?**
- **Privasi Terancam**: Rasanya aneh dan agak nakutkan ketika kita baru omong-omong soal sepatu sama temen, eh 5 menit kemudian iklannya muncul di mana-mana.
- **Komersialisasi Kepribadian**: Kebiasaan dan emosi kita dikemas jadi data untuk dijual ke pengiklan demi keuntungan korporasi.

Menurutmu, apakah pertukaran antara 'kemudahan hidup' dan 'data privasi' ini sepadan? Di mana batas toleransi privasimu? 🫧`;
    } else {
      responseText = `Wah, topik yang kamu lempar menarik banget buat dieksplorasi dari berbagai sudut pandang netizen! 🫧

**Jika Dilihat dari Sisi Positifnya ("Kenapa Ada yang Suka/Merasa PAS"):**
- Fenomena digital ini seringkali memberi kemudahan, hiburan instan, serta ruang bagi orang-orang untuk menemukan komunitas yang sefrekuensi tanpa batasan geografis.

**Jika Dilihat dari Sisi Kritisnya ("Kenapa Banyak yang Khawatir/GAK PAS"):**
- Namun, kalau tidak disikapi dengan nalar dingin, hal ini bisa bikin kita terjebak dalam sudut pandang sempit, gampang tersulut emosi, dan kehilangan kemampuan memahami perspektif berbeda.

Menurut pandanganmu sendiri, dari skala 1 sampai 10, seberapa netral linimasa media sosialmu saat ini? Yuk kita bahas lebih jauh! 🫧`;
    }

    return res.json({ text: responseText });
  }

  try {
    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError: any = null;
    let generatedText = "";
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: { 
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          }
        });
        
        if (response && response.text) {
          generatedText = response.text;
          console.log(`Successfully generated content using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or was unavailable:`, err.message || err);
        lastError = err;
      }
    }

    if (!generatedText && lastError) {
      throw lastError;
    }

    res.json({ text: generatedText || "Aduh, sistem analisisku sedikit tersendat. Bisa kamu ulangi gejalanya? 🫧" });
  } catch (error: any) {
    console.error("Gemini API Error after all fallbacks:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

export default app;
