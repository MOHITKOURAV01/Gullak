import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExpenseCalculator from './pages/ExpenseCalculator';
import EmiOptimizationPage from './pages/EmiOptimizationPage';
import DebtOptimizer from './pages/DebtOptimizer';

import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculate-expenses" element={<ExpenseCalculator />} />
            <Route path="/debt-optimizer" element={<DebtOptimizer />} />
            <Route path="/emi-optimization" element={<EmiOptimizationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
