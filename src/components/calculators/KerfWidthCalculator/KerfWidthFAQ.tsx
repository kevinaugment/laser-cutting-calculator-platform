import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const KerfWidthFAQ: React.FC = () => {
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
      question: 'How accurate is the kerf width prediction and what factors affect it?',
      answer: `Kerf width prediction accuracy depends on several factors and typically achieves 85-95% correlation with actual measurements:

**Prediction Accuracy by Material:**
• **Carbon steel**: Highest accuracy (90-95% correlation)
• **Stainless steel**: Good accuracy (85-90% correlation)
• **Aluminum**: Moderate accuracy (80-85% correlation)
• **Exotic alloys**: Lower accuracy (75-80% correlation)

**Key Factors Affecting Accuracy:**
• **Beam quality**: M² factor and beam profile consistency
• **Focus position**: Deviation from optimal focus affects kerf width significantly
• **Material consistency**: Variations in composition, thickness, and surface condition
• **Machine condition**: Lens cleanliness, alignment, and mechanical stability
• **Process stability**: Power fluctuations, speed variations, gas pressure consistency

**Typical Kerf Width Ranges:**
• **Thin materials (0.5-3mm)**: 0.08-0.15mm kerf width
• **Medium thickness (3-10mm)**: 0.12-0.25mm kerf width
• **Thick materials (10-25mm)**: 0.20-0.40mm kerf width

**Improving Prediction Accuracy:**
• **Regular calibration**: Validate predictions with actual measurements
• **Material testing**: Establish material-specific constants
• **Process monitoring**: Track and compensate for parameter drift
• **Environmental control**: Maintain stable temperature and humidity
• **Beam quality maintenance**: Regular optics cleaning and alignment

**Validation Recommendations:**
• Always perform test cuts for new materials or critical applications
• Measure kerf width at multiple points along the cut
• Document actual vs. predicted values for model improvement
• Update material constants based on measurement data`,
      category: 'Prediction Accuracy'
    },
    {
      question: 'How do I implement kerf width compensation in my CAD/CAM system?',
      answer: `Implementing kerf width compensation requires systematic approach in CAD/CAM programming:

**Compensation Methods:**

**1. Path Offset Method (Most Common):**
• **Inward offset**: Move cutting path inward by kerf width/2
• **Outward offset**: Move cutting path outward by kerf width/2
• **Direction rule**: Offset toward the waste material side

**2. Tool Diameter Compensation:**
• **Set tool diameter**: Use kerf width as "tool diameter" in CAM
• **Compensation direction**: Left/right compensation based on part geometry
• **Automatic calculation**: CAM system calculates offset paths

**Implementation Steps:**

**CAD Preparation:**
• **Design nominal dimensions**: Draw parts at final desired size
• **Mark cutting direction**: Indicate which side is waste material
• **Add reference features**: Include measurement points for verification

**CAM Programming:**
• **Kerf compensation value**: Typically kerf width ÷ 2
• **Compensation direction**: 
  - External cuts: Offset outward (away from part)
  - Internal cuts: Offset inward (toward center)
  - Slots: Offset both sides appropriately

**Software-Specific Settings:**
• **AutoCAD/Inventor**: Use offset command with calculated value
• **SolidWorks**: Apply kerf compensation in sheet metal features
• **Fusion 360**: Set kerf width in laser cutting setup
• **Hypertherm ProNest**: Built-in kerf compensation tools

**Verification Methods:**
• **Test cuts**: Cut sample parts and measure dimensions
• **Iterative adjustment**: Fine-tune compensation based on measurements
• **Statistical control**: Track dimensional accuracy over time
• **Process validation**: Verify compensation for different materials/thicknesses

**Common Compensation Values:**
• **Thin steel (1-3mm)**: 0.05-0.08mm compensation
• **Medium steel (3-10mm)**: 0.08-0.15mm compensation
• **Thick steel (10-25mm)**: 0.15-0.25mm compensation
• **Stainless steel**: Add 10-20% to carbon steel values
• **Aluminum**: Reduce carbon steel values by 10-15%

**Quality Control:**
• **First article inspection**: Measure all critical dimensions
• **In-process monitoring**: Check dimensions periodically
• **Compensation adjustment**: Update values based on measurement data
• **Documentation**: Record compensation values for each material/thickness combination`,
      category: 'CAD/CAM Integration'
    },
    {
      question: 'What causes kerf width variations and how can I minimize them?',
      answer: `Kerf width variations have multiple causes and require systematic control approaches:

**Primary Causes of Kerf Width Variation:**

**Machine-Related Factors:**
• **Power instability**: ±2-5% power variation can cause ±10-15% kerf variation
• **Speed inconsistency**: Acceleration/deceleration affects kerf width
• **Focus drift**: Thermal effects cause focus position changes
• **Beam quality degradation**: Dirty optics increase beam diameter
• **Mechanical vibration**: Reduces cutting precision and consistency

**Material-Related Factors:**
• **Thickness variation**: ±0.1mm thickness can cause ±15% kerf variation
• **Composition differences**: Alloy variations affect thermal properties
• **Surface condition**: Scale, rust, or coatings affect heat absorption
• **Material stress**: Internal stresses can cause kerf distortion

**Process-Related Factors:**
• **Gas pressure fluctuation**: ±10% pressure variation affects kerf geometry
• **Temperature changes**: Ambient temperature affects material properties
• **Cutting sequence**: Heat buildup affects subsequent cuts
• **Path geometry**: Corners and curves have different kerf characteristics

**Minimization Strategies:**

**Machine Optimization:**
• **Power stability**: Use high-quality power supplies with <1% variation
• **Motion control**: Implement smooth acceleration/deceleration profiles
• **Focus monitoring**: Use real-time focus position feedback
• **Preventive maintenance**: Regular cleaning and alignment schedules
• **Vibration control**: Isolate machine from external vibrations

**Process Control:**
• **Parameter standardization**: Document and maintain consistent parameters
• **Gas quality control**: Use high-purity gases with stable pressure
• **Environmental control**: Maintain stable temperature (±2°C)
• **Cutting sequence optimization**: Plan cuts to minimize heat effects
• **Real-time monitoring**: Track key parameters during cutting

**Quality Assurance:**
• **Statistical process control**: Monitor kerf width trends
• **Regular calibration**: Verify and adjust parameters weekly
• **Material inspection**: Check thickness and surface condition
• **Measurement protocols**: Standardized kerf width measurement procedures

**Typical Variation Targets:**
• **Excellent control**: ±5% kerf width variation
• **Good control**: ±10% kerf width variation
• **Acceptable control**: ±15% kerf width variation
• **Poor control**: >±20% kerf width variation

**Monitoring and Correction:**
• **Real-time feedback**: Automatic parameter adjustment systems
• **Trend analysis**: Identify systematic variations
• **Corrective actions**: Immediate response to out-of-control conditions
• **Continuous improvement**: Regular process optimization reviews`,
      category: 'Process Control'
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
          Common questions about kerf width calculation and precision cutting optimization
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
            Our precision cutting experts are here to help you optimize your kerf width control and achieve dimensional accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Kerf Width Calculator Question'}
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
              onClick={() => window.location.href = '/contact/precision-expert'}
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

export default KerfWidthFAQ;
