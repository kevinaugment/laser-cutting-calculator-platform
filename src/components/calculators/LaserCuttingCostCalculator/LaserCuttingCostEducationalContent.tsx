import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

const LaserCuttingCostEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Laser Cutting Cost Fundamentals',
      description: 'Understanding the key factors that drive laser cutting costs',
      type: 'Guide',
      readTime: '8 min read',
      url: '/learn/laser-cutting-cost-fundamentals',
      topics: ['Material costs', 'Operating expenses', 'Time factors', 'Quality considerations']
    },
    {
      title: 'Material Selection for Cost Optimization',
      description: 'How to choose materials that balance cost and performance',
      type: 'Tutorial',
      readTime: '12 min read',
      url: '/learn/material-selection-cost-optimization',
      topics: ['Material properties', 'Cost comparison', 'Performance trade-offs', 'Supplier selection']
    },
    {
      title: 'Reducing Waste in Laser Cutting Operations',
      description: 'Strategies to minimize material waste and improve efficiency',
      type: 'Best Practices',
      readTime: '6 min read',
      url: '/learn/reducing-waste-laser-cutting',
      topics: ['Nesting optimization', 'Cutting patterns', 'Material handling', 'Process improvement']
    },
    {
      title: 'Energy Cost Management in Laser Cutting',
      description: 'Techniques to optimize energy consumption and reduce electricity costs',
      type: 'Advanced Guide',
      readTime: '10 min read',
      url: '/learn/energy-cost-management',
      topics: ['Power optimization', 'Demand management', 'Efficiency upgrades', 'Cost monitoring']
    },
    {
      title: 'Labor Cost Optimization Strategies',
      description: 'Methods to improve operator efficiency and reduce labor costs',
      type: 'Management Guide',
      readTime: '9 min read',
      url: '/learn/labor-cost-optimization',
      topics: ['Workflow optimization', 'Training programs', 'Automation benefits', 'Performance metrics']
    },
    {
      title: 'Setup Time Reduction Techniques',
      description: 'Lean manufacturing approaches to minimize setup and changeover times',
      type: 'Operational Guide',
      readTime: '7 min read',
      url: '/learn/setup-time-reduction',
      topics: ['SMED methodology', 'Tool organization', 'Process standardization', 'Quick changeover']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Guide': return 'bg-blue-100 text-blue-800';
      case 'Tutorial': return 'bg-green-100 text-green-800';
      case 'Best Practices': return 'bg-purple-100 text-purple-800';
      case 'Advanced Guide': return 'bg-orange-100 text-orange-800';
      case 'Management Guide': return 'bg-red-100 text-red-800';
      case 'Operational Guide': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Educational Resources
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive guides and tutorials to help you master laser cutting cost optimization
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationalContent.map((content, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getTypeColor(content.type)}>
                    {content.type}
                  </Badge>
                  <span className="text-xs text-gray-500">{content.readTime}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {content.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {content.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {content.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = content.url}
                >
                  Read Article
                  <ExternalLink className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-World Cost Analysis Experience */}
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-4">My Cost Analysis Experience</h3>
          <p className="text-green-800 mb-4">
            Based on my hands-on experience in laser cutting manufacturing, here are the most important cost factors
            that actually impact your bottom line - not just the theoretical ones you read about.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Hidden Costs I've Learned About</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Setup Time Reality</h5>
                  <p className="text-sm text-gray-700">
                    Most people estimate 10-15 minutes setup. In reality, it's often 20-30 minutes when you include
                    material loading, parameter verification, test cuts, and quality checks.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Material Waste Factor</h5>
                  <p className="text-sm text-gray-700">
                    The 10% waste factor is optimistic. Real-world waste includes edge trim, defective parts,
                    handling damage, and remnants too small to use. 15-20% is more realistic.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Gas Consumption Variables</h5>
                  <p className="text-sm text-gray-700">
                    Gas consumption varies dramatically with material thickness and type. Thick stainless steel
                    can use 3x more gas than thin mild steel, but most calculators use fixed rates.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-green-800 mb-3">Cost Optimization Strategies That Work</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Batch Similar Jobs</h5>
                  <p className="text-sm text-gray-700">
                    Grouping jobs by material type and thickness reduces setup time per piece by 40-60%.
                    The setup cost gets spread across more parts.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Optimize Cutting Paths</h5>
                  <p className="text-sm text-gray-700">
                    Good nesting software can reduce cutting time by 20-30% and material waste by 10-15%.
                    The software cost pays for itself quickly.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Parameter Tuning Impact</h5>
                  <p className="text-sm text-gray-700">
                    Spending time to optimize parameters for each material/thickness combination can reduce
                    cutting time by 15-25% while improving quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Calculation Framework */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">My Cost Calculation Framework</h3>
          <p className="text-gray-700 mb-4">
            This is the step-by-step process I use for accurate cost estimation, based on real manufacturing experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">1</div>
              <h4 className="font-medium text-gray-900 mb-2">Material Costs</h4>
              <p className="text-sm text-gray-600 mb-2">Raw material + realistic waste factor + handling costs</p>
              <div className="text-xs text-gray-500">
                Include: Sheet cost, remnant value, handling time, storage costs
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">2</div>
              <h4 className="font-medium text-gray-900 mb-2">Machine Time</h4>
              <p className="text-sm text-gray-600 mb-2">Cutting time + setup + consumables + energy</p>
              <div className="text-xs text-gray-500">
                Include: Actual cutting, piercing time, gas consumption, electricity
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">3</div>
              <h4 className="font-medium text-gray-900 mb-2">Labor & Overhead</h4>
              <p className="text-sm text-gray-600 mb-2">Operator time + programming + quality + overhead</p>
              <div className="text-xs text-gray-500">
                Include: Setup, monitoring, inspection, programming time
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">4</div>
              <h4 className="font-medium text-gray-900 mb-2">Risk & Profit</h4>
              <p className="text-sm text-gray-600 mb-2">Quality buffer + business risk + target margin</p>
              <div className="text-xs text-gray-500">
                Include: Rework allowance, market risk, desired profit
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-900 mb-4">Common Cost Estimation Mistakes</h3>
          <p className="text-red-800 mb-4">
            These are the most common mistakes I see people make when calculating laser cutting costs,
            based on my experience helping others optimize their operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-800 mb-3">❌ What Not to Do</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Using theoretical cutting speeds from machine specs</li>
                <li>• Ignoring setup time for small batch jobs</li>
                <li>• Using fixed gas consumption rates for all materials</li>
                <li>• Not accounting for quality-related rework</li>
                <li>• Forgetting about material handling and storage costs</li>
                <li>• Using the same waste factor for all job types</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">✅ Better Approach</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Use actual cutting speeds from your machine logs</li>
                <li>• Include realistic setup time based on job complexity</li>
                <li>• Adjust gas consumption by material type and thickness</li>
                <li>• Build in 2-5% allowance for quality issues</li>
                <li>• Track and include all handling and overhead costs</li>
                <li>• Use different waste factors for different nesting efficiencies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Additional Learning Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Practical Guides</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Real-world cost tracking methods</li>
                <li>• Setting up cost monitoring systems</li>
                <li>• Benchmarking against industry standards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Case Studies</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Small shop cost optimization success</li>
                <li>• Material waste reduction strategies</li>
                <li>• Energy cost management examples</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              size="sm"
              onClick={() => window.location.href = '/learn/laser-cutting-cost'}
            >
              View All Resources
            </Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Stay Updated</h4>
              <p className="text-sm text-gray-600">Get the latest cost optimization tips and industry insights</p>
            </div>
            <Button 
              size="sm"
              onClick={() => window.location.href = '/newsletter/subscribe'}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LaserCuttingCostEducationalContent;
