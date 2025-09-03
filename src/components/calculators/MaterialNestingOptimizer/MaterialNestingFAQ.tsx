import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const MaterialNestingFAQ: React.FC = () => {
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
      question: 'How accurate is the material nesting optimization?',
      answer: `Our nesting optimizer typically achieves 85-95% of theoretical optimal utilization. Accuracy depends on:

• **Part complexity**: Simple rectangular parts achieve higher accuracy
• **Constraint flexibility**: Allowing rotation improves optimization by 10-15%
• **Sheet size variety**: Multiple sheet options increase efficiency
• **Algorithm limitations**: Heuristic methods vs. exact optimization

**Typical Results:**
• **Basic nesting**: 70-80% material utilization
• **Optimized nesting**: 80-90% material utilization  
• **Advanced optimization**: 85-95% material utilization

For critical cost analysis, always validate with actual production runs.`,
      category: 'Optimization Accuracy'
    },
    {
      question: 'What material utilization rates should I expect?',
      answer: `Material utilization varies significantly by application and optimization level:

**By Part Type:**
• **Simple rectangles**: 85-95% utilization possible
• **Complex shapes**: 70-85% utilization typical
• **Mixed part sizes**: 75-90% utilization range
• **Single part type**: 90-95% utilization achievable

**By Industry Standards:**
• **Excellent**: >90% utilization (world-class)
• **Good**: 80-90% utilization (industry standard)
• **Average**: 70-80% utilization (typical)
• **Poor**: <70% utilization (needs optimization)

**Improvement Strategies:**
• **Allow part rotation**: +10-15% utilization
• **Use multiple sheet sizes**: +5-10% utilization
• **Optimize edge margins**: +2-5% utilization
• **Batch similar parts**: +5-8% utilization
• **Consider remnant reuse**: +3-7% utilization

**Cost Impact:**
• 10% utilization improvement = 11% material cost reduction
• 20% utilization improvement = 25% material cost reduction`,
      category: 'Performance Expectations'
    },
    {
      question: 'How can I improve my nesting efficiency?',
      answer: `Multiple strategies can significantly improve nesting efficiency:

**Design Optimization:**
• **Standardize part sizes**: Use common dimensions when possible
• **Allow part rotation**: Enable 90° or 180° rotation for better fit
• **Minimize edge margins**: Reduce safety margins to minimum safe values
• **Consider grain direction**: Balance efficiency vs. material properties

**Process Improvements:**
• **Batch similar parts**: Group parts by material and thickness
• **Use multiple sheet sizes**: Offer 2-3 sheet size options
• **Plan for remnants**: Design smaller parts to use leftover material
• **Optimize kerf width**: Use precise kerf values for accurate spacing

**Technology Solutions:**
• **Professional nesting software**: Invest in advanced algorithms
• **Automated optimization**: Use AI-driven nesting solutions
• **Real-time optimization**: Adjust nesting based on inventory
• **Integration tools**: Connect CAD/CAM with nesting software

**Production Planning:**
• **Flexible scheduling**: Allow time for optimization
• **Inventory management**: Track remnants for future use
• **Quality vs. efficiency**: Balance utilization with cut quality
• **Cost monitoring**: Track material costs and waste regularly

**Common Mistakes to Avoid:**
• Over-tight edge margins causing quality issues
• Ignoring grain direction requirements
• Not considering setup time vs. material savings
• Failing to validate optimization results`,
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
          Common questions about material nesting optimization and efficiency improvement
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
            Our material optimization experts are here to help you maximize efficiency and reduce waste in your operations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Material Nesting Optimizer Question'}
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
              onClick={() => window.location.href = '/contact/optimization-expert'}
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

export default MaterialNestingFAQ;
