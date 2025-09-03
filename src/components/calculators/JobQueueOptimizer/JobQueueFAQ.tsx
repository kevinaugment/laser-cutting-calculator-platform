import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const JobQueueFAQ: React.FC = () => {
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
      question: 'How does the job queue optimizer determine the best scheduling sequence?',
      answer: `The job queue optimizer uses a multi-objective optimization approach that considers several key factors:

**Priority Scoring Algorithm:**
• **Job Priority**: Critical (10), Urgent (8), High (6), Normal (4), Low (2)
• **Customer Importance**: VIP (1.5x), Preferred (1.2x), Standard (1.0x)
• **Urgency Weight**: Based on time until due date (10 for <24h, decreasing to 2 for >1 week)
• **Profit Margin**: Higher margin jobs receive priority boost
• **Resource Availability**: Considers machine and operator constraints

**Optimization Objectives:**
• **Makespan Minimization**: Reduce total completion time
• **Tardiness Reduction**: Minimize late deliveries
• **Resource Utilization**: Balance machine and operator workload
• **Setup Time Reduction**: Group similar jobs to minimize changeovers
• **Cost Optimization**: Consider operational and opportunity costs

**Algorithm Process:**
1. **Calculate Priority Scores**: Weighted combination of all factors
2. **Machine Assignment**: Match jobs to optimal machines based on capabilities
3. **Sequence Optimization**: Use heuristic algorithms (e.g., dispatching rules, genetic algorithms)
4. **Buffer Time Allocation**: Add appropriate buffers for quality and setup
5. **Constraint Validation**: Ensure all resource and timing constraints are met
6. **Performance Evaluation**: Calculate makespan, utilization, and cost metrics

**Dynamic Adjustments:**
• **Real-time Updates**: Adjust for machine breakdowns or rush orders
• **Load Balancing**: Redistribute work across available resources
• **Priority Escalation**: Automatically promote jobs approaching due dates
• **Bottleneck Management**: Identify and address capacity constraints

**Typical Results:**
• **15-30% reduction** in total makespan
• **20-40% improvement** in on-time delivery
• **10-25% increase** in machine utilization
• **5-15% reduction** in operational costs`,
      category: 'Optimization Algorithm'
    },
    {
      question: 'What factors should I consider when setting job priorities and weights?',
      answer: `Setting effective job priorities requires balancing multiple business objectives and operational constraints:

**Priority Classification Framework:**

**Critical Priority (Weight: 10):**
• **Customer Impact**: Major customer relationships at risk
• **Financial Impact**: High-value orders or penalty clauses
• **Time Sensitivity**: Immediate delivery required
• **Strategic Importance**: Key business opportunities
• **Examples**: Rush orders, contract commitments, VIP customers

**Urgent Priority (Weight: 8):**
• **Due Date**: Within 24-48 hours
• **Customer Type**: Preferred or high-volume customers
• **Profit Margin**: Above-average profitability
• **Resource Availability**: Limited window for completion

**High Priority (Weight: 6):**
• **Standard Lead Time**: Normal delivery expectations
• **Good Profitability**: Solid margin contribution
• **Regular Customers**: Established relationships
• **Moderate Complexity**: Standard processing requirements

**Normal Priority (Weight: 4):**
• **Flexible Timing**: Some delivery flexibility
• **Standard Margins**: Average profitability
• **New Customers**: Building relationships
• **Standard Processing**: Routine operations

**Low Priority (Weight: 2):**
• **Internal Jobs**: Maintenance, samples, testing
• **Extended Lead Times**: Long delivery windows
• **Low Margins**: Minimal profit contribution
• **Fill-in Work**: Capacity utilization jobs

**Weight Setting Guidelines:**

**Customer Importance Multipliers:**
• **VIP Customers (1.5x)**: Top 10% revenue contributors, strategic accounts
• **Preferred Customers (1.2x)**: Regular customers, good payment history
• **Standard Customers (1.0x)**: New or occasional customers

**Optimization Goal Weights:**
• **Urgency Weight (30-50%)**: Time-sensitive delivery focus
• **Customer Satisfaction (20-30%)**: Relationship management priority
• **Profitability Weight (15-25%)**: Margin optimization focus
• **Efficiency Weight (10-20%)**: Operational cost minimization

**Best Practices:**
• **Regular Review**: Update priorities based on changing business conditions
• **Clear Criteria**: Document priority assignment rules
• **Stakeholder Input**: Involve sales, operations, and management
• **Performance Tracking**: Monitor impact of priority decisions
• **Flexibility**: Allow for emergency priority changes`,
      category: 'Priority Management'
    },
    {
      question: 'How can I handle unexpected disruptions and dynamic schedule changes?',
      answer: `Managing disruptions effectively requires proactive planning and responsive systems:

**Common Disruption Types:**

**Machine-Related Disruptions:**
• **Breakdowns**: Unplanned equipment failures
• **Maintenance**: Scheduled or emergency maintenance
• **Setup Issues**: Longer than expected changeovers
• **Quality Problems**: Rework or process adjustments

**Material and Resource Disruptions:**
• **Material Shortages**: Supply chain delays
• **Quality Issues**: Defective materials requiring replacement
• **Operator Absence**: Sick leave, training, or scheduling conflicts
• **Tooling Problems**: Worn or damaged cutting tools

**Customer-Driven Changes:**
• **Rush Orders**: Emergency high-priority jobs
• **Specification Changes**: Design or material modifications
• **Quantity Changes**: Order increases or decreases
• **Delivery Changes**: Accelerated or delayed requirements

**Disruption Management Strategies:**

**Proactive Measures:**
• **Buffer Time**: Build 10-20% buffer into schedules
• **Backup Resources**: Maintain spare machines and cross-trained operators
• **Inventory Management**: Keep safety stock of critical materials
• **Preventive Maintenance**: Reduce unplanned downtime
• **Supplier Relationships**: Develop reliable supply chains

**Reactive Response System:**
• **Real-time Monitoring**: Track job progress and resource status
• **Automatic Alerts**: Notify when schedules are at risk
• **Dynamic Rescheduling**: Automatically adjust sequences
• **Priority Escalation**: Promote jobs approaching due dates
• **Resource Reallocation**: Shift work to available machines

**Rescheduling Algorithms:**
• **Right-Shift**: Delay affected jobs while maintaining sequence
• **Complete Reschedule**: Optimize entire remaining schedule
• **Partial Reschedule**: Optimize subset of affected jobs
• **Priority-Based**: Reschedule based on updated priorities

**Communication Protocols:**
• **Customer Notification**: Proactive communication about delays
• **Internal Updates**: Keep all stakeholders informed
• **Escalation Procedures**: Clear decision-making authority
• **Documentation**: Record disruptions and responses

**Performance Metrics:**
• **Recovery Time**: How quickly schedules are restored
• **Customer Impact**: Delivery performance maintenance
• **Cost Impact**: Additional costs from disruptions
• **Learning**: Continuous improvement from disruption analysis

**Technology Solutions:**
• **MES Integration**: Real-time production monitoring
• **IoT Sensors**: Equipment health monitoring
• **Mobile Alerts**: Instant notification systems
• **Dashboard Visibility**: Real-time status displays`,
      category: 'Disruption Management'
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
          Common questions about job queue optimization and production scheduling
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
            Our production scheduling experts are here to help you optimize your job queues and improve operational efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Job Queue Optimizer Question'}
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
              onClick={() => window.location.href = '/contact/scheduling-expert'}
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

export default JobQueueFAQ;
