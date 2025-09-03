import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const QualityGradeFAQ: React.FC = () => {
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
      question: 'How accurate is the quality grade prediction and what factors affect it?',
      answer: `Quality grade prediction accuracy depends on several factors and typically achieves 80-90% correlation with actual measurements:

**Prediction Accuracy by Quality Metric:**
• **Surface roughness**: ±15-25% accuracy for most materials
• **Perpendicularity**: ±20-30% accuracy depending on thickness
• **Dross formation**: 85-95% correct prediction of presence/absence
• **HAZ width**: ±20-35% accuracy based on thermal models

**Factors Affecting Accuracy:**
• **Material consistency**: Variations in composition affect results
• **Machine condition**: Worn optics and mechanics reduce accuracy
• **Environmental factors**: Temperature, humidity, vibration
• **Parameter stability**: Power fluctuations and speed variations
• **Focus quality**: Beam quality and focus position accuracy

**Accuracy by Material Type:**
• **Carbon steel**: Highest accuracy (85-90% correlation)
• **Stainless steel**: Good accuracy (80-85% correlation)
• **Aluminum**: Moderate accuracy (75-80% correlation)
• **Exotic alloys**: Lower accuracy (70-75% correlation)

**Improving Prediction Accuracy:**
• Use accurate material property data
• Ensure stable laser parameters
• Regular machine calibration and maintenance
• Validate with test cuts for critical applications
• Update model parameters based on actual results

**Validation Recommendations:**
• Always validate with test cuts for new materials
• Perform periodic accuracy checks with known parameters
• Document actual vs. predicted results for model improvement`,
      category: 'Prediction Accuracy'
    },
    {
      question: 'What quality grades should I target for different applications?',
      answer: `Quality grade requirements vary significantly by application and industry standards:

**ISO 9013 Quality Grade Guidelines:**

**Grade 1 (Rough Cutting):**
• **Applications**: Rough cutting, preparation for welding
• **Surface roughness**: >40 μm Ra
• **Perpendicularity**: >0.5mm deviation
• **Typical use**: Structural steel, heavy fabrication

**Grade 2 (Production Cutting):**
• **Applications**: General fabrication, non-critical parts
• **Surface roughness**: 20-40 μm Ra
• **Perpendicularity**: 0.3-0.5mm deviation
• **Typical use**: Construction, general manufacturing

**Grade 3 (Standard Quality):**
• **Applications**: Most industrial applications
• **Surface roughness**: 10-20 μm Ra
• **Perpendicularity**: 0.15-0.3mm deviation
• **Typical use**: Machinery parts, brackets, enclosures

**Grade 4 (High Quality):**
• **Applications**: Precision parts, visible surfaces
• **Surface roughness**: 5-10 μm Ra
• **Perpendicularity**: 0.05-0.15mm deviation
• **Typical use**: Automotive, electronics, decorative parts

**Grade 5 (Precision Cutting):**
• **Applications**: Critical precision components
• **Surface roughness**: <5 μm Ra
• **Perpendicularity**: <0.05mm deviation
• **Typical use**: Aerospace, medical devices, optical components

**Industry-Specific Requirements:**
• **Automotive**: Grade 3-4 for body panels, Grade 4-5 for engine components
• **Aerospace**: Grade 4-5 required for most applications
• **Medical devices**: Grade 4-5 for implants and instruments
• **Electronics**: Grade 3-4 for enclosures, Grade 4-5 for precision parts
• **Architecture**: Grade 2-3 for structural, Grade 3-4 for decorative

**Cost vs. Quality Trade-offs:**
• Grade 1-2: Fastest cutting, lowest cost
• Grade 3: Good balance of quality and speed
• Grade 4-5: Slower cutting, higher cost, premium quality`,
      category: 'Quality Standards'
    },
    {
      question: 'How can I improve cut quality when predictions show poor results?',
      answer: `Quality improvement requires systematic parameter optimization and process control:

**Parameter Optimization Strategies:**

**Power and Speed Adjustment:**
• **Reduce power**: Lower heat input improves surface finish
• **Optimize speed**: Find sweet spot for material thickness
• **Power-speed ratio**: Maintain optimal energy density
• **Multiple passes**: Lower power, multiple passes for thick materials

**Focus Optimization:**
• **Focus position**: Typically 1/3 thickness below surface
• **Beam quality**: Ensure clean optics and proper alignment
• **Focal length**: Match to material thickness and application
• **Depth of focus**: Consider for varying thickness materials

**Gas Selection and Pressure:**
• **Nitrogen cutting**: Clean cuts, no oxidation, higher quality
• **Oxygen cutting**: Faster cutting, some oxidation acceptable
• **Air cutting**: Economic option for lower quality requirements
• **Pressure optimization**: Higher pressure for thicker materials

**Machine and Process Improvements:**
• **Machine maintenance**: Clean optics, check alignment
• **Vibration control**: Ensure stable cutting platform
• **Material support**: Proper fixturing prevents distortion
• **Edge preparation**: Clean, straight material edges

**Advanced Techniques:**
• **Pulse shaping**: Custom pulse profiles for better quality
• **Beam shaping**: Optimize beam profile for application
• **Adaptive control**: Real-time parameter adjustment
• **Process monitoring**: Feedback control systems

**Quality Control Measures:**
• **Regular calibration**: Maintain machine accuracy
• **Parameter documentation**: Record optimal settings
• **Statistical process control**: Monitor quality trends
• **Continuous improvement**: Regular process optimization

**Troubleshooting Common Issues:**
• **Rough surface**: Reduce power, optimize speed, check focus
• **Dross formation**: Increase gas pressure, adjust parameters
• **Poor perpendicularity**: Reduce speed, improve beam quality
• **Large HAZ**: Reduce power, increase speed, use pulsing`,
      category: 'Quality Improvement'
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
          Common questions about quality grade prediction and laser cutting quality optimization
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
            Our quality control experts are here to help you optimize your laser cutting quality and achieve target grades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Quality Grade Calculator Question'}
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
              onClick={() => window.location.href = '/contact/quality-expert'}
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

export default QualityGradeFAQ;
