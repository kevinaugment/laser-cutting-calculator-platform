import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const HeatAffectedZoneFAQ: React.FC = () => {
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
      question: 'How accurate is the HAZ width calculation?',
      answer: `Our HAZ calculator is typically accurate within ±20% when input parameters match real operating conditions. Accuracy depends on:

• **Material properties**: Accurate thermal conductivity, density, and specific heat values
• **Process stability**: Consistent laser power and cutting speed
• **Model limitations**: Simplified 2D thermal model vs. complex 3D reality
• **Environmental factors**: Ambient temperature and cooling conditions

For critical applications, always validate with metallographic analysis and hardness testing.`,
      category: 'Calculator Accuracy'
    },
    {
      question: 'What HAZ width is acceptable for different applications?',
      answer: `HAZ width requirements vary significantly by application:

**Structural Applications:**
• General fabrication: <0.5mm typically acceptable
• Critical structures: <0.3mm recommended
• Aerospace components: <0.2mm often required

**Precision Applications:**
• Electronics: <0.1mm for heat-sensitive components
• Medical devices: <0.15mm for biocompatible materials
• Optical components: <0.05mm for minimal distortion

**Material-Specific Guidelines:**
• **Carbon steel**: 0.2-0.4mm typical, <0.3mm for quality cuts
• **Stainless steel**: 0.15-0.3mm typical, minimize for corrosion resistance
• **Aluminum**: 0.1-0.25mm typical, control for strength retention
• **Titanium**: <0.2mm critical for aerospace applications

**Quality Grades:**
• Grade A: HAZ <0.15mm (excellent)
• Grade B: HAZ 0.15-0.25mm (good)
• Grade C: HAZ 0.25-0.4mm (acceptable)
• Grade D: HAZ >0.4mm (poor, requires optimization)`,
      category: 'Application Guidelines'
    },
    {
      question: 'How can I reduce HAZ width in my cutting process?',
      answer: `Several strategies can effectively reduce HAZ width:

**Parameter Optimization:**
• **Reduce laser power**: Lower power = less heat input
• **Increase cutting speed**: Faster cutting = less interaction time
• **Use pulsed mode**: Pulsing allows cooling between pulses
• **Optimize focus position**: Proper focus concentrates energy

**Process Modifications:**
• **Improve gas flow**: Better assist gas cooling
• **Use heat sinks**: Copper backing plates for heat dissipation
• **Pre-cooling**: Chill materials before cutting (where applicable)
• **Multiple passes**: Lower power multiple passes vs. single high power

**Equipment Considerations:**
• **Beam quality**: Better beam quality = smaller HAZ
• **Focus optics**: Clean, undamaged lenses for consistent focus
• **Power stability**: Stable power reduces thermal variations
• **Speed consistency**: Uniform speed prevents heat buildup

**Material Preparation:**
• **Surface cleanliness**: Clean surfaces for consistent absorption
• **Material support**: Proper fixturing prevents heat buildup
• **Edge preparation**: Smooth edges reduce heat concentration

**Monitoring and Control:**
• **Real-time temperature monitoring**: Feedback control systems
• **Process documentation**: Record optimal parameters
• **Regular calibration**: Maintain equipment accuracy`,
      category: 'Process Optimization'
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
          Common questions about heat affected zone analysis and thermal control
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
            Our thermal analysis experts are here to help you optimize your HAZ control and improve your cutting quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=HAZ Calculator Question'}
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
              onClick={() => window.location.href = '/contact/thermal-analysis-expert'}
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

export default HeatAffectedZoneFAQ;
