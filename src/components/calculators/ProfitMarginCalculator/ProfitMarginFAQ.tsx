import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const ProfitMarginFAQ: React.FC = () => {
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
      question: 'What are healthy profit margins for laser cutting businesses and how do I benchmark my performance?',
      answer: `Profit margin benchmarks vary by business model and market positioning, but here are industry standards:

**Industry Benchmark Profit Margins:**

**Gross Profit Margins:**
• **Job shop operations**: 25-35% (typical range)
• **Production cutting**: 30-45% (higher volume efficiency)
• **Custom/prototype work**: 35-50% (premium pricing)
• **Value-added services**: 40-60% (design, finishing, assembly)

**Operating Profit Margins:**
• **Small operations**: 8-15% (after all operating expenses)
• **Medium businesses**: 12-20% (economies of scale)
• **Large operations**: 15-25% (operational efficiency)
• **Specialized services**: 18-30% (niche expertise)

**Net Profit Margins:**
• **Industry average**: 5-12% (after taxes and interest)
• **Well-managed businesses**: 10-18%
• **Market leaders**: 15-25%
• **Highly efficient operations**: 20%+

**Factors Affecting Margin Benchmarks:**

**Business Model Impact:**
• **High-volume production**: Lower margins (25-35%) but higher throughput
• **Custom fabrication**: Higher margins (35-50%) but lower volume
• **Design services**: Premium margins (50-70%) for intellectual property
• **Material supply**: Lower margins (15-25%) but steady revenue

**Market Position:**
• **Price competitors**: 20-30% gross margins
• **Quality leaders**: 35-45% gross margins
• **Innovation leaders**: 40-55% gross margins
• **Niche specialists**: 45-60% gross margins

**Geographic Factors:**
• **Urban markets**: Higher margins due to premium pricing
• **Rural markets**: Lower margins but reduced competition
• **International markets**: Variable margins based on local conditions

**Performance Benchmarking Process:**

**Internal Benchmarking:**
• **Track monthly trends**: Monitor margin consistency
• **Compare by job type**: Identify most profitable work
• **Analyze by customer**: Focus on profitable relationships
• **Review by material**: Optimize material mix

**External Benchmarking:**
• **Industry associations**: Access peer performance data
• **Financial databases**: Compare against similar businesses
• **Supplier insights**: Leverage vendor market knowledge
• **Customer feedback**: Understand value perception

**Improvement Targets:**
• **Gross margin**: Aim for top quartile (35%+ for most operations)
• **Operating margin**: Target 15%+ for sustainable growth
• **Net margin**: Achieve 10%+ for healthy profitability
• **Trend direction**: Focus on consistent improvement over time`,
      category: 'Benchmarking'
    },
    {
      question: 'How do I identify and address the root causes of declining profit margins?',
      answer: `Declining profit margins require systematic diagnosis and targeted solutions:

**Root Cause Analysis Framework:**

**Revenue-Side Issues:**
• **Price erosion**: Competitive pressure forcing lower prices
• **Mix degradation**: Shift toward lower-margin work
• **Volume decline**: Fixed costs spread over fewer jobs
• **Customer concentration**: Over-dependence on price-sensitive accounts

**Cost-Side Issues:**
• **Material cost inflation**: Raw material price increases
• **Labor cost increases**: Wage inflation, overtime, inefficiency
• **Overhead creep**: Fixed costs growing faster than revenue
• **Equipment inefficiency**: Aging equipment, maintenance issues

**Operational Issues:**
• **Setup time increases**: More complex jobs, longer changeovers
• **Quality problems**: Rework, scrap, customer complaints
• **Capacity utilization**: Underutilized equipment and labor
• **Process inefficiencies**: Waste, delays, poor workflow

**Diagnostic Process:**

**Step 1: Data Analysis**
• **Trend analysis**: Compare current vs. historical margins
• **Segmentation**: Analyze margins by customer, job type, material
• **Variance analysis**: Identify largest contributors to decline
• **Benchmarking**: Compare against industry standards

**Step 2: Cost Structure Review**
• **Direct cost analysis**: Material, labor, machine time trends
• **Indirect cost analysis**: Overhead allocation and trends
• **Activity-based costing**: True cost of different job types
• **Break-even analysis**: Understand minimum pricing requirements

**Step 3: Market Analysis**
• **Competitive landscape**: Pricing pressure sources
• **Customer behavior**: Value perception changes
• **Market trends**: Industry growth, consolidation, technology
• **Positioning assessment**: Competitive advantages and weaknesses

**Solution Strategies:**

**Revenue Enhancement:**
• **Value-based pricing**: Focus on customer value, not just cost-plus
• **Service differentiation**: Add value-added services
• **Customer mix optimization**: Focus on profitable segments
• **Premium positioning**: Emphasize quality, service, expertise

**Cost Optimization:**
• **Material sourcing**: Negotiate better prices, alternative suppliers
• **Process improvement**: Lean manufacturing, automation, efficiency
• **Overhead management**: Eliminate non-value activities
• **Capacity optimization**: Improve utilization, reduce idle time

**Operational Excellence:**
• **Quality improvement**: Reduce rework, scrap, customer issues
• **Setup reduction**: Faster changeovers, better scheduling
• **Maintenance optimization**: Preventive maintenance, equipment reliability
• **Workflow optimization**: Eliminate bottlenecks, improve flow

**Implementation Priorities:**
• **Quick wins**: Address immediate cost issues (material sourcing, waste reduction)
• **Medium-term**: Process improvements, customer mix optimization
• **Long-term**: Strategic positioning, capability development
• **Continuous**: Regular monitoring, adjustment, improvement`,
      category: 'Problem Solving'
    },
    {
      question: 'What strategies can I use to optimize profit margins without losing customers?',
      answer: `Margin optimization requires balancing profitability with customer retention:

**Value-Based Optimization Strategies:**

**Service Enhancement Approach:**
• **Faster turnaround**: Premium pricing for expedited service
• **Quality guarantees**: Higher prices justified by quality assurance
• **Design assistance**: Add engineering/design services at premium rates
• **Material sourcing**: Provide material procurement as value-added service
• **Finishing services**: Offer deburring, coating, assembly for higher margins

**Customer Segmentation Strategy:**
• **Tier 1 customers**: Strategic accounts with negotiated pricing
• **Tier 2 customers**: Standard pricing with volume discounts
• **Tier 3 customers**: Premium pricing for small/complex jobs
• **New customers**: Competitive pricing to establish relationships

**Pricing Strategy Optimization:**

**Dynamic Pricing Models:**
• **Complexity-based pricing**: Higher margins for complex geometries
• **Volume-based pricing**: Tiered pricing encouraging larger orders
• **Rush order premiums**: 25-50% premium for expedited delivery
• **Material-based pricing**: Higher margins for specialty materials

**Value Communication:**
• **Total cost of ownership**: Emphasize quality, reliability, service
• **Risk mitigation**: Highlight consistency, on-time delivery, quality
• **Capability differentiation**: Showcase unique equipment, expertise
• **Partnership approach**: Position as strategic supplier, not commodity

**Operational Efficiency Gains:**

**Process Optimization:**
• **Batch processing**: Group similar jobs to reduce setup costs
• **Nesting optimization**: Maximize material utilization
• **Automation**: Reduce labor costs while maintaining quality
• **Preventive maintenance**: Minimize downtime, improve reliability

**Cost Structure Improvements:**
• **Material management**: Bulk purchasing, inventory optimization
• **Energy efficiency**: Reduce operating costs through efficiency
• **Overhead allocation**: Ensure accurate costing of all jobs
• **Waste reduction**: Minimize scrap, rework, material waste

**Customer Retention Strategies:**

**Relationship Building:**
• **Regular communication**: Proactive updates, problem-solving
• **Performance metrics**: Share quality, delivery performance data
• **Continuous improvement**: Involve customers in process optimization
• **Long-term contracts**: Negotiate multi-year agreements with escalation

**Gradual Implementation:**
• **Phased increases**: Implement price increases gradually (5-10% annually)
• **Grandfathering**: Honor existing contract terms while adjusting new work
• **Value demonstration**: Show ROI, cost savings, quality improvements
• **Market timing**: Align increases with market conditions, competitor actions

**Risk Mitigation:**
• **Customer diversification**: Reduce dependence on any single customer
• **Market expansion**: Develop new customer segments, applications
• **Capability development**: Invest in unique capabilities, competitive advantages
• **Financial monitoring**: Track customer profitability, payment terms

**Success Metrics:**
• **Customer retention rate**: Maintain 90%+ retention during optimization
• **Average margin improvement**: Target 2-5% annual improvement
• **Customer satisfaction**: Monitor feedback, address concerns proactively
• **Market share**: Maintain or grow position while improving margins`,
      category: 'Optimization Strategies'
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
          Common questions about profit margin analysis and profitability optimization for laser cutting businesses
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
            Our financial analysis and profitability experts are here to help you optimize your profit margins and achieve sustainable growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Profit Margin Calculator Question'}
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
              onClick={() => window.location.href = '/contact/financial-expert'}
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

export default ProfitMarginFAQ;
