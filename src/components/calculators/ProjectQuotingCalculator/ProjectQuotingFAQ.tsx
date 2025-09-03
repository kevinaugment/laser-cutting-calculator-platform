import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react';

const ProjectQuotingFAQ: React.FC = () => {
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
      question: 'How do I determine the right profit margin for my laser cutting projects?',
      answer: `Setting appropriate profit margins requires balancing competitiveness with profitability:

**Industry Standard Profit Margins:**
• **High-volume production**: 15-25% gross margin
• **Custom/prototype work**: 25-40% gross margin
• **Complex/specialized projects**: 30-50% gross margin
• **Rush orders**: 40-60% gross margin

**Factors Affecting Margin Decisions:**

**Market Conditions:**
• **Competitive market**: Lower margins (15-25%)
• **Specialized niche**: Higher margins (30-50%)
• **Long-term contracts**: Stable margins (20-30%)
• **Spot market**: Variable margins (20-60%)

**Customer Relationship:**
• **New customers**: Competitive margins to build relationship
• **Established customers**: Standard margins (25-35%)
• **Strategic accounts**: Volume-based margin tiers
• **Problem customers**: Higher margins to offset risk

**Project Complexity:**
• **Standard cutting**: Lower margins (15-25%)
• **Complex geometries**: Higher margins (25-35%)
• **Tight tolerances**: Premium margins (30-45%)
• **Special materials**: Risk-adjusted margins (35-50%)

**Margin Calculation Methods:**

**Cost-Plus Pricing:**
• Calculate total costs (material + labor + overhead)
• Add desired profit percentage
• Formula: Price = Cost ÷ (1 - Margin%)

**Value-Based Pricing:**
• Price based on customer value received
• Consider time savings, quality improvements
• Can achieve 40-60% margins for high-value solutions

**Competitive Pricing:**
• Research competitor pricing
• Position slightly below, at, or above market
• Adjust margins based on competitive advantage

**Risk-Adjusted Margins:**
• **Low risk projects**: Standard margins
• **Medium risk**: Add 5-10% margin premium
• **High risk**: Add 15-25% margin premium
• **Unknown customer**: Add 10-15% margin premium

**Margin Optimization Strategies:**
• **Bundle services**: Increase overall project value
• **Volume discounts**: Lower margins for guaranteed volume
• **Payment terms**: Better terms = lower margins
• **Long-term contracts**: Stable margins with escalation clauses`,
      category: 'Profit Margins'
    },
    {
      question: 'What should I include in my project quotes to ensure accuracy and competitiveness?',
      answer: `Comprehensive project quotes should include all cost elements and clear terms:

**Essential Quote Components:**

**Project Overview:**
• **Project description**: Clear scope of work
• **Part specifications**: Quantities, materials, dimensions
• **Quality requirements**: Tolerances, finish specifications
• **Delivery schedule**: Timeline and milestones
• **Terms and conditions**: Payment, warranty, liability

**Detailed Cost Breakdown:**

**Direct Costs:**
• **Material costs**: Raw materials + waste allowance (5-15%)
• **Labor costs**: Setup + processing + finishing time
• **Machine time**: Hourly rates including depreciation
• **Tooling costs**: Special fixtures, consumables
• **Subcontracting**: Outside services (heat treatment, coating)

**Indirect Costs:**
• **Overhead allocation**: Facility, utilities, administration (20-40% of direct costs)
• **Engineering time**: Design review, programming, setup
• **Quality control**: Inspection, testing, documentation
• **Project management**: Coordination, communication, reporting

**Additional Considerations:**
• **Packaging and shipping**: Protective packaging, freight costs
• **Insurance**: Project-specific coverage if required
• **Permits/certifications**: Special requirements
• **Contingency**: 5-10% for unforeseen issues

**Quote Presentation Best Practices:**

**Professional Format:**
• **Company branding**: Professional letterhead and formatting
• **Clear structure**: Organized sections with headers
• **Detailed specifications**: Leave no ambiguity
• **Visual aids**: Drawings, photos, or renderings when helpful

**Pricing Strategy:**
• **Itemized pricing**: Show breakdown for transparency
• **Alternative options**: Different quality/price levels
• **Volume discounts**: Pricing tiers for different quantities
• **Payment terms**: Early payment discounts, milestone payments

**Competitive Advantages:**
• **Unique capabilities**: Special equipment or expertise
• **Quality certifications**: ISO, AS9100, etc.
• **Delivery advantages**: Faster turnaround, flexible scheduling
• **Value-added services**: Design assistance, inventory management

**Risk Management:**
• **Material price protection**: Fixed pricing period
• **Change order procedures**: How modifications are handled
• **Force majeure clauses**: Protection against uncontrollable events
• **Warranty terms**: What is covered and for how long

**Quote Validity and Follow-up:**
• **Validity period**: Typically 30-60 days
• **Escalation clauses**: Material price adjustments
• **Follow-up schedule**: When and how to follow up
• **Decision timeline**: Customer's expected decision date`,
      category: 'Quote Components'
    },
    {
      question: 'How do I handle competitive bidding situations and price negotiations?',
      answer: `Successful competitive bidding requires strategic approach and skilled negotiation:

**Pre-Bid Strategy:**

**Opportunity Assessment:**
• **Win probability**: Realistic assessment of chances (aim for >30%)
• **Strategic value**: Long-term relationship potential
• **Competitive landscape**: Number and strength of competitors
• **Customer relationship**: Existing relationship advantages
• **Technical fit**: Match between capabilities and requirements

**Bid/No-Bid Decision Matrix:**
• **High win probability + High value**: Definitely bid
• **High win probability + Low value**: Bid if capacity available
• **Low win probability + High value**: Bid selectively
• **Low win probability + Low value**: No bid

**Competitive Bidding Tactics:**

**Information Gathering:**
• **Customer intelligence**: Decision criteria, budget, timeline
• **Competitor analysis**: Strengths, weaknesses, typical pricing
• **Technical requirements**: Understand all specifications
• **Evaluation process**: How bids will be evaluated

**Pricing Strategies:**
• **Aggressive pricing**: Lower margins to win strategic accounts
• **Value pricing**: Emphasize unique capabilities and benefits
• **Phased pricing**: Different prices for different project phases
• **Alternative proposals**: Offer different approaches/price points

**Proposal Differentiation:**
• **Technical advantages**: Superior processes, equipment, expertise
• **Service benefits**: Faster delivery, better support, flexibility
• **Risk mitigation**: Lower risk solutions, better warranties
• **Total cost of ownership**: Long-term value proposition

**Negotiation Strategies:**

**Preparation Phase:**
• **Know your numbers**: Understand all costs and margins
• **Set walk-away point**: Minimum acceptable terms
• **Prepare alternatives**: Multiple options and concessions
• **Research counterpart**: Understand their position and constraints

**Negotiation Tactics:**
• **Start high**: Leave room for concessions
• **Bundle/unbundle**: Adjust scope to meet price targets
• **Time-based pricing**: Different prices for different delivery schedules
• **Volume commitments**: Better pricing for guaranteed volumes

**Common Negotiation Points:**
• **Price**: Direct cost reductions or value-added services
• **Payment terms**: Faster payment for better pricing
• **Delivery schedule**: Premium for rush, discount for flexible timing
• **Scope adjustments**: Modify specifications to meet budget
• **Long-term agreements**: Multi-year contracts with escalation

**Handling Price Pressure:**
• **Justify value**: Clearly articulate benefits and advantages
• **Offer alternatives**: Different quality/price combinations
• **Highlight risks**: Consequences of choosing lowest bidder
• **Stand firm**: Know when to walk away from unprofitable deals

**Post-Negotiation Actions:**
• **Document agreements**: Confirm all terms in writing
• **Internal communication**: Ensure team understands final terms
• **Project setup**: Prepare for execution with agreed parameters
• **Relationship building**: Maintain positive relationship regardless of outcome`,
      category: 'Competitive Bidding'
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
          Common questions about project quoting and pricing strategies for laser cutting services
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
            Our pricing and business development experts are here to help you optimize your project quoting and win more profitable business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => window.location.href = 'mailto:support@lasercalc.com?subject=Project Quoting Calculator Question'}
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
              onClick={() => window.location.href = '/contact/pricing-expert'}
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

export default ProjectQuotingFAQ;
