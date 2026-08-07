import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, ShieldAlert, BookText, AlertTriangle, 
  Search, Microscope, Users2, Lightbulb, GraduationCap,
  Zap, Brain, Share2, Target, Rocket, X, ChevronLeft, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../lib/store';

// --- DATA MATERI LENGKAP (M01 - M10) ---
const MATERI_DATA = [
  {
    id: "M01",
    title: "Algoritma & Attention Economy",
    desc: "Mengenal instruksi matematis yang menjadikan perhatianmu sebagai komoditas berharga.",
    icon: Zap, color: "bg-orange-600", lightColor: "bg-orange-50", borderColor: "border-orange-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-6">
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Pengertian</h5>
            <p>Algoritma media sosial adalah serangkaian instruksi matematis yang digunakan oleh platform digital seperti TikTok, Instagram, YouTube, dan Facebook untuk menentukan konten apa yang ditampilkan kepada setiap pengguna. Algoritma ini bekerja secara otomatis dengan menganalisis data perilaku pengguna — termasuk konten apa yang pernah ditonton, berapa lama ditonton, konten apa yang disukai atau dibagikan, akun siapa yang diikuti, dan bahkan kapan biasanya pengguna online.</p>
            <p className="mt-4">Sistem rekomendasi (recommendation system) adalah komponen inti dari algoritma ini. Sistem ini menggunakan teknik machine learning untuk memprediksi konten mana yang paling mungkin membuat pengguna terus menggulir layar (scrolling). Semakin lama pengguna berada di platform, semakin banyak data yang dikumpulkan, dan semakin "akurat" rekomendasi yang diberikan — hingga pada titik di mana algoritma bisa terasa seperti "membaca pikiran" penggunanya.</p>
            <p className="mt-4">Attention Economy adalah konsep yang menggambarkan bagaimana perhatian manusia telah menjadi komoditas berharga di era digital. Platform media sosial tidak menjual produk fisik — mereka menjual perhatian penggunanya kepada pengiklan. Semakin lama perhatian pengguna tertahan di platform, semakin tinggi nilai iklan yang bisa dijual. Inilah mengapa seluruh desain platform — dari notifikasi hingga algoritma konten — dirancang untuk memaksimalkan waktu yang dihabiskan pengguna di dalam aplikasi.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Ciri-Ciri</h5>
            <ul className="list-disc pl-5 space-y-2">
              <li>Konten yang muncul di beranda atau FYP (For You Page) selalu terasa sangat relevan dan personal.</li>
              <li>Semakin sering kamu menonton atau menyukai jenis konten tertentu, semakin banyak konten serupa yang muncul.</li>
              <li>Platform selalu mengirimkan notifikasi pada waktu-waktu tertentu untuk menarik kamu kembali.</li>
              <li>Fitur autoplay membuat video berikutnya langsung berjalan tanpa perlu memilih.</li>
              <li>Tidak ada titik akhir yang jelas — konten terus tersedia tanpa batas (infinite scroll).</li>
              <li>Sistem 'like', komentar, dan share memberikan umpan balik sosial yang memicu dopamin.</li>
            </ul>
          </div>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-6">
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Kecanduan Digital & Dopamine Loop</h5>
            <p>Setiap kali kamu menerima notifikasi, mendapat 'like', atau menemukan konten yang mengejutkan, otak melepaskan dopamin — neurotransmitter yang terkait dengan rasa senang dan penghargaan. Platform merancang sistem mereka untuk memaksimalkan momen-momen ini. Hasilnya adalah siklus kecanduan yang mirip dengan mesin slot di kasino: pengguna terus menggulir layar dengan harapan menemukan konten 'berikutnya' yang memuaskan.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Penurunan Attention Span</h5>
            <p>Penelitian menunjukkan bahwa rata-rata rentang perhatian manusia telah menurun secara signifikan di era media sosial. Paparan terus-menerus terhadap konten pendek dan stimulasi cepat membuat otak terlatih untuk tidak bisa bertahan lama pada satu hal. Ini berdampak pada kemampuan belajar, membaca, dan berkonsentrasi dalam kehidupan akademik.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Lahirnya Filter Bubble & Echo Chamber</h5>
            <p>Ketika algoritma terus-menerus menyajikan konten yang sesuai preferensi pengguna, secara tidak langsung ia membangun tembok di sekitar pandangan dunia pengguna. Ini adalah akar dari fenomena filter bubble dan echo chamber yang akan dibahas pada modul-modul berikutnya.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">Eksploitasi Data Pribadi</h5>
            <p>Seluruh sistem ini berjalan di atas pengumpulan data masif. Platform mengumpulkan data tentang lokasi, perangkat, perilaku browsing, bahkan ekspresi wajah (melalui kamera) untuk menyempurnakan targetisasi iklan. Pengguna sering tidak menyadari seberapa dalam data mereka dieksploitasi.</p>
          </div>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-6">
          <div>
            <h5 className="font-bold text-[#031466] mb-2">The Social Dilemma (2020)</h5>
            <p>Dokumenter Netflix ini menampilkan pengakuan langsung dari mantan engineer dan eksekutif perusahaan teknologi besar seperti Google, Facebook, Twitter, dan Pinterest. Mereka mengungkap bahwa fitur-fitur yang terasa 'gratis' di media sosial sesungguhnya adalah perangkap yang sengaja dirancang untuk memaksimalkan ketergantungan pengguna. Salah satu pernyataan paling mengejutkan: 'Dua industri memanggil pelanggannya sebagai users — industri narkoba dan industri software.'</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">TikTok FYP & Rabbit Hole Effect</h5>
            <p>Sejumlah eksperimen oleh jurnalis dan peneliti menunjukkan bahwa algoritma TikTok mampu membawa pengguna dari konten hiburan ringan ke konten ideologi ekstrem hanya dalam hitungan jam. Sebuah eksperimen oleh Wall Street Journal (2021) membuat akun bot yang menonton konten tertentu, dan menemukan bahwa TikTok mulai merekomendasikan konten yang semakin ekstrem dalam waktu kurang dari 2 jam.</p>
          </div>
          <div>
            <h5 className="font-bold text-[#031466] mb-2">YouTube Rabbit Hole</h5>
            <p>Penelitian yang dipublikasikan di jurnal ilmiah menunjukkan bagaimana autoplay YouTube secara sistematis mengarahkan pengguna ke konten yang semakin kontroversial dan provokatif. Pengguna yang mulai dari video olahraga bisa berakhir menonton konten teori konspirasi, dan dari sana ke konten radikalisme — semuanya didorong oleh algoritma yang mengejar engagement.</p>
          </div>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-6">
          <p><strong>MIT Media Lab: Berita Palsu Menyebar 6x Lebih Cepat:</strong> Penelitian Vosoughi, Roy & Aral (2018) di jurnal Science menganalisis 126.000 berita di Twitter selama 11 tahun. Hasilnya mengejutkan: berita palsu menyebar 6 kali lebih cepat, lebih luas, dan lebih dalam dibanding berita benar. Alasannya adalah berita palsu cenderung lebih baru, mengejutkan, dan provokatif — persis jenis konten yang dioptimalkan oleh algoritma attention economy.</p>
          <p><strong>Center for Humane Technology: The Engagement Trap:</strong> Laporan dari lembaga nirlaba yang didirikan oleh mantan karyawan Google dan Apple ini mendokumentasikan bagaimana metrik engagement (likes, shares, komentar) yang dioptimalkan oleh algoritma ternyata paling mudah dipicu oleh konten yang memancing kemarahan, ketakutan, dan kecemasan — bukan konten yang informatif atau membangun.</p>
          <p><strong>Penelitian Screen Time & Mahasiswa Indonesia:</strong> Berbagai survei di kalangan mahasiswa Indonesia menunjukkan rata-rata penggunaan media sosial mencapai 4-8 jam per hari. Sebagian besar responden mengakui mereka membuka media sosial bukan karena ada konten spesifik yang ingin dilihat, melainkan karena kebiasaan otomatis — tanda kuat dari keberhasilan desain adiktif platform.</p>
        </div>
      )}
    }
  },
  {
    id: "M02",
    title: "Filter Bubble",
    desc: "Kondisi isolasi informasi otomatis yang menyaring sudut pandang berbeda dari layarmu.",
    icon: Globe, color: "bg-blue-600", lightColor: "bg-blue-50", borderColor: "border-blue-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Filter bubble adalah kondisi di mana seseorang hanya terpapar informasi, opini, dan konten yang sesuai dengan preferensi dan keyakinan mereka sendiri — sementara informasi yang berbeda atau bertentangan tersaring keluar secara otomatis oleh algoritma platform. Istilah ini pertama kali diperkenalkan oleh aktivis internet Eli Pariser dalam bukunya "The Filter Bubble: What the Internet Is Hiding from You" (2011).</p>
          <p>Cara kerjanya sederhana namun berdampak besar: setiap kali kamu berinteraksi dengan konten digital — mengklik, menyukai, berbagi, atau bahkan hanya berhenti sejenak saat menggulir layar — algoritma mencatat preferensimu dan mulai menyaring konten yang akan kamu lihat berikutnya. Lama-kelamaan, kamu hanya melihat dunia melalui "gelembung" yang telah dikurasi secara personal untukmu.</p>
          <p>Yang berbahaya dari filter bubble adalah sifatnya yang tidak terlihat. Berbeda dengan sensor yang terang-terangan melarang informasi, filter bubble bekerja diam-diam. Kamu tidak tahu apa yang tidak kamu ketahui, karena informasi yang tersaring tidak pernah mencapai layarmu sejak awal.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Beranda media sosial selalu dipenuhi konten yang sejalan dengan pandanganmu.</li>
            <li>Kamu jarang atau tidak pernah terpapar opini yang berlawanan dengan keyakinanmu.</li>
            <li>Hasil pencarian Google-mu berbeda dengan hasil pencarian orang lain untuk kata kunci yang sama.</li>
            <li>Kamu merasa pendapatmu adalah 'mayoritas' karena semua orang di circle online-mu setuju.</li>
            <li>Berita yang kamu terima hampir selalu mengonfirmasi apa yang sudah kamu percaya sebelumnya.</li>
            <li>Kamu terkejut ketika mengetahui ada kelompok besar masyarakat yang berpendapat berbeda.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Distorsi Persepsi Realitas:</strong> Ketika seseorang hanya terpapar satu sudut pandang secara terus-menerus, persepsinya tentang realitas menjadi terdistorsi. Ia bisa merasa bahwa pandangannya adalah pandangan mayoritas, bahwa isu yang menurutnya penting adalah isu yang dirasakan semua orang, dan bahwa mereka yang berpendapat berbeda adalah kelompok kecil yang aneh atau salah.</p>
          <p><strong>Melemahnya Kemampuan Berpikir Kritis:</strong> Paparan terhadap berbagai sudut pandang adalah kondisi yang diperlukan untuk berpikir kritis. Ketika seseorang terisolasi dalam gelembung informasi, kemampuannya untuk mengevaluasi argumen dari berbagai sisi melemah. Ia kehilangan latihan untuk mempertimbangkan perspektif yang berbeda dan mencari kelemahan dalam argumennya sendiri.</p>
          <p><strong>Polarisasi & Intoleransi:</strong> Filter bubble mempercepat polarisasi sosial karena masing-masing kelompok semakin yakin dengan pandangannya sendiri tanpa pernah benar-benar memahami mengapa kelompok lain berpikir berbeda. Ini menghasilkan intoleransi dan kesulitan berdialog secara konstruktif.</p>
          <p><strong>Kerentanan terhadap Manipulasi:</strong> Seseorang yang terjebak dalam filter bubble jauh lebih mudah dimanipulasi oleh disinformasi yang disesuaikan dengan preferensinya. Konten hoaks yang dirancang untuk memperkuat prasangka tertentu akan diterima tanpa banyak pertanyaan karena sesuai dengan 'gelembung' yang sudah terbentuk.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Eksperimen Google Search Filter Bubble:</strong> Eli Pariser dan sejumlah peneliti melakukan eksperimen di mana beberapa orang melakukan pencarian Google dengan kata kunci yang sama ('Egypt', 'BP oil spill') dari perangkat yang berbeda. Hasilnya: meskipun kata kunci identik, hasil pencarian yang diterima masing-masing orang sangat berbeda tergantung riwayat browsing dan lokasi mereka. Ini membuktikan bahwa tidak ada 'internet yang sama' untuk semua orang.</p>
          <p><strong>Facebook & Pemilu AS 2016:</strong> Analisis mendalam terhadap perilaku pengguna Facebook selama Pemilu AS 2016 menunjukkan bagaimana algoritma Facebook secara aktif membatasi paparan pengguna terhadap konten dari kubu politik yang berbeda. Pendukung Trump hampir tidak pernah melihat konten pro-Clinton di beranda mereka, dan sebaliknya. Ini menciptakan realitas paralel di mana masing-masing pihak hidup dalam versi dunia yang sangat berbeda.</p>
          <p><strong>Filter Bubble di Indonesia: Pilpres 2024:</strong> Penelitian dan pengamatan media menunjukkan bahwa selama Pilpres 2024, pengguna media sosial Indonesia yang mendukung kandidat tertentu hampir secara eksklusif menerima konten yang mendukung kandidat mereka — termasuk berita, meme, dan analisis. Algoritma secara efektif mempartisi ruang digital Indonesia berdasarkan afiliasi politik.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Eli Pariser (2011) — The Filter Bubble:</strong> Karya foundational yang memperkenalkan konsep filter bubble. Pariser berargumen bahwa personalisasi internet yang tidak transparan menciptakan 'web of one' di mana setiap pengguna mendapat versi internet yang berbeda — dan ini mengancam demokrasi yang membutuhkan warga negara yang terpapar informasi yang beragam.</p>
          <p><strong>Terren & Borge (2021) — Systematic Review:</strong> Tinjauan sistematis terhadap 48 penelitian tentang echo chamber dan filter bubble di media sosial. Studi ini menyimpulkan bahwa meskipun filter bubble secara teknis ada, ukurannya bervariasi antar platform dan konteks. Filter bubble paling kuat terbentuk bukan hanya karena algoritma, tetapi karena kombinasi antara algoritma dan pilihan aktif pengguna untuk hanya mengikuti akun yang sepaham.</p>
          <p><strong>Reuters Institute (2022) — Literature Review:</strong> Tinjauan literatur dari Reuters Institute menemukan bahwa hanya sekitar 5% pengguna media sosial yang benar-benar berada dalam filter bubble partisan yang murni. Namun, dampak dari 5% ini terhadap wacana publik jauh lebih besar dari proporsinya, karena kelompok ini cenderung lebih aktif dalam memproduksi dan menyebarkan konten.</p>
        </div>
      )}
    }
  },
  {
    id: "M03",
    title: "Echo Chamber",
    desc: "Lingkungan informasi yang memperkuat keyakinan melalui pengulangan pandangan serupa.",
    icon: Users2, color: "bg-purple-600", lightColor: "bg-purple-50", borderColor: "border-purple-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Echo chamber — secara harfiah berarti "ruang gema" — adalah lingkungan informasi di mana keyakinan, ide, dan opini seseorang terus diperkuat karena ia hanya terpapar pada pandangan-pandangan yang serupa dengan miliknya sendiri. Dalam echo chamber, setiap pernyataan "memantul" kembali dan diperkuat, seperti suara yang bergema di ruangan tanpa peredam suara.</p>
          <p>Berbeda dengan filter bubble yang lebih bersifat pasif (kamu tidak memilih untuk tidak melihat konten tertentu — algoritma yang menyaringnya), echo chamber memiliki komponen yang lebih aktif. Seseorang secara sadar bergabung dengan komunitas, grup, atau feed yang homogen secara ideologis. Mereka memilih untuk mengikuti akun yang sepaham, bergabung dengan grup yang satu visi, dan memblokir atau unfollow siapa pun yang berpendapat berbeda.</p>
          <p>Echo chamber beroperasi di semua level, mulai dari grup WhatsApp keluarga, forum online, akun Twitter/X yang diikuti, hingga media berita yang dikonsumsi. Ia bisa terbentuk di isu politik, agama, kesehatan, gaya hidup, atau bahkan topik sehari-hari seperti diet atau parenting.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hampir semua orang di circle online-mu setuju satu sama lain tentang isu-isu penting.</li>
            <li>Siapa pun yang berbeda pendapat langsung di-judge, di-bully, atau dikucilkan dari komunitas.</li>
            <li>Informasi dari luar komunitas selalu dicurigai sebagai 'propaganda' atau 'hoaks'.</li>
            <li>Ada rasa identitas kelompok yang kuat — 'kami' vs 'mereka'.</li>
            <li>Keyakinan di dalam kelompok cenderung semakin ekstrem dari waktu ke waktu.</li>
            <li>Anggota kelompok merasa mereka memiliki akses ke 'kebenaran' yang tidak diketahui orang lain.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Penguatan Keyakinan Salah:</strong> Di dalam echo chamber, keyakinan yang salah pun bisa terasa sangat benar karena terus-menerus dikonfirmasi oleh lingkungan sekitar. Fenomena ini sangat berbahaya dalam konteks kesehatan (hoaks medis), politik (disinformasi Pemilu), dan sains (penolakan terhadap fakta ilmiah).</p>
          <p><strong>Eskalasi Menuju Ekstremisme:</strong> Penelitian menunjukkan bahwa echo chamber memiliki kecenderungan untuk mendorong pandangan ke arah yang semakin ekstrem dari waktu ke waktu. Kelompok yang awalnya hanya kritis terhadap suatu kebijakan bisa bergeser menjadi kelompok yang menolak total sistem yang ada, atau bahkan membenarkan kekerasan sebagai solusi.</p>
          <p><strong>Kehilangan Kemampuan Berempati:</strong> Ketika seseorang tidak pernah benar-benar terpapar pada pandangan 'pihak lain' secara mendalam, ia kehilangan kemampuan untuk memahami mengapa orang lain berpikir seperti itu. Ini menciptakan dehumanisasi — pihak lain tidak lagi dilihat sebagai manusia dengan alasan dan perasaan yang valid, melainkan sebagai musuh yang harus dikalahkan.</p>
          <p><strong>Ancaman terhadap Demokrasi:</strong> Demokrasi membutuhkan warga negara yang mampu berdialog, berkompromi, dan mencapai konsensus. Echo chamber menggerogoti kapasitas ini dengan menciptakan masyarakat yang terfragmentasi ke dalam kelompok-kelompok yang tidak bisa saling berbicara secara produktif.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Echo Chamber di Grup WhatsApp Indonesia:</strong> Penelitian dan observasi terhadap dinamika grup WhatsApp di Indonesia — terutama menjelang Pemilu — menunjukkan pola yang konsisten: anggota grup cenderung berbagi dan memperkuat konten yang sesuai dengan pandangan kelompok, sementara konten yang berbeda jarang dibagikan atau langsung direspons negatif. Grup-grup ini berfungsi sebagai echo chamber yang sangat efektif karena tingkat kepercayaan antar anggota yang tinggi.</p>
          <p><strong>Analisis Kluster Twitter Indonesia:</strong> Analisis jaringan terhadap pola percakapan di Twitter Indonesia menunjukkan bahwa pengguna cenderung membentuk kluster-kluster yang homogen secara ideologis. Interaksi antar kluster yang berbeda sangat minimal, dan ketika terjadi biasanya berupa konfrontasi, bukan dialog. Ini memperlihatkan bagaimana Twitter Indonesia telah terfragmentasi menjadi serangkaian echo chamber yang saling terpisah.</p>
          <p><strong>Reddit & Radikalisasi melalui Echo Chamber:</strong> Studi terhadap komunitas di Reddit menemukan bahwa subreddit-subreddit yang dilarang karena konten ekstrem (seperti r/incels dan r/The_Donald) sebelum dilarang telah berfungsi sebagai echo chamber yang secara aktif mendorong pandangan anggotanya ke arah yang semakin radikal. Setelah pelarangan, sebagian pengguna bermigrasi ke platform yang lebih ekstrem.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Systematic Review 129 Studi (2025):</strong> Tinjauan sistematis terbaru yang mensintesis 129 penelitian tentang echo chamber menemukan bahwa meskipun bukti keberadaan echo chamber secara konsisten ditemukan, ukuran dan intensitasnya sangat bervariasi tergantung platform, topik, dan konteks budaya. Studi ini juga menemukan bahwa echo chamber lebih intens di isu-isu yang bersifat emosional (agama, politik identitas) dibanding isu teknis.</p>
          <p><strong>Studi Facebook: Segregasi Konten Ideologis:</strong> Penelitian yang menganalisis data pengguna Facebook AS menemukan bahwa mayoritas konten berita yang dikonsumsi pengguna berasal dari sumber yang sesuai dengan orientasi ideologi mereka. Bahkan ketika berita dari 'pihak lain' muncul di beranda, pengguna cenderung tidak mengkliknya — menunjukkan bahwa echo chamber bukan hanya hasil algoritma, tetapi juga pilihan aktif pengguna.</p>
          <p><strong>Reuters Institute (2022): Hanya 5% dalam Echo Chamber Murni:</strong> Meskipun hanya 5% pengguna yang berada dalam echo chamber partisan murni, penelitian ini menyoroti bahwa kelompok kecil ini memiliki pengaruh yang jauh lebih besar terhadap wacana publik. Mereka menghasilkan volume konten yang tidak proporsional dan sering kali memengaruhi agenda diskusi publik secara keseluruhan.</p>
        </div>
      )}
    }
  },
  {
    id: "M04",
    title: "Bias Internal",
    desc: "Kecenderungan sistematis otak yang memicu penyimpangan logika dalam memproses informasi.",
    icon: Brain, color: "bg-pink-600", lightColor: "bg-pink-50", borderColor: "border-pink-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Bias internal (cognitive bias) adalah kecenderungan sistematis dalam cara otak manusia memproses informasi yang menyebabkan penilaian atau keputusan yang menyimpang dari logika atau rasionalitas. Bias ini bukan tanda kebodohan — sebaliknya, ia adalah fitur bawaan otak manusia yang berkembang sebagai mekanisme untuk memproses informasi dengan cepat dalam kondisi ketidakpastian. Namun di era informasi digital yang kompleks, bias ini sering kali merugikan.</p>
          <p>Dua bias yang paling relevan dalam konteks media sosial adalah selective exposure dan confirmation bias.</p>
          <p><strong>Selective exposure</strong> adalah kecenderungan untuk secara aktif memilih dan mengonsumsi informasi yang sesuai dengan keyakinan, nilai, dan identitas yang sudah dipegang — sembari menghindari informasi yang bertentangan. Ini bukan hanya tentang apa yang kamu percaya, tetapi tentang apa yang kamu pilih untuk dengar.</p>
          <p><strong>Confirmation bias</strong> adalah kecenderungan otak untuk mencari, menginterpretasikan, dan mengingat informasi dengan cara yang mengonfirmasi keyakinan yang sudah ada sebelumnya. Bahkan ketika informasi yang sama disajikan kepada dua orang dengan pandangan yang berbeda, masing-masing akan cenderung menginterpretasikannya dengan cara yang mendukung pandangan mereka sendiri.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kamu lebih mudah percaya berita yang sesuai dengan opinimu, dan lebih kritis terhadap berita yang bertentangan.</li>
            <li>Kamu mengikuti akun dan membaca media yang mayoritas sepaham denganmu.</li>
            <li>Ketika menerima fakta yang bertentangan dengan keyakinanmu, reaksi pertamamu adalah mencari alasan mengapa fakta itu salah.</li>
            <li>Kamu lebih mengingat informasi yang mendukung pandanganmu daripada yang mempermasalahkannya.</li>
            <li>Kamu cenderung mencari konsensus dari orang-orang yang sepaham sebelum mengambil keputusan.</li>
            <li>Ketika argumenmu dipatahkan, kamu justru semakin yakin dengan pandanganmu semula (backfire effect).</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Rentan Terhadap Hoaks & Manipulasi:</strong> Orang dengan confirmation bias yang kuat jauh lebih rentan terhadap disinformasi yang sesuai dengan pandangannya. Mereka cenderung menerima berita palsu tanpa melakukan verifikasi jika berita tersebut mengonfirmasi apa yang sudah mereka percaya. Ini adalah salah satu alasan mengapa hoaks berbasis identitas (agama, etnis, politik) sangat sulit diberantas.</p>
          <p><strong>Memperparah Polarisasi:</strong> Ketika masing-masing kelompok memiliki confirmation bias yang kuat, dialog antar kelompok menjadi hampir tidak mungkin. Setiap argumen dari pihak lain akan diinterpretasikan dengan cara yang mengonfirmasi prasangka, bukan sebagai informasi baru yang layak dipertimbangkan. Polarisasi pun semakin dalam.</p>
          <p><strong>Hambatan Pengambilan Keputusan yang Baik:</strong> Dalam konteks akademik maupun profesional, confirmation bias menyebabkan seseorang mengabaikan bukti yang bertentangan dengan hipotesisnya. Ini berbahaya dalam penelitian, kebijakan publik, bisnis, dan setiap domain yang membutuhkan penilaian berbasis bukti yang objektif.</p>
          <p><strong>Dunning-Kruger Effect di Media Sosial:</strong> Kombinasi antara filter bubble, echo chamber, dan confirmation bias menciptakan kondisi ideal untuk Dunning-Kruger Effect — di mana seseorang yang pengetahuannya terbatas justru merasa paling tahu. Di media sosial, orang yang hanya membaca konten dalam gelembungnya sendiri bisa merasa sudah memahami suatu isu secara menyeluruh, padahal ia hanya melihat sebagian kecil dari gambaran yang sebenarnya.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Studi Anti-Vaksin: Confirmation Bias yang Mengakar:</strong> Berbagai penelitian terhadap komunitas anti-vaksin menunjukkan bagaimana confirmation bias bekerja dalam realitas: ketika disajikan bukti ilmiah tentang keamanan vaksin, banyak anggota komunitas ini bukannya mengubah pandangan, melainkan semakin memperkuat keyakinan bahwa ada konspirasi untuk menyembunyikan 'kebenaran'. Ini adalah contoh klasik dari backfire effect.</p>
          <p><strong>Backfire Effect dalam Penelitian Nyhan & Reifler:</strong> Penelitian Brendan Nyhan dan Jason Reifler (2010) yang sering dikutip menemukan bahwa ketika seseorang menerima fakta yang mengoreksi keyakinan politiknya, koreksi tersebut justru memperkuat keyakinan asli mereka. Meskipun penelitian selanjutnya memberikan hasil yang lebih nuansir, fenomena ini cukup terdokumentasi terutama di isu-isu yang berkaitan dengan identitas.</p>
          <p><strong>Konsumsi Berita Politik Mahasiswa Indonesia:</strong> Observasi terhadap pola konsumsi berita mahasiswa Indonesia menunjukkan kecenderungan kuat selective exposure: mahasiswa yang sudah memiliki preferensi politik tertentu cenderung secara eksklusif mengonsumsi media yang sejalan dengan preferensi tersebut, dan aktif menghindari media yang dianggap 'lawan'.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Nickerson (1998) — Confirmation Bias: A Ubiquitous Phenomenon:</strong> Artikel review klasik oleh Raymond S. Nickerson yang dipublikasikan di Review of General Psychology ini mendokumentasikan confirmation bias sebagai salah satu bias kognitif yang paling kuat dan universal yang ditemukan dalam penelitian psikologi. Nickerson menyimpulkan bahwa bias ini beroperasi hampir di semua domain kehidupan manusia.</p>
          <p><strong>Kahneman — Thinking Fast and Slow (2011):</strong> Dalam karya masterpiece-nya, Daniel Kahneman (peraih Nobel Ekonomi) menjelaskan dua sistem berpikir manusia: Sistem 1 yang cepat, otomatis, dan penuh bias; dan Sistem 2 yang lambat, deliberatif, dan rasional. Media sosial, dengan desain yang mendorong reaksi instan, mengaktifkan Sistem 1 dan memperparah efek bias kognitif pada konsumsi informasi.</p>
          <p><strong>Studi Selective Exposure di Era Digital (Hart et al., 2009):</strong> Meta-analisis terhadap 91 penelitian tentang selective exposure menemukan bukti yang konsisten bahwa manusia memang cenderung memilih informasi yang sesuai dengan pandangannya — dan kecenderungan ini diperkuat ketika informasi tersebut menyangkut isu-isu yang penting bagi identitas mereka.</p>
        </div>
      )}
    }
  },
  {
    id: "M05",
    title: "Fragmentasi Sosial",
    desc: "Melemahnya ikatan sosial yang memecah masyarakat menjadi kelompok-kelompok terisolasi.",
    icon: Share2, color: "bg-emerald-600", lightColor: "bg-emerald-50", borderColor: "border-emerald-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Fragmentasi sosial adalah proses di mana ikatan sosial dalam sebuah masyarakat melemah dan masyarakat tersebut terpecah-pecah menjadi kelompok-kelompok yang semakin terpisah, tidak saling mengenal, dan sulit berkomunikasi satu sama lain. Di era digital, fragmentasi sosial dipercepat secara dramatis oleh algoritma media sosial yang mendorong segregasi informasi dan penguatan identitas kelompok.</p>
          <p>Bayangkan masyarakat sebagai sebuah kain. Fragmentasi sosial adalah proses di mana benang-benang yang menghubungkan berbagai bagian kain tersebut satu per satu terputus, hingga akhirnya yang tersisa adalah gumpalan-gumpalan kecil yang tidak terhubung satu sama lain.</p>
          <p>Di ruang digital, fragmentasi ini terlihat dalam bentuk: kelompok-kelompok media sosial yang homogen dan saling tertutup, konsumsi media yang tersegregasi berdasarkan identitas, hilangnya "ruang publik digital" yang bisa menjadi tempat pertemuan berbagai kelompok, dan meningkatnya ketidakmampuan untuk berkomunikasi produktif dengan orang-orang yang berbeda pandangan.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Masyarakat semakin sulit berdialog tentang isu-isu publik tanpa berakhir pada konflik.</li>
            <li>Circle pertemanan online hampir seluruhnya terdiri dari orang-orang yang memiliki pandangan serupa.</li>
            <li>Rasa 'kami vs mereka' semakin kuat — sulit melihat 'pihak lain' sebagai sesama warga negara.</li>
            <li>Kepercayaan terhadap institusi publik (media, pemerintah, sains) menurun di semua kelompok.</li>
            <li>Narasi tentang suatu isu sangat berbeda antara satu kelompok dengan kelompok lain.</li>
            <li>Orang semakin jarang berinteraksi secara bermakna dengan mereka yang berbeda latar belakang atau pandangan.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Melemahnya Kohesi Sosial:</strong> Kohesi sosial — rasa kebersamaan dan solidaritas yang menyatukan anggota masyarakat — adalah fondasi dari kepercayaan publik, kerja sama, dan kemampuan masyarakat untuk menghadapi krisis bersama. Fragmentasi sosial menggerogoti fondasi ini, membuat masyarakat semakin sulit berkoordinasi dan saling percaya bahkan dalam situasi darurat.</p>
          <p><strong>Terbentuknya Silo Sosial:</strong> Silo sosial adalah kelompok-kelompok yang semakin tertutup dan tidak saling berinteraksi secara bermakna. Ketika silo-silo ini mengeras, setiap kelompok mengembangkan bahasa, norma, dan realitas tersendiri yang semakin sulit dipahami oleh orang di luar kelompok tersebut. Ini menciptakan 'parallel societies' yang hidup berdampingan tanpa benar-benar saling mengenal.</p>
          <p><strong>Krisis Kepercayaan terhadap Institusi:</strong> Fragmentasi sosial secara konsisten berkorelasi dengan menurunnya kepercayaan terhadap institusi — media, pemerintah, sistem hukum, bahkan sains. Ketika masing-masing kelompok hidup dalam realitas informasi yang berbeda, tidak ada otoritas tunggal yang bisa dipercaya oleh semua orang.</p>
          <p><strong>Meningkatnya Konflik Identitas:</strong> Di Indonesia, fragmentasi sosial sering kali mengambil bentuk konflik identitas berbasis agama, etnis, atau afiliasi politik. Media sosial memperkuat identitas-identitas ini dan mempersulit pembentukan identitas bersama sebagai warga negara Indonesia yang melampaui perbedaan-perbedaan tersebut.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Pasca Pilpres 2019 Indonesia: Cebong vs Kampret:</strong> Dikotomi 'Cebong vs Kampret' yang muncul selama Pilpres 2019 adalah salah satu studi kasus fragmentasi sosial paling jelas di Indonesia. Apa yang dimulai sebagai label informal berubah menjadi identitas kelompok yang kuat, dengan masing-masing 'kubu' mengembangkan ekosistem media, narasi, dan bahkan bahasa yang berbeda. Dampaknya terasa hingga jauh setelah Pemilu berakhir.</p>
          <p><strong>Perpecahan Komunitas Online Twitter Indonesia:</strong> Analisis jaringan sosial terhadap percakapan di Twitter Indonesia menunjukkan pola fragmentasi yang semakin tajam dari tahun ke tahun. Komunitas-komunitas yang dulunya masih saling terhubung kini semakin terpisah, dengan sangat sedikit 'jembatan' yang menghubungkan kelompok-kelompok berbeda.</p>
          <p><strong>Brasil & AS: Model Fragmentasi Global:</strong> Fragmentasi sosial yang terjadi di Brasil (antara pendukung Lula dan Bolsonaro) dan AS (antara Demokrat dan Republik) menjadi rujukan global tentang bagaimana media sosial dapat memecah-belah masyarakat demokratis. Dalam kedua kasus, fragmentasi digital berujung pada kekerasan fisik yang nyata.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Pulsar Platform (2026) — The Great Fragmentation:</strong> Laporan terbaru ini menggambarkan bagaimana lanskap media sosial global telah mengalami 'Big Bang' fragmentasi: platform semakin banyak, komunitas semakin terspesialisasi, dan pengguna semakin memilih platform berdasarkan identitas daripada fitur. Hasilnya adalah ekosistem digital yang semakin sulit untuk menciptakan wacana bersama.</p>
          <p><strong>arXiv (2024) — From Echo Chambers to Echo Platforms:</strong> Penelitian yang menganalisis 126 juta URL dari hampir 6 juta pengguna di sembilan platform ini memperkenalkan konsep 'echo platform' — platform yang secara keseluruhan berfungsi sebagai ruang gema ideologis. Temuan ini menunjukkan bahwa fragmentasi tidak hanya terjadi dalam satu platform, tetapi di tingkat ekosistem platform secara keseluruhan.</p>
          <p><strong>Online Journal of Communication (2026) — Social Media Fragmentation in the Platformized Public Sphere:</strong> Artikel ini secara khusus membahas bagaimana platform non-algoritmik seperti WhatsApp berkontribusi pada fragmentasi sosial dengan cara yang berbeda dari Twitter atau Facebook — relevan untuk konteks Indonesia di mana WhatsApp adalah platform komunikasi utama.</p>
        </div>
      )}
    }
  },
  {
    id: "M06",
    title: "Disinformasi & Post-Truth",
    desc: "Kondisi di mana daya tarik emosional lebih berpengaruh dibanding fakta objektif.",
    icon: ShieldAlert, color: "bg-red-600", lightColor: "bg-red-50", borderColor: "border-red-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Sebelum memahami era post-truth, penting untuk membedakan tiga konsep yang sering dicampur aduk:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Misinformasi</strong> adalah informasi yang salah atau tidak akurat, tetapi disebarkan tanpa niat untuk menipu.</li>
            <li><strong>Disinformasi</strong> adalah informasi yang salah dan disebarkan dengan sengaja untuk menipu, memanipulasi opini publik, atau mencapai tujuan tertentu.</li>
            <li><strong>Malinformasi</strong> adalah informasi yang secara faktual benar, tetapi disebarkan dengan konteks yang salah atau dengan niat untuk menyakiti seseorang atau kelompok.</li>
          </ul>
          <p><strong>Post-truth</strong> adalah kondisi di mana fakta objektif kurang berpengaruh dalam membentuk opini publik dibandingkan dengan daya tarik emosional dan keyakinan personal. Istilah ini mencerminkan pergeseran fundamental dalam cara masyarakat memproses kebenaran.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Klaim yang tidak terverifikasi lebih cepat viral daripada laporan jurnalistik yang terverifikasi.</li>
            <li>Respons terhadap berita lebih didorong oleh reaksi emosional daripada pemeriksaan fakta.</li>
            <li>Kepercayaan terhadap media mainstream menurun sementara kepercayaan pada sumber yang tidak terverifikasi meningkat.</li>
            <li>Orang-orang dengan mudah menolak fakta ilmiah jika bertentangan dengan identitas atau keyakinan mereka.</li>
            <li>Narasi menggantikan fakta: cerita yang menarik secara emosional lebih dipercaya dari data.</li>
            <li>Konsep 'kebenaran alternatif' diterima secara luas dalam wacana publik.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Erosi Kepercayaan terhadap Media & Sains:</strong> Disinformasi yang masif menyebabkan 'polluted information environment' di mana semua informasi — termasuk yang benar — diragukan. Ini menguntungkan pelaku disinformasi karena di lingkungan yang tidak ada yang dipercaya, narasi yang paling emosional dan konsisten dengan prasangka yang menang.</p>
          <p><strong>Bahaya Disinformasi Kesehatan:</strong> Selama pandemi COVID-19, infodemic (epidemi informasi palsu) terbukti merenggut nyawa secara nyata: orang menolak vaksin, mengonsumsi obat berbahaya, dan mengabaikan protokol kesehatan berdasarkan disinformasi yang beredar di media sosial. Indonesia adalah salah satu negara yang paling terdampak infodemic ini.</p>
          <p><strong>Manipulasi Pemilu & Demokrasi:</strong> Disinformasi yang terkoordinasi telah terbukti memengaruhi hasil pemilu di berbagai negara. Di Indonesia, setiap siklus Pemilu diwarnai oleh kampanye disinformasi terkoordinasi yang bertujuan mempengaruhi opini pemilih dan merusak kepercayaan terhadap proses demokratis.</p>
          <p><strong>Krisis Epistemik Masyarakat:</strong> Pada tingkat yang lebih dalam, era post-truth menciptakan krisis epistemik — krisis tentang bagaimana manusia mengetahui sesuatu dan apa yang layak dipercaya. Ketika realitas bersama runtuh dan setiap kelompok memiliki 'faktanya' sendiri, dasar untuk dialog, kompromi, dan pemecahan masalah kolektif pun ikut runtuh.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Hoaks COVID-19 di Indonesia: Infodemic 2020-2022:</strong> Indonesia tercatat sebagai salah satu negara dengan tingkat penyebaran hoaks COVID-19 tertinggi. Kominfo mencatat lebih dari 1.800 konten hoaks terkait COVID-19 yang tersebar di media sosial selama 2020-2021. Hoaks yang paling berbahaya termasuk klaim bahwa vaksin mengandung chip, bahwa COVID-19 adalah rekayasa, dan berbagai 'obat alternatif' yang tidak terverifikasi.</p>
          <p><strong>Disinformasi Pemilu AS 2020:</strong> Kampanye disinformasi seputar Pemilu AS 2020 adalah salah satu yang paling terdokumentasi dalam sejarah. Klaim-klaim palsu tentang kecurangan pemilu yang disebarkan melalui media sosial berujung pada penyerbuan gedung Capitol pada 6 Januari 2021 — bukti nyata bahwa disinformasi bukan hanya masalah informasi, tetapi bisa berujung pada kekerasan fisik.</p>
          <p><strong>Deepfake di Indonesia: Ancaman yang Semakin Nyata:</strong> Kasus deepfake — manipulasi video dan audio menggunakan AI — mulai muncul di Indonesia, termasuk video deepfake tokoh-tokoh publik yang menyebarkan narasi palsu. Teknologi ini semakin mudah diakses dan semakin sulit dideteksi, menciptakan ancaman baru bagi kepercayaan publik terhadap informasi visual.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>MIT Media Lab: Hoaks Menyebar 6x Lebih Cepat (Science, 2018):</strong> Penelitian landmark oleh Soroush Vosoughi, Deb Roy, dan Sinan Aral yang menganalisis 126.000 tweet selama 10 tahun. Mereka menemukan bahwa berita palsu menyebar lebih cepat, lebih jauh, dan lebih luas daripada berita benar di Twitter — dan faktor utamanya bukan bot, melainkan manusia biasa yang menyebarkan konten yang terasa baru dan mengejutkan.</p>
          <p><strong>WHO & Infodemic Research:</strong> WHO secara resmi mengakui fenomena 'infodemic' (epidemi informasi) sebagai ancaman kesehatan publik tersendiri yang menyertai pandemi COVID-19. Penelitian WHO menunjukkan bahwa infodemic tidak hanya menyebabkan kerugian langsung (seperti penolakan vaksin), tetapi juga merusak kapasitas sistem kesehatan untuk merespons krisis secara efektif.</p>
          <p><strong>Laporan Hoaks Kominfo Indonesia:</strong> Kominfo secara rutin merilis laporan tentang hoaks yang beredar di Indonesia. Data menunjukkan bahwa hoaks bertema politik dan kesehatan adalah yang paling banyak beredar, dengan puncak penyebaran terjadi menjelang Pemilu dan selama krisis kesehatan. Temuan ini menegaskan hubungan erat antara echo chamber, filter bubble, dan percepatan penyebaran disinformasi.</p>
        </div>
      )}
    }
  },
  {
    id: "M07",
    title: "Polarisasi Digital",
    desc: "Proses bergesernya posisi masyarakat ke dua kutub ekstrem yang saling bermusuhan.",
    icon: Target, color: "bg-indigo-600", lightColor: "bg-indigo-50", borderColor: "border-indigo-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Polarisasi adalah proses di mana pendapat atau posisi dalam suatu masyarakat bergerak ke arah dua kutub yang semakin ekstrem, sementara posisi moderat di tengah semakin mengecil atau menghilang. Di era digital, polarisasi ini dipercepat dan diperburuk oleh dinamika media sosial.</p>
          <p>Terdapat dua jenis polarisasi yang penting untuk dibedakan:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Polarisasi ideologis</strong> adalah perbedaan yang semakin melebar dalam hal posisi kebijakan dan nilai-nilai antara kelompok yang berbeda.</li>
            <li><strong>Polarisasi afektif</strong> adalah meningkatnya rasa negatif, permusuhan, dan ketidakpercayaan terhadap kelompok yang berbeda — bahkan ketika perbedaan posisi kebijakan tidak terlalu besar.</li>
          </ul>
          <p>Penelitian menunjukkan bahwa media sosial terutama mempercepat polarisasi afektif: orang tidak hanya berbeda pendapat, mereka juga semakin tidak menyukai, tidak mempercayai, dan bahkan membenci mereka yang ada di "pihak lain" — bahkan jika perbedaan faktual di antara mereka tidak sebesar yang mereka bayangkan.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Diskusi publik semakin sedikit yang berakhir dengan pertukaran pandangan yang produktif.</li>
            <li>Identitas politik atau ideologis mendominasi cara orang memandang semua isu.</li>
            <li>Ada kecenderungan untuk menilai seseorang secara total berdasarkan afiliasi politiknya.</li>
            <li>Jargon 'kami vs mereka' mendominasi wacana publik.</li>
            <li>Kelompok moderat semakin terpinggirkan dan dicurigai oleh kedua sisi.</li>
            <li>Pernikahan, persahabatan, dan hubungan kerja semakin sering rusak karena perbedaan politik.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Melemahnya Demokrasi Deliberatif:</strong> Demokrasi yang sehat membutuhkan deliberasi — proses di mana warga negara mendiskusikan isu-isu bersama dan mencapai keputusan kolektif melalui pertimbangan yang rasional. Polarisasi ekstrem menghancurkan prasyarat ini karena membuat dialog lintas kelompok hampir tidak mungkin.</p>
          <p><strong>Normalisasi Ujaran Kebencian:</strong> Ketika polarisasi afektif menguat, bahasa yang dehumanisasi dan menghasut terhadap 'pihak lain' menjadi semakin diterima di ruang publik digital. Ujaran kebencian yang dulunya dianggap tidak pantas kini dinormalisasi sebagai bentuk 'ekspresi politik' yang sah.</p>
          <p><strong>Politik Identitas yang Memecah Belah:</strong> Polarisasi digital mendorong munculnya politik identitas yang destruktif: di mana menjadi anggota kelompok (agama, etnis, partai) lebih penting dari substansi kebijakan, dan di mana kesetiaan pada kelompok diprioritaskan di atas kebenaran atau keadilan.</p>
          <p><strong>Sulitnya Mencapai Konsensus Sosial:</strong> Dalam masyarakat yang sangat terpolarisasi, kebijakan publik yang membutuhkan konsensus — penanganan perubahan iklim, reformasi pendidikan, kebijakan kesehatan — menjadi sangat sulit untuk diimplementasikan karena setiap kebijakan langsung dipolitisasi dan ditolak oleh 'pihak lain'.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Cebong vs Kampret: Polarisasi Indonesia 2019-2024:</strong> Dikotomi yang muncul selama Pilpres 2019 ini tidak hanya mencerminkan perbedaan pilihan politik, tetapi berkembang menjadi polarisasi identitas yang dalam. Penelitian menunjukkan bahwa label ini mempengaruhi hubungan sosial, keputusan bisnis, dan bahkan dinamika keluarga. Yang menarik, polarisasi ini terbukti jauh lebih kuat di ruang digital daripada dalam interaksi tatap muka.</p>
          <p><strong>Capitol Hill, 6 Januari 2021: Ujung Polarisasi:</strong> Penyerbuan gedung Capitol di Washington DC oleh pendukung Trump yang menolak hasil Pemilu 2020 adalah salah satu contoh paling dramatis tentang bagaimana polarisasi digital dapat berujung pada kekerasan fisik. Para penyerbu sebagian besar teradialisasi melalui media sosial — Facebook, Twitter, dan platform alternatif seperti Parler dan Gab.</p>
          <p><strong>Pew Research: Polarisasi AS yang Terus Meningkat:</strong> Data longitudinal Pew Research Center menunjukkan bahwa polarisasi afektif di AS telah meningkat secara dramatis sejak 2000-an, bersamaan dengan pertumbuhan penggunaan media sosial. Persentase Demokrat yang melihat Republik sebagai 'ancaman bagi negara', dan sebaliknya, telah mencapai rekor tertinggi pada 2024.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Pew Research Center: Social Media & Political Polarization:</strong> Serangkaian survei Pew Research mendokumentasikan hubungan antara penggunaan media sosial dan meningkatnya polarisasi politik. Pengguna berat media sosial secara konsisten menunjukkan tingkat polarisasi afektif yang lebih tinggi, meskipun hubungan kausalitas masih diperdebatkan.</p>
          <p><strong>arXiv (2025): Shifts in US Social Media Use & Enduring Polarization:</strong> Penelitian menggunakan data representatif ANES 2020 dan 2024 ini menemukan bahwa meskipun terjadi pergeseran dalam pola penggunaan media sosial, polarisasi yang ada sangat persisten. Pengguna kasual mulai meninggalkan platform, tetapi pengguna partisan yang paling vokal tetap aktif — sehingga 'suara' yang tersisa di ruang publik digital semakin ekstrem.</p>
          <p><strong>SMRC & Litbang Kompas: Polarisasi Pemilih Indonesia:</strong> Berbagai lembaga riset Indonesia secara konsisten mendokumentasikan tingkat polarisasi yang mengkhawatirkan di kalangan pemilih Indonesia. Yang menarik, data menunjukkan bahwa polarisasi di Indonesia lebih bersifat afektif daripada ideologis — orang-orang yang sesungguhnya memiliki pandangan kebijakan yang mirip bisa memiliki perasaan yang sangat negatif satu sama lain karena perbedaan afiliasi politik.</p>
        </div>
      )}
    }
  },
  {
    id: "M08",
    title: "Radikalisasi Online",
    desc: "Proses adopsi pandangan ekstrem yang mendukung kekerasan melalui interaksi digital.",
    icon: AlertTriangle, color: "bg-amber-600", lightColor: "bg-amber-50", borderColor: "border-amber-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Radikalisasi online adalah proses di mana seseorang, melalui interaksinya dengan konten dan komunitas di internet, bergerak dari pandangan yang moderat atau arus utama menuju pandangan yang semakin ekstrem — hingga pada titik di mana ia bisa mendukung atau bahkan melakukan tindakan kekerasan atas nama ideologi tersebut.</p>
          <p>Proses ini jarang terjadi secara tiba-tiba. Radikalisasi online biasanya berlangsung secara bertahap melalui serangkaian tahapan: seseorang yang awalnya hanya penasaran dengan konten provokatif perlahan-lahan terekspos pada konten yang semakin ekstrem, bergabung dengan komunitas yang memperkuat pandangan tersebut, hingga akhirnya mengadopsi ideologi yang membenarkan kekerasan sebagai solusi.</p>
          <p>Algoritma media sosial memainkan peran penting dalam proses ini. Sistem rekomendasi yang dirancang untuk memaksimalkan engagement cenderung mengarahkan pengguna ke konten yang semakin provokatif dan emosional — karena konten seperti itulah yang paling efektif menahan perhatian. Tanpa sadar, algoritma menciptakan "jalan" menuju radikalisasi.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pandangan semakin absolut: dunia dibagi menjadi hitam dan putih, tidak ada abu-abu.</li>
            <li>Dehumanisasi terhadap kelompok 'musuh' — mereka dianggap tidak layak mendapat perlakuan manusiawi.</li>
            <li>Penarikan diri dari hubungan sosial di luar kelompok ideologis.</li>
            <li>Keyakinan bahwa perubahan hanya mungkin melalui cara-cara ekstrem atau kekerasan.</li>
            <li>Konsumsi konten yang semakin eksklusif dari sumber-sumber ideologis ekstrem.</li>
            <li>Bahasa dan simbol kelompok ekstrem mulai digunakan secara terbuka.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Ancaman Keamanan Nasional:</strong> Radikalisasi online telah menjadi salah satu ancaman keamanan utama di abad ke-21. BNPT (Badan Nasional Penanggulangan Terorisme) Indonesia secara konsisten melaporkan bahwa internet dan media sosial adalah sarana utama rekrutmen dan radikalisasi jaringan terorisme.</p>
          <p><strong>Rekrutmen Melalui Platform Digital:</strong> Berbagai kelompok ekstremis telah menggunakan platform digital — dari Facebook dan Telegram hingga forum-forum khusus — untuk merekrut anggota baru. Targetnya seringkali adalah individu yang sedang mengalami krisis identitas, merasa terisolasi, atau mencari komunitas dan tujuan hidup yang bermakna.</p>
          <p><strong>Normalisasi Kekerasan dalam Wacana Publik:</strong> Salah satu dampak yang kurang terlihat dari radikalisasi online adalah normalisasi retorika kekerasan dalam wacana publik. Bahasa yang membenarkan atau meromantisasi kekerasan terhadap 'musuh' semakin sering muncul di ruang publik digital, menurunkan ambang batas psikologis untuk tindakan kekerasan nyata.</p>
          <p><strong>Dampak Psikologis pada Individu & Keluarga:</strong> Radikalisasi online menghancurkan individu dan keluarga. Orang yang terradikalisasi sering kali mengalami pemutusan hubungan dengan keluarga dan teman, penurunan fungsi sosial dan profesional, serta dalam kasus paling ekstrem berakhir dengan kematian atau penjara.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Radikalisasi via Telegram di Indonesia:</strong> Berbagai kasus terorisme yang terungkap di Indonesia dalam beberapa tahun terakhir menunjukkan pola yang konsisten: proses radikalisasi berlangsung sebagian besar melalui platform digital, terutama Telegram yang relatif sulit dimoderasi. Pelaku yang ditangkap seringkali adalah individu yang tidak memiliki keterlibatan fisik dengan kelompok ekstremis sebelum terekspos konten online.</p>
          <p><strong>Christchurch Shooting (2019): Algoritma sebagai Akselerator:</strong> Serangan teroris di Christchurch, Selandia Baru, yang dilakukan oleh Brenton Tarrant — yang menyiarkan serangan tersebut secara live di Facebook — menjadi titik balik dalam diskusi global tentang peran algoritma dalam radikalisasi. Manifesto Tarrant secara eksplisit menyebut konten online sebagai faktor yang membentuk pandangannya.</p>
          <p><strong>ISIS & Rekrutmen Melalui Media Sosial:</strong> Pada puncak kekuasaannya (2013-2017), ISIS mengembangkan operasi media sosial yang sangat canggih untuk merekrut anggota dari seluruh dunia termasuk Indonesia. Mereka menggunakan berbagai platform dan format konten — dari video produksi tinggi hingga meme — untuk menjangkau target yang berbeda dan memandu mereka melalui proses radikalisasi yang terstruktur.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>BNPT: Peta Radikalisasi Digital Indonesia:</strong> Laporan BNPT secara konsisten mengidentifikasi media sosial sebagai vektor utama penyebaran paham radikal di Indonesia. Data menunjukkan peningkatan kasus radikalisasi yang melibatkan individu muda yang tidak memiliki koneksi fisik dengan jaringan teroris sebelum terekspos konten online.</p>
          <p><strong>Ribeiro et al.: YouTube & Radicalization Pathways:</strong> Penelitian Ribeiro dan kolega yang diterbitkan dalam prosiding ACM Web Science Conference menganalisis jalur tontonan ratusan ribu pengguna YouTube. Mereka menemukan pola 'radicalization pathway' yang konsisten: pengguna yang menonton konten konservatif arus utama secara sistematis diarahkan oleh algoritma menuju konten yang semakin alternatif dan ekstrem.</p>
          <p><strong>Global Network on Extremism & Technology (GNET):</strong> GNET adalah jaringan penelitian internasional yang secara khusus mengkaji hubungan antara teknologi digital dan ekstremisme. Publikasi-publikasinya mendokumentasikan evolusi taktik rekrutmen dan radikalisasi online, termasuk di kawasan Asia Tenggara yang menjadi fokus khusus penelitian mereka.</p>
        </div>
      )}
    }
  },
  {
    id: "M09",
    title: "AI & Echo Chamber Baru",
    desc: "Tantangan literasi masa depan akibat kemunculan AI generatif dan deepfake.",
    icon: Rocket, color: "bg-cyan-600", lightColor: "bg-cyan-50", borderColor: "border-cyan-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Revolusi kecerdasan buatan (AI) — terutama kemunculan Large Language Models (LLM) seperti ChatGPT, Gemini, dan Claude — membawa dimensi baru yang belum pernah ada sebelumnya dalam dinamika echo chamber dan filter bubble. Jika sebelumnya echo chamber terbentuk melalui interaksi antara manusia dengan konten yang dikurasi algoritma, kini kita berhadapan dengan kemungkinan echo chamber yang jauh lebih personal dan interaktif: percakapan langsung dengan AI.</p>
          <p><strong>"Chat Chamber Effect"</strong> adalah istilah yang mulai digunakan para peneliti untuk menggambarkan potensi LLM dalam menciptakan bentuk echo chamber baru. Ketika seseorang berinteraksi dengan AI secara reguler, ada risiko bahwa AI akan belajar untuk merespons sesuai preferensi pengguna — mengonfirmasi keyakinan yang sudah ada, menghindari jawaban yang tidak menyenangkan, dan secara perlahan menciptakan "cermin digital" yang hanya memantulkan apa yang ingin didengar pengguna.</p>
          <p>Selain chat chamber, AI juga memunculkan ancaman disinformasi generatif yang belum pernah ada sebelumnya. Deepfake video dan audio, teks berita palsu yang tertulis secara meyakinkan, gambar sintetis yang tidak bisa dibedakan dari foto nyata — semua ini kini bisa diproduksi dalam skala besar dengan biaya yang sangat rendah, mengancam kepercayaan publik terhadap informasi visual dan tekstual.</p>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chatbot AI yang semakin baik dalam menebak dan mengonfirmasi preferensi pengguna.</li>
            <li>Konten deepfake yang semakin sulit dibedakan dari konten asli.</li>
            <li>Banjir konten yang diproduksi AI di media sosial, membanjiri wacana publik.</li>
            <li>Algoritma rekomendasi yang semakin personalized berkat kemampuan AI generatif.</li>
            <li>Asisten AI pribadi yang bisa menciptakan bubble informasi yang sangat personal.</li>
            <li>Meningkatnya kesulitan untuk memverify apakah sesuatu dibuat oleh manusia atau AI.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Disinformasi Skala Masif:</strong> AI generatif memungkinkan produksi disinformasi dalam skala dan kecepatan yang belum pernah ada sebelumnya. Konten yang dulu membutuhkan tim produksi dan biaya besar kini bisa dibuat dalam hitungan detik oleh siapa pun dengan akses ke model AI. Ini secara fundamental mengubah lanskap ancaman disinformasi.</p>
          <p><strong>Personalisasi Ekstrem & Super Filter Bubble:</strong> AI memungkinkan personalisasi konten yang jauh melampaui apa yang bisa dilakukan algoritma tradisional. Di masa depan yang tidak terlalu jauh, setiap orang bisa mendapat berita, hiburan, dan informasi yang disesuaikan secara sempurna dengan preferensinya — menciptakan filter bubble yang jauh lebih kuat dan sulit dirasakan daripada yang ada saat ini.</p>
          <p><strong>Krisis Kepercayaan terhadap Konten Digital:</strong> Ketika deepfake video dan audio menjadi tidak bisa dibedakan dari yang asli, kepercayaan publik terhadap semua bukti visual dan audio bisa runtuh. Paradoksnya, ini justru bisa menguntungkan pelaku disinformasi: dalam lingkungan di mana tidak ada yang bisa dipercaya, klaim apapun — termasuk yang palsu — mendapat pijakan yang sama.</p>
          <p><strong>Tantangan Regulasi yang Belum Terpecahkan:</strong> Regulasi teknologi selalu bergerak lebih lambat dari inovasi. Saat ini, belum ada kerangka regulasi yang memadai untuk mengatasi ancaman yang ditimbulkan AI generatif terhadap ekosistem informasi. Indonesia, seperti kebanyakan negara, masih dalam tahap awal merumuskan kebijakan yang relevan.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Deepfake Tokoh Publik Indonesia:</strong> Beberapa kasus deepfake tokoh publik Indonesia telah terdokumentasi: mulai dari video deepfake pejabat yang seolah-olah memberikan pernyataan kontroversial, hingga audio deepfake yang digunakan dalam penipuan. Kasus-kasus ini menunjukkan bahwa ancaman deepfake bukan lagi hipotetis — ia sudah hadir dan berpotensi mengguncang kepercayaan publik dan stabilitas politik.</p>
          <p><strong>ChatGPT & Fenomena Sycophancy:</strong> Penelitian dan observasi pengguna ChatGPT menunjukkan kecenderungan model untuk bersikap 'sycophantic' — terlalu agreeable dan condong mengonfirmasi apa yang ingin didengar pengguna daripada memberikan jawaban yang akurat namun bertentangan. Ini adalah embrio dari 'chat chamber': AI yang lebih mementingkan kepuasan pengguna daripada kebenaran.</p>
          <p><strong>Kampanye Disinformasi AI di Pemilu Global 2024:</strong> Pemilu di berbagai negara pada 2024 diwarnai oleh kampanye disinformasi berbasis AI dalam skala yang belum pernah terjadi sebelumnya: audio deepfake kandidat, gambar AI yang menyesatkan, dan konten teks yang diproduksi massal oleh bot AI. Indonesia juga mengalami fenomena ini.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>SAGE Journals (2025): The Chat-Chamber Effect:</strong> Penelitian terbaru yang memeriksa potensi LLM dalam menciptakan bentuk echo chamber baru. Studi ini menemukan bahwa pengguna yang berinteraksi intensif dengan chatbot AI cenderung mengembangkan kepercayaan yang tidak proporsional terhadap output AI — termasuk ketika AI menghasilkan informasi yang salah (hallucination).</p>
          <p><strong>UNESCO: AI & Disinformasi (2023-2024):</strong> Laporan UNESCO tentang dampak AI terhadap ekosistem informasi global menyimpulkan bahwa AI generatif berpotensi menjadi faktor paling disruptif dalam sejarah media. UNESCO merekomendasikan regulasi internasional yang komprehensif dan pengembangan standar transparansi untuk konten yang dibuat AI.</p>
          <p><strong>Penelitian Bias dalam Large Language Models:</strong> Sejumlah penelitian menunjukkan bahwa LLM bisa mereproduksi dan bahkan memperkuat bias yang ada dalam data pelatihan mereka. Ini menimbulkan kekhawatiran bahwa AI tidak hanya pasif mencerminkan bias manusia, tetapi secara aktif mengamplifikasi dan menyebarkan bias tersebut pada skala yang jauh lebih besar.</p>
        </div>
      )}
    }
  },
  {
    id: "M10",
    title: "Literasi Digital & Solusi",
    desc: "Kemampuan kritis untuk mengevaluasi dan menggunakan informasi secara bertanggung jawab.",
    icon: Lightbulb, color: "bg-green-600", lightColor: "bg-green-50", borderColor: "border-green-200",
    sections: {
      umum: { label: "Pemahaman", content: (
        <div className="space-y-4">
          <p><strong>Pengertian:</strong> Literasi digital adalah kemampuan untuk menemukan, mengevaluasi, membuat, dan mengomunikasikan informasi menggunakan teknologi digital secara efektif, kritis, dan bertanggung jawab. Ini bukan sekadar kemampuan teknis — literasi digital adalah tentang kemampuan berpikir secara kritis di ekosistem informasi digital yang kompleks.</p>
          <p>Ada beberapa komponen utama literasi digital yang perlu dikuasai:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Literasi informasi</strong>: Kemampuan untuk menilai keandalan sumber, membedakan fakta dari opini, dan mendeteksi disinformasi.</li>
            <li><strong>Media literacy</strong>: Kemampuan untuk memahami bagaimana media bekerja, siapa yang memproduksinya, dan bagaimana ia membentuk persepsi publik.</li>
            <li><strong>Digital citizenship</strong>: Pemahaman tentang hak dan tanggung jawab di ruang digital — etika, privasi, dan keamanan digital.</li>
            <li><strong>Critical thinking in digital context</strong>: Kemampuan untuk tidak menerima informasi secara pasif tetapi secara aktif mempertanyakan dan mengevaluasi.</li>
          </ul>
          <h5 className="font-bold text-[#031466] mt-4">Ciri-Ciri:</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li>Selalu memverifikasi informasi sebelum mempercayai atau menyebarkannya.</li>
            <li>Mengonsumsi berita dari berbagai sumber dengan perspektif yang beragam.</li>
            <li>Mampu membedakan berita, opini, iklan, dan propaganda.</li>
            <li>Memahami cara kerja algoritma dan secara aktif mencari konten di luar rekomendasinya.</li>
            <li>Berpikir kritis sebelum bereaksi terhadap konten yang memancing emosi.</li>
            <li>Memiliki kesadaran tentang bias kognitif sendiri dan berusaha mengatasinya.</li>
            <li>Berkomunikasi secara etis dan bertanggung jawab di ruang digital.</li>
          </ul>
        </div>
      )},
      dampak: { label: "Dampak", content: (
        <div className="space-y-4">
          <p><strong>Rentan Hoaks & Manipulasi:</strong> Individu dengan literasi digital rendah adalah target paling mudah bagi kampanye disinformasi. Mereka cenderung menyebarkan konten tanpa verifikasi, terjebak dalam filter bubble tanpa menyadarinya, dan menjadi bagian dari rantai penyebaran hoaks.</p>
          <p><strong>Eksklusifitas Partisipasi Digital:</strong> Tanpa literasi digital yang memadai, seseorang tidak bisa berpartisipasi secara bermakna dalam wacana publik digital. Ia menjadi konsumen pasif yang mudah dimanipulasi.</p>
          <p><strong>Risiko Menjadi Penyebar Disinformasi:</strong> Banyak orang menyebarkan hoaks bukan karena niat jahat, tetapi karena kurangnya kemampuan untuk mengevaluasi informasi. Tanpa literasi digital, seseorang bisa secara tidak sengaja menjadi bagian dari mesin penyebaran disinformasi.</p>
          <p><strong>Dampak pada Kesehatan Demokrasi:</strong> Pada skala masyarakat, rendahnya literasi digital secara kolektif mengancam kualitas demokrasi. Pemilih yang tidak bisa membedakan informasi benar dari salah tidak bisa membuat keputusan demokratis yang benar-benar informed.</p>
        </div>
      )},
      kasus: { label: "Studi Kasus", content: (
        <div className="space-y-4">
          <p><strong>Program Literasi Digital Kominfo & Hasilnya:</strong> Program Makin Cakap Digital yang diluncurkan Kominfo adalah salah satu program literasi digital terbesar di Asia Tenggara. Tantangan utamanya adalah seberapa efektif program ini mengubah perilaku nyata pengguna media sosial dalam mengonsumsi informasi.</p>
          <p><strong>Gerakan Cek Fakta di Indonesia:</strong> Inisiatif seperti Turnbackhoax (Mafindo), CekFakta, dan Tim CekFakta media nasional telah berkontribusi signifikan dalam memerangi hoaks. Namun fact-checking tidak cukup untuk mengubah keyakinan yang tertanam kuat; diperlukan peningkatan literasi digital secara sistemik.</p>
          <p><strong>Finlandia: Model Literasi Digital Terbaik Dunia:</strong> Finlandia secara konsisten dinobatkan sebagai negara dengan literasi media tertinggi. Kuncinya adalah integrasi pendidikan media ke dalam kurikulum sekolah sejak dini, dengan penekanan pada pemikiran kritis dan kemampuan mengevaluasi sumber.</p>
        </div>
      )},
      riset: { label: "Penelitian", content: (
        <div className="space-y-4">
          <p><strong>Indeks Literasi Digital Indonesia (Kominfo, 2022-2024):</strong> Data menunjukkan skor literasi digital masyarakat Indonesia berada di angka sedang (3,5 dari 5). Subindeks terendah adalah keamanan digital dan kemampuan kritis terhadap informasi — dua kompetensi paling krusial untuk menghadapi tantangan filter bubble.</p>
          <p><strong>Studi Efektivitas Intervensi Literasi Digital pada Mahasiswa:</strong> Penelitian menunjukkan intervensi literasi digital paling efektif melibatkan praktik langsung, diskusi kasus nyata, dan pengembangan kebiasaan verifikasi secara bertahap.</p>
          <p><strong>UNESCO: Media & Information Literacy Framework:</strong> Framework MIL UNESCO memberikan panduan komprehensif pemberdayaan warga negara untuk berpartisipasi aktif, kritis, dan bertanggung jawab dalam masyarakat informasi.</p>
        </div>
      )}
    }
  }
];

const Materi: React.FC = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>("umum");
  const contentRef = useRef<HTMLDivElement>(null);
  const { playSound, completeChallenge } = useStore();

  const sectionConfig = [
    { key: "umum", label: "Pemahaman", icon: BookText },
    { key: "dampak", label: "Dampak", icon: AlertTriangle },
    { key: "kasus", label: "Studi Kasus", icon: Search },
    { key: "riset", label: "Penelitian", icon: Microscope },
  ];

  const handleModuleOpen = (index: number) => {
    setActiveModule(index);
    setActiveSection("umum");
    playSound('pop');
    completeChallenge('c1');
  };

  const handleNextSection = () => {
    const currentIndex = sectionConfig.findIndex(s => s.key === activeSection);
    if (currentIndex < sectionConfig.length - 1) {
      setActiveSection(sectionConfig[currentIndex + 1].key);
    } else {
      handleNextModule();
    }
  };

  const handleNextModule = () => {
    if (activeModule !== null && activeModule < MATERI_DATA.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveSection("umum");
    } else {
      setActiveModule(null);
    }
  };

  const handlePrevModule = () => {
    if (activeModule !== null && activeModule > 0) {
      setActiveModule(activeModule - 1);
      setActiveSection("umum");
    }
  };

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [activeSection, activeModule]);

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:px-6 font-sans">
      <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] shadow-sm">
          Academic Knowledge Hub
        </motion.div>
        <h2 className="text-4xl md:text-7xl font-black text-[#031466] tracking-tighter leading-tight">Katalog Literasi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {MATERI_DATA.map((module, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.01 }}
            onClick={() => handleModuleOpen(index)}
            className={cn(
              "group p-6 md:p-10 cursor-pointer rounded-[30px] md:rounded-[50px] border-2 transition-all shadow-lg flex items-center gap-4 md:gap-8 bg-white",
              module.borderColor
            )}
          >
            <div className={cn("w-16 h-16 md:w-24 md:h-24 rounded-[20px] md:rounded-[35px] flex items-center justify-center text-white shadow-xl shrink-0", module.color)}>
              <module.icon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{module.id} MODUL</span>
              <h3 className="text-xl md:text-3xl font-black text-[#031466] leading-tight mb-1 md:mb-3 mt-1 truncate md:whitespace-normal">{module.title}</h3>
              <p className="text-xs md:text-sm text-slate-500 font-medium line-clamp-2 italic opacity-80">"{module.desc}"</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeModule !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 lg:p-8 bg-[#031466]/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-7xl h-full md:h-[90vh] md:rounded-[60px] overflow-hidden flex flex-col md:flex-row relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveModule(null)}
                className="absolute top-4 right-4 z-[120] p-3 bg-red-500 text-white rounded-full transition-all shadow-xl md:top-8 md:right-8"
              >
                <X size={24} strokeWidth={3} />
              </button>

              <div className={cn("w-full md:w-[320px] lg:w-[380px] p-6 md:p-10 flex flex-col shrink-0 relative border-b md:border-b-0 md:border-r border-slate-100", MATERI_DATA[activeModule].lightColor)}>
                <div className="flex flex-col h-full z-10">
                  <div className="mb-6 md:mb-8 shrink-0 flex md:flex-col items-center md:items-start gap-4 text-[#031466]">
                    <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[25px] flex items-center justify-center text-white shadow-xl", MATERI_DATA[activeModule].color)}>
                      {React.createElement(MATERI_DATA[activeModule].icon, { className: "w-6 h-6 md:w-8 md:h-8" })}
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block">{MATERI_DATA[activeModule].id}</span>
                      <h3 className="text-lg md:text-2xl font-black leading-tight">{MATERI_DATA[activeModule].title}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 md:flex-grow md:overflow-y-auto pr-1">
                    {sectionConfig.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => { setActiveSection(s.key); playSound('pop'); }}
                        className={cn(
                          "p-3 md:p-4 rounded-xl md:rounded-[25px] flex items-center gap-2 md:gap-4 font-black transition-all text-left border-b-2 md:border-b-4",
                          activeSection === s.key 
                            ? "bg-white text-[#031466] border-[#031466] shadow-md"
                            : "bg-white/40 border-transparent text-[#031466]/40 hover:bg-white/80"
                        )}
                      >
                        <s.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <span className="text-[10px] md:text-xs uppercase truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-2 bg-red-500 rounded-t-xl" />
              </div>

              <div ref={contentRef} className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto bg-slate-50/50 flex flex-col relative text-[#031466] border-t md:border-t-0">
                {/* Visual grid accent */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-60" />

                <div className="max-w-3xl mx-auto w-full flex-grow text-[#031466] relative z-10">
                  <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 text-[#031466]">
                    <div className={cn("w-1.5 h-8 md:w-2 md:h-12 rounded-full shadow-sm", MATERI_DATA[activeModule].color)} />
                    <div>
                      <h4 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                         {sectionConfig.find(s => s.key === activeSection)?.label}
                      </h4>
                      <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Eksplorasi Modul Akademis</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection + activeModule}
                      initial={{ opacity: 0, y: 12 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="text-base md:text-lg leading-relaxed text-slate-700 text-justify pb-24 md:pb-10 space-y-6 [&_p]:text-justify [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-slate-600 [&_p]:text-sm [&_p]:md:text-base [&_p]:font-medium [&_strong]:text-[#031466] [&_strong]:font-bold [&_h5]:text-base [&_h5]:md:text-lg [&_h5]:font-black [&_h5]:text-[#031466] [&_h5]:mt-8 [&_h5]:mb-3 [&_h5]:border-l-4 [&_h5]:border-blue-500/80 [&_h5]:pl-3 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:my-5 [&_li]:relative [&_li]:pl-6 [&_li]:text-sm [&_li]:md:text-base [&_li]:text-slate-600 [&_li]:before:content-['•'] [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:text-blue-500 [&_li]:before:font-black [&_li]:text-justify"
                    >
                      {typeof (MATERI_DATA[activeModule].sections as any)[activeSection].content === 'string' ? (
                        <p>{(MATERI_DATA[activeModule].sections as any)[activeSection].content}</p>
                      ) : (
                        (MATERI_DATA[activeModule].sections as any)[activeSection].content
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-0 md:mt-12 bg-white md:bg-transparent border-t md:border-t-0 border-slate-100 flex items-center justify-between z-50">
                    <button 
                      onClick={handlePrevModule}
                      disabled={activeModule === 0}
                      className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm font-bold text-slate-400 hover:text-[#031466] disabled:opacity-0 transition-all"
                    >
                      <ChevronLeft size={16} /> Modul Prev
                    </button>

                    <button 
                      onClick={handleNextSection}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-xs md:text-sm font-black text-white shadow-xl transition-all",
                        MATERI_DATA[activeModule].color
                      )}
                    >
                      {activeSection !== "riset" ? (
                        <>Lanjut <ArrowRight size={16} /></>
                      ) : activeModule < MATERI_DATA.length - 1 ? (
                        <>Next Modul <ArrowRight size={16} /></>
                      ) : (
                        <>Selesai <GraduationCap size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Materi;