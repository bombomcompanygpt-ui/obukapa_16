import express from "express";
import fs from "fs";
import path from "path";
import { Firestore, FieldValue } from "@google-cloud/firestore";

interface Reply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  avatarSeed?: string;
}

interface ChatMessage {
  id: string;
  channel: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  timestamp: number;
  reactions?: Record<string, number>;
}

interface DiscussionTopic {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  lens: string;
  likes: number;
  repliesCount: number;
  replies: Reply[];
  repostsCount: number;
  timestamp: number;
  createdAt?: string;
}

// Initial default chat messages
const fallbackChatMessages: ChatMessage[] = [
  {
    id: "m-1",
    channel: "obrolan-santai",
    authorId: "uid-system",
    authorName: "Bubul 🫧 (Bot OutBubble)",
    authorAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Bubul",
    content: "Halo kawan-kawan OutBubble! Selamat datang di Ruang Obrolan Langsung. Silakan berbagi cerita, bertukar ide, atau berkenalan disini ya! 💬",
    timestamp: Date.now() - 3600000 * 3,
    reactions: { "👋": 5, "❤️": 3 }
  },
  {
    id: "m-2",
    channel: "obrolan-santai",
    authorId: "uid-budi",
    authorName: "Ksatria_Nalar 🛡️",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    content: "Halo semuanya! Keren banget fitur obrolan ini, sekarang kita bisa diskusi langsung tanpa tunggu waktu postingan.",
    timestamp: Date.now() - 3600000 * 2,
    reactions: { "👍": 4, "🔥": 2 }
  },
  {
    id: "m-3",
    channel: "literasi-digital",
    authorId: "uid-lisa",
    authorName: "Skeptis_Muda 🔍",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    content: "Ada yang pernah coba verifikasi foto hoaks pake Google Reverse Image Search? Efektif banget buat cek rekayasa foto!",
    timestamp: Date.now() - 3600000 * 1,
    reactions: { "💡": 6, "🔥": 3 }
  },
  {
    id: "m-4",
    channel: "luar-gelembung",
    authorId: "uid-outb",
    authorName: "Pendeteksi_Bias 🧠",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    content: "Kunci utama keluar dari gelembung informasi adalah mau membaca sudut pandang lawan bicara dengan tenang. Gimana menurut kalian?",
    timestamp: Date.now() - 1800000,
    reactions: { "⚖️": 4, "👏": 2 }
  }
];

// Initial default topics for digital literacy & filter bubble discussions
const fallbackTopics: DiscussionTopic[] = [
  {
    id: "s1",
    title: "",
    authorId: "uid-budi",
    authorName: "Ksatria_BebasBubble 🛡️",
    authorAvatar: "Felix",
    content: "Capek banget tiap perhelatan pemilu, timeline sosmed isinya adu domba melulu. Berasa warga dipecah belah sama algoritma buzzer 😭. Kayak di-lock dalam gelembung amarah.",
    lens: "Kritik",
    likes: 18,
    repliesCount: 2,
    repostsCount: 3,
    timestamp: Date.now() - 3600000 * 5,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    replies: [
      { id: "sr-1", authorName: "Pendeteksi_Bias 🧠", content: "Sama kak, mending ganti tab ke luar gelembung biar pencerahan.", createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), avatarSeed: "Buster" },
      { id: "sr-2", authorName: "Logika_Murni ⚖️", content: "Ini contoh nyata Filter Bubble dikombinasiin sama Echo Chamber. Ngeri pol!", createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(), avatarSeed: "Leo" }
    ]
  },
  {
    id: "s2",
    title: "",
    authorId: "uid-lisa",
    authorName: "Skeptis_Muda 🔍",
    authorAvatar: "Anika",
    content: "Guys, coba buktiin filter bubble kalian sekarang! Cari satu kata kunci kontroversial di Google/TikTok pake HP kalian, trus bandingin sama hasil pencarian di HP temen kalian yang beda kubu politik. Hasilnya beneran beda 180 derajat! Kita disuapin kenyataan yang beda.",
    lens: "Fakta",
    likes: 29,
    repliesCount: 1,
    repostsCount: 5,
    timestamp: Date.now() - 3600000 * 2,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    replies: [
      { id: "sr-3", authorName: "Gelembung_Pecah 🫧", content: "Gila gw baru coba td sore, hasilnya jomplang banget! Serem juga ya cara kerja mesin rekomendasi.", createdAt: new Date(Date.now() - 3600000).toISOString(), avatarSeed: "Daisy" }
    ]
  },
  {
    id: "s3",
    title: "",
    authorId: "uid-outb",
    authorName: "OutBubble_Inspirator ✨",
    authorAvatar: "Jack",
    content: "Pondasi utama negara demokrasi yang sehat di era modern itu bukan cuma kebebasan berpendapat, tapi LITERASI DIGITAL kritis. Tanpa itu, kita cuma jadi bidak catur yang digerakin algoritma pembuat emosi.",
    lens: "Harapan",
    likes: 42,
    repliesCount: 0,
    repostsCount: 12,
    timestamp: Date.now() - 1800000,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    replies: []
  }
];

// Initialize Firestore
let firestoreDb: Firestore | null = null;
try {
  let databaseId = "ai-studio-outbubble-45e8fa5c-4f00-4901-8763-6a4bb12047b7";
  let projectId = "advance-gadget-1ptg6";

  if (fs.existsSync("firebase-applet-config.json")) {
    const config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf-8"));
    if (config.firestoreDatabaseId) databaseId = config.firestoreDatabaseId;
    if (config.projectId) projectId = config.projectId;
  }

  firestoreDb = new Firestore({
    projectId,
    databaseId
  });
  console.log(`[Forum API] Connected to Firestore Database (${databaseId})`);
} catch (e) {
  console.error("[Forum API] Firestore initialization error:", e);
}

// Local file fallback backup
const DATA_FILE = path.join(process.cwd(), "data", "forum_topics.json");
const CHAT_FILE = path.join(process.cwd(), "data", "chat_messages.json");
const STATS_FILE = path.join(process.cwd(), "data", "forum_stats.json");
let localMemoryTopics: DiscussionTopic[] = [];
let localMemoryChat: ChatMessage[] = [];
let localTotalVisitors = 0;
const localPresenceMap: Record<string, number> = {};

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function loadLocalChatFile(): ChatMessage[] {
  try {
    if (fs.existsSync(CHAT_FILE)) {
      const content = fs.readFileSync(CHAT_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return [...fallbackChatMessages];
}

function saveLocalChatFile(messages: ChatMessage[]) {
  localMemoryChat = messages;
  try {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (e) {}
}

localMemoryChat = loadLocalChatFile();

function loadLocalStats(): number {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
      if (typeof data.totalVisitors === "number") return data.totalVisitors;
    }
  } catch (e) {}
  return 1; // Default initial visitor count
}

function saveLocalStats(total: number) {
  localTotalVisitors = total;
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify({ totalVisitors: total }, null, 2), "utf-8");
  } catch (e) {}
}

localTotalVisitors = loadLocalStats();

function loadLocalFile(): DiscussionTopic[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return [...fallbackTopics];
}

function saveLocalFile(topics: DiscussionTopic[]) {
  localMemoryTopics = topics;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(topics, null, 2), "utf-8");
  } catch (e) {}
}

localMemoryTopics = loadLocalFile();

function handleFirestoreError(err: any) {
  const msg = String(err?.message || err);
  if (msg.includes("PERMISSION_DENIED") || msg.includes("7 PERMISSION_DENIED")) {
    if (firestoreDb) {
      console.log("[Forum API] Firestore permission notice: Falling back seamlessly to local persistent database.");
      firestoreDb = null;
    }
  } else {
    console.error("[Forum API] Firestore operation error:", msg);
  }
}

async function getTopicsFromDatabase(): Promise<DiscussionTopic[]> {
  if (firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("topics").get();
      if (!snapshot.empty) {
        const topics: DiscussionTopic[] = [];
        snapshot.forEach(doc => {
          topics.push(doc.data() as DiscussionTopic);
        });
        topics.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        saveLocalFile(topics);
        return topics;
      } else {
        // Seed initial topics into Firestore if empty
        for (const topic of fallbackTopics) {
          await firestoreDb.collection("topics").doc(topic.id).set(topic);
        }
        saveLocalFile(fallbackTopics);
        return fallbackTopics;
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }
  return localMemoryTopics;
}

async function getChatFromDatabase(): Promise<ChatMessage[]> {
  if (firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("chat_messages").get();
      if (!snapshot.empty) {
        const msgs: ChatMessage[] = [];
        snapshot.forEach(doc => {
          msgs.push(doc.data() as ChatMessage);
        });
        msgs.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        saveLocalChatFile(msgs);
        return msgs;
      } else {
        for (const msg of fallbackChatMessages) {
          await firestoreDb.collection("chat_messages").doc(msg.id).set(msg);
        }
        saveLocalChatFile(fallbackChatMessages);
        return fallbackChatMessages;
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }
  return localMemoryChat;
}

// Get stats (Total Visitors & Live Active Visitors)
async function getVisitorStats(): Promise<{ totalVisitors: number; onlineCount: number }> {
  let totalVisitors = localTotalVisitors;
  let onlineCount = 1;

  const cutoff = Date.now() - 35000; // 35s active window

  if (firestoreDb) {
    try {
      // 1. Fetch Total Visitors counter
      const statsDoc = await firestoreDb.collection("stats").doc("counters").get();
      if (statsDoc.exists) {
        totalVisitors = statsDoc.data()?.totalVisitors || totalVisitors;
      }

      // 2. Fetch Active Presences (last 35 seconds)
      const presenceSnapshot = await firestoreDb.collection("presence")
        .where("lastSeen", ">=", cutoff)
        .get();

      onlineCount = Math.max(1, presenceSnapshot.size);
      return { totalVisitors, onlineCount };
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  // Fallback to local memory calculation
  const activeKeys = Object.keys(localPresenceMap).filter(k => localPresenceMap[k] >= cutoff);
  onlineCount = Math.max(1, activeKeys.length);
  return { totalVisitors, onlineCount };
}

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// GET list of all discussion topics (Globally shared from Firestore)
app.get("/api/forum/topics", async (req: any, res: any) => {
  try {
    const topics = await getTopicsFromDatabase();
    return res.json(topics);
  } catch (e) {
    return res.json(localMemoryTopics);
  }
});

// GET stats (Total Visitors & Online Citizens)
app.get("/api/forum/stats", async (req: any, res: any) => {
  try {
    const stats = await getVisitorStats();
    return res.json(stats);
  } catch (e) {
    return res.json({ totalVisitors: localTotalVisitors, onlineCount: 1 });
  }
});

// POST visitor heartbeat ping / visit log
app.post("/api/forum/ping", async (req: any, res: any) => {
  const { visitorId, isNewVisit } = req.body;
  const vid = visitorId || `vid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();

  // Update local memory presence
  localPresenceMap[vid] = now;
  if (isNewVisit) {
    saveLocalStats(localTotalVisitors + 1);
  }

  if (firestoreDb) {
    try {
      // Record presence heartbeat
      await firestoreDb.collection("presence").doc(vid).set({
        visitorId: vid,
        lastSeen: now
      }, { merge: true });

      // If new visit, increment total visitors counter
      if (isNewVisit) {
        await firestoreDb.collection("stats").doc("counters").set({
          totalVisitors: FieldValue.increment(1)
        }, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const stats = await getVisitorStats();
  return res.json({ success: true, ...stats });
});

// POST create new discussion topic (Saved globally)
app.post("/api/forum/topics", async (req: any, res: any) => {
  const topic = req.body.topic || req.body;
  if (!topic || (!topic.content && !topic.image)) {
    return res.status(400).json({ error: "Missing topic content or details" });
  }

  const newTopic: DiscussionTopic = {
    id: topic.id || `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: topic.title || "",
    authorId: topic.authorId || "anon",
    authorName: topic.authorName || "Warga OutBubble 🫧",
    authorAvatar: topic.authorAvatar || "Felix",
    content: topic.content || "",
    image: topic.image || undefined,
    lens: topic.lens || "Opini",
    likes: topic.likes || 0,
    repliesCount: topic.repliesCount || 0,
    replies: topic.replies || [],
    repostsCount: topic.repostsCount || 0,
    timestamp: topic.timestamp || Date.now(),
    createdAt: topic.createdAt || new Date().toISOString()
  };

  // Update local memory and file immediately
  localMemoryTopics = [newTopic, ...localMemoryTopics.filter(t => t.id !== newTopic.id)];
  saveLocalFile(localMemoryTopics);

  if (firestoreDb) {
    try {
      await firestoreDb.collection("topics").doc(newTopic.id).set(newTopic);
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  return res.status(201).json(newTopic);
});

// POST toggle like
app.post("/api/forum/topics/:id/like", async (req: any, res: any) => {
  const { id } = req.params;
  const { isLikedByMe } = req.body;

  let newLikes = 0;

  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("topics").doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data() as DiscussionTopic;
        newLikes = isLikedByMe ? Math.max(0, (data.likes || 0) - 1) : (data.likes || 0) + 1;
        await docRef.update({ likes: newLikes });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryTopics.map(t => {
    if (t.id === id) {
      newLikes = isLikedByMe ? Math.max(0, (t.likes || 0) - 1) : (t.likes || 0) + 1;
      return { ...t, likes: newLikes };
    }
    return t;
  });
  saveLocalFile(updated);

  return res.json({ success: true, likes: newLikes });
});

// POST increment repost
app.post("/api/forum/topics/:id/repost", async (req: any, res: any) => {
  const { id } = req.params;

  let newReposts = 0;
  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("topics").doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data() as DiscussionTopic;
        newReposts = (data.repostsCount || 0) + 1;
        await docRef.update({ repostsCount: newReposts });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryTopics.map(t => {
    if (t.id === id) {
      newReposts = (t.repostsCount || 0) + 1;
      return { ...t, repostsCount: newReposts };
    }
    return t;
  });
  saveLocalFile(updated);

  return res.json({ success: true, repostsCount: newReposts });
});

// POST add reply
app.post("/api/forum/topics/:id/replies", async (req: any, res: any) => {
  const { id } = req.params;
  const reply = req.body.reply || req.body;

  if (!reply || !reply.content) {
    return res.status(400).json({ error: "Missing reply content" });
  }

  const newReply: Reply = {
    id: reply.id || `r-${Date.now()}`,
    authorName: reply.authorName || "Anonymous",
    content: reply.content || "",
    createdAt: reply.createdAt || new Date().toISOString(),
    avatarSeed: reply.avatarSeed || "Felix"
  };

  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("topics").doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data() as DiscussionTopic;
        const currentReplies = data.replies || [];
        const updatedReplies = [newReply, ...currentReplies];
        await docRef.update({
          replies: updatedReplies,
          repliesCount: updatedReplies.length
        });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryTopics.map(t => {
    if (t.id === id) {
      const updatedReplies = [newReply, ...(t.replies || [])];
      return {
        ...t,
        replies: updatedReplies,
        repliesCount: updatedReplies.length
      };
    }
    return t;
  });
  saveLocalFile(updated);

  return res.json({ success: true, reply: newReply });
});

// DELETE topic
app.delete("/api/forum/topics/:id", async (req: any, res: any) => {
  const { id } = req.params;

  if (firestoreDb) {
    try {
      await firestoreDb.collection("topics").doc(id).delete();
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryTopics.filter(t => t.id !== id);
  saveLocalFile(updated);

  return res.json({ success: true });
});

// DELETE reply
app.delete("/api/forum/topics/:id/replies/:replyId", async (req: any, res: any) => {
  const { id, replyId } = req.params;

  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("topics").doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data() as DiscussionTopic;
        const updatedReplies = (data.replies || []).filter((r: any) => r.id !== replyId);
        await docRef.update({
          replies: updatedReplies,
          repliesCount: updatedReplies.length
        });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryTopics.map(t => {
    if (t.id === id) {
      const updatedReplies = (t.replies || []).filter((r: any) => r.id !== replyId);
      return {
        ...t,
        replies: updatedReplies,
        repliesCount: updatedReplies.length
      };
    }
    return t;
  });
  saveLocalFile(updated);

  return res.json({ success: true });
});

// GET live chat messages
app.get("/api/forum/chat/messages", async (req: any, res: any) => {
  try {
    const channel = req.query.channel;
    let msgs = await getChatFromDatabase();
    if (channel) {
      msgs = msgs.filter(m => m.channel === channel);
    }
    return res.json(msgs);
  } catch (e) {
    return res.json(localMemoryChat);
  }
});

// POST new live chat message
app.post("/api/forum/chat/messages", async (req: any, res: any) => {
  const { channel, authorId, authorName, authorAvatar, content, image } = req.body;
  if (!content && !image) {
    return res.status(400).json({ error: "Missing chat content or image" });
  }

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    channel: channel || "obrolan-santai",
    authorId: authorId || "anon",
    authorName: authorName || "Warga OutBubble",
    authorAvatar: authorAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
    content: content || "",
    image: image || undefined,
    timestamp: Date.now(),
    reactions: {}
  };

  // Update local memory immediately
  localMemoryChat = [...localMemoryChat.filter(m => m.id !== newMsg.id), newMsg];
  saveLocalChatFile(localMemoryChat);

  if (firestoreDb) {
    try {
      await firestoreDb.collection("chat_messages").doc(newMsg.id).set(newMsg);
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  return res.status(201).json(newMsg);
});

// POST react to live chat message
app.post("/api/forum/chat/messages/:id/react", async (req: any, res: any) => {
  const { id } = req.params;
  const { emoji } = req.body;
  if (!emoji) return res.status(400).json({ error: "Missing emoji" });

  let updatedReactions: Record<string, number> = {};

  if (firestoreDb) {
    try {
      const docRef = firestoreDb.collection("chat_messages").doc(id);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data() as ChatMessage;
        const rx = data.reactions || {};
        rx[emoji] = (rx[emoji] || 0) + 1;
        updatedReactions = rx;
        await docRef.update({ reactions: rx });
      }
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryChat.map(m => {
    if (m.id === id) {
      const rx = { ...(m.reactions || {}) };
      rx[emoji] = (rx[emoji] || 0) + 1;
      updatedReactions = rx;
      return { ...m, reactions: rx };
    }
    return m;
  });
  saveLocalChatFile(updated);

  return res.json({ success: true, reactions: updatedReactions });
});

// DELETE chat message
app.delete("/api/forum/chat/messages/:id", async (req: any, res: any) => {
  const { id } = req.params;

  if (firestoreDb) {
    try {
      await firestoreDb.collection("chat_messages").doc(id).delete();
    } catch (err) {
      handleFirestoreError(err);
    }
  }

  const updated = localMemoryChat.filter(m => m.id !== id);
  saveLocalChatFile(updated);

  return res.json({ success: true });
});

export default app;
