import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const MaintenanceCostFAQ: React.FC = () => {
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
      question: 'What percentage of equipment value should I budget for annual maintenance costs?',
      answer: `Maintenance cost budgeting varies by equipment type, age, and operating conditions:

**Industry Standard Maintenance Cost Percentages:**

**By Equipment Type:**
• **CO₂ laser systems**: 8-15% of equipment value annually
• **Fiber laser systems**: 6-12% of equipment value annually
• **Plasma cutting systems**: 10-18% of equipment value annually
• **Waterjet systems**: 12-20% of equipment value annually

**By Equipment Age:**
• **Years 1-3**: 4-8% of original value (warranty period)
• **Years 4-7**: 8-15% of original value (normal operation)
• **Years 8-12**: 15-25% of original value (increased wear)
• **Years 13+**: 20-35% of original value (aging equipment)

**By Operating Intensity:**
• **Light duty (1-2 shifts)**: 6-10% of equipment value
• **Medium duty (2-3 shifts)**: 10-16% of equipment value
• **Heavy duty (24/7 operation)**: 15-25% of equipment value
• **Extreme conditions**: 20-30% of equipment value

**Maintenance Cost Breakdown:**

**Planned Maintenance (60-70% of total):**
• **Consumables**: 30-40% (lenses, nozzles, filters)
• **Labor**: 25-35% (technician time)
• **Scheduled parts**: 15-25% (belts, bearings, seals)
• **Calibration/service**: 10-15% (professional services)

**Unplanned Maintenance (30-40% of total):**
• **Emergency repairs**: 15-25% (breakdown fixes)
• **Component replacement**: 10-20% (failed parts)
• **Downtime costs**: 5-15% (lost production)

**Factors Affecting Maintenance Costs:**

**Equipment Factors:**
• **Build quality**: Premium brands typically 20-30% lower maintenance costs
• **Design complexity**: More complex systems require higher maintenance
• **Component accessibility**: Easy access reduces labor costs
• **Diagnostic capabilities**: Better diagnostics reduce troubleshooting time

**Operational Factors:**
• **Operating environment**: Clean environments reduce maintenance by 20-40%
• **Operator training**: Well-trained operators reduce maintenance by 15-30%
• **Material quality**: Clean materials reduce contamination and wear
• **Preventive maintenance adherence**: Reduces total costs by 25-50%

**Budgeting Best Practices:**
• **Start conservative**: Use upper range estimates for new operations
• **Track actual costs**: Build historical database for accurate forecasting
• **Include contingency**: Add 15-25% buffer for unexpected repairs
• **Consider lifecycle**: Plan for increasing costs as equipment ages
• **Evaluate alternatives**: Compare maintenance costs vs. replacement costs

**Cost Optimization Strategies:**
• **Preventive maintenance**: Reduces total costs by 25-50%
• **Operator training**: Reduces maintenance needs by 15-30%
• **Spare parts inventory**: Reduces downtime costs by 20-40%
• **Service contracts**: Can provide cost predictability and expertise`,
      category: 'Budgeting'
    },
    {
      question: 'How do I determine the optimal balance between preventive and reactive maintenance?',
      answer: `The optimal maintenance balance depends on equipment criticality, failure costs, and maintenance resources:

**Maintenance Strategy Framework:**

**Preventive Maintenance (PM) Optimization:**
• **High-criticality equipment**: 70-80% preventive, 20-30% reactive
• **Medium-criticality equipment**: 60-70% preventive, 30-40% reactive
• **Low-criticality equipment**: 40-60% preventive, 40-60% reactive
• **Non-critical equipment**: 20-40% preventive, 60-80% reactive

**Cost-Benefit Analysis:**

**Preventive Maintenance Benefits:**
• **Reduced downtime**: 50-80% reduction in unplanned outages
• **Extended equipment life**: 20-40% increase in useful life
• **Lower repair costs**: 30-60% reduction in emergency repair costs
• **Improved safety**: Significant reduction in safety incidents
• **Better planning**: Predictable maintenance schedules and costs

**Preventive Maintenance Costs:**
• **Labor costs**: Regular inspection and service time
• **Parts costs**: Scheduled replacement of components
• **Opportunity costs**: Planned downtime for maintenance
• **Over-maintenance**: Replacing components before necessary

**Decision Matrix for Maintenance Strategy:**

**High PM Ratio (70-80%) When:**
• **High downtime costs**: >$1,000/hour lost production
• **Safety critical**: Equipment failure poses safety risks
• **Quality critical**: Failures affect product quality
• **High repair costs**: Emergency repairs >3x planned maintenance
• **Long lead times**: Critical parts take weeks to obtain

**Balanced PM/Reactive (50-60% PM) When:**
• **Moderate downtime costs**: $200-1,000/hour lost production
• **Redundant systems**: Backup equipment available
• **Standard components**: Parts readily available
• **Predictable failures**: Clear warning signs before failure

**Low PM Ratio (30-40%) When:**
• **Low downtime costs**: <$200/hour lost production
• **Non-critical operations**: Failures don't stop production
• **Cheap components**: Replacement costs are minimal
• **Run-to-failure acceptable**: No safety or quality impact

**Implementation Guidelines:**

**Step 1: Equipment Criticality Assessment**
• **Criticality ranking**: Rate equipment 1-10 based on impact
• **Failure mode analysis**: Identify potential failure modes
• **Cost impact analysis**: Calculate downtime and repair costs
• **Risk assessment**: Evaluate safety and quality risks

**Step 2: Maintenance Task Optimization**
• **Task frequency**: Optimize based on failure patterns
• **Task scope**: Right-size maintenance activities
• **Resource allocation**: Match skills to maintenance needs
• **Scheduling optimization**: Coordinate maintenance windows

**Step 3: Performance Monitoring**
• **Key metrics**: Track MTBF, MTTR, maintenance costs
• **Trend analysis**: Monitor equipment degradation patterns
• **Cost tracking**: Compare planned vs. actual maintenance costs
• **Effectiveness measurement**: Assess maintenance impact on reliability

**Optimization Strategies:**

**Condition-Based Maintenance (CBM):**
• **Vibration monitoring**: Detect bearing and alignment issues
• **Thermal imaging**: Identify electrical and mechanical problems
• **Oil analysis**: Monitor lubrication and contamination
• **Performance monitoring**: Track cutting quality and speed

**Predictive Maintenance (PdM):**
• **IoT sensors**: Continuous monitoring of critical parameters
• **Data analytics**: Predict failures before they occur
• **Machine learning**: Improve prediction accuracy over time
• **Integration**: Connect with maintenance management systems

**Continuous Improvement:**
• **Regular review**: Quarterly assessment of maintenance strategy
• **Feedback loops**: Incorporate operator and technician input
• **Benchmarking**: Compare performance against industry standards
• **Technology adoption**: Evaluate new maintenance technologies`,
      category: 'Strategy Optimization'
    },
    {
      question: 'What are the warning signs that my maintenance costs are too high and how do I address them?',
      answer: `High maintenance costs often indicate underlying issues that require systematic analysis and correction:

**Warning Signs of Excessive Maintenance Costs:**

**Financial Indicators:**
• **Cost escalation**: Maintenance costs increasing >10% annually
• **Budget overruns**: Consistently exceeding maintenance budgets by >15%
• **High cost per hour**: Maintenance costs >$50/operating hour for standard equipment
• **Poor ROI**: Maintenance costs >20% of equipment value annually
• **Increasing frequency**: More frequent repairs and service calls

**Operational Indicators:**
• **Excessive downtime**: >5% unplanned downtime for critical equipment
• **Repeat failures**: Same components failing within 6 months
• **Emergency repairs**: >30% of maintenance work is emergency/reactive
• **Quality issues**: Increasing defect rates or customer complaints
• **Operator complaints**: Frequent equipment performance issues

**Performance Indicators:**
• **Declining MTBF**: Mean time between failures decreasing
• **Increasing MTTR**: Mean time to repair increasing
• **Low OEE**: Overall equipment effectiveness <75%
• **High spare parts costs**: Inventory costs >15% of annual maintenance budget
• **Vendor dependency**: Excessive reliance on external service providers

**Root Cause Analysis:**

**Equipment-Related Causes:**
• **Age and wear**: Equipment beyond economic life
• **Poor design**: Inherent reliability issues
• **Installation problems**: Improper setup or environment
• **Overloading**: Operating beyond design specifications
• **Contamination**: Dirty operating environment

**Maintenance-Related Causes:**
• **Inadequate PM**: Insufficient preventive maintenance
• **Poor procedures**: Incorrect maintenance practices
• **Skill gaps**: Inadequate technician training
• **Wrong parts**: Using incorrect or substandard components
• **Delayed maintenance**: Deferring scheduled maintenance

**Operational Causes:**
• **Operator errors**: Improper equipment operation
• **Poor training**: Inadequate operator education
• **Process issues**: Upstream problems affecting equipment
• **Environmental factors**: Temperature, humidity, contamination
• **Material quality**: Poor quality inputs causing equipment stress

**Corrective Action Framework:**

**Immediate Actions (0-30 days):**
• **Cost analysis**: Detailed breakdown of maintenance expenses
• **Failure analysis**: Identify top 5 failure modes
• **Emergency repairs**: Address critical safety and production issues
• **Vendor review**: Evaluate service provider performance
• **Budget reallocation**: Shift resources to high-impact areas

**Short-term Actions (1-6 months):**
• **PM optimization**: Revise preventive maintenance schedules
• **Training programs**: Enhance operator and technician skills
• **Spare parts review**: Optimize inventory levels and quality
• **Procedure updates**: Improve maintenance work instructions
• **Condition monitoring**: Implement basic monitoring systems

**Long-term Actions (6+ months):**
• **Equipment replacement**: Replace high-maintenance equipment
• **Technology upgrades**: Implement predictive maintenance systems
• **Process improvements**: Address root causes of equipment stress
• **Organizational changes**: Improve maintenance management
• **Strategic planning**: Develop long-term maintenance strategy

**Cost Reduction Strategies:**

**Preventive Approach:**
• **Reliability-centered maintenance**: Focus on critical failure modes
• **Condition-based maintenance**: Maintain based on actual condition
• **Operator involvement**: Train operators for basic maintenance
• **Supplier partnerships**: Develop strategic vendor relationships
• **Continuous improvement**: Regular review and optimization

**Technology Solutions:**
• **CMMS implementation**: Computerized maintenance management
• **IoT sensors**: Real-time equipment monitoring
• **Mobile maintenance**: Tablets and smartphones for technicians
• **Predictive analytics**: AI-powered failure prediction
• **Digital twins**: Virtual equipment models for optimization

**Performance Targets:**
• **Reduce total costs**: Target 15-25% reduction over 2 years
• **Improve reliability**: Increase MTBF by 20-40%
• **Reduce downtime**: Decrease unplanned downtime by 50%
• **Optimize inventory**: Reduce spare parts costs by 20-30%
• **Enhance skills**: Achieve 90% technician certification rates`,
      category: 'Problem Solving'
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
          Common questions about maintenance cost management and optimization for laser cutting operations
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
            Our maintenance cost management and reliability experts are here to help you optimize your maintenance strategy and reduce operational costs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Maintenance Cost Calculator Question'}
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
              onClick={() => window.location.href = '/contact/maintenance-expert'}
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

export default MaintenanceCostFAQ;
