// Quiz Utilities and Question Generator

export const generateQuestion = (level: number, index: number, mode: 'pre' | 'quiz' | 'post') => {
  const seed = (level * 10) + index;

  // Fisher-Yates shuffle
  const shuffleArray = (array: string[], correctText: string) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return {
      options: shuffled,
      correctIdx: shuffled.indexOf(correctText)
    };
  };
  
  const library = [
    { m: "M01", t: "Algoritma Feed", d: "instruksi matematis penentu konten berdasarkan perilaku", e: "Algoritma bekerja secara otomatis dengan menganalisis data perilaku pengguna seperti durasi tonton dan interaksi untuk menciptakan umpan balik yang personal." },
    { m: "M01", t: "Attention Economy", d: "perhatian sebagai komoditas yang dijual ke pengiklan", e: "Dalam attention economy, laba platform digital bergantung pada seberapa lama mereka bisa menahan perhatian pengguna agar nilai iklan semakin tinggi." },
    { m: "M02", t: "Filter Bubble", d: "isolasi informasi otomatis oleh algoritma", e: "Filter bubble menutup akses kita ke informasi yang berbeda, sehingga kita hanya melihat realitas yang mendukung pandangan kita saja." },
    { m: "M03", t: "Echo Chamber", d: "ruang gema yang memperkuat opini homogen secara aktif", e: "Echo chamber terjadi saat kita secara sadar memilih lingkungan sosial yang hanya berisi suara-suara yang mendukung opini kita sendiri." },
    { m: "M04", t: "Bias Konfirmasi", d: "kecenderungan otak mencari pembenaran keyakinan", e: "Otak manusia memiliki bias untuk lebih memercayai informasi yang mendukung keyakinannya dan menolak informasi yang membuktikannya salah." },
    { m: "M05", t: "Fragmentasi Sosial", d: "pecahnya ikatan antar kelompok masyarakat", e: "Fragmentasi sosial mengakibatkan kelompok masyarakat terpecah menjadi unit-kelompok kecil yang tidak lagi memiliki bahasa atau pemahaman bersama." },
    { m: "M06", t: "Post-Truth", d: "kondisi emosi lebih dipercaya daripada fakta objektif", e: "Di era post-truth, fakta ilmiah seringkali kalah telak dengan narasi yang menyentuh emosi atau identitas personal pengguna." },
    { m: "M07", t: "Polarisasi Afektif", d: "kebencian emosional antar kubu politik", e: "Polarisasi afektif membuat seseorang tidak hanya berbeda pendapat secara politik, tapi juga membenci orang dari kubu lawan secara pribadi." },
    { m: "M08", t: "Radikalisasi Online", d: "proses bertahap menuju paham ekstrem via algoritma", e: "Proses ini memanfaatkan algoritma yang terus menyajikan konten yang semakin provokatif untuk menjaga keterlibatan (engagement) pengguna." },
    { m: "M09", t: "Chat Chamber Effect", d: "AI yang hanya memantulkan keinginan pengguna", e: "AI chatbot seringkali menunjukkan sifat 'sycophancy' atau selalu menyetujui opini pengguna daripada memberikan fakta yang objektif namun tidak nyaman." },
    { m: "M10", t: "Literasi Digital", d: "kemampuan kritis mengevaluasi informasi", e: "Literasi digital bukan sekadar mahir teknologi, melainkan kemampuan untuk memverifikasi, menganalisis, dan mengevaluasi kebenaran informasi." }
  ];

  if (mode === 'pre' || mode === 'post') {
    const scenarios = [
      { q: "Apa yang paling tepat dilakukan saat menerima informasi yang memicu amarah?", o: ["Verifikasi sumber sebelum bereaksi", "Segera bagikan agar orang lain waspada", "Langsung percaya jika sesuai keyakinan", "Mengabaikannya tanpa peduli"], c: "Verifikasi sumber sebelum bereaksi", e: "Berhenti sejenak and melakukan verifikasi adalah langkah kunci literasi digital untuk memutus rantai disinformasi." },
      { q: "Mengapa algoritma TikTok bisa membuat seseorang terpapar konten ekstrem?", o: ["Karena mengejar engagement/durasi tonton", "Karena sistem keamanan yang lemah", "Karena campur tangan manual admin", "Hanya terjadi jika kita mencarinya"], c: "Karena mengejar engagement/durasi tonton", e: "Algoritma dioptimalkan untuk Attention Economy, yang mana konten provokatif terbukti lebih lama menahan perhatian pengguna." },
      { q: "Kondisi di mana kita tidak tahu apa yang tidak kita ketahui karena disaring algoritma disebut...", o: ["Filter Bubble", "Echo Chamber", "Post-Truth", "Deepfake"], c: "Filter Bubble", e: "Filter bubble menyaring informasi secara pasif sehingga Anda tidak sadar telah kehilangan perspektif lain." },
      { q: "Fenomena 'Cebong vs Kampret' di Indonesia merupakan contoh nyata dari...", o: ["Fragmentasi Sosial & Polarisasi", "Kecanggihan Teknologi", "Literasi Digital Tinggi", "Sistem Rekomendasi AI"], c: "Fragmentasi Sosial & Polarisasi", e: "Konflik ini menunjukkan bagaimana ruang digital memecah masyarakat menjadi kubu identitas yang bermusuhan secara emosional." },
      { q: "Apa yang dimaksud dengan 'Dopamine Loop' di media sosial?", o: ["Siklus candu dari notifikasi dan likes", "Proses pembersihan data akun", "Sistem pengiriman pesan rahasia", "Algoritma pencarian kata kunci"], c: "Siklus candu dari notifikasi dan likes", e: "Interaksi sosial digital memicu pelepasan dopamin di otak, menciptakan ketergantungan mental untuk terus membuka aplikasi." },
      { q: "Mengapa berita palsu menyebar 6x lebih cepat dibanding berita benar?", o: ["Karena lebih mengejutkan dan provokatif", "Karena jumlah bot lebih banyak", "Karena berita benar sulit ditulis", "Karena internet terlalu lambat"], c: "Karena lebih mengejutkan dan provokatif", e: "Riset MIT menunjukkan bahwa emosi negatif dan unsur kebaruan pada hoaks memicu impuls manusia untuk berbagi lebih cepat." },
      { q: "Saat otak kita hanya mencari informasi yang membenarkan opini kita, kita mengalami...", o: ["Bias Konfirmasi", "Critical Thinking", "Digital Citizenship", "Selective Memory"], c: "Bias Konfirmasi", e: "Bias konfirmasi adalah filter kognitif yang membuat kita menutup diri dari kebenaran yang bertentangan dengan keyakinan kita." },
      { q: "Bahaya utama dari Deepfake dalam konteks politik adalah...", o: ["Runtuhnya kepercayaan pada bukti visual", "Kualitas video yang buruk", "Hanya bisa dibuat oleh ahli", "Tidak berpengaruh pada opini"], c: "Runtuhnya kepercayaan pada bukti visual", e: "Deepfake merusak epistemologi masyarakat; orang menjadi sulit membedakan mana bukti nyata dan mana rekayasa digital." },
      { q: "Echo Chamber berbeda dengan Filter Bubble karena...", o: ["Melibatkan pilihan aktif pengguna", "Bekerja secara otomatis oleh mesin", "Hanya terjadi di Google Search", "Tidak memiliki dampak negatif"], c: "Melibatkan pilihan aktif pengguna", e: "Echo chamber diperkuat oleh perilaku kita yang sengaja memilih lingkungan pertemanan yang hanya berisi satu pemikiran saja." },
      { q: "Apa inti dari solusi literasi digital menurut model Finlandia?", o: ["Integrasi berpikir kritis sejak dini", "Melarang penggunaan media sosial", "Menghapus semua akun anonim", "Membangun firewall nasional"], c: "Integrasi berpikir kritis sejak dini", e: "Finlandia melatih logika kritis sebagai pertahanan utama masyarakat dalam menghadapi manipulasi informasi." }
    ];
    const s = scenarios[index % scenarios.length];
    const randomized = shuffleArray(s.o, s.c);
    return { q: s.q, options: randomized.options, correct: randomized.correctIdx, explanation: s.e };
  }

  const topic = library[seed % library.length];
  const templates = [
    { q: `Berdasarkan Modul ${topic.m}, apa bahaya utama dari ${topic.t}?`, a: `Dapat menjadi ${topic.d}` },
    { q: `Bagaimana ${topic.t} mempengaruhi cara masyarakat memproses informasi?`, a: `Dengan bertindak sebagai ${topic.d}` },
    { q: `Manakah yang mendefinisikan fenomena ${topic.t} di ruang digital?`, a: `Sebuah ${topic.d}` }
  ];
  const template = templates[seed % templates.length];
  
  const distractors = library
    .filter(item => item.t !== topic.t)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(item => `Proses ${item.d}`);

  const randomized = shuffleArray([template.a, ...distractors], template.a);

  return {
    q: template.q,
    options: randomized.options,
    correct: randomized.correctIdx,
    explanation: topic.e
  };
};
