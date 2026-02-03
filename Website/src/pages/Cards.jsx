import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Star, Zap, ShoppingBag, Plane, Coffee, ShieldCheck, ChevronRight, Info, ExternalLink, CheckCircle2 } from 'lucide-react';

const CardDemo = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('🇮🇳 India');
    const [searchQuery, setSearchQuery] = useState('');

    const cardData = [
        // --- INDIA ---
        {
            id: 1,
            name: "HDFC Millennia",
            type: "Credit Card",
            color: "from-blue-600 to-indigo-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "5% Cashback on Amazon, Flipkart, Myntra",
                "1% Cashback on all other spends",
                "8 Domestic Lounge accesses per year",
                "Dining discount up to 20% via Swiggy Dineout"
            ],
            bestFor: "Daily Lifestyle & Shopping",
            fee: "₹1,000 (Waived on ₹1L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 2,
            name: "IDFC First WOW",
            type: "Credit Card",
            color: "from-emerald-600 to-teal-900",
            category: "Students",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "No Income Proof required (FD based)",
                "Zero Forex Markup on International spends",
                "6X Rewards on all spends",
                "Buy 1 Get 1 on Movie Tickets"
            ],
            bestFor: "Students & First-time Card Users",
            fee: "₹0 (Life Time Free)",
            rating: 4.9,
            image: ""
        },
        {
            id: 3,
            name: "Axis Atlas",
            type: "Credit Card",
            color: "from-amber-500 to-amber-800",
            category: "Travelers",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "5 EDGE Miles per ₹100 on Flights/Hotels",
                "Tiered benefits (Silver, Gold, Platinum)",
                "Concierge & Airport Assistance",
                "Miles transferable to 20+ Airlines"
            ],
            bestFor: "Frequent Flyers & Global Travelers",
            fee: "₹5,000 (Waived on ₹10L spend)",
            rating: 4.7,
            image: ""
        }
    ];

    const categories = ['All', 'Students', 'Personal', 'Business', 'Travelers', 'Luxury'];
    const countries = ['🇮🇳 India', '🇺🇸 USA', '🇬🇧 UK', '🇦🇪 UAE', '🇨🇦 Canada', '🇪🇺 Europe', '🇯🇵 Japan', '🇭🇰 Hong Kong', '🇸🇬 Singapore', '🇦🇺 Australia', 'Global'];

    return null;
};

export default CardDemo;
