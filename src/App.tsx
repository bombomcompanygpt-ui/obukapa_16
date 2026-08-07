import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Materi from './components/Materi';
import TesSimulasi from './components/TesSimulasi';
import Explore from './components/Explore';
import Refleksi from './components/Refleksi';
import Forum from './components/Forum';
import InsightSosial from './components/InsightSosial';
import Profile from './components/Profile';
import BubulChat from './components/BubulChat';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materi" element={<Materi />} />
          <Route path="/tes" element={<TesSimulasi />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/refleksi" element={<Refleksi />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/insight" element={<InsightSosial />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bubul" element={<BubulChat />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
