import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

import MainPage from './pages/main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
