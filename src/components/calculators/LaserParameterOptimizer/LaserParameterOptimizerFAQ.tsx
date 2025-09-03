import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const LaserParameterOptimizerFAQ: React.FC = () => {
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
      question: "How accurate are the optimized parameters?",
      answer: "Our optimization algorithm achieves ±5% accuracy for cutting speed and ±10% for quality predictions. The parameters are based on extensive experimental data and validated against industry standards. However, actual results may vary depending on machine condition, material quality, and environmental factors."
    },
    {
      question: "Can I use these parameters on any laser cutting machine?",
      answer: "The optimized parameters are designed to work with most industrial laser cutting systems. However, you should always verify the parameters are within your machine's capabilities and perform test cuts before production. Different machines may have slight variations in beam quality and control systems."
    },
    {
      question: "What's the difference between speed, quality, and cost optimization?",
      answer: "Speed optimization maximizes cutting throughput by using higher power and faster speeds. Quality optimization focuses on achieving the best edge finish and dimensional accuracy. Cost optimization minimizes operating expenses by reducing gas consumption and power usage while maintaining acceptable quality."
    },
    {
      question: "Why do I get different parameters for the same material and thickness?",
      answer: "Parameters can vary based on your optimization priority (speed/quality/cost), laser type, available power, gas type, and quality requirements. The optimizer considers all these factors to provide the best parameters for your specific situation and goals."
    },
    {
      question: "How should I handle materials not listed in the optimizer?",
      answer: "For unlisted materials, select the closest similar material as a starting point. For example, use 'Stainless Steel' for other austenitic alloys, or 'Mild Steel' for other carbon steels. Always perform test cuts and adjust parameters as needed for optimal results."
    },
    {
      question: "What if my machine can't achieve the recommended gas pressure?",
      answer: "If your gas system can't reach the recommended pressure, you can compensate by slightly reducing cutting speed or increasing laser power. The optimizer provides alternative parameter sets that you can access through the results section."
    },
    {
      question: "How often should I re-optimize my parameters?",
      answer: "Re-optimize when you change materials, thickness, quality requirements, or laser settings. Also consider re-optimization if you notice declining cut quality, which could indicate changes in machine condition or beam quality that require parameter adjustment."
    },
    {
      question: "Can I save and reuse parameter sets?",
      answer: "Yes, you can export your optimized parameters to CSV or PDF format for future reference. We recommend keeping a parameter library organized by material type and thickness for quick access during production setup."
    },
    {
      question: "What should I do if the optimized parameters don't work well?",
      answer: "Start by verifying your input parameters are correct, especially material type and thickness. Check your machine's beam alignment and focus position. If issues persist, try the alternative parameter sets provided in the results, or contact our support team for assistance."
    },
    {
      question: "How does part complexity affect the optimization?",
      answer: "Complex parts with tight corners, small features, or intricate patterns may require reduced speeds for quality. The optimizer accounts for this by applying complexity factors. For very complex parts, consider using the 'Quality' optimization priority for best results."
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          FAQ & Support
        </CardTitle>
        <p className="text-gray-600">
          Common questions about laser parameter optimization
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

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Need More Help?</h3>
          <p className="text-blue-800 mb-4">
            Can't find the answer you're looking for? Our technical support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserParameterOptimizerFAQ;
