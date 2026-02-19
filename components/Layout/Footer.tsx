"use client";

import { motion } from "framer-motion";
import { Mountain, Mail, Instagram } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/skijobss", label: "Instagram" },
    { icon: Mail, href: "mailto:customsites21@gmail.com", label: "Email" },
  ];

  const footerLinks = {
    "Quick Links": [
      { label: "Browse Jobs", href: "#jobs" },
      { label: "View Map", href: "#jobs" },
      { label: "About", href: "#about" },
    ],
    "Resort Partners": [
      { label: "Vail Resorts (Epic Pass)", href: "https://www.vailresortscareers.com" },
      { label: "Alterra (Ikon Pass)", href: "https://jobs.alterramtnco.com" },
      { label: "Boyne Resorts", href: "https://careers.boyneresorts.com" },
    ],
    "Resources": [
      { label: "All Resorts", href: "#resorts" },
      { label: "Housing Info", href: "#jobs" },
      { label: "Contact", href: "#contact" },
    ],
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                SkiJobs
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting passionate individuals with dream careers at world-class ski
              resorts.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/10 transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 SkiJobs. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-500 text-sm">
            <a href="#about" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#about" className="hover:text-cyan-400 transition-colors">Terms</a>
            <span>•</span>
            <p className="text-gray-500">Made with ❄️ for the ski community</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
