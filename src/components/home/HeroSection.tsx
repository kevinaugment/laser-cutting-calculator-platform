/**
 * Hero Section Component for HomePage
 * 
 * Extracted from HomePage to reduce bundle size and improve loading performance.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Calculator, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Laser Cutting Calculator Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            27 Free Calculators - Reduce Costs 30% & Boost Efficiency 40%
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Transform your laser cutting operations with our comprehensive suite of 27 professional-grade calculators.
            Developed by certified laser cutting engineers with 15+ years of industry experience, our tools provide
            precision calculations for material optimization, production planning, quality control, and cost reduction.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Calculator className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">27 Professional Tools</h3>
            <p className="text-gray-600">Complete calculator suite covering all aspects of laser cutting operations</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">30% Cost Reduction</h3>
            <p className="text-gray-600">Proven results from 10,000+ manufacturing professionals worldwide</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <ArrowRight className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">40% Efficiency Boost</h3>
            <p className="text-gray-600">Streamline operations with intelligent automation and optimization</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            to="/calculators"
            title="Explore All 27 Laser Cutting Calculators - Complete Professional Toolkit"
            aria-label="Access complete collection of 27 specialized laser cutting calculators"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start Calculating Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Link
            to="/epic/core-engineering"
            title="Browse Core Engineering Calculators - Essential Tools for Laser Cutting"
            aria-label="Access core engineering calculators for fundamental laser cutting operations"
          >
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50 hover:text-blue-600 px-8 py-3">
              Browse by Category
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-12 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-6">Trusted by manufacturing professionals worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400 font-semibold">10,000+ Users</div>
            <div className="text-gray-400 font-semibold">15+ Years Experience</div>
            <div className="text-gray-400 font-semibold">27 Calculators</div>
            <div className="text-gray-400 font-semibold">100% Free</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
