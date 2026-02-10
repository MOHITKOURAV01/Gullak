import React from 'react';
import { motion } from 'framer-motion';
import {
    Calculator,
    PieChart,
    Zap,
    BookOpen,
    Smartphone,
    Target,
    BarChart3,
    SearchCheck,
    CreditCard
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true }}
        className="p-8 rounded-3xl bg-surface border border-white/5 hover:border-primary/30 transition-all group"
    >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
);

const Features = () => {
    const features = [
        {
            icon: Calculator,
            title: "EMI Optimization",
            description: "Our core engine simulates extra payments to show exactly how much interest you can save and how early you can close loans."
        },
        {
            icon: SearchCheck,
            title: "Leak Detection",
            description: "Find out where your money is silently leaking, from unused subscriptions to excessive online ordering habits."
        },
        {
            icon: BarChart3,
            title: "Net Worth Tracker",
            description: "Track Bank Balance, Mutual Funds, Stocks, Gold, and Property in one place. Watch your wealth grow over time."
        },
        {
            icon: Target,
            title: "Health Score",
            description: "Get a monthly financial health score (0-100) based on your savings ratio, EMI burden, and spending habits."
        },
        {
            icon: CreditCard,
            title: "Card Vault",
            description: "Explore a curated list of premium credit & debit cards. Compare rewards, annual fees, and discover the best card for your lifestyle."
        },
        {
            icon: Smartphone,
            title: "Cross-Platform",
            description: "Real-time sync between Web and Mobile ensures your finances are always within reach, wherever you are."
        }
    ];

    return (
        <section id="features" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">Designed for your <span className="text-gradient">financial peace.</span></h2>
                        <p className="text-gray-400 text-lg">Every feature is crafted to move you one step closer to financial freedom, using logic used by top financial experts.</p>
                    </div>
                    <button className="text-primary font-bold flex items-center gap-2 group">
                        See all features <Zap size={20} className="group-hover:fill-primary" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={i * 0.1} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
