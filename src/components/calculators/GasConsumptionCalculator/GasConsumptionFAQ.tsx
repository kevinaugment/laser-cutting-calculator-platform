import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const GasConsumptionFAQ: React.FC = () => {
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
      question: 'How can I reduce gas consumption costs without compromising cut quality?',
      answer: `Reducing gas consumption while maintaining quality requires systematic optimization:

**Gas Selection Optimization:**

**Material-Specific Gas Selection:**
• **Carbon steel (thin <3mm)**: Use compressed air instead of oxygen (60-80% cost reduction)
• **Carbon steel (thick >3mm)**: Optimize oxygen purity (99.5% vs 99.9% - 15-25% savings)
• **Stainless steel**: Use nitrogen with optimized pressure (reduce from 20 bar to 12-15 bar)
• **Aluminum**: Use nitrogen or compressed air depending on thickness and quality requirements

**Process Parameter Optimization:**

**Flow Rate Optimization:**
• **Cutting flow**: Reduce by 10-20% from manufacturer recommendations and test quality
• **Piercing flow**: Use separate lower flow rate for piercing (30-50% reduction possible)
• **Standby flow**: Implement automatic flow reduction during idle periods
• **Progressive flow**: Start with lower flow, increase only if quality issues occur

**Pressure Optimization:**
• **Minimum effective pressure**: Find lowest pressure that maintains cut quality
• **Dynamic pressure control**: Adjust pressure based on material thickness
• **Pressure ramping**: Use lower pressure for thin materials, higher for thick
• **System pressure**: Optimize supply pressure to minimize waste

**System Efficiency Improvements:**

**Equipment Optimization:**
• **Nozzle selection**: Use appropriate nozzle diameter (smaller = less gas consumption)
• **Nozzle condition**: Maintain clean, undamaged nozzles for optimal flow
• **Gas delivery system**: Minimize pressure drops in supply lines
• **Flow control**: Install precision flow controllers for accurate gas metering

**Process Improvements:**
• **Batch processing**: Group similar materials to minimize gas switching waste
• **Nesting optimization**: Reduce total cutting time through better material layout
• **Path optimization**: Minimize rapid movements that waste gas during acceleration
• **Setup reduction**: Reduce setup time that requires gas flow

**Cost Control Strategies:**

**Supply Chain Optimization:**
• **Bulk purchasing**: Negotiate better rates for higher volumes
• **Gas purity**: Use appropriate purity levels (not always highest purity needed)
• **Supplier comparison**: Regular market analysis for competitive pricing
• **Contract terms**: Negotiate favorable delivery and storage terms

**Monitoring and Control:**
• **Real-time monitoring**: Track consumption patterns and identify waste
• **Consumption targets**: Set and monitor gas consumption per part/hour
• **Operator training**: Educate operators on gas-efficient practices
• **Regular audits**: Periodic review of gas usage and optimization opportunities

**Quality Assurance:**
• **Test cuts**: Validate quality with reduced gas consumption settings
• **Quality metrics**: Monitor edge quality, dross formation, surface finish
• **Customer acceptance**: Ensure quality meets customer requirements
• **Documentation**: Record optimal settings for different materials/thicknesses

**Typical Savings Potential:**
• **Process optimization**: 15-30% reduction in gas consumption
• **Equipment upgrades**: 10-20% improvement in efficiency
• **Supply chain optimization**: 5-15% cost reduction
• **Operator training**: 10-25% reduction in waste
• **Total potential savings**: 25-50% of gas costs while maintaining quality`,
      category: 'Cost Optimization'
    },
    {
      question: 'What are the typical gas consumption rates for different materials and how do I benchmark my usage?',
      answer: `Gas consumption varies significantly by material, thickness, and cutting parameters:

**Typical Gas Consumption Rates:**

**Carbon Steel with Oxygen:**
• **1mm thickness**: 0.8-1.2 m³/hour at 2-4 bar pressure
• **3mm thickness**: 1.5-2.5 m³/hour at 4-6 bar pressure
• **6mm thickness**: 3.0-4.5 m³/hour at 6-8 bar pressure
• **10mm thickness**: 5.0-7.5 m³/hour at 8-12 bar pressure
• **20mm thickness**: 8.0-12.0 m³/hour at 12-16 bar pressure

**Stainless Steel with Nitrogen:**
• **1mm thickness**: 2.0-3.0 m³/hour at 8-12 bar pressure
• **3mm thickness**: 4.0-6.0 m³/hour at 12-16 bar pressure
• **6mm thickness**: 8.0-12.0 m³/hour at 16-20 bar pressure
• **10mm thickness**: 15.0-20.0 m³/hour at 18-22 bar pressure
• **15mm thickness**: 25.0-35.0 m³/hour at 20-25 bar pressure

**Aluminum with Nitrogen:**
• **1mm thickness**: 1.5-2.5 m³/hour at 6-10 bar pressure
• **3mm thickness**: 3.0-5.0 m³/hour at 10-14 bar pressure
• **6mm thickness**: 6.0-10.0 m³/hour at 12-16 bar pressure
• **10mm thickness**: 12.0-18.0 m³/hour at 14-18 bar pressure
• **20mm thickness**: 20.0-30.0 m³/hour at 16-20 bar pressure

**Benchmarking Your Usage:**

**Data Collection Methods:**
• **Flow meter readings**: Install calibrated flow meters on gas lines
• **Pressure monitoring**: Track pressure consumption patterns
• **Time studies**: Measure actual cutting, piercing, and idle times
• **Material tracking**: Record gas usage per material type and thickness

**Performance Metrics:**
• **Gas per linear meter**: m³ of gas per meter of cut length
• **Gas per part**: Total gas consumption per finished part
• **Gas per hour**: Consumption rate during active cutting
• **Gas efficiency ratio**: Actual vs. theoretical consumption

**Industry Benchmarks:**

**Efficient Operations:**
• **Carbon steel**: 0.6-0.8 m³ per linear meter (3mm thickness)
• **Stainless steel**: 1.2-1.8 m³ per linear meter (3mm thickness)
• **Aluminum**: 1.0-1.5 m³ per linear meter (3mm thickness)
• **Overall efficiency**: 75-85% of theoretical consumption

**Average Operations:**
• **Carbon steel**: 0.8-1.2 m³ per linear meter (3mm thickness)
• **Stainless steel**: 1.8-2.5 m³ per linear meter (3mm thickness)
• **Aluminum**: 1.5-2.2 m³ per linear meter (3mm thickness)
• **Overall efficiency**: 60-75% of theoretical consumption

**Factors Affecting Consumption:**

**Process Variables:**
• **Cutting speed**: Higher speeds may require more gas for quality
• **Laser power**: Higher power often allows lower gas consumption
• **Focus position**: Optimal focus reduces gas requirements
• **Nozzle standoff**: Proper distance optimizes gas flow efficiency

**System Variables:**
• **Machine condition**: Well-maintained systems are more efficient
• **Gas quality**: Higher purity may allow lower flow rates
• **Environmental conditions**: Temperature and humidity affect consumption
• **Operator skill**: Experienced operators waste less gas

**Improvement Targets:**
• **Short-term goal**: Achieve industry average benchmarks
• **Medium-term goal**: Reach top quartile performance (15-25% above average)
• **Long-term goal**: Achieve best-in-class efficiency (85%+ theoretical)
• **Continuous improvement**: 5-10% annual efficiency gains through optimization`,
      category: 'Benchmarking'
    },
    {
      question: 'How do I troubleshoot high gas consumption and identify waste sources?',
      answer: `High gas consumption requires systematic diagnosis to identify and eliminate waste sources:

**Systematic Troubleshooting Process:**

**Step 1: Data Collection and Analysis**
• **Baseline measurement**: Establish current consumption patterns
• **Consumption mapping**: Track usage by operation type (cutting, piercing, idle)
• **Time analysis**: Measure actual vs. planned cutting times
• **Material correlation**: Analyze consumption by material type and thickness

**Step 2: System Inspection**
• **Leak detection**: Check all connections, fittings, and valves for leaks
• **Pressure testing**: Verify system pressure at various points
• **Flow verification**: Calibrate and verify flow meter accuracy
• **Component inspection**: Check nozzles, valves, regulators for proper operation

**Common Waste Sources and Solutions:**

**Equipment-Related Waste:**
• **Gas leaks**: 10-30% of consumption can be lost to leaks
  - Solution: Regular leak detection with soap solution or electronic detectors
  - Check: All fittings, quick-disconnects, valve seals, hose connections
• **Worn nozzles**: Damaged nozzles increase gas consumption by 20-40%
  - Solution: Regular nozzle inspection and replacement schedule
  - Check: Nozzle bore condition, concentricity, surface damage
• **Incorrect nozzle size**: Wrong nozzle diameter wastes gas
  - Solution: Use manufacturer-recommended nozzle sizes for each application
  - Check: Nozzle diameter vs. material thickness requirements

**Process-Related Waste:**
• **Excessive flow rates**: Over-specified flow rates waste 15-25% of gas
  - Solution: Optimize flow rates through systematic testing
  - Method: Reduce flow in 10% increments while monitoring cut quality
• **Incorrect pressure settings**: Too high pressure increases consumption
  - Solution: Find minimum effective pressure for each material/thickness
  - Method: Pressure optimization testing with quality validation
• **Idle gas consumption**: Gas flow during non-cutting periods
  - Solution: Implement automatic gas flow control during idle periods
  - Method: Program machine to reduce/stop gas flow during rapid moves

**Operational Waste:**
• **Setup and changeover waste**: Gas consumption during job changes
  - Solution: Minimize setup times and gas purging requirements
  - Method: Batch similar materials, optimize job sequencing
• **Operator practices**: Inefficient operating procedures
  - Solution: Operator training on gas-efficient practices
  - Method: Standard operating procedures, performance monitoring
• **Poor job planning**: Inefficient cutting sequences and nesting
  - Solution: Optimize cutting paths and material utilization
  - Method: CAM software optimization, nesting software

**Diagnostic Tools and Methods:**

**Measurement Tools:**
• **Flow meters**: Real-time consumption monitoring
• **Pressure gauges**: System pressure verification
• **Leak detectors**: Electronic or ultrasonic leak detection
• **Data loggers**: Continuous consumption tracking

**Analysis Techniques:**
• **Consumption trending**: Track consumption patterns over time
• **Variance analysis**: Compare actual vs. expected consumption
• **Pareto analysis**: Identify largest sources of waste
• **Root cause analysis**: Systematic problem identification

**Corrective Actions:**

**Immediate Actions (0-30 days):**
• **Fix all identified leaks**: Can reduce consumption by 10-30%
• **Replace worn components**: Nozzles, seals, valves
• **Optimize flow rates**: Reduce to minimum effective levels
• **Implement idle gas control**: Automatic flow reduction

**Medium-term Actions (1-6 months):**
• **Operator training programs**: Gas-efficient operating practices
• **Process optimization**: Systematic parameter optimization
• **Equipment upgrades**: More efficient gas delivery systems
• **Monitoring system implementation**: Real-time consumption tracking

**Long-term Actions (6+ months):**
• **System redesign**: Optimize gas delivery architecture
• **Technology upgrades**: Advanced gas control systems
• **Continuous improvement**: Regular optimization reviews
• **Performance benchmarking**: Compare against industry standards

**Success Metrics:**
• **Consumption reduction**: Target 20-40% reduction in total gas costs
• **Efficiency improvement**: Achieve 80%+ of theoretical consumption
• **Waste elimination**: Reduce non-productive gas usage by 50%+
• **Cost savings**: Achieve ROI on optimization efforts within 6-12 months`,
      category: 'Troubleshooting'
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
          Common questions about gas consumption optimization and cost control for laser cutting operations
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
            Our gas consumption and cost optimization experts are here to help you reduce operating costs and improve efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Gas Consumption Calculator Question'}
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
              onClick={() => window.location.href = '/contact/gas-optimization-expert'}
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

export default GasConsumptionFAQ;
