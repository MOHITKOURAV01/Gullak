import React from 'react';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import EmiSimulator from '../components/EmiSimulator';
import Features from '../components/Features';

const Home = () => {
    return (
        <>
            <Hero />
            <ProblemSolution />
            <EmiSimulator />
            <Features />

            {/* Call to Action Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative glass rounded-[3rem] p-12 overflow-hidden text-center border-primary/20 bg-primary/5">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to level up your <span className="text-gradient">finances?</span></h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join 10,000+ Indians who are using GULLAK to take control of their money and build their net worth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary hover:bg-primary-dark text-background px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl">
                                Get Started for Free
                            </button>
                            <button className="glass px-10 py-4 rounded-2xl font-bold text-lg transition-all border-white/10 hover:bg-white/5">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
