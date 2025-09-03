import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const MaintenanceCostEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Maintenance Cost Management Fundamentals',
      description: 'Understanding maintenance strategies, cost structures, and optimization principles',
      type: 'Guide',
      readTime: '20 min read',
      url: '/learn/maintenance-cost-fundamentals',
      topics: ['Preventive maintenance', 'Cost structures', 'ROI analysis', 'Maintenance strategies']
    },
    {
      title: 'Predictive Maintenance Implementation',
      description: 'Advanced techniques for implementing condition-based and predictive maintenance',
      type: 'Tutorial',
      readTime: '28 min read',
      url: '/learn/predictive-maintenance-implementation',
      topics: ['Condition monitoring', 'IoT sensors', 'Data analytics', 'Implementation roadmap']
    },
    {
      title: 'Maintenance Cost Optimization Strategies',
      description: 'Proven strategies for reducing maintenance costs while improving reliability',
      type: 'Best Practices',
      readTime: '24 min read',
      url: '/learn/maintenance-cost-optimization',
      topics: ['Cost reduction', 'Reliability improvement', 'Spare parts management', 'Vendor optimization']
    },
    {
      title: 'Equipment Lifecycle Management',
      description: 'Managing equipment from acquisition to disposal for optimal total cost of ownership',
      type: 'Strategy Guide',
      readTime: '26 min read',
      url: '/learn/equipment-lifecycle-management',
      topics: ['Lifecycle planning', 'Replacement decisions', 'Asset management', 'Depreciation strategies']
    },
    {
      title: 'Maintenance Performance Metrics',
      description: 'Key performance indicators and metrics for maintenance cost management',
      type: 'Process Guide',
      readTime: '18 min read',
      url: '/learn/maintenance-performance-metrics',
      topics: ['KPI development', 'Performance tracking', 'Benchmarking', 'Continuous improvement']
    },
    {
      title: 'Maintenance Cost Problem Solving',
      description: 'Systematic approach to identifying and solving maintenance cost challenges',
      type: 'Problem Solving',
      readTime: '22 min read',
      url: '/learn/maintenance-cost-problem-solving',
      topics: ['Root cause analysis', 'Cost variance analysis', 'Problem diagnosis', 'Solution implementation']
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
          Comprehensive guides and tutorials to help you master maintenance cost management and optimization
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
                <span>Maintenance Cost Management Masterclass (32 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Predictive Maintenance ROI Analysis (24 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Equipment Lifecycle Optimization (28 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Maintenance Cost Benchmarking Database</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Equipment Reliability Standards Guide</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Maintenance Strategy Selection Framework</span>
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
              Get the latest maintenance cost optimization strategies and industry best practices
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

export default MaintenanceCostEducationalContent;
