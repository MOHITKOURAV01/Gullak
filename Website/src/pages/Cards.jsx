import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, Star, Zap, ShoppingBag, Plane, Coffee, ShieldCheck, ChevronRight, Info, ExternalLink, CheckCircle2, Sparkles, X, Search } from 'lucide-react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CardDemo = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('🇮🇳 India');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAiCard, setActiveAiCard] = useState(null);
    const [aiInput, setAiInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isAiLoading]);

    const openChat = (card = { name: "General Assistant" }) => {
        setActiveAiCard(card);
        const welcomeMsg = {
            role: 'assistant',
            content: "Namaste! Welcome to meraGullak.com. How can I help you save? 🇮🇳 \n\nNamaste! How may I help you?"
        };
        setChatHistory([welcomeMsg]);
        return [welcomeMsg];
    };

    const askAiExpert = async (card, customMessage = null, initialHistory = null) => {
        const messageToSend = customMessage || "Is this card good for me? Tell me how much I can save.";
        const currentHistory = initialHistory || chatHistory;

        // Add user message to history
        const newUserMessage = { role: 'user', content: messageToSend };
        const updatedHistoryWithUser = [...currentHistory, newUserMessage];
        setChatHistory(updatedHistoryWithUser);

        setActiveAiCard(card);
        setIsAiLoading(true);
        setAiInput('');

        try {
            const response = await fetch(`${API_URL}/api/ai/card-expert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardName: card.name,
                    cardData: card,
                    userMessage: messageToSend,
                    history: updatedHistoryWithUser.filter(m => m.role !== 'assistant' || !m.content.includes("Namaste"))
                })
            });
            const data = await response.json();

            // Add AI response to history
            const newAssistantMessage = { role: 'assistant', content: data.reply };
            setChatHistory(prev => [...prev, newAssistantMessage]);
        } catch (error) {
            const errorMessage = { role: 'assistant', content: "Sorry, main abhi busy hoon. Thodi der baad try karein! (Check server/API key)" };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const cardData = [
        // --- INDIA ---
        {
            id: 1,
            name: "HDFC Millennia",
            type: "Credit Card",
            color: "from-blue-600 to-indigo-900",
            category: "Shopping",
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
            category: "Student",
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
            category: "Travel",
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
        },
        {
            id: 4,
            name: "SBI Cashback",
            type: "Credit Card",
            color: "from-blue-400 to-blue-700",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "5% Cashback on ALL online spends",
                "1% Cashback on offline spends",
                "No merchant-specific restrictions",
                "Direct credit to credit card account"
            ],
            bestFor: "Direct Cashback Lovers",
            fee: "₹999 (Waived on ₹2L spend)",
            rating: 4.9,
            image: ""
        },
        {
            id: 5,
            name: "Amazon Pay ICICI",
            type: "Credit Card",
            color: "from-orange-500 to-slate-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "5% Reward Points for Prime members",
                "2% on 100+ partner merchants",
                "1% on all other spends",
                "Life Time Free Card"
            ],
            bestFor: "Amazon Prime Users",
            fee: "₹0 (Lifetime Free)",
            rating: 4.8,
            image: ""
        },
        {
            id: 6,
            name: "Amex Gold Card",
            type: "Charge Card",
            color: "from-yellow-400 to-yellow-700",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "5X Membership Rewards points on spends",
                "1,000 Bonus Points for 6 transactions",
                "Exclusive Reward Multiplier portal",
                "Premium Travel & Dining benefits"
            ],
            bestFor: "Reward Point Maximizers",
            fee: "₹4,500 + GST",
            rating: 4.7,
            image: ""
        },
        {
            id: 7,
            name: "HDFC Regalia Gold",
            type: "Credit Card",
            color: "from-yellow-600 to-slate-900",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "4 Reward Points per ₹150 spent",
                "Complimentary Club Marriott membership",
                "12 Domestic & 6 International Lounge visits",
                "Premium Flight & Hotel redemption"
            ],
            bestFor: "Business & Travel Enthusiasts",
            fee: "₹2,500 (Waived on ₹4L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 8,
            name: "Standard Chartered Smart",
            type: "Credit Card",
            color: "from-blue-800 to-blue-600",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "STANDARD CHARTERED",
            benefits: [
                "2% Cashback on all online spends",
                "Flat 1% Cashback on offline spends",
                "Special introductory offer benefits",
                "Simple and straightforward rewards"
            ],
            bestFor: "Simple Online Value",
            fee: "₹499 (Waived on ₹1.2L spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 9,
            name: "Kotak League Platinum",
            type: "Credit Card",
            color: "from-red-600 to-slate-800",
            category: "Student",
            country: "🇮🇳 India",
            bank: "KOTAK MAHINDRA",
            benefits: [
                "Up to 8X Reward Points on spends",
                "PVR movie tickets as milestone rewards",
                "Fuel surcharge waiver across India",
                "Lounge access available on Select variants"
            ],
            bestFor: "PVR & Entertainment lovers",
            fee: "₹499 (Lifetime Free for selected)",
            rating: 4.3,
            image: ""
        },
        {
            id: 10,
            name: "OneCard",
            type: "Credit Card",
            color: "from-slate-800 to-black",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "BOB/SBM/FEDERAL",
            benefits: [
                "Full Metal Card experience",
                "No Joining or Annual Fees",
                "Instant rewards & category multipliers",
                "Best-in-class mobile app control"
            ],
            bestFor: "Tech-savvy Millennials",
            fee: "₹0 (Forever Free)",
            rating: 4.6,
            image: ""
        },
        {
            id: 11,
            name: "Axis Flipkart",
            type: "Credit Card",
            color: "from-blue-200 to-blue-500",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "5% Unlimited Cashback on Flipkart",
                "4% on preferred partners (Swiggy, PVR)",
                "1.5% Unlimited on all other spends",
                "4 Domestic lounge visits per year"
            ],
            bestFor: "Flipkart Loyalists",
            fee: "₹500 (Waived on ₹3.5L spend)",
            rating: 4.7,
            image: ""
        },
        {
            id: 12,
            name: "ICICI Coral",
            type: "Credit Card",
            color: "from-blue-400 to-slate-400",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "2 Reward Points per ₹100 spent",
                "Buy 1 Get 1 on movie tickets (BookMyShow)",
                "Complimentary Airport & Railway Lounge visits",
                "Exclusive dining offers via Culinary Treats"
            ],
            bestFor: "Everyday Rewards & Movies",
            fee: "₹500 (Waived on ₹1.5L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 13,
            name: "HDFC Tata Neu Infinity",
            type: "Credit Card",
            color: "from-black to-slate-800",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "5% NeuCoins on Tata Neu & partner brands",
                "1.5% NeuCoins on all other spends",
                "8 Domestic & 4 International Lounge visits",
                "Additional 5% NeuCoins on Tata Neu App"
            ],
            bestFor: "Tata Ecosystem Shoppers",
            fee: "₹1,499 (Waived on ₹3L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 14,
            name: "SBI SimplyClick",
            type: "Credit Card",
            color: "from-blue-500 to-indigo-600",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "10X Points on Amazon, Apollo, Cleartrip, Netmeds",
                "5X Points on all other online spends",
                "₹500 Amazon welcome voucher",
                "Milestone e-vouchers worth ₹2,000"
            ],
            bestFor: "Online Shopping Beginners",
            fee: "₹499 (Waived on ₹1L spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 15,
            name: "Axis Magnus",
            type: "Credit Card",
            color: "from-slate-700 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "12 Reward Points per ₹200 spent",
                "25,000 Reward Points on monthly milestone",
                "Unlimited Domestic & International Lounge access",
                "Buy 1 Get 1 on movies up to ₹500"
            ],
            bestFor: "High Net-worth Individuals",
            fee: "₹12,500 + GST",
            rating: 4.9,
            image: ""
        },
        {
            id: 16,
            name: "IDFC First Select",
            type: "Credit Card",
            color: "from-red-800 to-amber-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Up to 10X Reward Points on spends",
                "Buy 1 Get 1 on movie tickets",
                "Complimentary Airport & Railway Lounge access",
                "Zero interest on cash withdrawals"
            ],
            bestFor: "Premium Lifestyle Benefits",
            fee: "₹0 (Life Time Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 17,
            name: "Amex Plat Travel",
            type: "Credit Card",
            color: "from-slate-400 to-indigo-400",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "₹40,000+ value in bonus Membership Rewards",
                "Taj gift cards as milestone rewards",
                "Complimentary Lounge access",
                "Priority Assistance for travelers"
            ],
            bestFor: "Vacation Savers",
            fee: "₹5,000 (Free in Year 1)",
            rating: 4.7,
            image: ""
        },
        {
            id: 18,
            name: "SBI Prime",
            type: "Credit Card",
            color: "from-indigo-800 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "10 Points per ₹100 on Dining & Movies",
                "20 Points per ₹100 on Birthday spends",
                "Trident Privilege & Club Vistara membership",
                "8 Domestic & 4 International Lounges"
            ],
            bestFor: "Premium Dining & Travel",
            fee: "₹2,999 (Waived on ₹3L spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 19,
            name: "AU LIT Card",
            type: "Credit Card",
            color: "from-purple-500 to-indigo-700",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "AU SMALL FINANCE",
            benefits: [
                "India's first customizable credit card",
                "Choose features you want and pay only for those",
                "Switch features on/off instantly via app",
                "Real-time tracking of spends and rewards"
            ],
            bestFor: "Full Customization Control",
            fee: "₹0 (Customizable charges)",
            rating: 4.8,
            image: ""
        },
        {
            id: 20,
            name: "Axis Ace",
            type: "Credit Card",
            color: "from-green-600 to-teal-800",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Flat 2% Cashback on all spends",
                "5% Cashback on Bill payments via GPay",
                "4% on Swiggy, Zomato, and Ola",
                "Unlimited cashback with no cap"
            ],
            bestFor: "High Cashback on Utilities",
            fee: "₹499 (Waived on ₹2L spend)",
            rating: 4.9,
            image: ""
        },
        {
            id: 21,
            name: "HDFC Infinia",
            type: "Credit Card",
            color: "from-slate-900 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "Invited-only Metal Card",
                "5 Reward Points per ₹150 spent",
                "Unlimited Airport Lounge access globally",
                "Luxury hotel perks and dining via Global Concierge"
            ],
            bestFor: "Ultra-High Net Worth Individuals",
            fee: "₹12,500 (Waived on criteria)",
            rating: 5.0,
            image: ""
        },
        {
            id: 22,
            name: "Axis Airtel Card",
            type: "Credit Card",
            color: "from-red-500 to-slate-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "25% Cashback on Airtel bills & recharge",
                "10% Cashback on Swiggy, Zomato, BigBasket",
                "10% Cashback on utility bill payments",
                "1% on all other spends"
            ],
            bestFor: "Airtel Users & Utility Bills",
            fee: "₹500 (Waived on ₹2L spend)",
            rating: 4.7,
            image: ""
        },
        {
            id: 23,
            name: "SBI SimplySave",
            type: "Credit Card",
            color: "from-blue-600 to-blue-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "10 Reward Points on Dining, Movies & Groceries",
                "1 Reward Point per ₹150 on other spends",
                "2,000 Bonus points on ₹2,000 spend in 60 days",
                "Worldwide acceptance and fuel surcharge waiver"
            ],
            bestFor: "Everyday Offline Spends",
            fee: "₹499 (Waived on ₹1L spend)",
            rating: 4.2,
            image: ""
        },
        {
            id: 24,
            name: "Axis Vistara Signature",
            type: "Credit Card",
            color: "from-purple-800 to-indigo-900",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Premium Economy class ticket on joining",
                "4 CV points per ₹200 spent",
                "Up to 4 milestone Premium Economy tickets",
                "Complimentary Airport Lounge access"
            ],
            bestFor: "Vistara Loyalists",
            fee: "₹3,000 + GST",
            rating: 4.6,
            image: ""
        },
        {
            id: 25,
            name: "RBL Shoprite",
            type: "Credit Card",
            color: "from-red-400 to-red-600",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "RBL BANK",
            benefits: [
                "5% Value back on Grocery spends",
                "10% discount on BookMyShow tickets",
                "Fuel surcharge waiver up to ₹100 monthly",
                "Simple rewards on all other categories"
            ],
            bestFor: "Budget-conscious Grocery Shoppers",
            fee: "₹500 (Waived on ₹1L spend)",
            rating: 4.1,
            image: ""
        },
        {
            id: 26,
            name: "HDFC Diners Black",
            type: "Credit Card",
            color: "from-slate-800 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "5 Reward Points per ₹150 spent",
                "Unlimited Lounge Access globally",
                "Complimentary Golf games and memberships",
                "1:1 Transfer to Air Miles and Partners"
            ],
            bestFor: "Luxury Travel & Rewards",
            fee: "₹10,000 (Waived on criteria)",
            rating: 4.9,
            image: ""
        },
        {
            id: 27,
            name: "ICICI Sapphiro",
            type: "Credit Card",
            color: "from-slate-400 to-blue-500",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "Vouchers worth ₹9,000+ on joining",
                "Buy 1 Get 1 on movies via BookMyShow",
                "Domestic & International Lounge access",
                "Golf rounds and spa access"
            ],
            bestFor: "Lifestyle & Entertainment",
            fee: "₹6,500 (Free for selected alumni)",
            rating: 4.6,
            image: ""
        },
        {
            id: 28,
            name: "HSBC Visa Platinum",
            type: "Credit Card",
            color: "from-red-600 to-slate-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "HSBC",
            benefits: [
                "Life Time Free Zero joining fee",
                "10% Cashback up to ₹2,000 on first 60 days",
                "Buy 1 Get 1 on BookMyShow (Saturdays)",
                "Dining discounts at 1,000+ restaurants"
            ],
            bestFor: "Zero Fee Reward Seekers",
            fee: "₹0 (Always Free)",
            rating: 4.3,
            image: ""
        },
        {
            id: 29,
            name: "SBI Elite",
            type: "Credit Card",
            color: "from-yellow-700 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "₹5,000 Welcome gift voucher",
                "Free Movie tickets worth ₹6,000 yearly",
                "6 International & 8 Domestic Lounge visits",
                "Milestone rewards worth 50,000 points"
            ],
            bestFor: "Movie Lovers & High Spenders",
            fee: "₹4,999 (Waived on ₹10L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 30,
            name: "Amex Plat Reserve",
            type: "Credit Card",
            color: "from-slate-300 to-indigo-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "Complimentary Taj/Oberoi vouchers",
                "Priority Pass and Lounge access",
                "Exclusive concierge and travel desk",
                "Dedicated relationship manager"
            ],
            bestFor: "Elite Travel Experiences",
            fee: "₹10,000 + GST",
            rating: 4.5,
            image: ""
        },
        {
            id: 31,
            name: "HDFC MoneyBack+",
            type: "Credit Card",
            color: "from-blue-400 to-indigo-500",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "10X Points on Amazon, BigBasket, Flipkart, Swiggy",
                "5X Points on EMI spends",
                "2 Reward Points per ₹150 on other spends",
                "₹500 gift voucher on quarterly milestones"
            ],
            bestFor: "Starter Shopping Card",
            fee: "₹500 (Waived on ₹50k spend)",
            rating: 4.3,
            image: ""
        },
        {
            id: 32,
            name: "Axis Neo",
            type: "Credit Card",
            color: "from-indigo-400 to-blue-600",
            category: "Student",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "40% off on Zomato (Up to ₹120)",
                "5% off on Amazon Pay bills",
                "10% off on BookMyShow & Blinkit",
                "Easy approval for entry-level users"
            ],
            bestFor: "Online Food & Bill Discounts",
            fee: "₹250 (Often Free/LTF)",
            rating: 4.5,
            image: ""
        },
        {
            id: 33,
            name: "IDFC First Wealth",
            type: "Credit Card",
            color: "from-slate-800 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Up to 10X Reward Points with no expiry",
                "Buy 1 Get 1 on movie tickets up to ₹500",
                "Unlimited Domestic Lounge & Spa access",
                "Low interest rate starting from 0.75%"
            ],
            bestFor: "Premium Lifestyle & Savings",
            fee: "₹0 (Life Time Free)",
            rating: 4.9,
            image: ""
        },
        {
            id: 34,
            name: "Axis Reserve",
            type: "Credit Card",
            color: "from-amber-600 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Ultra-Premium Metal Card Experience",
                "Unlimited Airport Lounge access for self & guests",
                "15 complimentary Meet & Assist services",
                "Accor Plus & Club Marriott memberships"
            ],
            bestFor: "High-Net Worth Individuals",
            fee: "₹50,000 + GST",
            rating: 5.0,
            image: ""
        },
        {
            id: 35,
            name: "Yes Bank Marquee",
            type: "Credit Card",
            color: "from-slate-700 to-blue-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "YES BANK",
            benefits: [
                "36 Reward Points per ₹200 on online spends",
                "Unlimited Domestic & International Lounges",
                "Buy 1 Get 1 movies on BookMyShow",
                "Low Forex markup of 1%"
            ],
            bestFor: "Luxury Lifestyle & Shopping",
            fee: "₹9,999 (Waived on ₹10L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 36,
            name: "Scapia Federal",
            type: "Credit Card",
            color: "from-indigo-600 to-indigo-900",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "FEDERAL BANK",
            benefits: [
                "Zero Forex Markup on all International spends",
                "Unlimited Lounge access (on ₹5k monthly spend)",
                "Instant 10% Scapia Coins on every spend",
                "Easy app-based travel booking"
            ],
            bestFor: "Frequent International Travelers",
            fee: "₹0 (Life Time Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 37,
            name: "AU Zenith",
            type: "Credit Card",
            color: "from-gray-800 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "AU SMALL FINANCE",
            benefits: [
                "20 Reward Points per ₹100 on Dining",
                "Complimentary Taj Epicure membership",
                "Domestic & International Lounge access",
                "Low Forex markup of 1.99%"
            ],
            bestFor: "Premium Dining & Lifestyle",
            fee: "₹7,999 (Waived on ₹5L spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 38,
            name: "HSBC Live+",
            type: "Credit Card",
            color: "from-red-500 to-red-700",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "HSBC BANK",
            benefits: [
                "10% Cashback on Dining, Grocery & Food Delivery",
                "1.5% Cashback on all other spends",
                "15% discount on 1,000+ restaurants",
                "Simple cashback credited to statement"
            ],
            bestFor: "Daily Lifestyle & Foodies",
            fee: "₹999 (Waived on ₹2L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 39,
            name: "Axis Indian Oil",
            type: "Credit Card",
            color: "from-orange-500 to-orange-700",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "4% value back as fuel points",
                "1% fuel surcharge waiver",
                "10% instant discount on BookMyShow",
                "Reward points on online shopping"
            ],
            bestFor: "Fuel & Daily Commute",
            fee: "₹500 (Waived on ₹50k spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 40,
            name: "Amex SmartEarn",
            type: "Credit Card",
            color: "from-blue-400 to-blue-600",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "10X Points on Flipkart, Swiggy, Uber & Zomato",
                "5X Points on Amazon spends",
                "Joining bonus of 500 bonus points",
                "Amex safety & world-class service"
            ],
            bestFor: "Millennial Online Shoppers",
            fee: "₹495 (Waived on ₹40k spend)",
            rating: 4.3,
            image: ""
        },
        {
            id: 41,
            name: "RBL World Safari",
            type: "Credit Card",
            color: "from-teal-600 to-emerald-800",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "RBL BANK",
            benefits: [
                "First Travel card with 0% Markup Fee",
                "Complimentary Lounge access globally",
                "Travel insurance coverage included",
                "Milestone points for flight bookings"
            ],
            bestFor: "Foreign Spends & Safari",
            fee: "₹3,000 + GST",
            rating: 4.5,
            image: ""
        },
        {
            id: 42,
            name: "Standard Chartered DigiSmart",
            type: "Credit Card",
            color: "from-blue-500 to-emerald-500",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "STANDARD CHARTERED",
            benefits: [
                "20% off on Myntra every month",
                "10% off on Grofers & Zomato",
                "10% off on Ola cab bookings",
                "Buy 1 Get 1 on INOX movie tickets"
            ],
            bestFor: "Smart Online Savers",
            fee: "₹49 Monthly (Waived on ₹5k spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 43,
            name: "BoB Eterna",
            type: "Credit Card",
            color: "from-orange-600 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "BOB FINANCIAL",
            benefits: [
                "15 Reward Points per ₹100 on Dining/Travel",
                "Unlimited Domestic Lounge access",
                "Fitternity membership & Golf access",
                "Buy 1 Get 1 movies on Paytm"
            ],
            bestFor: "Premium Travelers & Fitness",
            fee: "₹2,499 (Waived on ₹4L spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 44,
            name: "HDFC Tata Neu Plus",
            type: "Credit Card",
            color: "from-red-600 to-slate-800",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "2% NeuCoins on Tata Neu & Partners",
                "1% NeuCoins on all other spends",
                "4 Domestic Lounge visits per year",
                "Additional 5% NeuCoins on Tata Neu App"
            ],
            bestFor: "Tata Ecosystem Shoppers",
            fee: "₹499 (Waived on ₹1L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 45,
            name: "Kotak Zen Signature",
            type: "Credit Card",
            color: "from-slate-600 to-slate-800",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "KOTAK MAHINDRA",
            benefits: [
                "10 Zen Points per ₹150 on online spends",
                "Complimentary Priority Pass membership",
                "Milestone rewards worth ₹1,500 monthly",
                "8 Domestic Lounge visits per year"
            ],
            bestFor: "Balanced Lifestyle Spends",
            fee: "₹1,500 (Waived on ₹1.5L spend)",
            rating: 4.2,
            image: ""
        },
        {
            id: 46,
            name: "Federal Celesta",
            type: "Credit Card",
            color: "from-indigo-400 to-indigo-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "FEDERAL BANK",
            benefits: [
                "Premium Metal Card Experience",
                "Up to 3X Reward Points on categories",
                "Domestic & International Lounge visits",
                "Buy 1 Get 1 on BMS movie tickets"
            ],
            bestFor: "Premium Banking Customers",
            fee: "₹3,000 (Waived on ₹5L spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 47,
            name: "IDFC First Private",
            type: "Credit Card",
            color: "from-slate-900 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Invite-only Metal Card",
                "Unlimited Domestic & Global Lounges",
                "Comprehensive Travel & Stay perks",
                "World-class concierge services"
            ],
            bestFor: "Ultra High-Net Worth Group",
            fee: "₹0 (Life Time Free / Invite)",
            rating: 4.9,
            image: ""
        },
        {
            id: 48,
            name: "SBI Octane",
            type: "Credit Card",
            color: "from-blue-900 to-slate-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "7.25% Value back on BPCL fuel spends",
                "25 Reward points per ₹100 on dining",
                "4 Complimentary Lounge visits yearly",
                "Gift vouchers on annual milestones"
            ],
            bestFor: "Fuel & Commute Savers",
            fee: "₹1,499 (Waived on ₹2L spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 49,
            name: "SBI Aurum",
            type: "Credit Card",
            color: "from-yellow-600 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "Invite-only Metal Card",
                "Unlimited International & Domestic Lounges",
                "4 Free Movie tickets monthly (BookMyShow)",
                "Luxury Brand vouchers on milestones"
            ],
            bestFor: "Elite Lifestyle & Rewards",
            fee: "₹9,999 (Waived on ₹12L spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 50,
            name: "Jupiter Edge CSB",
            type: "Credit Card",
            color: "from-blue-600 to-teal-400",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "CSB/JUPITER",
            benefits: [
                "Flat 2% Cashback on all spends via Jupiter App",
                "Welcome vouchers worth ₹1,000",
                "Zero joining fee for select users",
                "Instant digital onboarding & control"
            ],
            bestFor: "Tech-savvy Shoppers",
            fee: "₹0 (Life Time Free / Selective)",
            rating: 4.6,
            image: ""
        },
        {
            id: 51,
            name: "Fi Federal Card",
            type: "Credit Card",
            color: "from-emerald-400 to-emerald-700",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "FEDERAL/FI",
            benefits: [
                "5X Rewards on top 3 brands of your choice",
                "2% Value back on all other spends",
                "Complimentary Lounge access",
                "No hidden charges or paper statements"
            ],
            bestFor: "Modern Banking Experience",
            fee: "₹2,000 (Waived on ₹2.5L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 52,
            name: "Axis Select",
            type: "Credit Card",
            color: "from-blue-700 to-blue-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Priority Pass with 6 International visits",
                "₹500 off on BigBasket every month",
                "Buy 1 Get 1 movies on BookMyShow",
                "Golf rounds & Concierge services"
            ],
            bestFor: "Premium Lifestyle & Groceries",
            fee: "₹3,000 (Waived on ₹6L spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 53,
            name: "ICICI Emeralde",
            type: "Credit Card",
            color: "from-slate-700 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "Unlimited Domestic & Global Lounges",
                "Low Forex markup of 1.5%",
                "Unlimited Spa & Golf access",
                "No cancellation fee on travel bookings"
            ],
            bestFor: "Ultra High-Net Worth Group",
            fee: "₹12,000 + GST",
            rating: 4.9,
            image: ""
        },
        {
            id: 54,
            name: "StandChart EaseMyTrip",
            type: "Credit Card",
            color: "from-blue-500 to-orange-500",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "STANDARD CHARTERED",
            benefits: [
                "Flat 20% off on Hotel bookings (EaseMyTrip)",
                "Flat 10% off on Flight bookings",
                "Earn 10x rewards on other travel portals",
                "Complimentary Lounge access"
            ],
            bestFor: "Online Travel Bookings",
            fee: "₹350 (Waived on ₹50k spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 55,
            name: "Yes Bank Reserv",
            type: "Credit Card",
            color: "from-slate-500 to-slate-700",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "YES BANK",
            benefits: [
                "24 Reward Points per ₹200 on basic spends",
                "Unlimited Lounge visits within India",
                "8 International visits via Priority Pass",
                "Golf rounds and Dining perks"
            ],
            bestFor: "High Reward Accumulation",
            fee: "₹1,999 (Waived on criteria)",
            rating: 4.4,
            image: ""
        },
        {
            id: 56,
            name: "OneCard Lite",
            type: "Credit Card",
            color: "from-gray-500 to-gray-700",
            category: "Student",
            country: "🇮🇳 India",
            bank: "BOB/SBM",
            benefits: [
                "No Income Proof (FD based)",
                "Full Metal Card experience",
                "Earn interest on your FD while spending",
                "Start building credit history early"
            ],
            bestFor: "Students & Beginners",
            fee: "₹0 (Always Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 57,
            name: "Kotak Mojo",
            type: "Credit Card",
            color: "from-blue-800 to-black",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "KOTAK MAHINDRA",
            benefits: [
                "2.5 Mojo points per ₹100 online",
                "1 Mojo point per ₹100 offline",
                "8 Domestic Lounge visits per year",
                "Annual fee waiver on ₹1L spend"
            ],
            bestFor: "Online Lifestyle Shopping",
            fee: "₹1,000 (Waived on ₹1L spend)",
            rating: 4.2,
            image: ""
        },
        {
            id: 58,
            name: "Slice Card",
            type: "Credit Card",
            color: "from-purple-600 to-pink-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "SLICE/SBM",
            benefits: [
                "Instant 'Spark' offers on top brands",
                "Simple repayment options (1/3rd pay)",
                "No joining or hidden fees",
                "Best for young urban professionals"
            ],
            bestFor: "Micro-credit & Cashback",
            fee: "₹0 (Free Forever)",
            rating: 4.5,
            image: ""
        },
        {
            id: 59,
            name: "IDFC First Millennia",
            type: "Credit Card",
            color: "from-red-600 to-indigo-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Up to 10X Reward Points on milestones",
                "Buy 1 Get 1 movies on Paytm",
                "Lounge access available",
                "Interest-free cash withdrawals"
            ],
            bestFor: "Gen-Z & Lifestyle spends",
            fee: "₹0 (Life Time Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 60,
            name: "IDFC First SWYP",
            type: "Credit Card",
            color: "from-purple-400 to-indigo-600",
            category: "Student",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Tailored for Youth & New earners",
                "Exclusive brand discounts via SWYP",
                "No processing fee on EMI",
                "Modern vertical card design"
            ],
            bestFor: "First-time Card Users",
            fee: "₹499 (Waived on ₹30k spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 61,
            name: "Axis Rewards",
            type: "Credit Card",
            color: "from-gray-700 to-slate-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "10X Points on Departmental Stores",
                "5,000 Edge points on joining",
                "Domestic Lounge access",
                "Dining and Movie discounts"
            ],
            bestFor: "Offline & Online Rewards",
            fee: "₹1,000 (Waived on ₹2L spend)",
            rating: 4.3,
            image: ""
        },
        {
            id: 62,
            name: "Federal Signet",
            type: "Credit Card",
            color: "from-blue-400 to-blue-700",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "FEDERAL BANK",
            benefits: [
                "Buy 1 Get 1 on Inox movies",
                "Reward points on every spend",
                "Lounge access (selective)",
                "Dining perks via Swiggy/Zomato"
            ],
            bestFor: "Daily Life & Entertainment",
            fee: "₹750 (Waived on criteria)",
            rating: 4.2,
            image: ""
        },
        {
            id: 63,
            name: "BoB Premier",
            type: "Credit Card",
            color: "from-orange-500 to-red-800",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "BOB FINANCIAL",
            benefits: [
                "10 Reward Points per ₹100 on travel",
                "1 Complimentary Lounge access per quarter",
                "1% Fuel surcharge waiver",
                "Simple milestone based fee waiver"
            ],
            bestFor: "Budget Friendly Travel",
            fee: "₹1,000 (Waived on ₹1.2L spend)",
            rating: 4.1,
            image: ""
        },
        {
            id: 64,
            name: "IndusInd Legend",
            type: "Credit Card",
            color: "from-amber-400 to-amber-700",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "INDUSIND BANK",
            benefits: [
                "Buy 1 Get 1 movie ticket on BookMyShow",
                "Complimentary Priority Pass membership",
                "1.5 Reward Points per ₹100 spent on weekends",
                "Discounted foreign currency markup"
            ],
            bestFor: "Premium Lifestyle & Movies",
            fee: "₹0 (Life Time Free / Selective)",
            rating: 4.6,
            image: ""
        },
        {
            id: 65,
            name: "ICICI Rubyx",
            type: "Credit Card",
            color: "from-gray-600 to-gray-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "Dual card privilege (Amex & Mastercard)",
                "2 complimentary Golf rounds monthly",
                "Airport lounge access locally & globally",
                "Movie & Dining discounts via Cult.fit"
            ],
            bestFor: "Multi-network Benefits",
            fee: "₹3,000 (Waived on ₹3L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 66,
            name: "StanChart Ultimate",
            type: "Credit Card",
            color: "from-indigo-800 to-indigo-950",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "STANDARD CHARTERED",
            benefits: [
                "3.3% Reward rate on all spends",
                "Highest rewards for premium customers",
                "Unlimited Lounge visits",
                "Dedicated concierge & travel desk"
            ],
            bestFor: "High Cashback & Rewards",
            fee: "₹5,000 + GST",
            rating: 4.9,
            image: ""
        },
        {
            id: 67,
            name: "SBI Pulse",
            type: "Credit Card",
            color: "from-pink-500 to-pink-700",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "Complimentary Noise ColorFit Pulse watch",
                "Fitpass Pro & Netmeds memberships",
                "5X Rewards on Pharmacy & Dining",
                "Airport lounge access included"
            ],
            bestFor: "Health & Fitness Enthusiasts",
            fee: "₹1,499 (Waived on ₹2L spend)",
            rating: 4.5,
            image: ""
        },
        {
            id: 68,
            name: "Axis My Zone",
            type: "Credit Card",
            color: "from-blue-500 to-blue-800",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Complimentary SonyLiv Premium yearly",
                "Buy 1 Get 1 on movie tickets",
                "₹120 off on Swiggy twice monthly",
                "Flat ₹1000 off on Ajio"
            ],
            bestFor: "Entertainment & Foodies",
            fee: "₹500 (Often Life Time Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 69,
            name: "Yes First Exclusive",
            type: "Credit Card",
            color: "from-slate-700 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "YES BANK",
            benefits: [
                "Complimentary Taj Epicure membership",
                "12 Reward Points per ₹200 spent",
                "Unlimited International Lounges (Priority Pass)",
                "Low Forex markup of 1.75%"
            ],
            bestFor: "Luxury Travel & Rewards",
            fee: "₹9,999 (Waived on spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 70,
            name: "IndusInd Tiger",
            type: "Credit Card",
            color: "from-orange-400 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "INDUSIND BANK",
            benefits: [
                "Accelerated rewards on online spends",
                "2 complimentary movie tickets monthly",
                "Concierge services for luxury bookings",
                "Lounge access across major cities"
            ],
            bestFor: "Online Luxury & Movies",
            fee: "₹0 (Life Time Free / Selective)",
            rating: 4.5,
            image: ""
        },
        {
            id: 71,
            name: "HDFC BizBlack",
            type: "Credit Card",
            color: "from-black to-slate-800",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "5X Reward Points on Tax payments",
                "Unlimited Lounge Access globally",
                "Best-in-class rewards for businesses",
                "Marriott Bonvoy benefits included"
            ],
            bestFor: "Business Owners & HNWIs",
            fee: "₹10,000 + GST",
            rating: 4.9,
            image: ""
        },
        {
            id: 72,
            name: "Axis Kwik",
            type: "Credit Card",
            color: "from-indigo-300 to-indigo-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Virtual-first UPI Credit Card",
                "Cardless experience via app",
                "Flat 1% cashback on UPI spends",
                "Instant approval & usage"
            ],
            bestFor: "Instant Digital Payments",
            fee: "₹0 (Life Time Free)",
            rating: 4.8,
            image: ""
        },
        {
            id: 73,
            name: "Kiwi UPI Card",
            type: "Credit Card",
            color: "from-green-400 to-emerald-600",
            category: "Student",
            country: "🇮🇳 India",
            bank: "AXIS/KIWI",
            benefits: [
                "First Virtual 'Find' Credit Card",
                "Earn Kiwi points on scanning any QR",
                "Flexible repayments in-app",
                "No physical documents needed"
            ],
            bestFor: "Daily QR Scanner Users",
            fee: "₹0 (Life Time Free)",
            rating: 4.6,
            image: ""
        },
        {
            id: 74,
            name: "Niyo Global",
            type: "Credit Card",
            color: "from-blue-600 to-cyan-500",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "SBM/NIYO",
            benefits: [
                "Zero Forex markup globally",
                "Lounge access (International)",
                "High-interest savings link",
                "App with worldwide currency tracker"
            ],
            bestFor: "International Students & Travelers",
            fee: "₹0 (No Annual Fee)",
            rating: 4.9,
            image: ""
        },
        {
            id: 75,
            name: "IndusInd Pinnacle",
            type: "Credit Card",
            color: "from-gray-800 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "INDUSIND BANK",
            benefits: [
                "Complimentary golf lessons and games",
                "Unlimited International Lounge visits",
                "Accelerated rewards on international spends",
                "Exclusive Oberoi & Taj vouchers"
            ],
            bestFor: "High Spenders & Golf Lovers",
            fee: "₹12,999 + GST",
            rating: 4.7,
            image: ""
        },
        {
            id: 76,
            name: "Kotak White",
            type: "Credit Card",
            color: "from-slate-200 to-gray-400",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "KOTAK MAHINDRA",
            benefits: [
                "Premium White Metal Card",
                "Unlimited Lounge access (Select)",
                "PVR movie vouchers on milestones",
                "Direct redemption for luxury brands"
            ],
            bestFor: "Minimalist Luxury Seekers",
            fee: "₹3,000 (Waived on ₹5L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 77,
            name: "IndusInd EazyDiner",
            type: "Credit Card",
            color: "from-red-500 to-black",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "INDUSIND BANK",
            benefits: [
                "Extra 25% off on dining (EazyDiner)",
                "Complimentary EazyDiner Prime yearly",
                "Buy 1 Get 1 on movies",
                "10 Reward Points on Dining & Shopping"
            ],
            bestFor: "Foodies & Fine Dining",
            fee: "₹2,500 (Waived on spend)",
            rating: 4.8,
            image: ""
        },
        {
            id: 78,
            name: "SBI Aura",
            type: "Credit Card",
            color: "from-purple-600 to-slate-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "SBI CARD",
            benefits: [
                "Health & Wellness focus",
                "Complimentary doctor consultations",
                "Fitternity & PharmEasy memberships",
                "5X Points on Dining & Departmental"
            ],
            bestFor: "Family Wellness & Health",
            fee: "₹499 (Waived on ₹1L spend)",
            rating: 4.3,
            image: ""
        },
        {
            id: 79,
            name: "BoB Varunah",
            type: "Credit Card",
            color: "from-blue-600 to-indigo-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "BOB FINANCIAL",
            benefits: [
                "Designed for defense personnel",
                "High accidental insurance cover",
                "Airport lounge visits (Domestic)",
                "1% Fuel surcharge waiver"
            ],
            bestFor: "Defense & Government Employees",
            fee: "₹0 (Life Time Free)",
            rating: 4.5,
            image: ""
        },
        {
            id: 80,
            name: "Union Unicarbon",
            type: "Credit Card",
            color: "from-gray-700 to-gray-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "UNION BANK",
            benefits: [
                "Co-branded with HPCL for fuel",
                "4% value back as reward points",
                "Airport lounge access (Quarterly)",
                "Personal accident insurance cover"
            ],
            bestFor: "Fuel & Daily Commute",
            fee: "₹499 (Waived on criteria)",
            rating: 4.1,
            image: ""
        },
        {
            id: 81,
            name: "HDFC BizPower",
            type: "Credit Card",
            color: "from-blue-900 to-black",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "Business savings on Tax & Rent",
                "Milestone vouchers on business spend",
                "Lounge access (Select cities)",
                "Fraud liability cover for business"
            ],
            bestFor: "Small Business Owners",
            fee: "₹2,500 (Waived on criteria)",
            rating: 4.3,
            image: ""
        },
        {
            id: 82,
            name: "ICICI MMT Signature",
            type: "Credit Card",
            color: "from-blue-400 to-orange-400",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "Accelerated MyCash for MakeMyTrip",
                "Complimentary MMT Black membership",
                "Airport lounge & Spa access",
                "Joining bonus MyCash credits"
            ],
            bestFor: "MakeMyTrip Loyalists",
            fee: "₹2,500 (Joining only)",
            rating: 4.6,
            image: ""
        },
        {
            id: 83,
            name: "Axis Magzter",
            type: "Credit Card",
            color: "from-yellow-500 to-gray-800",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "AXIS BANK",
            benefits: [
                "Complimentary Magzter Gold subscription",
                "Discount on global magazine access",
                "EDGE reward points on every spend",
                "Digital lifestyle perks"
            ],
            bestFor: "Digital Readers & Professionals",
            fee: "₹500 (Often waived)",
            rating: 4.2,
            image: ""
        },
        {
            id: 84,
            name: "StanChart Manhattan",
            type: "Credit Card",
            color: "from-cyan-600 to-slate-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "STANDARD CHARTERED",
            benefits: [
                "5% Cashback on Supermarkets",
                "3X Reward points on other shops",
                "Lounge access (Domestic)",
                "Flexible EMI options for shoppers"
            ],
            bestFor: "Grocery & Departmental Shopping",
            fee: "₹999 (Waived on ₹2L spend)",
            rating: 4.4,
            image: ""
        },
        {
            id: 85,
            name: "ICICI Manchester Utd",
            type: "Credit Card",
            color: "from-red-600 to-black",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "ICICI BANK",
            benefits: [
                "Exclusive discounts at MU Store",
                "Chance to win a trip to Old Trafford",
                "2X Reward Points on match days",
                "Lounge access & Movie perks"
            ],
            bestFor: "Football & MU Fans",
            fee: "₹499 (Waived on criteria)",
            rating: 4.1,
            image: ""
        },
        {
            id: 86,
            name: "Kotak Privy League",
            type: "Credit Card",
            color: "from-slate-700 to-blue-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "KOTAK MAHINDRA",
            benefits: [
                "Priority client treatment",
                "Unlimited Lounge Access (Select)",
                "Milestone rewards in cash",
                "Low interest starting from 0.75%"
            ],
            bestFor: "Premium Banking Clients",
            fee: "₹0 (Complimentary for Privy)",
            rating: 4.7,
            image: ""
        },
        {
            id: 87,
            name: "Yes Premia",
            type: "Credit Card",
            color: "from-blue-200 to-indigo-500",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "YES BANK",
            benefits: [
                "Complimentary Priority Pass (Select)",
                "8 Reward Points per ₹200 spent",
                "Fuel surcharge waiver",
                "Simple milestone based fee waiver"
            ],
            bestFor: "Middle Management Card",
            fee: "₹1,499 (Waived on spend)",
            rating: 4.2,
            image: ""
        },
        {
            id: 88,
            name: "Uni Pay 1/3rd",
            type: "Credit Card",
            color: "from-indigo-600 to-pink-500",
            category: "Student",
            country: "🇮🇳 India",
            bank: "SBM/UNI",
            benefits: [
                "Pay in 3 parts with no extra cost",
                "1% cashback if you pay in full",
                "No processing fee or hidden charges",
                "Modern app-only controls"
            ],
            bestFor: "Young Spenders & Students",
            fee: "₹0 (Always Free)",
            rating: 4.7,
            image: ""
        },
        {
            id: 89,
            name: "Fi Amplify",
            type: "Credit Card",
            color: "from-emerald-500 to-blue-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "FEDERAL/FI",
            benefits: [
                "Curated premium reward store",
                "5X on chosen brand categories",
                "Unlimited Lounge access (Select)",
                "Smart insights on spending"
            ],
            bestFor: "Modern Fintech Users",
            fee: "₹2,500 (Waived on spend)",
            rating: 4.6,
            image: ""
        },
        {
            id: 90,
            name: "Zolve Card",
            type: "Credit Card",
            color: "from-blue-900 to-slate-800",
            category: "Travel",
            country: "🇮🇳 India",
            bank: "ZOLVE/SBM",
            benefits: [
                "Works in India & USA instantly",
                "Building US Credit History from India",
                "Zero Forex markup",
                "Personalized wealth advice"
            ],
            bestFor: "Expats & US Travelers",
            fee: "₹0 (Life Time Free)",
            rating: 4.8,
            image: ""
        },
        {
            id: 91,
            name: "Stashfin Card",
            type: "Credit Card",
            color: "from-gray-700 to-gray-900",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "STASHFIN/SBM",
            benefits: [
                "Instant line of credit up to 5L",
                "Pay interest only on used funds",
                "Flat 1% cashback on all spends",
                "No joining or hidden fees"
            ],
            bestFor: "Emergency Funds & Flexibility",
            fee: "₹0 (Free Forever)",
            rating: 4.3,
            image: ""
        },
        {
            id: 92,
            name: "RBL Cookie",
            type: "Credit Card",
            color: "from-amber-200 to-amber-500",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "RBL BANK",
            benefits: [
                "Choose your own monthly rewards",
                "Up to 10% cashback on Zomato/Uber",
                "Flexible rewards tailored to you",
                "Zero joining fee for app users"
            ],
            bestFor: "Gen-Z Content Creators",
            fee: "₹0 (Life Time Free)",
            rating: 4.5,
            image: ""
        },
        {
            id: 93,
            name: "PNB Select",
            type: "Credit Card",
            color: "from-blue-800 to-red-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "PNB",
            benefits: [
                "Airport lounge access (Quarterly)",
                "Reward points on grocery & bill pay",
                "Personal accident insurance",
                "Simple milestone based fee waiver"
            ],
            bestFor: "Govt Employees & Households",
            fee: "₹500 (Waived on spend)",
            rating: 4.0,
            image: ""
        },
        {
            id: 94,
            name: "Canara Bank World",
            type: "Credit Card",
            color: "from-blue-700 to-yellow-600",
            category: "Personal",
            country: "🇮🇳 India",
            bank: "CANARA BANK",
            benefits: [
                "Worldwide acceptance via Mastercard",
                "Insurance cover up to 50L",
                "Simplified reward system",
                "No processing fee on EMI"
            ],
            bestFor: "Stable Public Sector Banking",
            fee: "₹999 (Waived on criteria)",
            rating: 3.9,
            image: ""
        },
        {
            id: 95,
            name: "IDFC FIRST FIRST",
            type: "Credit Card",
            color: "from-black to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "IDFC FIRST",
            benefits: [
                "Invite-only Metal Card",
                "1% Low Forex Markup",
                "Unlimited Global Lounge Access",
                "Private Wealth desk assistance"
            ],
            bestFor: "Global Wealth & Elites",
            fee: "₹0 (Invite Only / Elite)",
            rating: 5.0,
            image: ""
        },
        {
            id: 96,
            name: "HSBC Premier",
            type: "Credit Card",
            color: "from-red-700 to-slate-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HSBC BANK",
            benefits: [
                "World-class global banking perks",
                "Airport lounge access worldwide",
                "Exclusive luxury hotel offers",
                "Relationship manager included"
            ],
            bestFor: "Global High-Net Worth Group",
            fee: "₹0 (For Premier Clients)",
            rating: 4.8,
            image: ""
        },
        {
            id: 97,
            name: "RBL Monthly",
            type: "Credit Card",
            color: "from-indigo-500 to-indigo-800",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "RBL BANK",
            benefits: [
                "Pay zero interest per month",
                "Small monthly subscription fee",
                "Cashback on top 5 brands",
                "Simplified app experience"
            ],
            bestFor: "Subscription Lovers",
            fee: "₹99 / month",
            rating: 4.2,
            image: ""
        },
        {
            id: 98,
            name: "Citibank Prestige",
            type: "Credit Card",
            color: "from-slate-700 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "CITI (Legacy/AXIS)",
            benefits: [
                "Exclusive airport meet & greet",
                "1 complimentary night at any hotel",
                "Accelerated travel points",
                "Concierge & Luxury Lifestyle"
            ],
            bestFor: "Legacy Luxury Travelers",
            fee: "₹20,000 + GST",
            rating: 4.9,
            image: ""
        },
        {
            id: 99,
            name: "Citibank Rewards",
            type: "Credit Card",
            color: "from-blue-600 to-blue-900",
            category: "Shopping",
            country: "🇮🇳 India",
            bank: "CITI (Legacy/AXIS)",
            benefits: [
                "10X Points on Departmental Stores",
                "Points that never expire",
                "Instant redemption at 100+ stores",
                "Lounge access (Selective)"
            ],
            bestFor: "Loyal Rewards Shoppers",
            fee: "₹1,000 (Waived on spend)",
            rating: 4.3,
            image: ""
        },
        {
            id: 100,
            name: "HDFC Millennia Metal",
            type: "Credit Card",
            color: "from-blue-600 to-indigo-900",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "Upgraded Metal Card Experience",
                "5% Cashback on Top 10 Merchants",
                "Unlimited Lounge Access (Domestic)",
                "Paisa Vasool rewards on every swipe"
            ],
            bestFor: "Premium Daily Spends",
            fee: "₹1,000 (Waived on ₹2.5L spend)",
            rating: 4.8,
            image: ""
        },
        // --- USA ---
        {
            id: 101,
            name: "Chase Sapphire Preferred",
            type: "Credit Card",
            color: "from-blue-800 to-blue-950",
            category: "Travel",
            country: "🇺🇸 USA",
            bank: "CHASE",
            benefits: [
                "60,000 Bonus Points after $4,000 spend",
                "5x on travel purchased through Chase",
                "3x on dining and streaming services",
                "$50 Annual Ultimate Rewards Hotel Credit"
            ],
            bestFor: "Travel & Dining Rewards",
            fee: "$95 Annual Fee",
            rating: 4.9,
            image: ""
        },
        {
            id: 102,
            name: "Amex Platinum",
            type: "Credit Card",
            color: "from-slate-300 to-slate-500",
            category: "Luxury",
            country: "🇺🇸 USA",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "80,000 Membership Rewards points",
                "5x points on flights and hotels",
                "$200 Hotel Credit & $200 Airline Credit",
                "Global Lounge Collection access"
            ],
            bestFor: "Luxury Travel & Lifestyle",
            fee: "$695 Annual Fee",
            rating: 4.8,
            image: ""
        },
        {
            id: 103,
            name: "Capital One Venture X",
            type: "Credit Card",
            color: "from-indigo-700 to-purple-900",
            category: "Travel",
            country: "🇺🇸 USA",
            bank: "CAPITAL ONE",
            benefits: [
                "75,000 Bonus Miles on joining",
                "10x miles on hotels and rental cars",
                "$300 Annual Travel Credit",
                "Unlimited Lounge visits globally"
            ],
            bestFor: "Modern Global Travelers",
            fee: "$395 Annual Fee",
            rating: 4.9,
            image: ""
        },
        {
            id: 104,
            name: "Apple Card",
            type: "Credit Card",
            color: "from-white to-gray-200",
            category: "Personal",
            country: "🇺🇸 USA",
            bank: "GOLDMAN SACHS / APPLE",
            benefits: [
                "3% Daily Cash on Apple products",
                "2% Daily Cash when using Apple Pay",
                "Titanium metal card with no numbers",
                "Financial health tracker in Apple Wallet"
            ],
            bestFor: "Apple Ecosystem Users",
            fee: "$0 Annual Fee",
            rating: 4.7,
            image: ""
        },
        {
            id: 105,
            name: "Bilt Rewards",
            type: "Credit Card",
            color: "from-black to-slate-800",
            category: "Personal",
            country: "🇺🇸 USA",
            bank: "WELLS FARGO / BILT",
            benefits: [
                "Earn 1x points on Rent payments",
                "3x on dining & 2x on travel",
                "Points transferable to top airlines",
                "Building credit through rent"
            ],
            bestFor: "Renters & Travelers",
            fee: "$0 Annual Fee",
            rating: 4.8,
            image: ""
        },
        // --- UK ---
        {
            id: 201,
            name: "Amex Gold UK",
            type: "Credit Card",
            color: "from-yellow-600 to-yellow-900",
            category: "Travel",
            country: "🇬🇧 UK",
            bank: "AMERICAN EXPRESS",
            benefits: [
                "20,000 Membership Rewards points bonus",
                "2x points on flights & foreign currency",
                "Two complimentary airport lounge visits",
                "Deliveroo credits (£5 back twice a month)"
            ],
            bestFor: "Travel & Dining in UK",
            fee: "£160 (Free in Year 1)",
            rating: 4.7,
            image: ""
        },
        {
            id: 202,
            name: "Barclaycard Forward",
            type: "Credit Card",
            color: "from-blue-400 to-blue-600",
            category: "Student",
            country: "🇬🇧 UK",
            bank: "BARCLAYS",
            benefits: [
                "Designed for building credit history",
                "0% interest on purchases for 3 months",
                "Price drop on interest if you pay on time",
                "No annual fee"
            ],
            bestFor: "Credit Building & Students",
            fee: "£0 Annual Fee",
            rating: 4.4,
            image: ""
        },
        {
            id: 203,
            name: "Revolut Metal",
            type: "Credit Card",
            color: "from-slate-600 to-black",
            category: "Luxury",
            country: "🇬🇧 UK",
            bank: "REVOLUT",
            benefits: [
                "1% Cashback in any currency",
                "Free Lounge access & Concierge",
                "Unlimited Forex and Stock trading",
                "Exclusive 18g reinforced metal card"
            ],
            bestFor: "Global Wealth & Fintech",
            fee: "£12.99 / month",
            rating: 4.9,
            image: ""
        },

        // --- UAE ---
        {
            id: 301,
            name: "Emirates NBD Skywards Infinite",
            type: "Credit Card",
            color: "from-red-600 to-red-900",
            category: "Luxury",
            country: "🇦🇪 UAE",
            bank: "EMIRATES NBD",
            benefits: [
                "Up to 100,000 Skywards Miles Welcome",
                "Rotation of 50+ Global Airport Lounges",
                "Rotana Rewards Exclusive Membership",
                "Complimentary Golf access"
            ],
            bestFor: "Emirates High-Flyers",
            fee: "AED 2,999 Annual Fee",
            rating: 4.9,
            image: ""
        },
        {
            id: 228,
            name: "HSBC Cashback",
            type: "Credit Card",
            color: "from-red-500 to-red-800",
            category: "Personal",
            country: "🇦🇪 UAE",
            bank: "HSBC",
            benefits: [
                "10% Cashback on fuel and supermarkets",
                "3% Cashback on online shopping",
                "1% Cashback on all other spends",
                "No minimum spend requirement"
            ],
            bestFor: "Everyday UAE Expenses",
            fee: "AED 0 in Year 1",
            rating: 4.6,
            image: ""
        },
        // --- CANADA ---
        {
            id: 401,
            name: "Scotiabank Gold Amex",
            type: "Credit Card",
            color: "from-red-700 to-red-900",
            category: "Travel",
            country: "🇨🇦 Canada",
            bank: "SCOTIABANK",
            benefits: [
                "6 Scene+ points per $1 at Sobeys/Safeway",
                "No Foreign Transaction Fees",
                "5 points per $1 on Dining & Entertainment",
                "Comprehensive Travel Insurance"
            ],
            bestFor: "Groceries & International Travel",
            fee: "$120 Annual Fee",
            rating: 4.8,
            image: ""
        },
        // --- SINGAPORE ---
        {
            id: 501,
            name: "DBS Altitude",
            type: "Credit Card",
            color: "from-red-600 to-blue-900",
            category: "Travel",
            country: "🇸🇬 Singapore",
            bank: "DBS",
            benefits: [
                "Earn miles that never expire",
                "3 miles per $1 on online travel bookings",
                "2 complimentary lounge visits per year",
                "Eco-friendly card made of recycled plastic"
            ],
            bestFor: "Frequent Travelers",
            fee: "S$194.40 (Waived for Year 1)",
            rating: 4.7,
            image: ""
        },
        // --- AUSTRALIA ---
        {
            id: 601,
            name: "Westpac Altitude Black",
            type: "Credit Card",
            color: "from-red-500 to-slate-900",
            category: "Luxury",
            country: "🇦🇺 Australia",
            bank: "WESTPAC",
            benefits: [
                "Earn Qantas or Altitude Points",
                "2 complimentary lounge visits per year",
                "Travel insurance for you and family",
                "Personal concierge service"
            ],
            bestFor: "Premium Rewards & Qantas Miles",
            fee: "$250 Annual Fee",
            rating: 4.7,
            image: ""
        },
        // --- INDIA PREMIUM ---
        {
            id: 231,
            name: "HDFC Infinia Metal",
            type: "Credit Card",
            color: "from-slate-900 to-black",
            category: "Luxury",
            country: "🇮🇳 India",
            bank: "HDFC BANK",
            benefits: [
                "Unlimited Lounge Access Worldwide",
                "1+1 on Movie Tickets & Dining",
                "Global Concierge 24x7",
                "Lowest Forex Markup (2%)"
            ],
            bestFor: "Ultra-High Net Worth",
            fee: "₹12,500 + Taxes",
            rating: 5.0,
            image: ""
        },
        // --- JAPAN ---
        {
            id: 801,
            name: "Rakuten Card",
            type: "Credit Card",
            color: "from-red-600 to-red-800",
            category: "Personal",
            country: "🇯🇵 Japan",
            bank: "RAKUTEN",
            benefits: [
                "1% point back on every 100 JPY",
                "3x points on Rakuten Ichiba",
                "Overseas travel insurance",
                "No annual fee"
            ],
            bestFor: "Everyday Spends & Shopping",
            fee: "0 JPY (Lifetime)",
            rating: 4.8,
            image: ""
        },
        // --- HONG KONG ---
        {
            id: 901,
            name: "HSBC Red Credit Card",
            type: "Credit Card",
            color: "from-red-700 to-red-950",
            category: "Personal",
            country: "🇭🇰 Hong Kong",
            bank: "HSBC HK",
            benefits: [
                "4% RewardCash on online shopping",
                "No minimum spend requirement",
                "Points never expire",
                "Instant approval through app"
            ],
            bestFor: "Online Shoppers in HK",
            fee: "$0 Annual Fee",
            rating: 4.9,
            image: ""
        }
    ];

    const categories = ['All', 'Travel', 'Student', 'Shopping', 'Luxury', 'Personal'];
    const countries = ['🇮🇳 India', '🇺🇸 USA', '🇬🇧 UK', '🇦🇪 UAE', '🇨🇦 Canada', '🇪🇺 Europe', '🇯🇵 Japan', '🇭🇰 Hong Kong', '🇸🇬 Singapore', '🇦🇺 Australia', 'Global'];

    const filteredCards = cardData.filter(card => {
        const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
        const matchesCountry = selectedCountry === 'Global' || card.country === selectedCountry;
        const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.bank.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesCountry && matchesSearch;
    });

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Area */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center md:text-left flex-1"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 tracking-widest uppercase">
                                <CreditCard size={14} />
                                <span>Global Card Intelligence</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                                The World's <span className="text-gradient">Card Vault</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                                Search and filter through 1,000+ cards from India, USA, UK, and beyond.
                                Find the perfect plastic for your persona.
                            </p>
                        </motion.div>

                    </div>
                </div>

                {/* Search Row */}
                <div className="flex flex-col gap-6 mb-12">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto w-full group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                            <Search size={22} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by card name or bank (e.g. Amex, HDFC, SBI)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-14 pr-20 text-white focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all text-lg font-medium shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                        />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 border border-white/10 text-gray-500 font-mono text-xs font-bold">
                                <span>⌘</span>
                                <span>K</span>
                            </kbd>
                        </div>
                    </div>

                    {/* Category Filter Section */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {['All', 'Travel', 'Student', 'Shopping', 'Luxury', 'Personal'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-primary text-background'
                                    : 'bg-white/5 text-gray-500 border border-white/5 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                {filteredCards.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {filteredCards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    className="group"
                                >
                                    <div className="glass h-full rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col hover:border-primary/20 transition-colors duration-500">
                                        <div className="p-6 pb-0">
                                            <div className={`relative h-48 w-full rounded-2xl bg-gradient-to-br ${card.color} p-6 shadow-2xl transform group-hover:rotate-2 group-hover:-translate-y-2 transition-transform duration-500 overflow-hidden`}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                                <div className="relative h-full flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-10 h-8 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-80 shadow-inner" />
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-[10px] font-black tracking-widest text-white/60 mb-1">{card.bank}</div>
                                                            <div className="text-[8px] font-bold text-white/40">{card.country}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-bold tracking-widest mb-1 shadow-sm">{card.name}</div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-5 rounded bg-white/20"></div>
                                                            <div className="text-[10px] font-mono text-white/40">•••• •••• •••• {card.id.toString().padStart(4, '0')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-primary uppercase tracking-wider">{card.category}</span>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star size={14} fill="currentColor" />
                                                    <span className="text-sm font-bold text-white">{card.rating}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{card.name}</h3>
                                            <p className="text-xs text-gray-500 font-bold mb-6 flex items-center gap-1">
                                                <Zap size={14} className="text-secondary" />
                                                Best for: {card.bestFor}
                                            </p>

                                            <div className="space-y-3 mb-8 flex-1">
                                                {card.benefits.map((benefit, i) => (
                                                    <div key={i} className="flex gap-3 text-sm text-gray-300">
                                                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                                                        <span>{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-black text-gray-500 uppercase">Annual Fee</span>
                                                    <span className="text-sm font-bold text-white">{card.fee}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const freshHistory = openChat(card);
                                                        askAiExpert(card, null, freshHistory);
                                                    }}
                                                    className="w-full bg-primary/10 hover:bg-primary/20 border border-primary/30 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-primary transition-all duration-300"
                                                >
                                                    <Sparkles size={16} /> Ask AI Expert
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 glass rounded-[3rem] border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="text-gray-600" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No cards found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query.</p>
                        <button
                            onClick={() => { setSelectedCategory('All'); setSelectedCountry('Global'); setSearchQuery(''); }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}



                {/* AI Assistant Side Panel */}
                <AnimatePresence>
                    {activeAiCard && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="fixed bottom-24 right-8 w-80 z-40 flex flex-col"
                        >
                            <div className="bg-background border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[450px]">
                                {/* Chat Header - Sleeker Professional Design */}
                                <div className="bg-primary p-5 flex justify-between items-center bg-gradient-to-r from-primary to-yellow-500">
                                    <div className="flex items-center gap-3 text-background">
                                        <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center">
                                            <Sparkles size={20} className="fill-current" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black tracking-tight leading-none uppercase">Gullak AI</h4>
                                            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-0.5">Expert Advisor</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveAiCard(null)}
                                        className="text-background/80 hover:text-background p-1.5 transition-all"
                                    >
                                        <X size={24} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Chat Messages Area - Professional spacing & smaller text */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0a0a]">
                                    {chatHistory.map((msg, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[90%] p-2.5 rounded-xl text-[11px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                                                ? 'bg-primary text-background font-black rounded-tr-none'
                                                : 'bg-white/5 text-gray-400 border border-white/10 rounded-tl-none font-bold'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isAiLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input Area - Compact & Professional */}
                                <div className="p-4 bg-background border-t border-white/5">
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            placeholder="Optimize my finances..."
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-600"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && aiInput.trim()) {
                                                    askAiExpert(activeAiCard, aiInput);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => aiInput.trim() && askAiExpert(activeAiCard, aiInput)}
                                            className="bg-primary text-background p-2 px-3 rounded-xl hover:bg-yellow-500 transition-colors shadow-md flex items-center justify-center"
                                        >
                                            <ChevronRight size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-[8px] text-gray-700 text-center font-black uppercase tracking-widest">Proudly Made in India</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Chat Button - Sleek Glass Pill Design */}
                {!activeAiCard && (
                    <motion.button
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openChat()}
                        className="fixed bottom-10 right-10 flex items-center gap-3 px-6 py-4 bg-background/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] group overflow-hidden z-50 ring-1 ring-white/5"
                    >
                        {/* Interactive Aura Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                            <Sparkles size={18} className="text-primary fill-primary/20 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="relative flex flex-col items-start pr-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Gullak AI</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Open Card Expert</span>
                        </div>

                        {/* Decorative 'Active' dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                    </motion.button>
                )}

            </div >
        </div >
    );
};

export default CardDemo;
