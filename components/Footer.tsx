
import React from 'react';
import { Logo } from './Logo';
import { Twitter, Github, Linkedin, Disc as Discord } from 'lucide-react';
import { PageRoute } from '../types';

interface FooterProps {
    onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="py-20 bg-gray-50 dark:bg-[#030303] text-sm border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div onClick={() => onNavigate('home')} className="cursor-pointer inline-block">
                        <Logo />
                    </div>
                    <p className="text-gray-500 dark:text-neutral-500 leading-relaxed max-w-xs">
                        Visualizing the world's code, one repository at a time. Built for engineers, by engineers.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                            <Github size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                            <Discord size={18} />
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
                    <ul className="space-y-3 text-gray-500 dark:text-neutral-500 cursor-pointer">
                        <li><span onClick={() => onNavigate('visualizer')} className="hover:text-[#00d907] transition-colors">Visualizer</span></li>
                        <li><span onClick={() => onNavigate('integrations')} className="hover:text-[#00d907] transition-colors">Integrations</span></li>
                        <li><span onClick={() => onNavigate('pricing')} className="hover:text-[#00d907] transition-colors">Pricing</span></li>
                        <li><span onClick={() => onNavigate('changelog')} className="hover:text-[#00d907] transition-colors">Changelog</span></li>
                        <li><span onClick={() => onNavigate('enterprise')} className="hover:text-[#00d907] transition-colors">Enterprise</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Resources</h4>
                    <ul className="space-y-3 text-gray-500 dark:text-neutral-500 cursor-pointer">
                        <li><span onClick={() => onNavigate('docs')} className="hover:text-[#00d907] transition-colors">Documentation</span></li>
                        <li><span onClick={() => onNavigate('api')} className="hover:text-[#00d907] transition-colors">API Reference</span></li>
                        <li><span onClick={() => onNavigate('community')} className="hover:text-[#00d907] transition-colors">Community</span></li>
                        <li><span onClick={() => onNavigate('blog')} className="hover:text-[#00d907] transition-colors">Blog</span></li>
                        <li><span onClick={() => onNavigate('status')} className="hover:text-[#00d907] transition-colors">Status</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
                    <ul className="space-y-3 text-gray-500 dark:text-neutral-500 cursor-pointer">
                        <li><span onClick={() => onNavigate('privacy')} className="hover:text-[#00d907] transition-colors">Privacy Policy</span></li>
                        <li><span onClick={() => onNavigate('terms')} className="hover:text-[#00d907] transition-colors">Terms of Service</span></li>
                        <li><span onClick={() => onNavigate('cookies')} className="hover:text-[#00d907] transition-colors">Cookie Policy</span></li>
                        <li><span onClick={() => onNavigate('security')} className="hover:text-[#00d907] transition-colors">Security</span></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-neutral-600 font-mono">
                <p>&copy; {new Date().getFullYear()} Velocit Inc. All rights reserved.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        All Systems Operational
                    </span>
                </div>
            </div>
        </div>
    </footer>
  );
};
