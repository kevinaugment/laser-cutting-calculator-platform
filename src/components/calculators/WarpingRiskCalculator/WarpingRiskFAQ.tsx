import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const WarpingRiskFAQ: React.FC = () => {
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
      question: 'What are the main factors that cause warping in laser cutting and how can I predict and prevent it?',
      answer: `Warping in laser cutting is a complex phenomenon caused by thermal stress and material response. Understanding and controlling these factors is essential for quality production:

**Primary Warping Mechanisms:**

**Thermal Stress Development:**
• **Localized Heating**: Laser energy creates intense heat zones that expand the material locally
• **Thermal Gradients**: Temperature differences across the part create internal stresses
• **Cooling Contraction**: Rapid cooling after cutting causes material contraction and stress
• **Residual Stress**: Locked-in stresses remain after cooling, causing delayed warping
• **Thermal Cycling**: Multiple cuts create cumulative thermal stress effects

**Material Response Factors:**
• **Thermal Expansion**: Materials expand when heated, creating dimensional changes
• **Elastic-Plastic Behavior**: High temperatures can cause permanent plastic deformation
• **Microstructural Changes**: Heat treatment effects alter material properties
• **Grain Structure**: Material grain orientation affects thermal stress distribution
• **Phase Transformations**: Some materials undergo phase changes that affect dimensions

**Geometric Influences:**
• **Aspect Ratio**: Long, thin parts are more susceptible to warping
• **Thickness Variations**: Thin sections heat and cool faster than thick sections
• **Feature Distribution**: Concentrated features create localized stress concentrations
• **Support Conditions**: How the part is held during cutting affects stress development
• **Cut Sequence**: Order of cuts influences stress accumulation patterns

**Warping Prediction Methods:**

**Risk Assessment Factors:**
• **Material Properties**: Thermal expansion, conductivity, elastic modulus, yield strength
• **Geometric Analysis**: Length-to-width ratio, thickness-to-dimension ratio, feature density
• **Process Parameters**: Laser power, cutting speed, heat input density, cooling rate
• **Constraint Analysis**: Support conditions, fixture design, material restraint
• **Thermal History**: Previous heating cycles, residual stress state, material condition

**Predictive Modeling:**
• **Finite Element Analysis**: Detailed thermal-structural simulation for complex parts
• **Empirical Models**: Statistical relationships based on experimental data
• **Risk Scoring**: Weighted factor analysis for quick assessment
• **Thermal Mapping**: Temperature distribution prediction during cutting
• **Stress Analysis**: Calculation of thermal stress magnitudes and distributions

**Prevention Strategies:**

**Process Optimization:**
• **Parameter Selection**: Optimize power, speed, and gas settings for minimal heat input
• **Cut Sequencing**: Plan cutting order to minimize stress accumulation
• **Thermal Management**: Control heating and cooling rates through process timing
• **Support Design**: Use appropriate fixtures and supports to control deformation
• **Stress Relief**: Incorporate stress relief cuts or features in the design

**Design Modifications:**
• **Geometry Optimization**: Modify part shape to reduce warping susceptibility
• **Feature Placement**: Distribute cuts and features to balance thermal loads
• **Thickness Considerations**: Maintain uniform thickness where possible
• **Support Features**: Add temporary supports that can be removed after cutting
• **Sectioning Strategy**: Divide large parts into smaller, more stable sections

**Material Considerations:**
• **Material Selection**: Choose materials with lower thermal expansion or higher thermal conductivity
• **Pre-conditioning**: Use stress-relieved or pre-treated materials
• **Grain Orientation**: Consider material grain direction in part layout
• **Alloy Selection**: Select alloys with better dimensional stability
• **Heat Treatment**: Apply appropriate heat treatment before or after cutting

**Practical Implementation:**

**Monitoring and Control:**
• **Temperature Monitoring**: Use thermal imaging to track heat distribution
• **Dimensional Inspection**: Measure parts during and after cutting
• **Process Feedback**: Adjust parameters based on warping observations
• **Quality Control**: Implement inspection procedures for early detection
• **Documentation**: Record successful parameter combinations for different materials

**Corrective Actions:**
• **Fixture Adjustment**: Modify support conditions if warping occurs
• **Parameter Modification**: Adjust cutting parameters to reduce heat input
• **Post-Process Correction**: Use mechanical or thermal straightening methods
• **Design Revision**: Modify part geometry if warping persists
• **Alternative Processes**: Consider different cutting methods for problematic parts

**Expected Results:**
• **Risk Reduction**: 60-80% reduction in warping incidents through proper prediction
• **Quality Improvement**: Improved dimensional accuracy and part flatness
• **Cost Savings**: Reduced rework and scrap rates
• **Process Reliability**: More consistent and predictable cutting results
• **Customer Satisfaction**: Better part quality and delivery performance`,
      category: 'Warping Prevention'
    },
    {
      question: 'How do different materials behave under thermal stress and what are the best practices for each material type?',
      answer: `Different materials exhibit unique thermal behavior and warping characteristics. Understanding material-specific responses is crucial for effective warping prevention:

**Carbon Steel Behavior:**

**Thermal Characteristics:**
• **Thermal Expansion**: Moderate expansion coefficient (11-13 × 10⁻⁶/°C)
• **Thermal Conductivity**: Good heat conduction (45-50 W/m·K)
• **Heat Capacity**: Moderate thermal mass requiring controlled heating
• **Phase Changes**: Potential for microstructural changes at high temperatures
• **Stress Response**: Predictable elastic-plastic behavior under thermal stress

**Warping Susceptibility:**
• **Low to Moderate Risk**: Generally stable with proper parameter control
• **Thickness Sensitivity**: Thin sheets (<3mm) more prone to warping
• **Geometry Effects**: Long, narrow parts require careful thermal management
• **Residual Stress**: Can accumulate with multiple heating cycles
• **Quality Impact**: Warping affects dimensional accuracy and edge straightness

**Best Practices:**
• **Parameter Settings**: Moderate power (60-80%), controlled speed (1000-3000 mm/min)
• **Heat Management**: Allow cooling time between nearby cuts
• **Support Strategy**: Use adequate support for thin sections
• **Cut Sequencing**: Cut external contours last to maintain part stability
• **Quality Control**: Monitor for heat tinting and dimensional changes

**Stainless Steel Behavior:**

**Thermal Characteristics:**
• **Thermal Expansion**: High expansion coefficient (16-18 × 10⁻⁶/°C)
• **Thermal Conductivity**: Lower heat conduction (15-25 W/m·K)
• **Heat Retention**: Retains heat longer, creating extended thermal zones
• **Austenitic Structure**: Stable crystal structure but high expansion
• **Work Hardening**: Can work harden under thermal stress

**Warping Susceptibility:**
• **High Risk**: Significant warping potential due to high thermal expansion
• **Heat Accumulation**: Poor heat conduction leads to localized overheating
• **Distortion Patterns**: Characteristic bowl-shaped warping in large sheets
• **Edge Effects**: Pronounced edge curling and distortion
• **Stress Concentration**: High stress at cut intersections and corners

**Best Practices:**
• **Reduced Heat Input**: Lower power settings (40-60%), higher speeds
• **Thermal Breaks**: Implement cooling pauses between cuts
• **Support Enhancement**: Use more extensive support systems
• **Cut Planning**: Minimize heat accumulation through strategic sequencing
• **Post-Process**: Consider stress relief annealing for critical parts

**Aluminum Behavior:**

**Thermal Characteristics:**
• **Thermal Expansion**: Very high expansion coefficient (23-24 × 10⁻⁶/°C)
• **Thermal Conductivity**: Excellent heat conduction (200-250 W/m·K)
• **Rapid Heat Dissipation**: Quick heat spreading and cooling
• **Low Melting Point**: Lower temperature threshold for thermal effects
• **Oxide Formation**: Rapid oxidation affects surface properties

**Warping Susceptibility:**
• **Very High Risk**: Highest warping potential among common materials
• **Rapid Thermal Response**: Quick heating and cooling create dynamic stresses
• **Uniform Distortion**: Heat spreads quickly, affecting larger areas
• **Thickness Critical**: Even moderate thicknesses can warp significantly
• **Support Dependency**: Heavily dependent on support conditions

**Best Practices:**
• **Optimized Parameters**: Balanced power-speed combinations for controlled heating
• **Enhanced Support**: Comprehensive support systems with thermal management
• **Rapid Processing**: Quick cutting to minimize thermal exposure time
• **Thermal Barriers**: Use heat sinks or cooling systems when possible
• **Design Adaptation**: Modify designs to accommodate thermal behavior

**Specialized Materials:**

**Titanium Alloys:**
• **Characteristics**: Low thermal conductivity, high strength, reactive
• **Warping Risk**: Moderate to high due to poor heat conduction
• **Best Practices**: Controlled atmosphere cutting, optimized parameters, enhanced cooling

**Copper Alloys:**
• **Characteristics**: Very high thermal conductivity, high reflectivity
• **Warping Risk**: Low to moderate due to excellent heat dissipation
• **Best Practices**: Higher power requirements, rapid cutting, reflectivity management

**High-Strength Steels:**
• **Characteristics**: High strength, potential for hardening, residual stress sensitivity
• **Warping Risk**: Moderate, depends on alloy composition and heat treatment
• **Best Practices**: Controlled heat input, stress relief considerations, quality monitoring

**Material Selection Guidelines:**

**For Minimal Warping Risk:**
• **Choose**: Carbon steel, low-carbon alloys, stress-relieved materials
• **Avoid**: High thermal expansion materials for precision applications
• **Consider**: Material thickness, grain orientation, and pre-treatment

**For High-Precision Applications:**
• **Material Preparation**: Use stress-relieved or annealed materials
• **Thickness Selection**: Optimize thickness for application requirements
• **Quality Specifications**: Define acceptable warping tolerances
• **Process Validation**: Conduct test cuts for critical applications

**Quality Control by Material:**
• **Carbon Steel**: Focus on heat tinting and dimensional accuracy
• **Stainless Steel**: Monitor for distortion patterns and edge quality
• **Aluminum**: Check for warping and surface oxidation
• **Specialized Alloys**: Material-specific quality criteria and testing methods`,
      category: 'Material Behavior'
    },
    {
      question: 'What cutting parameters and techniques can I use to minimize warping risk in my laser cutting operations?',
      answer: `Optimizing cutting parameters and techniques is essential for minimizing warping risk. A systematic approach to parameter selection and process control can significantly reduce thermal distortion:

**Fundamental Parameter Relationships:**

**Power and Speed Balance:**
• **Heat Input Control**: Lower power with higher speed reduces total heat input
• **Power Density**: Optimize beam focus for efficient cutting without excess heat
• **Speed Optimization**: Higher speeds reduce thermal exposure time
• **Power Ramping**: Gradual power changes prevent thermal shock
• **Pulse Parameters**: Use pulsed mode for better thermal control when applicable

**Heat Input Calculation:**
• **Linear Heat Input**: HI = Power / Speed (J/mm)
• **Target Range**: Minimize heat input while maintaining cut quality
• **Material Specific**: Adjust targets based on material thermal properties
• **Thickness Scaling**: Increase heat input proportionally with thickness
• **Quality Balance**: Balance between cut quality and thermal effects

**Advanced Parameter Strategies:**

**Multi-Pass Cutting:**
• **Reduced Heat Per Pass**: Distribute total heat input across multiple passes
• **Cooling Between Passes**: Allow thermal recovery between cutting passes
• **Progressive Cutting**: Gradually increase cut depth to control heat buildup
• **Quality Benefits**: Often improves edge quality while reducing warping
• **Thickness Applications**: Particularly effective for thick materials (>10mm)

**Adaptive Parameter Control:**
• **Real-Time Adjustment**: Modify parameters based on thermal feedback
• **Zone-Based Settings**: Different parameters for different part areas
• **Feature-Specific**: Adjust parameters based on local geometry
• **Thermal History**: Consider previous cuts when setting parameters
• **Quality Monitoring**: Continuous adjustment based on cut quality feedback

**Process Sequencing Techniques:**

**Strategic Cut Ordering:**
• **Thermal Distribution**: Spread cuts to avoid heat concentration
• **Cooling Intervals**: Plan pauses for thermal recovery
• **Support Maintenance**: Cut support features last to maintain part stability
• **Stress Management**: Sequence cuts to minimize stress accumulation
• **Quality Preservation**: Protect critical features from thermal effects

**Heat Management Strategies:**
• **Skip Cutting**: Alternate between distant cuts to allow cooling
• **Sectional Cutting**: Divide large parts into thermally manageable sections
• **Progressive Release**: Gradually release material constraints
• **Thermal Barriers**: Use sacrificial material to absorb excess heat
• **Active Cooling**: Implement cooling systems for critical applications

**Fixture and Support Optimization:**

**Support Design Principles:**
• **Thermal Conduction**: Use supports that conduct heat away from the part
• **Constraint Control**: Provide adequate support without over-constraining
• **Accessibility**: Ensure supports don't interfere with cutting operations
• **Removal Planning**: Design supports for easy removal after cutting
• **Material Compatibility**: Use support materials compatible with the workpiece

**Advanced Support Techniques:**
• **Thermal Sinks**: Incorporate heat sinks in support structures
• **Flexible Supports**: Use supports that accommodate thermal expansion
• **Graduated Support**: Vary support density based on thermal risk
• **Active Systems**: Implement active cooling or heating in supports
• **Monitoring Integration**: Include sensors in support systems for feedback

**Gas and Environmental Control:**

**Assist Gas Optimization:**
• **Cooling Effect**: Use assist gas for additional cooling
• **Gas Selection**: Choose gases that enhance cooling (nitrogen vs. oxygen)
• **Pressure Control**: Optimize pressure for cooling without affecting cut quality
• **Flow Patterns**: Design gas flow for maximum thermal management
• **Purity Considerations**: High-purity gases for better thermal control

**Environmental Factors:**
• **Ambient Temperature**: Control workshop temperature for consistent results
• **Humidity Control**: Manage humidity to prevent condensation and oxidation
• **Air Circulation**: Ensure adequate ventilation for heat removal
• **Thermal Stability**: Allow equipment to reach thermal equilibrium
• **Contamination Control**: Prevent contamination that affects thermal properties

**Quality Control and Monitoring:**

**Real-Time Monitoring:**
• **Thermal Imaging**: Monitor temperature distribution during cutting
• **Dimensional Tracking**: Measure parts during cutting process
• **Vibration Monitoring**: Detect stress-related vibrations
• **Cut Quality Assessment**: Continuous evaluation of edge quality
• **Process Feedback**: Automatic adjustment based on monitoring data

**Post-Process Evaluation:**
• **Dimensional Inspection**: Comprehensive measurement of final parts
• **Warping Assessment**: Quantify warping magnitude and patterns
• **Quality Documentation**: Record results for process improvement
• **Parameter Correlation**: Analyze relationships between parameters and results
• **Continuous Improvement**: Refine parameters based on accumulated data

**Implementation Guidelines:**

**Parameter Development Process:**
1. **Material Characterization**: Understand thermal properties and behavior
2. **Initial Parameter Selection**: Start with conservative settings
3. **Test Cutting**: Conduct systematic parameter trials
4. **Quality Evaluation**: Assess both cut quality and warping
5. **Parameter Refinement**: Optimize based on test results
6. **Process Validation**: Confirm parameters with production parts
7. **Documentation**: Record successful parameter combinations

**Expected Improvements:**
• **Warping Reduction**: 50-75% reduction in warping incidents
• **Quality Enhancement**: Improved dimensional accuracy and surface finish
• **Process Reliability**: More consistent and predictable results
• **Efficiency Gains**: Reduced rework and improved throughput
• **Cost Savings**: Lower material waste and labor costs`,
      category: 'Parameter Optimization'
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
          Common questions about warping risk assessment and thermal management for laser cutting operations
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
            Our warping risk assessment and thermal management experts are here to help you achieve better quality and reduce production issues.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Warping Risk Calculator Question'}
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
              onClick={() => window.location.href = '/contact/warping-expert'}
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

export default WarpingRiskFAQ;
