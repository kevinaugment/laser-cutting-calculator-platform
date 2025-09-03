import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const EquipmentComparisonFAQ: React.FC = () => {
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
      question: 'What are the most important factors to consider when comparing laser cutting equipment?',
      answer: `Equipment comparison requires evaluating multiple critical factors across technical, financial, and operational dimensions:

**Technical Performance Factors:**

**Cutting Capabilities:**
• **Power range**: Match laser power to material thickness requirements
• **Cutting speed**: Compare actual cutting speeds for your typical materials
• **Edge quality**: Evaluate surface finish and precision capabilities
• **Material compatibility**: Ensure equipment handles your material types
• **Thickness capacity**: Verify maximum cutting thickness for each material

**System Specifications:**
• **Beam quality (M²)**: Lower values provide better focus and edge quality
• **Positioning accuracy**: ±0.01-0.05mm for precision applications
• **Repeatability**: Consistent positioning over time
• **Work envelope**: Table size and material handling capacity
• **Automation level**: Manual, semi-automatic, or fully automated systems

**Financial Analysis Factors:**

**Total Cost of Ownership (TCO):**
• **Purchase price**: Initial equipment cost including installation
• **Operating costs**: Energy, gas, consumables, labor
• **Maintenance costs**: Scheduled maintenance, repairs, parts
• **Financing costs**: Interest, lease payments, depreciation
• **Opportunity costs**: Downtime, lost production, training

**Return on Investment (ROI):**
• **Productivity gains**: Increased throughput vs. current methods
• **Quality improvements**: Reduced rework and scrap costs
• **Labor savings**: Automation and efficiency improvements
• **Revenue potential**: New capabilities and market opportunities
• **Payback period**: Time to recover initial investment (typically 2-5 years)

**Operational Considerations:**

**Reliability and Uptime:**
• **MTBF (Mean Time Between Failures)**: Target >2000 hours
• **MTTR (Mean Time To Repair)**: Minimize downtime duration
• **Availability**: Overall equipment effectiveness (OEE) >85%
• **Preventive maintenance**: Scheduled maintenance requirements
• **Service response**: Local service availability and response times

**Ease of Use and Training:**
• **User interface**: Intuitive controls and programming
• **Training requirements**: Operator and programmer training time
• **Software compatibility**: CAD/CAM integration capabilities
• **Setup time**: Job changeover and material setup efficiency
• **Skill requirements**: Operator expertise needed

**Vendor and Support Factors:**

**Vendor Evaluation:**
• **Company stability**: Financial strength and market presence
• **Local support**: Service technicians and parts availability
• **Training programs**: Comprehensive operator and maintenance training
• **Software updates**: Ongoing technology improvements
• **Warranty terms**: Coverage period and included services

**Service and Support:**
• **Response time**: Emergency service availability (target <4 hours)
• **Parts availability**: Local inventory and delivery times
• **Remote diagnostics**: Online troubleshooting capabilities
• **Technical support**: Phone and online support quality
• **User community**: Active user groups and forums

**Decision Framework:**

**Weighted Scoring Method:**
• **Performance (30%)**: Speed, quality, capability
• **Cost (25%)**: TCO, ROI, financing options
• **Reliability (20%)**: Uptime, service, support
• **Ease of use (15%)**: Training, operation, maintenance
• **Vendor (10%)**: Stability, support, reputation

**Evaluation Process:**
1. **Define requirements**: Specify technical and business needs
2. **Vendor research**: Identify qualified suppliers
3. **Request proposals**: Detailed quotes and specifications
4. **Site visits**: See equipment in operation
5. **Reference checks**: Contact existing customers
6. **Financial analysis**: Calculate TCO and ROI
7. **Final evaluation**: Score and rank options`,
      category: 'Selection Criteria'
    },
    {
      question: 'How do I calculate and compare the total cost of ownership (TCO) for different equipment options?',
      answer: `TCO analysis provides a comprehensive view of equipment costs over its entire lifecycle:

**TCO Components and Calculation:**

**Initial Costs:**
• **Equipment purchase price**: Base machine cost
• **Installation costs**: Site preparation, utilities, setup (5-15% of purchase price)
• **Training costs**: Operator and maintenance training ($5,000-15,000)
• **Initial tooling**: Nozzles, lenses, fixtures ($2,000-10,000)
• **Software licenses**: CAD/CAM, nesting software ($5,000-25,000)

**Annual Operating Costs:**

**Energy Costs:**
• **Laser power consumption**: Rated power × operating hours × efficiency
• **Auxiliary systems**: Chillers, compressors, ventilation (30-50% of laser power)
• **Electricity rate**: Local utility rates (typically $0.08-0.15/kWh)
• **Annual energy cost**: Total kW × operating hours × rate

**Consumables and Materials:**
• **Assist gases**: Oxygen, nitrogen, air costs
• **Consumable parts**: Nozzles, lenses, mirrors
• **Replacement frequency**: Based on operating hours and conditions
• **Annual consumables**: $10,000-50,000 depending on usage

**Maintenance Costs:**
• **Preventive maintenance**: Scheduled service and parts (2-4% of purchase price annually)
• **Corrective maintenance**: Unplanned repairs and downtime
• **Service contracts**: Annual service agreements (3-8% of purchase price)
• **Internal maintenance**: Labor for routine maintenance

**Labor Costs:**
• **Operator wages**: Direct labor for equipment operation
• **Programming time**: Job setup and programming labor
• **Maintenance labor**: Internal maintenance staff time
• **Supervision**: Management and quality control time

**TCO Calculation Formula:**

**Basic TCO Calculation:**
TCO = Initial_Costs + (Annual_Operating_Costs × Years) + (Maintenance_Costs × Years) + (Labor_Costs × Years) - Residual_Value

**Detailed TCO Breakdown:**
Year 0: Purchase Price + Installation + Training + Initial Tooling
Year 1-N: Energy + Consumables + Maintenance + Labor + Insurance
Final Year: - Residual Value (typically 10-20% of purchase price)

**Comparative Analysis Methods:**

**Net Present Value (NPV):**
• **Discount rate**: Cost of capital (typically 8-12%)
• **Cash flow analysis**: Annual costs discounted to present value
• **NPV comparison**: Lower NPV indicates better financial option

**Levelized Cost per Hour:**
• **Total NPV**: Sum of all discounted costs
• **Operating hours**: Total hours over equipment life
• **Cost per hour**: NPV ÷ total operating hours

**Example TCO Comparison:**

**Equipment A (Lower Initial Cost):**
• Purchase price: $300,000
• Annual operating costs: $45,000
• 10-year TCO: $750,000
• Cost per hour: $37.50 (20,000 hours)

**Equipment B (Higher Initial Cost):**
• Purchase price: $450,000
• Annual operating costs: $35,000
• 10-year TCO: $800,000
• Cost per hour: $40.00 (20,000 hours)

**TCO Analysis Best Practices:**

**Data Collection:**
• **Vendor quotes**: Detailed cost breakdowns
• **Reference sites**: Actual operating cost data
• **Utility rates**: Current and projected energy costs
• **Labor rates**: Local wage rates and benefits

**Sensitivity Analysis:**
• **Operating hours**: Impact of utilization changes
• **Energy costs**: Effect of utility rate changes
• **Maintenance costs**: Variation in service requirements
• **Productivity**: Impact of speed and efficiency differences

**Hidden Costs to Consider:**
• **Downtime costs**: Lost production during maintenance
• **Quality costs**: Rework and scrap from equipment issues
• **Obsolescence**: Technology advancement impact
• **Facility costs**: Space, utilities, environmental compliance`,
      category: 'Financial Analysis'
    },
    {
      question: 'What are the common mistakes to avoid when selecting laser cutting equipment?',
      answer: `Equipment selection mistakes can be costly and long-lasting. Here are the most common pitfalls and how to avoid them:

**Technical Specification Mistakes:**

**Over-Specifying or Under-Specifying:**
• **Mistake**: Buying more capability than needed or insufficient capability
• **Impact**: Higher costs or inability to meet production requirements
• **Solution**: Conduct thorough needs analysis including future growth
• **Best practice**: Specify 20-30% capacity above current needs for growth

**Ignoring Application Requirements:**
• **Mistake**: Focusing only on power rating without considering application
• **Impact**: Poor performance on actual production parts
• **Solution**: Test cut actual parts during evaluation
• **Best practice**: Provide representative samples to all vendors

**Overlooking Integration Requirements:**
• **Mistake**: Not considering existing workflow and systems integration
• **Impact**: Bottlenecks, inefficiencies, additional costs
• **Solution**: Map entire production workflow before selection
• **Best practice**: Evaluate material handling and automation needs

**Financial Analysis Mistakes:**

**Focusing Only on Purchase Price:**
• **Mistake**: Selecting lowest initial cost without TCO analysis
• **Impact**: Higher long-term costs, poor ROI
• **Solution**: Calculate complete TCO over equipment lifecycle
• **Best practice**: Use 7-10 year analysis period for comparison

**Underestimating Operating Costs:**
• **Mistake**: Not accounting for all operating expenses
• **Impact**: Budget overruns, poor financial performance
• **Solution**: Include energy, consumables, maintenance, labor
• **Best practice**: Get actual cost data from reference customers

**Ignoring Financing Options:**
• **Mistake**: Not exploring lease, finance, or rental options
• **Impact**: Cash flow problems, missed opportunities
• **Solution**: Evaluate all financing alternatives
• **Best practice**: Consider tax implications and cash flow impact

**Vendor Selection Mistakes:**

**Insufficient Vendor Research:**
• **Mistake**: Not thoroughly evaluating vendor stability and support
• **Impact**: Poor service, parts availability issues, business risk
• **Solution**: Research vendor financial stability and market presence
• **Best practice**: Visit vendor facilities and reference sites

**Inadequate Service Evaluation:**
• **Mistake**: Not assessing local service and support capabilities
• **Impact**: Extended downtime, high service costs
• **Solution**: Evaluate local service presence and response times
• **Best practice**: Test service response during evaluation period

**Skipping Reference Checks:**
• **Mistake**: Not contacting existing customers for feedback
• **Impact**: Unknown problems, unrealistic expectations
• **Solution**: Contact multiple reference customers
• **Best practice**: Visit reference sites and observe operations

**Process and Planning Mistakes:**

**Rushing the Decision:**
• **Mistake**: Making quick decisions under pressure
• **Impact**: Poor choices, missed opportunities, regret
• **Solution**: Allow adequate time for thorough evaluation
• **Best practice**: Plan 6-12 months for major equipment decisions

**Inadequate Testing:**
• **Mistake**: Not conducting sufficient testing and trials
• **Impact**: Performance surprises, capability gaps
• **Solution**: Conduct comprehensive testing with actual parts
• **Best practice**: Test multiple materials, thicknesses, and geometries

**Poor Team Involvement:**
• **Mistake**: Limited input from operators, maintenance, and management
• **Impact**: Resistance to change, operational problems
• **Solution**: Include all stakeholders in evaluation process
• **Best practice**: Form cross-functional evaluation team

**Implementation Mistakes:**

**Inadequate Training:**
• **Mistake**: Insufficient operator and maintenance training
• **Impact**: Poor performance, safety issues, equipment damage
• **Solution**: Invest in comprehensive training programs
• **Best practice**: Plan for ongoing training and skill development

**Poor Installation Planning:**
• **Mistake**: Inadequate site preparation and installation planning
• **Impact**: Delays, additional costs, performance issues
• **Solution**: Detailed site preparation and installation planning
• **Best practice**: Use vendor installation services and expertise

**Lack of Performance Monitoring:**
• **Mistake**: Not tracking equipment performance after installation
• **Impact**: Missed optimization opportunities, warranty issues
• **Solution**: Implement performance monitoring and reporting
• **Best practice**: Regular performance reviews and optimization

**Risk Mitigation Strategies:**

**Due Diligence Checklist:**
• **Technical validation**: Comprehensive testing and verification
• **Financial analysis**: Detailed TCO and ROI calculations
• **Vendor assessment**: Stability, support, and reputation evaluation
• **Reference verification**: Multiple customer contacts and site visits
• **Contract review**: Terms, warranties, and service agreements

**Decision Documentation:**
• **Requirements specification**: Detailed technical and business requirements
• **Evaluation criteria**: Weighted scoring methodology
• **Vendor comparison**: Side-by-side analysis of all options
• **Financial justification**: ROI and payback calculations
• **Risk assessment**: Identified risks and mitigation strategies`,
      category: 'Common Mistakes'
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
          Common questions about equipment comparison and selection for laser cutting operations
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
                      
                      // Handle code blocks
                      if (paragraph.startsWith('```')) {
                        return (
                          <pre key={pIndex} className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-3">
                            <code>{paragraph.replace(/```/g, '')}</code>
                          </pre>
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
            Our equipment selection and investment analysis experts are here to help you make the best equipment decisions for your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Equipment Comparison Calculator Question'}
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
              onClick={() => window.location.href = '/contact/equipment-expert'}
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

export default EquipmentComparisonFAQ;
