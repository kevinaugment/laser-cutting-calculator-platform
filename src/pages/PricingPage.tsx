/**
 * Pricing Page Component
 * Displays pricing tiers and subscription options
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  X,
  Star,
  Users,
  Zap,
  Shield,
  Headphones,
  Download,
  BarChart3,
  Settings,
  Crown,
  ArrowRight,
  Calculator,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

// Pricing tier interface
interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  cta: string;
  calculatorCount: number;
  calculationsPerMonth: number | 'unlimited';
  support: string;
  exports: string[];
  advanced: string[];
}

// Pricing tiers configuration
const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with basic laser cutting calculations',
    calculatorCount: 5,
    calculationsPerMonth: 10,
    support: 'Community support',
    exports: ['PDF'],
    advanced: [],
    features: [
      '5 core calculators',
      '10 calculations per month',
      'Basic PDF export',
      'Community support',
      'Mobile responsive',
      'Basic tutorials'
    ],
    limitations: [
      'Limited calculator access',
      'Monthly calculation limit',
      'No parameter presets',
      'No calculation history',
      'No advanced analytics'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 19,
    period: 'month',
    description: 'For professionals who need full access to all calculators and features',
    calculatorCount: 27,
    calculationsPerMonth: 'unlimited',
    support: 'Priority email support',
    exports: ['PDF', 'Excel', 'CSV'],
    advanced: ['Parameter presets', 'Calculation history', 'Advanced analytics'],
    popular: true,
    features: [
      'All 27 professional calculators',
      'Unlimited calculations',
      'Advanced export options (PDF, Excel, CSV)',
      'Parameter presets and templates',
      'Complete calculation history',
      'Advanced analytics and insights',
      'Priority email support',
      'Video tutorials and guides',
      'Mobile app access',
      'Offline calculation capability'
    ],
    limitations: [
      'Single user account',
      'No team collaboration',
      'No API access',
      'Standard branding'
    ],
    cta: 'Start Pro Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For teams and organizations requiring collaboration and advanced features',
    calculatorCount: 27,
    calculationsPerMonth: 'unlimited',
    support: 'Dedicated support manager',
    exports: ['PDF', 'Excel', 'CSV', 'API'],
    advanced: ['Team collaboration', 'API access', 'Custom branding', 'SSO'],
    features: [
      'Everything in Professional',
      'Team collaboration features',
      'Shared parameter libraries',
      'Team analytics dashboard',
      'API access for integrations',
      'Custom branding options',
      'Single Sign-On (SSO)',
      'Dedicated support manager',
      'Custom training sessions',
      'Priority feature requests',
      'Advanced security features',
      'Compliance reporting'
    ],
    limitations: [],
    cta: 'Contact Sales'
  }
];

// Feature comparison data
const featureComparison = [
  { feature: 'Core Calculators', free: '5', pro: '27', enterprise: '27' },
  { feature: 'Monthly Calculations', free: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Export Formats', free: 'PDF', pro: 'PDF, Excel, CSV', enterprise: 'PDF, Excel, CSV, API' },
  { feature: 'Parameter Presets', free: false, pro: true, enterprise: true },
  { feature: 'Calculation History', free: false, pro: true, enterprise: true },
  { feature: 'Advanced Analytics', free: false, pro: true, enterprise: true },
  { feature: 'Team Collaboration', free: false, pro: false, enterprise: true },
  { feature: 'API Access', free: false, pro: false, enterprise: true },
  { feature: 'Custom Branding', free: false, pro: false, enterprise: true },
  { feature: 'SSO Integration', free: false, pro: false, enterprise: true },
  { feature: 'Support Level', free: 'Community', pro: 'Priority Email', enterprise: 'Dedicated Manager' }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Calculate yearly discount (20% off)
  const getPrice = (tier: PricingTier) => {
    if (tier.price === 0) return 0;
    return billingPeriod === 'yearly' ? Math.round(tier.price * 12 * 0.8) : tier.price;
  };

  const getPeriodText = (tier: PricingTier) => {
    if (tier.price === 0) return tier.period;
    return billingPeriod === 'yearly' ? 'year' : tier.period;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Laser Cutting Calculator Platform",
    "description": "Professional laser cutting calculator platform with 27 specialized calculators",
    "offers": pricingTiers.map(tier => ({
      "@type": "Offer",
      "name": tier.name,
      "price": getPrice(tier),
      "priceCurrency": "USD",
      "description": tier.description
    }))
  };

  return (
    <>
      <SEOHead
        title="Pricing Plans - Laser Cutting Calculator Platform"
        description="Choose the perfect plan for your laser cutting needs. Free tier available with 5 calculators, Professional plan with all 27 calculators, and Enterprise plan with team features."
        keywords="laser cutting calculator pricing, subscription plans, professional laser tools, enterprise laser software, calculator pricing tiers"
        canonical="/pricing"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our professional-grade calculators 
              designed by laser cutting experts.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  tier.popular 
                    ? 'border-blue-500 scale-105' 
                    : selectedTier === tier.id 
                      ? 'border-blue-300' 
                      : 'border-gray-200'
                }`}
                onMouseEnter={() => setSelectedTier(tier.id)}
                onMouseLeave={() => setSelectedTier(null)}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-500 text-white">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Tier Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900">${getPrice(tier)}</span>
                      {tier.price > 0 && (
                        <span className="text-gray-500">/{getPeriodText(tier)}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{tier.calculatorCount}</div>
                      <div className="text-sm text-gray-600">Calculators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {tier.calculationsPerMonth === 'unlimited' ? '∞' : tier.calculationsPerMonth}
                      </div>
                      <div className="text-sm text-gray-600">Calculations</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                    <ul className="space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <button
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        tier.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
            <div className="px-8 py-6 bg-gray-50 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Feature Comparison</h3>
              <p className="text-gray-600 mt-2">Compare all features across our pricing tiers</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Professional</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {typeof item.free === 'boolean' ? (
                          item.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          item.free
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          item.pro
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-400 mx-auto" />
                        ) : (
                          item.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600">Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 p-8 bg-blue-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-6">Join thousands of professionals using our calculators to optimize their laser cutting operations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-blue-400 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Sales
                <Headphones className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
