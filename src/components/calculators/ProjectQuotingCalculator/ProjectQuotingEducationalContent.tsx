import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const ProjectQuotingEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Project Quoting Fundamentals',
      description: 'Understanding cost structures, pricing strategies, and competitive positioning',
      type: 'Guide',
      readTime: '20 min read',
      url: '/learn/project-quoting-fundamentals',
      topics: ['Cost accounting', 'Pricing strategies', 'Competitive analysis', 'Risk assessment']
    },
    {
      title: 'Advanced Pricing Strategies',
      description: 'Value-based pricing, market positioning, and profit optimization techniques',
      type: 'Tutorial',
      readTime: '25 min read',
      url: '/learn/advanced-pricing-strategies',
      topics: ['Value pricing', 'Market analysis', 'Profit optimization', 'Customer segmentation']
    },
    {
      title: 'Cost Estimation Best Practices',
      description: 'Accurate cost estimation methods for manufacturing projects',
      type: 'Best Practices',
      readTime: '18 min read',
      url: '/learn/cost-estimation-best-practices',
      topics: ['Cost modeling', 'Activity-based costing', 'Overhead allocation', 'Risk factors']
    },
    {
      title: 'Competitive Bidding Strategies',
      description: 'Winning strategies for competitive bidding and proposal development',
      type: 'Strategy Guide',
      readTime: '22 min read',
      url: '/learn/competitive-bidding-strategies',
      topics: ['Bid strategy', 'Proposal writing', 'Value proposition', 'Win probability']
    },
    {
      title: 'Quote Management and Follow-up',
      description: 'Managing the quoting process from initial inquiry to contract award',
      type: 'Process Guide',
      readTime: '16 min read',
      url: '/learn/quote-management-follow-up',
      topics: ['Quote tracking', 'Customer communication', 'Negotiation tactics', 'Contract terms']
    },
    {
      title: 'Pricing Problem Solving',
      description: 'Systematic approach to solving common pricing and quoting challenges',
      type: 'Problem Solving',
      readTime: '19 min read',
      url: '/learn/pricing-problem-solving',
      topics: ['Problem diagnosis', 'Solution strategies', 'Market adjustments', 'Profitability recovery']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Best Practices': 'bg-purple-100 text-purple-800',
      'Strategy Guide': 'bg-orange-100 text-orange-800',
      'Process Guide': 'bg-red-100 text-red-800',
      'Problem Solving': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Educational Resources
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive guides and tutorials to help you master project quoting and pricing strategies
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

        {/* Additional Learning Resources */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">Video Tutorials</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Project Quoting Masterclass (32 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Competitive Pricing Strategies (28 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Cost Estimation Workshop (24 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Pricing Strategy White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Manufacturing Cost Benchmarks</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quote Template Library</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline">
            View All Resources
          </Button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <div className="max-w-md mx-auto">
            <h4 className="font-semibold mb-2">Stay Updated</h4>
            <p className="text-sm text-gray-600 mb-3">
              Get the latest pricing strategies and project quoting insights
            </p>
            <Button size="sm">
              Subscribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectQuotingEducationalContent;
