// frontend/src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Twitter,
  Instagram,
  Github,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import Button from "../../ui/Button";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-serif font-bold text-lg group-hover:bg-neutral-800 transition-colors">
                B
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">
                Blogify.
              </span>
            </Link>

            <p className="text-secondary leading-relaxed">
              Curated insights for the modern developer. Weekly articles on
              technology, leadership, and code.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3 pt-2">
               <h4 className="text-sm font-semibold text-primary">Subscribe to our newsletter</h4>
               <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-primary placeholder-secondary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="small" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-primary mb-6">Navigation</h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/blog", label: "Articles" },
                { to: "/categories", label: "Topics" },
                { to: "/about", label: "About" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-secondary hover:text-primary transition-colors hover:underline decoration-1 underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-primary mb-6">Resources</h3>
            <ul className="space-y-3">
              {[
                { to: "#", label: "Documentation" },
                { to: "#", label: "Guides" },
                { to: "#", label: "Support" },
                { to: "#", label: "API Status" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="text-secondary hover:text-primary transition-colors hover:underline decoration-1 underline-offset-4"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-semibold text-primary mb-6">Connect</h3>
            <div className="flex gap-4 mb-6">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Github, label: "GitHub" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-secondary hover:text-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="text-sm text-secondary space-y-2">
               <p>hello@blogify.com</p>
               <p>San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
          <div>© {currentYear} Blogify Inc.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;