import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import TopBar from './components/TopBar';
import NotFoundPage from './pages/404';
import AboutPage from './pages/About';
import CareerPage from './pages/Careers';
import ProjectsPage from './pages/Projects';
import SkillsPage from './pages/Skills';

function App() {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<AboutPage />} />

        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/careers" element={<CareerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
