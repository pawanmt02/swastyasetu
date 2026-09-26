import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Intake from './pages/Intake';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/intake" element={<Intake />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
