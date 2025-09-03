import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const CutPathOptimizerFAQ: React.FC = () => {
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
      question: 'What are the key factors that affect cut path optimization and how can I improve cutting efficiency?',
      answer: `Cut path optimization involves multiple interconnected factors that significantly impact production efficiency, quality, and costs:

**Primary Optimization Factors:**

**Geometric Considerations:**
• **Travel Distance Minimization**: Reducing non-productive rapid movements between cuts
• **Path Sequencing**: Optimal order of cutting operations to minimize total time
• **Lead-in/Lead-out Strategy**: Efficient entry and exit points for each cut
• **Common Line Cutting**: Sharing cut paths between adjacent parts when possible
• **Bridge Cutting**: Strategic connection points to maintain part stability

**Thermal Management:**
• **Heat Distribution**: Spreading thermal load across the material to prevent localized overheating
• **Cooling Time**: Allowing adequate cooling between nearby cuts to prevent heat accumulation
• **Thermal Stress Reduction**: Sequencing cuts to minimize material distortion
• **Hot Spot Avoidance**: Preventing concentrated heat buildup in small areas
• **Progressive Cutting**: Gradual material removal to maintain thermal balance

**Quality Optimization:**
• **Edge Quality Consistency**: Maintaining uniform cutting conditions throughout the job
• **Precision Maintenance**: Minimizing thermal effects that can affect dimensional accuracy
• **Surface Finish**: Optimizing parameters for consistent surface quality
• **Burr Minimization**: Reducing secondary operations through proper path planning
• **Tolerance Control**: Ensuring dimensional requirements are met consistently

**Efficiency Improvement Strategies:**

**Algorithm-Based Optimization:**
• **Traveling Salesman Problem (TSP)**: Mathematical approach to minimize travel distance
• **Genetic Algorithms**: Evolutionary optimization for complex multi-objective problems
• **Simulated Annealing**: Probabilistic technique for finding near-optimal solutions
• **Nearest Neighbor**: Simple heuristic for quick path optimization
• **Cluster Analysis**: Grouping nearby features for efficient processing

**Production Workflow Optimization:**
• **Batch Processing**: Grouping similar operations for maximum efficiency
• **Setup Reduction**: Minimizing tool changes and parameter adjustments
• **Material Flow**: Optimizing part removal and handling sequences
• **Quality Checkpoints**: Strategic inspection points to prevent defect propagation
• **Automation Integration**: Designing paths compatible with automated systems

**Practical Implementation Tips:**

**Software Tools:**
• **CAM System Integration**: Using advanced nesting and path optimization features
• **Simulation Software**: Validating paths before production to identify issues
• **Real-time Monitoring**: Tracking performance metrics for continuous improvement
• **Data Analytics**: Analyzing historical data to identify optimization opportunities

**Machine Considerations:**
• **Acceleration Limits**: Respecting machine dynamics for smooth operation
• **Cutting Head Clearance**: Ensuring adequate clearance for complex geometries
• **Gas Flow Optimization**: Maintaining consistent assist gas delivery
• **Power Management**: Balancing laser power for optimal efficiency and quality

**Measurable Benefits:**
• **Time Reduction**: 15-40% improvement in total cycle time
• **Quality Improvement**: 20-30% reduction in edge quality variations
• **Material Savings**: 5-15% improvement through better nesting and reduced waste
• **Energy Efficiency**: 10-25% reduction in power consumption per part
• **Tool Life Extension**: 20-35% longer consumable life through optimized parameters`,
      category: 'Optimization Strategies'
    },
    {
      question: 'How do thermal effects impact cutting quality and what path strategies can minimize heat-related problems?',
      answer: `Thermal effects are critical factors in laser cutting that directly impact part quality, dimensional accuracy, and production efficiency:

**Understanding Thermal Effects:**

**Heat Accumulation Mechanisms:**
• **Localized Heating**: Concentrated laser energy creates intense heat zones
• **Heat Conduction**: Thermal energy spreads through material thickness and surrounding areas
• **Thermal Gradients**: Temperature differences create internal stresses
• **Cooling Rate Variations**: Different cooling rates affect microstructure and properties
• **Cumulative Effects**: Multiple nearby cuts compound thermal stress

**Quality Impact Assessment:**
• **Dimensional Distortion**: Thermal expansion and contraction cause part warping
• **Edge Quality Degradation**: Excessive heat creates rough edges and increased HAZ
• **Metallurgical Changes**: Heat treatment effects alter material properties
• **Residual Stress**: Internal stresses can cause cracking or dimensional instability
• **Surface Oxidation**: High temperatures promote oxide formation and discoloration

**Thermal Management Strategies:**

**Path Sequencing Optimization:**
• **Heat Distribution**: Spreading cuts across the sheet to prevent localized overheating
• **Cooling Intervals**: Allowing time between nearby cuts for thermal recovery
• **Progressive Cutting**: Gradual material removal to maintain thermal balance
• **Symmetrical Patterns**: Balanced cutting sequences to minimize distortion
• **Thermal Zones**: Dividing the sheet into thermal management zones

**Advanced Thermal Control:**
• **Dynamic Parameter Adjustment**: Modifying cutting parameters based on thermal history
• **Adaptive Cooling**: Implementing active cooling strategies for critical areas
• **Thermal Modeling**: Using simulation to predict and prevent thermal issues
• **Real-time Monitoring**: Temperature sensing for adaptive process control
• **Stress Relief Cuts**: Strategic cuts to release thermal stress buildup

**Specific Path Strategies:**

**Heat Avoidance Techniques:**
• **Skip Cutting**: Alternating between distant cuts to allow cooling
• **Spiral Patterns**: Gradual inward or outward cutting to manage heat flow
• **Sector Division**: Dividing complex parts into thermal management sectors
• **Cooling Paths**: Incorporating non-cutting movements for thermal recovery
• **Temperature-Based Sequencing**: Ordering cuts based on thermal considerations

**Quality Preservation Methods:**
• **Lead-in Optimization**: Proper entry techniques to minimize heat shock
• **Exit Strategy**: Clean exit methods to prevent heat buildup at cut termination
• **Parameter Ramping**: Gradual parameter changes to maintain thermal stability
• **Assist Gas Management**: Optimizing gas flow for thermal control
• **Pulse Cutting**: Using pulsed laser modes for thermal management

**Practical Implementation:**

**Monitoring and Control:**
• **Thermal Imaging**: Real-time temperature monitoring during cutting
• **Process Feedback**: Adjusting parameters based on thermal measurements
• **Quality Metrics**: Tracking thermal-related defects for process improvement
• **Predictive Models**: Using thermal models to optimize cutting sequences
• **Automated Adjustment**: Implementing closed-loop thermal control systems

**Material-Specific Considerations:**
• **Thermal Conductivity**: Adjusting strategies based on material heat transfer properties
• **Thickness Effects**: Modifying approaches for different material thicknesses
• **Alloy Sensitivity**: Special considerations for heat-sensitive materials
• **Coating Interactions**: Managing thermal effects with coated materials
• **Multi-Material Handling**: Strategies for mixed-material cutting jobs

**Expected Results:**
• **Distortion Reduction**: 40-70% decrease in thermal distortion
• **Edge Quality Improvement**: 25-50% improvement in surface finish consistency
• **Dimensional Accuracy**: ±0.05-0.1mm improvement in tolerance achievement
• **Reduced Rework**: 60-80% reduction in thermal-related quality issues
• **Process Stability**: More consistent results across production runs`,
      category: 'Thermal Management'
    },
    {
      question: 'What are the most effective algorithms for cut path optimization and how do I choose the right approach?',
      answer: `Cut path optimization algorithms range from simple heuristics to complex mathematical approaches, each with specific advantages and applications:

**Algorithm Categories and Applications:**

**Classical Optimization Algorithms:**

**Traveling Salesman Problem (TSP) Solutions:**
• **Exact Algorithms**: Branch-and-bound, dynamic programming for small problems (<50 points)
• **Approximation Algorithms**: Christofides algorithm (1.5-approximation guarantee)
• **Heuristic Methods**: Nearest neighbor, cheapest insertion, 2-opt improvements
• **Applications**: Optimal for simple point-to-point travel optimization
• **Performance**: Excellent for small to medium datasets, computationally intensive for large problems

**Genetic Algorithms (GA):**
• **Population-Based**: Evolves solutions through selection, crossover, and mutation
• **Multi-Objective**: Can optimize multiple criteria simultaneously (time, quality, energy)
• **Adaptive**: Self-improving through evolutionary pressure
• **Applications**: Complex multi-constraint optimization problems
• **Performance**: Good for large problems, requires parameter tuning

**Simulated Annealing (SA):**
• **Probabilistic**: Accepts worse solutions with decreasing probability
• **Global Optimization**: Avoids local optima through controlled randomness
• **Temperature Schedule**: Cooling strategy affects solution quality
• **Applications**: Single-objective optimization with complex constraints
• **Performance**: Robust for medium to large problems, sensitive to parameter settings

**Modern Optimization Approaches:**

**Ant Colony Optimization (ACO):**
• **Swarm Intelligence**: Mimics ant foraging behavior for path finding
• **Pheromone Trails**: Reinforces good solutions through artificial pheromones
• **Parallel Processing**: Natural parallelization for distributed computing
• **Applications**: Dynamic routing problems with changing constraints
• **Performance**: Excellent for real-time optimization, good scalability

**Particle Swarm Optimization (PSO):**
• **Social Behavior**: Particles share information to find optimal solutions
• **Velocity Updates**: Continuous optimization through position and velocity
• **Global Communication**: All particles share best-found solutions
• **Applications**: Continuous parameter optimization problems
• **Performance**: Fast convergence, good for real-time applications

**Machine Learning Approaches:**
• **Reinforcement Learning**: Learns optimal policies through trial and error
• **Neural Networks**: Pattern recognition for path optimization
• **Deep Learning**: Complex feature extraction for optimization decisions
• **Applications**: Adaptive optimization with learning capabilities
• **Performance**: Excellent for complex, data-rich environments

**Algorithm Selection Criteria:**

**Problem Characteristics:**
• **Problem Size**: Number of cuts, parts, and constraints
• **Complexity**: Single vs. multi-objective optimization
• **Constraints**: Machine limitations, quality requirements, time constraints
• **Dynamic Nature**: Static vs. changing optimization requirements
• **Real-time Needs**: Online vs. offline optimization requirements

**Performance Requirements:**
• **Solution Quality**: Optimality vs. near-optimality requirements
• **Computation Time**: Real-time vs. batch processing constraints
• **Memory Usage**: Available computational resources
• **Scalability**: Growth in problem size over time
• **Robustness**: Sensitivity to parameter changes and input variations

**Implementation Considerations:**
• **Development Time**: Algorithm complexity vs. implementation effort
• **Maintenance**: Long-term support and modification requirements
• **Integration**: Compatibility with existing systems and workflows
• **User Interface**: Ease of use and parameter adjustment
• **Validation**: Testing and verification requirements

**Practical Recommendations:**

**Small Problems (< 20 cuts):**
• **Exact TSP Algorithms**: Guaranteed optimal solutions
• **Simple Heuristics**: Nearest neighbor with local improvements
• **Computation Time**: Seconds to minutes
• **Applications**: Prototype parts, small batch production

**Medium Problems (20-100 cuts):**
• **Genetic Algorithms**: Good balance of quality and computation time
• **Simulated Annealing**: Robust performance across problem types
• **Hybrid Approaches**: Combining multiple algorithms for better results
• **Computation Time**: Minutes to hours
• **Applications**: Production parts, medium batch sizes

**Large Problems (> 100 cuts):**
• **Ant Colony Optimization**: Scalable with good solution quality
• **Machine Learning**: Adaptive optimization with historical data
• **Parallel Processing**: Distributed computing for faster results
• **Computation Time**: Hours for offline, seconds for online with pre-training
• **Applications**: High-volume production, complex nesting layouts

**Algorithm Performance Metrics:**
• **Solution Quality**: 5-15% improvement over basic heuristics
• **Computation Speed**: 10x-100x faster than exhaustive search
• **Scalability**: Linear to polynomial growth with problem size
• **Robustness**: ±2-5% variation in solution quality across runs
• **Implementation Effort**: 2-6 months development time depending on complexity`,
      category: 'Algorithm Selection'
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
          Common questions about cut path optimization and production efficiency for laser cutting operations
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
            Our cut path optimization and production efficiency experts are here to help you maximize your cutting performance and reduce production costs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Cut Path Optimizer Question'}
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
              onClick={() => window.location.href = '/contact/optimization-expert'}
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

export default CutPathOptimizerFAQ;
