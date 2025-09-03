import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const ProductionCapacityEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Production Capacity Planning Fundamentals',
      description: 'Understanding capacity concepts, measurement methods, and strategic planning principles',
      type: 'Guide',
      readTime: '14 min read',
      url: '/learn/production-capacity-fundamentals',
      topics: ['Capacity types', 'OEE calculation', 'Bottleneck theory', 'Utilization metrics']
    },
    {
      title: 'Bottleneck Analysis and Management',
      description: 'Identifying, analyzing, and managing production bottlenecks using Theory of Constraints',
      type: 'Tutorial',
      readTime: '20 min read',
      url: '/learn/bottleneck-analysis-management',
      topics: ['TOC methodology', 'Constraint identification', 'Throughput optimization', 'Buffer management']
    },
    {
      title: 'Capacity Expansion Strategies',
      description: 'Strategic approaches to scaling production capacity and investment planning',
      type: 'Best Practices',
      readTime: '12 min read',
      url: '/learn/capacity-expansion-strategies',
      topics: ['Expansion timing', 'Investment analysis', 'Risk assessment', 'Scalability planning']
    },
    {
      title: 'OEE Optimization Techniques',
      description: 'Improving Overall Equipment Effectiveness through availability, performance, and quality',
      type: 'Technical Guide',
      readTime: '16 min read',
      url: '/learn/oee-optimization-techniques',
      topics: ['Availability improvement', 'Performance optimization', 'Quality enhancement', 'Data collection']
    },
    {
      title: 'Demand Forecasting for Capacity Planning',
      description: 'Forecasting methods and their application to production capacity planning',
      type: 'Management Guide',
      readTime: '18 min read',
      url: '/learn/demand-forecasting-capacity',
      topics: ['Forecasting methods', 'Seasonal adjustments', 'Uncertainty management', 'Scenario planning']
    },
    {
      title: 'Capacity Planning Troubleshooting',
      description: 'Common capacity planning problems and systematic approaches to resolution',
      type: 'Problem Solving',
      readTime: '13 min read',
      url: '/learn/capacity-planning-troubleshooting',
      topics: ['Common issues', 'Diagnostic methods', 'Solution frameworks', 'Performance monitoring']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Best Practices': 'bg-purple-100 text-purple-800',
      'Technical Guide': 'bg-orange-100 text-orange-800',
      'Management Guide': 'bg-red-100 text-red-800',
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
          Comprehensive guides and tutorials to help you master production capacity planning and optimization
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
                <span>Production Capacity Planning Basics (18 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Bottleneck Analysis Workshop (26 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>OEE Improvement Case Studies (22 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Capacity Planning White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Manufacturing Benchmarks Database</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Theory of Constraints Implementation Guide</span>
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
              Get the latest production capacity planning tips and manufacturing optimization insights
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

export default ProductionCapacityEducationalContent;
