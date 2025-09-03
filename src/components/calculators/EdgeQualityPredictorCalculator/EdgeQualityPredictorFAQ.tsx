import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const EdgeQualityPredictorFAQ: React.FC = () => {
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
      question: 'What edge quality can I expect for different materials and how do I optimize parameters?',
      answer: `Edge quality varies significantly by material type and cutting parameters. Here's a comprehensive guide:

**Material-Specific Edge Quality Expectations:**

**Carbon Steel:**
• **Thin (0.5-3mm)**: Ra 1.5-3.5 μm, Quality Grade 3-4
• **Medium (3-10mm)**: Ra 2.5-5.0 μm, Quality Grade 2-3
• **Thick (10-20mm)**: Ra 4.0-8.0 μm, Quality Grade 1-2
• **Optimization**: Use oxygen assist gas, optimize power/speed ratio

**Stainless Steel:**
• **Thin (0.5-3mm)**: Ra 2.0-4.0 μm, Quality Grade 3-4
• **Medium (3-10mm)**: Ra 3.5-6.0 μm, Quality Grade 2-3
• **Thick (10-15mm)**: Ra 5.0-10.0 μm, Quality Grade 1-2
• **Optimization**: Use nitrogen assist gas, control heat input

**Aluminum:**
• **Thin (0.5-3mm)**: Ra 1.8-3.8 μm, Quality Grade 3-4
• **Medium (3-8mm)**: Ra 3.0-5.5 μm, Quality Grade 2-3
• **Thick (8-15mm)**: Ra 4.5-8.5 μm, Quality Grade 1-2
• **Optimization**: Use nitrogen or air, manage thermal effects

**Parameter Optimization Strategies:**

**Power and Speed Balance:**
• **High quality (Grade 4)**: Lower speed, moderate power
• **Production balance (Grade 2-3)**: Optimize power/speed ratio
• **High speed (Grade 1-2)**: Higher power, faster speeds
• **Rule of thumb**: Power density 10⁶-10⁷ W/cm² for optimal quality

**Focus Position Optimization:**
• **Thin materials**: Focus on surface (0 to -1mm)
• **Medium thickness**: Focus at 1/3 depth (-1 to -3mm)
• **Thick materials**: Focus at 1/2 depth (-3 to -8mm)
• **Fine adjustment**: ±0.5mm for quality optimization

**Gas Pressure Optimization:**
• **Oxygen cutting**: 0.5-3 bar (carbon steel)
• **Nitrogen cutting**: 8-20 bar (stainless steel, aluminum)
• **Air cutting**: 4-12 bar (general purpose)
• **Quality focus**: Lower pressures for smoother edges

**Beam Quality Considerations:**
• **M² < 1.2**: Excellent quality potential, tight focus
• **M² 1.2-1.8**: Good quality, standard industrial applications
• **M² > 1.8**: Reduced quality potential, thicker materials only

**Quality Improvement Techniques:**

**Process Optimization:**
• **Pulse parameters**: Use pulsed mode for thin materials
• **Cutting sequence**: Optimize path to minimize thermal effects
• **Lead-in/out**: Use proper lead-in techniques
• **Multiple passes**: Consider for extreme quality requirements

**Equipment Optimization:**
• **Nozzle condition**: Clean, undamaged nozzles essential
• **Beam alignment**: Proper beam centering in nozzle
• **Gas purity**: High purity gases for best results
• **Machine stability**: Minimize vibration and thermal drift

**Quality Prediction Accuracy:**
• **Typical accuracy**: ±20% for surface roughness prediction
• **Best conditions**: ±10% with calibrated systems
• **Factors affecting accuracy**: Material consistency, machine condition, environmental factors
• **Validation**: Regular measurement recommended for critical applications`,
      category: 'Material Optimization'
    },
    {
      question: 'How do I interpret edge quality grades and what do the different measurements mean?',
      answer: `Edge quality assessment involves multiple characteristics and standardized grading systems:

**ISO 9013 Quality Grades:**

**Quality Grade 1 (Production Quality):**
• **Surface roughness**: Ra 10-25 μm
• **Perpendicularity tolerance**: ±0.5-1.0mm
• **Dross formation**: Heavy dross acceptable
• **Applications**: Rough cutting, preparation for machining
• **Typical cutting**: High speed, maximum productivity

**Quality Grade 2 (Good Quality):**
• **Surface roughness**: Ra 5-15 μm
• **Perpendicularity tolerance**: ±0.3-0.6mm
• **Dross formation**: Moderate dross, easily removable
• **Applications**: General fabrication, structural components
• **Typical cutting**: Balanced speed and quality

**Quality Grade 3 (High Quality):**
• **Surface roughness**: Ra 2.5-8 μm
• **Perpendicularity tolerance**: ±0.15-0.3mm
• **Dross formation**: Minimal dross
• **Applications**: Precision parts, visible surfaces
• **Typical cutting**: Quality-focused parameters

**Quality Grade 4 (Premium Quality):**
• **Surface roughness**: Ra 1-4 μm
• **Perpendicularity tolerance**: ±0.05-0.15mm
• **Dross formation**: Dross-free cutting
• **Applications**: High-precision components, aerospace
• **Typical cutting**: Optimized for maximum quality

**Edge Quality Measurements:**

**Surface Roughness (Ra):**
• **Definition**: Average roughness of the cut surface
• **Measurement**: Profilometer across cut edge
• **Typical range**: 1-25 μm depending on grade
• **Factors**: Power density, cutting speed, gas flow

**Perpendicularity (u):**
• **Definition**: Deviation from 90° edge angle
• **Measurement**: Coordinate measuring machine or gauge
• **Typical range**: ±0.05-1.0mm depending on grade
• **Factors**: Beam alignment, focus position, thermal effects

**Dross Formation:**
• **Definition**: Molten material adhering to cut edge
• **Assessment**: Visual inspection and measurement
• **Categories**: None, slight, moderate, heavy
• **Factors**: Gas pressure, cutting speed, material properties

**Heat Affected Zone (HAZ):**
• **Definition**: Thermally altered material adjacent to cut
• **Measurement**: Metallographic examination
• **Typical width**: 0.05-0.5mm depending on parameters
• **Impact**: Affects material properties and appearance

**Quality Assessment Process:**

**Measurement Procedures:**
• **Sample preparation**: Clean cut samples, proper mounting
• **Measurement locations**: Multiple points along cut edge
• **Statistical analysis**: Average values with standard deviation
• **Documentation**: Detailed measurement reports

**Quality Control Standards:**
• **Acceptance criteria**: Define quality requirements upfront
• **Measurement frequency**: Regular quality checks during production
• **Corrective actions**: Parameter adjustment based on measurements
• **Continuous improvement**: Track quality trends over time

**Practical Quality Guidelines:**

**Quality Selection Criteria:**
• **Grade 1**: Cost-critical applications, post-processing planned
• **Grade 2**: General manufacturing, good cost/quality balance
• **Grade 3**: Precision applications, minimal post-processing
• **Grade 4**: Critical applications, no post-processing acceptable

**Quality vs. Productivity Trade-offs:**
• **Higher quality**: Slower cutting, higher costs, better finish
• **Lower quality**: Faster cutting, lower costs, more post-processing
• **Optimization**: Balance quality requirements with production needs
• **Economic analysis**: Consider total cost including post-processing`,
      category: 'Quality Standards'
    },
    {
      question: 'What causes poor edge quality and how do I troubleshoot edge quality problems?',
      answer: `Poor edge quality has multiple causes requiring systematic troubleshooting:

**Common Edge Quality Problems:**

**Excessive Surface Roughness:**
• **Symptoms**: Ra > target values, rough cut surface
• **Primary causes**: Incorrect power/speed ratio, poor beam quality
• **Secondary causes**: Contaminated optics, worn nozzle, unstable gas flow
• **Solutions**: Optimize cutting parameters, clean/replace components

**Poor Perpendicularity:**
• **Symptoms**: Angled cut edges, dimensional inaccuracy
• **Primary causes**: Beam misalignment, incorrect focus position
• **Secondary causes**: Machine wear, thermal distortion, improper setup
• **Solutions**: Beam alignment, focus calibration, machine maintenance

**Excessive Dross Formation:**
• **Symptoms**: Molten material adhering to bottom edge
• **Primary causes**: Insufficient gas pressure, too slow cutting speed
• **Secondary causes**: Wrong gas type, nozzle problems, material issues
• **Solutions**: Increase gas pressure, optimize speed, check gas purity

**Heat Affected Zone Issues:**
• **Symptoms**: Discoloration, hardness changes, warping
• **Primary causes**: Excessive heat input, slow cutting speed
• **Secondary causes**: Poor heat dissipation, material properties
• **Solutions**: Reduce heat input, increase cutting speed, use heat sinks

**Systematic Troubleshooting Process:**

**Step 1: Problem Identification**
• **Visual inspection**: Examine cut samples under magnification
• **Measurement**: Quantify roughness, perpendicularity, dross
• **Documentation**: Record problem characteristics and severity
• **Pattern analysis**: Identify if problems are consistent or intermittent

**Step 2: Parameter Analysis**
• **Current settings**: Document all cutting parameters
• **Parameter ranges**: Compare to recommended values
• **Recent changes**: Identify any recent parameter modifications
• **Material verification**: Confirm material grade and condition

**Step 3: Equipment Inspection**
• **Optics condition**: Check lenses, mirrors for contamination/damage
• **Nozzle inspection**: Verify nozzle condition and alignment
• **Gas system**: Check pressure, flow rate, gas purity
• **Machine condition**: Assess mechanical condition and calibration

**Step 4: Corrective Actions**

**Parameter Optimization:**
• **Power adjustment**: Increase/decrease based on problem type
• **Speed optimization**: Balance with power for optimal heat input
• **Focus position**: Fine-tune for material thickness
• **Gas settings**: Optimize pressure and flow rate

**Equipment Maintenance:**
• **Optics cleaning**: Clean all optical components
• **Nozzle replacement**: Replace worn or damaged nozzles
• **Calibration**: Perform beam alignment and focus calibration
• **Preventive maintenance**: Follow manufacturer's maintenance schedule

**Process Improvements:**
• **Cutting sequence**: Optimize path to minimize thermal effects
• **Fixturing**: Improve part clamping and support
• **Environmental control**: Manage temperature and vibration
• **Material handling**: Ensure proper material preparation

**Advanced Troubleshooting:**

**Intermittent Quality Issues:**
• **Thermal effects**: Machine warm-up, environmental temperature
• **Material variations**: Batch-to-batch material differences
• **Consumable wear**: Gradual degradation of nozzles, lenses
• **Process drift**: Gradual parameter changes over time

**Material-Specific Issues:**
• **Stainless steel**: Nitrogen purity, heat management
• **Aluminum**: Reflectivity issues, thermal conductivity
• **Carbon steel**: Oxidation control, scale formation
• **Coated materials**: Coating interaction, adhesion issues

**Quality Improvement Strategies:**
• **Statistical process control**: Monitor quality trends
• **Design of experiments**: Systematic parameter optimization
• **Predictive maintenance**: Prevent equipment-related quality issues
• **Operator training**: Ensure consistent setup and operation procedures

**Prevention Strategies:**
• **Regular calibration**: Maintain equipment accuracy
• **Quality monitoring**: Continuous quality assessment
• **Preventive maintenance**: Scheduled component replacement
• **Process documentation**: Standardized procedures and parameters`,
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
          Common questions about edge quality prediction and optimization for laser cutting operations
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
            Our edge quality and laser cutting experts are here to help you achieve optimal cutting results and solve quality challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Edge Quality Predictor Question'}
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

export default EdgeQualityPredictorFAQ;
