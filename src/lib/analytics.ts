export interface QuizResult {
  question: string;
  answer: boolean; // true for agree, false for disagree
  timestamp: number;
  type: 'pre' | 'post';
}

export interface UserMindset {
  preLevel: 'Rendah' | 'Sedang' | 'Tinggi' | null;
  postLevel: 'Rendah' | 'Sedang' | 'Tinggi' | null;
  preScore: number; // 0 to 1
  postScore: number; // 0 to 1
}

export const calculateLevel = (score: number) => {
  if (score < 0.4) return 'Rendah';
  if (score < 0.7) return 'Sedang';
  return 'Tinggi';
};

export const saveQuizResult = (result: QuizResult) => {
  const data = JSON.parse(localStorage.getItem('outbubble_analytics_v2') || '{"results": [], "mindset": {"preLevel": null, "postLevel": null, "preScore": 0, "postScore": 0}}');
  data.results.push(result);
  
  // Update mindset scores based on results
  const preResults = data.results.filter((r: QuizResult) => r.type === 'pre');
  const postResults = data.results.filter((r: QuizResult) => r.type === 'post');
  
  if (preResults.length > 0) {
    const agreeCount = preResults.filter((r: QuizResult) => r.answer).length;
    data.mindset.preScore = agreeCount / preResults.length;
    data.mindset.preLevel = calculateLevel(data.mindset.preScore);
  }
  
  if (postResults.length > 0) {
    const agreeCount = postResults.filter((r: QuizResult) => r.answer).length;
    data.mindset.postScore = agreeCount / postResults.length;
    data.mindset.postLevel = calculateLevel(data.mindset.postScore);
  }

  localStorage.setItem('outbubble_analytics_v2', JSON.stringify(data));
};

export const getAnalytics = () => {
  return JSON.parse(localStorage.getItem('outbubble_analytics_v2') || '{"results": [], "mindset": {"preLevel": null, "postLevel": null, "preScore": 0, "postScore": 0}}');
};
