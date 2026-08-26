'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Globe,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const offices = [
    {
      city: 'Lagos Office & Gallery',
      country: 'Nigeria 🇳🇬',
      address: '14 Queen Amina Way, Victoria Island, Lagos',
      phone: '+234 1 888 2783',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM WAT'
    },
    {
      city: 'Accra Curatorial Hub',
      country: 'Ghana 🇬🇭',
      address: '7 Kwame Nkrumah Avenue, Airport Residential, Accra',
      phone: '+233 30 299 4410',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM GMT'
    },
    {
      city: 'Johannesburg Regional Bureau',
      country: 'South Africa 🇿🇦',
      address: '42 Jan Smuts Avenue, Rosebank, Johannesburg',
      phone: '+27 11 447 9002',
      hours: 'Mon – Fri: 9:00 AM – 5:30 PM SAST'
    },
    {
      city: 'London Representative Office',
      country: 'United Kingdom 🇬🇧',
      address: '28 Old Bond Street, Mayfair, London W1S 4DR',
      phone: '+44 20 7946 0880',
      hours: 'Mon – Fri: 9:00 AM – 5:00 PM GMT'
    }
  ];

  const contactChannels = [
    {
      title: 'Customer Support & Orders',
      email: 'support@artellium.com',
      desc: 'Assistance with orders, delivery tracking, payments, and website help.'
    },
    {
      title: 'Art Acquisitions & Private Sales',
      email: 'sales@artellium.com',
      desc: 'Private viewings, bespoke acquisitions, and corporate collections.'
    },
    {
      title: 'Artist Consignments & Roster',
      email: 'artists@artellium.com',
      desc: 'Artist applications, portfolio reviews, and gallery representation.'
    },
    {
      title: 'Press & Media Relations',
      email: 'press@artellium.com',
      desc: 'Media inquiries, press kits, interview requests, and event partnerships.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#07080A] text-slate-300 pb-24 font-sans">
      
      {/* Top Breadcrumb & Page Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0B0D13] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-art-gold hover:text-art-black text-slate-400 text-xs font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-art-gold font-mono uppercase tracking-wider">Contact Us</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide">
              Contact Artellium
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
              Have questions about an artwork, need help with an order, or interested in partnering with us? Reach out through any of our channels below.
            </p>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* Contact Email Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactChannels.map((channel, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0D1017] border border-white/10 p-6 space-y-3 shadow-lg flex flex-col justify-between hover:border-art-gold/40 transition"
            >
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-white text-base">
                  {channel.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {channel.desc}
                </p>
              </div>

              <a
                href={`mailto:${channel.email}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-art-gold hover:underline pt-2"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{channel.email}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form & Office Locations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Clean, Standard Contact Form */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0D1017] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-art-gold" />
                <span>Send Us a Message</span>
              </h2>
              <p className="text-xs text-slate-400">
                Fill in the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 p-8 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Thank You for Reaching Out!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your message has been received. One of our team members will respond to <strong className="text-art-gold">{formData.email}</strong> shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', inquiryType: 'general', subject: '', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/10 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Inquiry Type</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-art-gold transition cursor-pointer"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="buying">Buying Art / Private Acquisition</option>
                      <option value="selling">Selling / Consigning Artwork</option>
                      <option value="orders">Order & Delivery Assistance</option>
                      <option value="press">Press & Partnerships</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of your inquiry..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#08090D] border border-white/15 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-art-gold hover:bg-[#E5BE38] text-art-black font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* Right: Office Locations & Business Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#0D1017] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="space-y-1 border-b border-white/10 pb-3">
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-art-gold" />
                  <span>Our Locations</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Visit our offices and partner galleries across Africa and Europe.
                </p>
              </div>

              <div className="space-y-5">
                {offices.map((office, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-serif text-sm">
                        {office.city}
                      </span>
                      <span className="text-slate-400 font-sans text-[11px]">{office.country}</span>
                    </div>

                    <p className="text-slate-400 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-art-gold shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>

                    <p className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{office.phone}</span>
                    </p>

                    <p className="text-slate-500 flex items-center gap-1.5 font-mono text-[10px]">
                      <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{office.hours}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help Card */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3.5 text-xs">
              <div className="w-9 h-9 rounded-xl bg-art-gold/10 text-art-gold flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Looking for Frequently Asked Questions?</span>
                <span className="text-slate-400 text-[11px]">
                  Learn more about our <Link href="/policies" className="text-art-gold hover:underline">buyer protection</Link> and authentication process.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
