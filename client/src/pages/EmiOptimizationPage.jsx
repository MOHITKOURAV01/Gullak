import React from 'react';
import EmiCalculator from '../components/EmiCalculator';

const EmiOptimizationPage = () => {
    return (
        <div className="pt-28 pb-16 min-h-screen bg-background text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <EmiCalculator />
            </div>
        </div>
    );
};

export default EmiOptimizationPage;
