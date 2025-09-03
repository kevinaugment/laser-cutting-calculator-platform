import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const BatchProcessingFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'How do I determine the optimal batch size for my production?',
      answer: `Optimal batch size depends on several key factors and trade-offs:

**Key Factors to Consider:**
• **Setup costs**: Higher setup costs favor larger batches
• **Holding costs**: Higher inventory costs favor smaller batches
• **Demand rate**: Steady demand allows larger batches
• **Production capacity**: Machine capacity limits maximum batch size

**Calculation Methods:**
• **Economic Order Quantity (EOQ)**: B_optimal = √(2 × D × S / H)
  - D = Annual demand, S = Setup cost, H = Holding cost per unit
• **Production lot sizing**: Consider production rate vs. demand rate
• **Constraint-based**: Limited by material availability or machine capacity

**Typical Batch Size Guidelines:**
• **Small parts (<100mm)**: 50-200 pieces per batch
• **Medium parts (100-500mm)**: 20-100 pieces per batch  
• **Large parts (>500mm)**: 5-50 pieces per batch
• **High-value parts**: Smaller batches (10-30 pieces)
• **Standard parts**: Larger batches (100-500 pieces)

**Optimization Strategy:**
1. Start with EOQ calculation as baseline
2. Adjust for material constraints and machine capacity
3. Consider setup time reduction opportunities
4. Test different batch sizes and measure actual efficiency
5. Monitor and adjust based on performance data`,
      category: 'Batch Sizing'
    },
    {
      question: 'What batch processing efficiency should I expect?',
      answer: `Batch processing efficiency varies significantly by operation type and optimization level:

**Efficiency Benchmarks by Industry:**
• **Excellent (>85%)**: World-class operations with optimized setups
• **Good (70-85%)**: Well-managed operations with standard practices
• **Average (55-70%)**: Typical operations with basic optimization
• **Poor (<55%)**: Operations needing significant improvement

**Factors Affecting Efficiency:**
• **Setup time**: Shorter setups = higher efficiency
  - Quick changeover: 85-95% efficiency possible
  - Standard setup: 70-85% efficiency typical
  - Long setup: 50-70% efficiency common

• **Batch size optimization**:
  - Optimal batches: +10-15% efficiency improvement
  - Oversized batches: Inventory costs increase
  - Undersized batches: Setup overhead increases

• **Material handling**:
  - Automated handling: +5-10% efficiency
  - Manual handling: Standard efficiency
  - Poor organization: -10-20% efficiency

**Improvement Strategies:**
• **SMED (Single-Minute Exchange of Die)**: Reduce setup times by 50-90%
• **Standardization**: Consistent processes improve efficiency by 10-20%
• **Batch sequencing**: Optimize order to minimize changeovers
• **Parallel processing**: Setup next batch while current runs

**Realistic Targets:**
• **Short-term (3 months)**: 10-15% efficiency improvement
• **Medium-term (6-12 months)**: 20-30% efficiency improvement  
• **Long-term (1-2 years)**: 30-50% efficiency improvement with full optimization`,
      category: 'Performance Expectations'
    },
    {
      question: 'How can I reduce setup times and improve batch efficiency?',
      answer: `Setup time reduction is critical for batch processing efficiency. Here are proven strategies:

**SMED (Single-Minute Exchange of Die) Implementation:**
• **External setup**: Prepare while machine is running
  - Pre-position materials and tools
  - Pre-heat equipment when possible
  - Prepare programs and documentation
• **Internal setup**: Minimize machine downtime
  - Standardize tool positions and settings
  - Use quick-release mechanisms
  - Implement visual guides and checklists

**Tool and Equipment Optimization:**
• **Quick-change tooling**: Reduce tool change time by 70-90%
• **Preset tooling**: Pre-adjust tools offline
• **Modular fixtures**: Standardized clamping systems
• **Automated tool changers**: Eliminate manual intervention

**Process Standardization:**
• **Standard operating procedures**: Consistent setup methods
• **Visual workplace**: Clear labeling and organization
• **Setup checklists**: Ensure nothing is forgotten
• **Training programs**: Skilled operators work faster

**Technology Solutions:**
• **CNC program management**: Quick program loading
• **Automated material handling**: Reduce manual loading time
• **Vision systems**: Automated part positioning
• **IoT monitoring**: Track setup times and identify improvements

**Organizational Improvements:**
• **5S methodology**: Organize workspace for efficiency
• **Cross-training**: Multiple operators can perform setups
• **Continuous improvement**: Regular kaizen events
• **Performance metrics**: Track and reward setup time improvements

**Typical Results:**
• **Basic improvements**: 20-30% setup time reduction
• **SMED implementation**: 50-70% setup time reduction
• **Advanced automation**: 70-90% setup time reduction

**Implementation Priority:**
1. Eliminate obvious waste and delays
2. Standardize setup procedures
3. Implement quick-change tooling
4. Add automation where cost-effective
5. Continuous monitoring and improvement`,
      category: 'Process Improvement'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2" />
          Frequently Asked Questions
        </CardTitle>
        <p className="text-sm text-gray-600">
          Common questions about batch processing optimization and production efficiency improvement
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {faq.category}
                  </Badge>
                </div>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    {faq.answer.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.trim() === '') return null;
                      
                      // Handle bold text
                      if (paragraph.includes('**')) {
                        const parts = paragraph.split('**');
                        return (
                          <p key={pIndex} className="mb-3">
                            {parts.map((part, partIndex) => 
                              partIndex % 2 === 1 ? (
                                <strong key={partIndex}>{part}</strong>
                              ) : (
                                part
                              )
                            )}
                          </p>
                        );
                      }
                      
                      // Handle bullet points
                      if (paragraph.startsWith('• ')) {
                        return (
                          <li key={pIndex} className="ml-4 mb-1">
                            {paragraph.substring(2)}
                          </li>
                        );
                      }
                      
                      // Handle numbered lists
                      if (/^\d+\./.test(paragraph.trim())) {
                        return (
                          <li key={pIndex} className="ml-4 mb-1">
                            {paragraph.trim()}
                          </li>
                        );
                      }
                      
                      return (
                        <p key={pIndex} className="mb-3">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Still Have Questions?</h3>
          <p className="text-sm text-blue-800 mb-4">
            Our production optimization experts are here to help you maximize batch processing efficiency and reduce operational costs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Batch Processing Calculator Question'}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.open('https://chat.lasercalc.com', '_blank')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
            
            <Button 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = '/contact/production-expert'}
            >
              Contact Expert
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-blue-700">
            <strong>Response Time:</strong> Within 4 hours during business hours (Mon-Fri, 8AM-6PM EST)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchProcessingFAQ;
