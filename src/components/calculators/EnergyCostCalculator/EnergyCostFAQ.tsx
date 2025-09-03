import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const EnergyCostFAQ: React.FC = () => {
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
      question: 'How can I reduce my laser cutting energy costs effectively?',
      answer: `Energy cost reduction requires a systematic approach targeting multiple areas:

**Demand Management Strategies:**
• **Peak shaving**: Reduce maximum demand during peak hours (15-30% savings)
• **Load scheduling**: Shift operations to off-peak periods when rates are lower
• **Power factor improvement**: Maintain PF >0.95 to avoid penalties
• **Standby reduction**: Minimize standby power consumption during idle periods

**Efficiency Improvements:**
• **System optimization**: Regular maintenance and calibration (5-10% savings)
• **Variable frequency drives**: Install VFDs on auxiliary systems (10-20% savings)
• **HVAC optimization**: Smart scheduling and temperature control (15-25% savings)
• **Compressed air efficiency**: Optimize pressure and eliminate leaks (10-15% savings)

**Rate Structure Optimization:**
• **Time-of-use rates**: Switch to TOU rates if beneficial (10-25% savings)
• **Demand response programs**: Participate in utility programs (5-15% savings)
• **Rate schedule analysis**: Ensure optimal rate classification
• **Power purchase agreements**: Consider alternative energy suppliers

**Technology Solutions:**
• **Energy monitoring systems**: Real-time tracking and alerts (5-10% savings)
• **Automated controls**: Smart scheduling and load management
• **Energy storage**: Battery systems for peak shaving (20-40% demand savings)
• **Power quality improvement**: Reduce losses and equipment stress

**Typical Savings Potential:**
• **Immediate actions**: 10-20% cost reduction
• **Medium-term improvements**: 20-35% cost reduction
• **Long-term optimization**: 30-50% cost reduction

**Implementation Priority:**
1. Fix power factor and eliminate obvious waste
2. Implement demand monitoring and control
3. Optimize operating schedules
4. Invest in efficiency upgrades
5. Consider advanced technologies`,
      category: 'Cost Reduction'
    },
    {
      question: 'What energy costs should I expect for different laser cutting operations?',
      answer: `Energy costs vary significantly by laser type, power, and operating patterns:

**Energy Cost Benchmarks by Laser Type:**

**CO₂ Lasers (2-6kW):**
• **Energy consumption**: 15-25 kWh per operating hour
• **Monthly cost**: $800-2,500 (8 hours/day, 22 days/month)
• **Cost per part**: $0.15-0.45 (depending on complexity)
• **Efficiency**: 8-15% wall-plug efficiency

**Fiber Lasers (1-12kW):**
• **Energy consumption**: 8-35 kWh per operating hour
• **Monthly cost**: $400-4,200 (8 hours/day, 22 days/month)
• **Cost per part**: $0.08-0.35 (depending on complexity)
• **Efficiency**: 25-45% wall-plug efficiency

**Cost Breakdown by Component:**
• **Laser power**: 60-75% of total energy cost
• **Auxiliary systems**: 15-25% (chillers, compressors, exhaust)
• **HVAC**: 8-15% (facility climate control)
• **Standby power**: 2-8% (idle periods)

**Operating Pattern Impact:**
• **Single shift**: Higher cost per hour due to fixed costs
• **Two shifts**: 15-25% lower cost per hour
• **Three shifts**: 25-35% lower cost per hour
• **Intermittent operation**: 20-40% higher costs due to startup/standby

**Regional Variations (US averages):**
• **Northeast**: $0.12-0.18/kWh (higher costs)
• **Southeast**: $0.08-0.12/kWh (moderate costs)
• **West Coast**: $0.10-0.16/kWh (variable by state)
• **Industrial rates**: Typically 20-40% lower than commercial

**Demand Charge Impact:**
• **Low demand operations**: $5-15/kW-month
• **High demand operations**: $15-35/kW-month
• **Peak demand penalties**: Can add 25-50% to energy costs

**Optimization Targets:**
• **Excellent**: <$0.10 per part energy cost
• **Good**: $0.10-0.20 per part energy cost
• **Average**: $0.20-0.35 per part energy cost
• **Poor**: >$0.35 per part energy cost`,
      category: 'Cost Expectations'
    },
    {
      question: 'How do I understand and optimize demand charges on my electricity bill?',
      answer: `Demand charges can represent 30-70% of industrial electricity costs and require specific strategies:

**Understanding Demand Charges:**
• **Definition**: Charge based on highest 15-30 minute power demand during billing period
• **Measurement**: Typically measured in kW of peak demand
• **Rate structure**: $10-50 per kW-month depending on utility and rate class
• **Billing period**: Usually monthly, some utilities use seasonal or annual peaks

**Common Demand Charge Types:**
• **Facility demand**: Based on total facility peak demand
• **Ratchet demand**: Uses highest demand from recent months (typically 12 months)
• **Seasonal demand**: Different rates for summer/winter peaks
• **Time-of-use demand**: Higher rates during peak hours (typically 12-8 PM)

**Demand Optimization Strategies:**

**Peak Shaving Techniques:**
• **Load scheduling**: Avoid simultaneous operation of high-power equipment
• **Demand limiting**: Automatic load shedding when approaching peak thresholds
• **Energy storage**: Battery systems to reduce peak demand (20-40% reduction)
• **Load shifting**: Move operations to off-peak periods

**Operational Changes:**
• **Staggered startups**: Avoid simultaneous equipment startup
• **Maintenance scheduling**: Perform high-power maintenance during low-demand periods
• **Production planning**: Schedule heavy cutting during off-peak hours
• **Equipment coordination**: Coordinate laser, compressor, and HVAC operation

**Technology Solutions:**
• **Demand monitoring**: Real-time tracking with alerts and automatic controls
• **Smart controls**: Automated load management systems
• **Power factor correction**: Reduce apparent power demand
• **Variable frequency drives**: Reduce motor starting currents

**Typical Demand Patterns:**
• **Morning startup**: Often creates daily peak (7-9 AM)
• **Production peaks**: Mid-morning and afternoon peaks
• **HVAC interaction**: Summer afternoon peaks due to cooling loads
• **Standby periods**: Opportunity for demand reduction

**Optimization Results:**
• **Basic monitoring**: 10-20% demand reduction
• **Active management**: 20-35% demand reduction
• **Advanced systems**: 35-50% demand reduction
• **Energy storage**: 40-60% peak demand reduction

**ROI Considerations:**
• **Demand monitoring**: 6-18 month payback
• **Control systems**: 12-36 month payback
• **Energy storage**: 3-7 year payback
• **Process optimization**: Immediate to 12 month payback`,
      category: 'Demand Management'
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
          Common questions about energy cost management and optimization for laser cutting operations
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
            Our energy management experts are here to help you optimize your energy costs and improve operational efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Energy Cost Calculator Question'}
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
              onClick={() => window.location.href = '/contact/energy-expert'}
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

export default EnergyCostFAQ;
