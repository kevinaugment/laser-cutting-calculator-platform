import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const BeamQualityCalculatorFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "What is the difference between M² and beam parameter product (BPP)?",
      answer: "M² is a dimensionless beam quality factor that compares your beam to an ideal Gaussian beam (M² = 1.0). BPP is the product of beam radius and divergence angle, measured in mm·mrad. BPP = M² × (λ/π), so M² normalizes BPP by wavelength. Both describe beam quality, but M² is more commonly used for comparison between different lasers."
    },
    {
      question: "How accurate are the beam quality calculations?",
      answer: "The calculations are accurate to ±5% for M² factor and ±3% for focus spot size when input parameters are measured correctly. Accuracy depends on the quality of your beam measurements, environmental stability, and adherence to ISO 11146 measurement standards. Always validate with actual beam profiler measurements when possible."
    },
    {
      question: "Why is my fiber laser showing M² > 1.2 when it should be better?",
      answer: "Several factors can degrade fiber laser beam quality: poor fiber coupling alignment, contaminated fiber end faces, thermal effects in the fiber, or damage to the fiber core. Check fiber coupling optics alignment, clean fiber connectors, verify power levels are within specifications, and inspect for physical damage. Proper maintenance typically achieves M² = 1.05-1.15 for single-mode fibers."
    },
    {
      question: "How does beam quality affect cutting performance?",
      answer: "Better beam quality (lower M²) enables smaller focus spots, resulting in higher power density, faster cutting speeds, and better edge quality. A 20% improvement in M² can increase cutting speed by 15-25% and improve edge quality significantly. Poor beam quality limits maximum thickness capability and reduces process efficiency."
    },
    {
      question: "What's the minimum M² value I can achieve?",
      answer: "The theoretical minimum is M² = 1.0 for a perfect Gaussian beam. In practice: single-mode fiber lasers achieve 1.05-1.15, high-quality CO2 lasers reach 1.0-1.1, and well-designed solid-state lasers achieve 1.1-1.3. Values below 1.0 are impossible and indicate measurement errors."
    },
    {
      question: "How do I measure beam quality accurately?",
      answer: "Use a calibrated beam profiler following ISO 11146 standards. Measure at multiple positions along the beam propagation axis, ensure the beam is not clipped by apertures, maintain stable environmental conditions, and take multiple measurements for statistical accuracy. The 4σ or second moment method is recommended for M² calculations."
    },
    {
      question: "Can I improve my laser's beam quality?",
      answer: "Yes, several methods can improve beam quality: optimize fiber coupling alignment, use beam shaping optics, implement spatial filtering, maintain clean optical surfaces, control thermal effects, and consider upgrading to higher-quality optical components. Improvements of 10-20% in M² are typically achievable with proper optimization."
    },
    {
      question: "What beam quality do I need for different applications?",
      answer: "Precision cutting (thin materials): M² ≤ 1.2; General cutting: M² ≤ 1.5; Thick material cutting: M² ≤ 2.0; Welding applications: M² ≤ 1.8. Better beam quality always improves performance, but the requirements depend on your specific application needs and quality standards."
    },
    {
      question: "Why does my calculated focus spot differ from reality?",
      answer: "Several factors can cause differences: aberrations in focusing optics, thermal lensing effects, beam quality degradation through the optical system, incorrect measurement of input beam parameters, or non-Gaussian beam profiles. The calculator assumes ideal optics and Gaussian beams. Real systems may have 10-20% larger spots due to these effects."
    },
    {
      question: "How often should I check beam quality?",
      answer: "Check beam quality during initial system setup, after any optical system changes, when cutting performance degrades, and as part of regular maintenance (monthly for production systems). Environmental changes, component aging, and contamination can gradually degrade beam quality over time."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-purple-600" />
          FAQ & Support
        </CardTitle>
        <p className="text-gray-600">
          Common questions about beam quality analysis and measurement
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Need Technical Support?</h3>
          <p className="text-purple-800 mb-4">
            Our beam quality experts are here to help with measurement techniques, equipment selection, and optimization strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Contact Beam Quality Expert
            </button>
            <button className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              View Measurement Guide
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeamQualityCalculatorFAQ;
