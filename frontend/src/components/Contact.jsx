import React, { useState } from 'react';
import { Send, Mail, Github, Linkedin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { developerInfo } from '../data/portfolioData';
import { parseApiResponse } from '../utils/apiHelper';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_type: 'AI Web App',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        error: 'Please fill in all required fields.',
        message: ''
      });
      return;
    }

    setStatus({ submitting: true, success: false, error: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await parseApiResponse(response);

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to submit inquiry. Please try again.');
      }

      setStatus({
        submitting: false,
        success: true,
        error: null,
        message: data.message || 'Thank you for reaching out, Ibrahim will get back to you shortly!'
      });

      // Clear form on success
      setFormData({
        name: '',
        email: '',
        project_type: 'AI Web App',
        message: ''
      });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'An unexpected error occurred. Please try again or email directly.',
        message: ''
      });
    }
  };

  return (
    <section id="contact" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="contact-wrapper">
          {/* Left Column: Direct Info & Socials */}
          <div className="contact-info-col">
            <span className="section-tag">Get In Touch</span>
            <h2 className="contact-heading">Let's Build Something Great</h2>
            <p className="contact-intro-text">
              Have an idea for an AI-powered web application or a modern digital product? Let's turn it into reality.
            </p>

            <div className="contact-channels">
              <a
                href={`mailto:${developerInfo.socialLinks.email}`}
                className="contact-channel-card"
              >
                <div className="channel-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="channel-text-title">Email Directly</div>
                  <div className="channel-text-val">{developerInfo.socialLinks.email}</div>
                </div>
              </a>

              <a
                href={developerInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-card"
              >
                <div className="channel-icon">
                  <Github size={20} />
                </div>
                <div>
                  <div className="channel-text-title">GitHub Profile</div>
                  <div className="channel-text-val">github.com/ibrahimtanveer</div>
                </div>
              </a>

              <a
                href={developerInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-card"
              >
                <div className="channel-icon">
                  <Linkedin size={20} />
                </div>
                <div>
                  <div className="channel-text-title">LinkedIn Profile</div>
                  <div className="channel-text-val">linkedin.com/in/ibrahimtanveer</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-card">
            {status.success && (
              <div className="form-alert success">
                <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
                <span>{status.message}</span>
              </div>
            )}

            {status.error && (
              <div className="form-alert error">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={status.submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  disabled={status.submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-project-type">
                  Project Type
                </label>
                <select
                  id="contact-project-type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  className="form-select"
                  disabled={status.submitting}
                >
                  <option value="AI Web App">AI-Powered Web Application</option>
                  <option value="Full-Stack Web Platform">Full-Stack Web Platform</option>
                  <option value="Business Website">Business Website</option>
                  <option value="Admin Dashboard">Admin Dashboard / Inventory Portal</option>
                  <option value="AI Model Integration">AI Model / API Integration</option>
                  <option value="Other Project">Other Custom Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Project Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows="4"
                  placeholder="Describe your project requirements, timeline, or objectives..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  disabled={status.submitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={status.submitting}
              >
                {status.submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
