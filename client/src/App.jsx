import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExpenseCalculator from './pages/ExpenseCalculator';
import EmiOptimizationPage from './pages/EmiOptimizationPage';
import DebtOptimizer from './pages/DebtOptimizer';
import Insights from './pages/Insights';
import Auth from './pages/Auth';
import Cards from './pages/Cards';

import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-white selection:bg-primary/30 selection:text-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculate-expenses" element={<ExpenseCalculator />} />
            <Route path="/debt-optimizer" element={<DebtOptimizer />} />
            <Route path="/emi-optimization" element={<EmiOptimizationPage />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
