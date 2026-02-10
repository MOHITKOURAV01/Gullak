import React from 'react';
import { Wallet, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="pt-24 pb-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <span className="text-xl font-bold">GULLAK</span>
                        <p className="text-gray-400 max-w-sm mb-8">
                            Empowering Indian families with expert financial intelligence. Smart tracking, smarter growth.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary">Features</a></li>
                            <li><a href="#" className="hover:text-primary">EMI Optimizer</a></li>
                            <li><a href="#" className="hover:text-primary">Learning Hub</a></li>
                            <li><a href="#" className="hover:text-primary">Mobile App</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-primary">About Us</a></li>
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:row justify-between items-center pt-8 border-t border-white/5 text-gray-500 text-sm gap-4">
                    <p>© 2026 GULLAK. All rights reserved.</p>
                    <div className="flex gap-8">
                        <p>Made in Bharat | भारत में निर्मित</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
