import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const ProductionCapacityFAQ: React.FC = () => {
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
      question: 'How do I calculate realistic production capacity for my operation?',
      answer: `Realistic production capacity requires considering multiple factors beyond theoretical maximums:

**Step-by-Step Calculation:**
1. **Theoretical Capacity**: Available hours × Production rate
2. **Apply Efficiency Factor**: Multiply by OEE (typically 60-85%)
3. **Account for Constraints**: Consider bottlenecks and resource limitations
4. **Add Buffer**: Plan for 80-85% utilization for flexibility

**Key Factors to Include:**
• **Equipment efficiency**: Actual vs. rated performance
• **Downtime**: Planned maintenance, breakdowns, changeovers
• **Labor availability**: Shifts, breaks, skill levels
• **Material flow**: Supply chain constraints and inventory
• **Quality issues**: Rework, scrap, and inspection time

**Typical Capacity Utilization Benchmarks:**
• **World-class operations**: 80-85% utilization
• **Good operations**: 70-80% utilization
• **Average operations**: 60-70% utilization
• **Poor operations**: <60% utilization

**Validation Methods:**
• Compare with historical production data
• Conduct time studies and capacity audits
• Benchmark against industry standards
• Test with pilot runs at different volumes

**Common Mistakes to Avoid:**
• Using theoretical capacity without efficiency factors
• Ignoring setup and changeover times
• Not accounting for quality losses
• Failing to consider seasonal variations`,
      category: 'Capacity Calculation'
    },
    {
      question: 'How do I identify and address production bottlenecks?',
      answer: `Bottleneck identification and management is critical for capacity optimization:

**Bottleneck Identification Methods:**
• **Utilization analysis**: Find resources running at >90% capacity
• **Queue analysis**: Look for work-in-process buildup
• **Throughput analysis**: Identify process steps limiting overall flow
• **Cycle time analysis**: Find longest processing steps

**Common Bottleneck Types:**
• **Equipment bottlenecks**: Machine capacity limitations
• **Labor bottlenecks**: Skill shortages or insufficient staffing
• **Material bottlenecks**: Supply chain constraints
• **Information bottlenecks**: Planning and scheduling delays
• **Quality bottlenecks**: Inspection and rework processes

**Theory of Constraints (TOC) Approach:**
1. **Identify** the system constraint
2. **Exploit** the constraint (maximize its utilization)
3. **Subordinate** everything else to the constraint
4. **Elevate** the constraint (increase its capacity)
5. **Repeat** the process for the next constraint

**Bottleneck Management Strategies:**
• **Immediate actions**: Reduce downtime, improve efficiency
• **Short-term solutions**: Add shifts, cross-train operators
• **Medium-term fixes**: Process improvements, minor equipment upgrades
• **Long-term solutions**: Capacity expansion, automation

**Performance Monitoring:**
• Track constraint utilization continuously
• Monitor queue lengths and wait times
• Measure overall system throughput
• Analyze constraint migration patterns

**ROI of Bottleneck Improvements:**
• 1% improvement at bottleneck = 1% system improvement
• Non-bottleneck improvements may not increase throughput
• Focus investment on constraint resources first`,
      category: 'Bottleneck Management'
    },
    {
      question: 'What capacity utilization rate should I target for optimal performance?',
      answer: `Optimal capacity utilization balances efficiency with flexibility and varies by industry:

**General Guidelines by Industry:**
• **High-volume manufacturing**: 75-85% utilization
• **Job shop operations**: 70-80% utilization
• **Custom manufacturing**: 65-75% utilization
• **Service operations**: 70-80% utilization
• **Critical infrastructure**: 60-70% utilization

**Factors Affecting Optimal Utilization:**
• **Demand variability**: Higher variability requires lower utilization
• **Setup complexity**: Frequent changeovers favor lower utilization
• **Quality requirements**: Critical quality needs buffer capacity
• **Customer expectations**: Fast delivery requires spare capacity
• **Equipment reliability**: Less reliable equipment needs more buffer

**Utilization vs. Performance Trade-offs:**
• **>90% utilization**: High efficiency but poor flexibility
  - Long lead times, poor customer service
  - High stress on equipment and workers
  - Difficult to handle demand spikes

• **80-85% utilization**: Optimal balance
  - Good efficiency with reasonable flexibility
  - Manageable lead times
  - Capacity for maintenance and improvements

• **<70% utilization**: High flexibility but poor efficiency
  - Excellent customer service capability
  - High unit costs due to fixed cost spread
  - May indicate overcapacity

**Dynamic Utilization Management:**
• **Peak seasons**: Plan for higher utilization (85-90%)
• **Off-peak periods**: Use for maintenance and training (60-70%)
• **New product launches**: Reserve capacity for ramp-up (70-75%)
• **Process improvements**: Temporary capacity reduction acceptable

**Monitoring and Adjustment:**
• Track utilization trends monthly
• Analyze correlation with quality and delivery performance
• Adjust targets based on business priorities
• Consider market conditions and competitive requirements`,
      category: 'Utilization Optimization'
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
          Common questions about production capacity planning and optimization
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
            Our capacity planning experts are here to help you optimize your production operations and maximize efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Production Capacity Calculator Question'}
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
              onClick={() => window.location.href = '/contact/capacity-expert'}
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

export default ProductionCapacityFAQ;
