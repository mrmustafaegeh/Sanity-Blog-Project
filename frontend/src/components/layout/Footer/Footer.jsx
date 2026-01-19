// frontend/src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Tag,
  Info,
  Mail,
  BookOpen,
  FileText,
  HelpCircle,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 pt-16 pb-8 px-4 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Blogify
              </span>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              A platform for writers, thinkers, and creators to share meaningful
              stories with the world.
            </p>

            {/* Newsletter Subscription */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Stay Updated
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                Get the latest articles delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-1">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <Tag className="w-4 h-4" />
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <Info className="w-4 h-4" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <BookOpen className="w-4 h-4" />
                  Guides & Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4" />
                  Support Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 hover:translate-x-1 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Connect With Us
            </h3>
            <p className="text-gray-400 mb-6">
              Follow us on social media for updates and discussions.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-blue-400/20 hover:border-blue-400/30 transition-all flex items-center justify-center group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-blue-600/20 hover:border-blue-600/30 transition-all flex items-center justify-center group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/30 transition-all flex items-center justify-center group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-pink-500" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-gray-700/50 hover:border-gray-500/30 transition-all flex items-center justify-center group"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-slate-800/50 border border-white/10 hover:bg-blue-700/20 hover:border-blue-700/30 transition-all flex items-center justify-center group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-700" />
              </a>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-gray-400 space-y-1">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                hello@blogify.com
              </p>
              <p>📞 +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by the Blogify team</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-emerald-400 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>

          <div>© {currentYear} Blogify. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;