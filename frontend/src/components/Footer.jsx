import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { developerInfo } from '../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3 className="footer-name">{developerInfo.name}</h3>
            <div className="footer-title">{developerInfo.title}</div>
            <p className="footer-desc">
              Building modern web applications powered by thoughtful design and intelligent technology.
            </p>
          </div>

          {/* Nav Links */}
          <div className="footer-links-group">
            <div className="footer-links-col">
              <h4>Navigation</h4>
              <ul className="footer-nav-list">
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className="footer-nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Connect</h4>
              <ul className="footer-nav-list">
                <li>
                  <a
                    href={developerInfo.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={developerInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-nav-link"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${developerInfo.socialLinks.email}`}
                    className="footer-nav-link"
                  >
                    Email Me
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Ibrahim Tanveer. All rights reserved.
          </div>

          <div className="footer-social-icons">
            <a
              href={developerInfo.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              style={{ width: '36px', height: '36px' }}
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href={developerInfo.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              style={{ width: '36px', height: '36px' }}
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`mailto:${developerInfo.socialLinks.email}`}
              className="btn-icon"
              style={{ width: '36px', height: '36px' }}
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <button
              onClick={scrollToTop}
              className="btn-icon"
              style={{ width: '36px', height: '36px', marginLeft: '8px' }}
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
