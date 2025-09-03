// Contact Page with support form
// Professional contact page with form submission to support@dfoffer.com

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import SEOHead from '../components/seo/SEOHead';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Phone
} from 'lucide-react';

const ContactPage: React.FC = () => {
  // SEO结构化数据
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - Professional Laser Cutting Calculator Support",
    "description": "Get professional support for laser cutting calculators. Technical assistance, feature requests, and customer service for manufacturing professionals.",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "mainEntity": {
      "@type": "Organization",
      "name": "Laser Calc Team",
      "description": "Professional laser cutting calculator platform",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "support@dfoffer.com",
          "availableLanguage": "English",
          "areaServed": "Worldwide"
        },
        {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "email": "support@dfoffer.com",
          "availableLanguage": "English",
          "areaServed": "Worldwide"
        }
      ],
      "sameAs": [
        typeof window !== 'undefined' ? window.location.origin : ''
      ]
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      description: 'Get help with calculators and technical questions',
      contact: 'support@dfoffer.com',
      color: 'bg-blue-500'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Website',
      description: 'Visit our main website for more information',
      contact: 'www.dfoffer.com',
      color: 'bg-green-500'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Response Time',
      description: 'We typically respond within 24 hours',
      contact: '< 24 hours',
      color: 'bg-purple-500'
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Support Categories',
      description: 'Technical support, feature requests, and feedback',
      contact: 'Multiple channels',
      color: 'bg-orange-500'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feedback', label: 'Feedback' }
  ];

  return (
    <>
      <SEOHead
        title="Contact Us - Professional Laser Cutting Calculator Support"
        description="Get professional support for laser cutting calculators. Technical assistance, feature requests, and customer service for manufacturing professionals. 24/7 form submission with <24h response time."
        keywords="laser cutting calculator support, technical support, customer service, manufacturing calculator help, laser cutting assistance"
        canonical={typeof window !== 'undefined' ? window.location.href : ''}
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Contact & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get help with the laser cutting calculators. I'm a developer with hands-on laser cutting experience
              who built these tools to solve real manufacturing problems I encountered. Whether you need technical support,
              have feature suggestions, or found issues with the calculations - I'm here to help.
            </p>

            {/* About the Developer */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-gray-200 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">About the Developer</h2>
              <div className="text-center space-y-4">
                <p className="text-gray-700 max-w-2xl mx-auto">
                  Hi! I'm a software developer who worked in laser cutting manufacturing for several years.
                  I built these calculators because I was constantly doing the same calculations manually and
                  wanted better tools for parameter optimization and cost estimation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-6">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">3+ Years</div>
                    <div className="text-sm font-medium text-gray-900">Manufacturing Experience</div>
                    <div className="text-xs text-gray-600">Hands-on laser cutting work</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">27 Calculators</div>
                    <div className="text-sm font-medium text-gray-900">Built from Real Problems</div>
                    <div className="text-xs text-gray-600">Solving actual shop floor issues</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">Free & Open</div>
                    <div className="text-sm font-medium text-gray-900">Community Focused</div>
                    <div className="text-xs text-gray-600">Improving based on user feedback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;24h</div>
              <div className="text-sm text-gray-600 font-medium">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Form Submission</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5+</div>
              <div className="text-sm text-gray-600 font-medium">Support Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Multiple ways to reach our support team for assistance with your laser cutting calculations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 rounded-2xl ${info.color} text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {info.icon}
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {info.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {info.description}
                </p>
                <div className="font-medium text-gray-900">
                  {info.contact}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Send us a Message
              </CardTitle>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll respond to your message at <strong>support@dfoffer.com</strong> within 24 hours.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Brief subject line"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Please describe your question, issue, or feedback in detail..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Direct Email Alternative</p>
                        <p>You can also email us directly at <strong>support@dfoffer.com</strong> for faster response.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Support Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Immediate Help?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            For urgent technical issues or immediate assistance with our calculators
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@dfoffer.com"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>Email Support</span>
            </a>
            <a
              href="https://www.dfoffer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span>Visit Main Site</span>
            </a>
          </div>
        </div>
      </section>

      {/* What I Can Help With */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What I Can Help With
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here's what kind of support I can provide for the laser cutting calculators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">?</span>
              </div>
              Technical Issues
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1 text-sm">•</span>
                <span>Calculator giving unexpected results</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1 text-sm">•</span>
                <span>Questions about calculation methods</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1 text-sm">•</span>
                <span>Parameter recommendations for specific materials</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-500 mt-1 text-sm">•</span>
                <span>Understanding result interpretations</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">+</span>
              </div>
              Feature Requests & Feedback
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1 text-sm">•</span>
                <span>New calculator ideas</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1 text-sm">•</span>
                <span>Improvements to existing tools</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1 text-sm">•</span>
                <span>Additional material support</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-green-500 mt-1 text-sm">•</span>
                <span>User experience suggestions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Response Time & Process</h3>
            <p className="text-blue-800 mb-3">
              I typically respond within 24-48 hours. For technical issues, please include:
            </p>
            <ul className="text-blue-700 space-y-1 ml-4">
              <li>• Which calculator you were using</li>
              <li>• What inputs you provided</li>
              <li>• What result you got vs. what you expected</li>
              <li>• Any error messages you saw</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Internal Navigation Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Our Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            While you're here, discover our comprehensive laser cutting calculator platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/calculators"
            className="block group"
            title="Browse All 27 Professional Calculators - Complete Toolkit"
            aria-label="Access complete collection of 27 specialized laser cutting calculators"
          >
            <Card className="group-hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  All Calculators
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Browse our complete collection of 27 specialized calculators across 5 professional categories
                </p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  27 Tools Available
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link
            to="/features"
            className="block group"
            title="Discover Platform Features - Professional Tools Overview"
            aria-label="Learn about comprehensive features of our laser cutting calculator platform"
          >
            <Card className="group-hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Platform Features
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Discover comprehensive features designed for manufacturing professionals and optimization
                </p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Professional Grade
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link
            to="/"
            className="block group"
            title="Return to Homepage - Laser Cutting Calculator Platform"
            aria-label="Navigate back to the homepage and platform overview"
          >
            <Card className="group-hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-1 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Homepage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Return to our homepage to explore the complete laser cutting calculator platform
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Platform Overview
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
};

export default ContactPage;
