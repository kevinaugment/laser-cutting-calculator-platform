import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const GasConsumptionEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Gas Consumption Fundamentals',
      description: 'Understanding assist gas types, flow rates, and consumption patterns in laser cutting',
      type: 'Guide',
      readTime: '16 min read',
      url: '/learn/gas-consumption-fundamentals',
      topics: ['Gas types', 'Flow dynamics', 'Consumption patterns', 'System efficiency']
    },
    {
      title: 'Gas Cost Optimization Strategies',
      description: 'Advanced techniques for reducing gas consumption and controlling operating costs',
      type: 'Tutorial',
      readTime: '22 min read',
      url: '/learn/gas-cost-optimization-strategies',
      topics: ['Cost reduction', 'Process optimization', 'Efficiency improvements', 'Alternative gases']
    },
    {
      title: 'Gas Selection and Application Guide',
      description: 'Comprehensive guide to selecting optimal assist gases for different materials and applications',
      type: 'Best Practices',
      readTime: '19 min read',
      url: '/learn/gas-selection-application-guide',
      topics: ['Gas selection', 'Material compatibility', 'Quality considerations', 'Cost-benefit analysis']
    },
    {
      title: 'Gas System Setup and Maintenance',
      description: 'Proper setup, calibration, and maintenance of gas delivery systems for optimal performance',
      type: 'Technical Guide',
      readTime: '24 min read',
      url: '/learn/gas-system-setup-maintenance',
      topics: ['System setup', 'Calibration procedures', 'Maintenance schedules', 'Troubleshooting']
    },
    {
      title: 'Gas Consumption Monitoring and Control',
      description: 'Implementing monitoring systems and control strategies for gas consumption management',
      type: 'Process Guide',
      readTime: '18 min read',
      url: '/learn/gas-consumption-monitoring-control',
      topics: ['Monitoring systems', 'Data collection', 'Control strategies', 'Performance tracking']
    },
    {
      title: 'Gas Consumption Problem Solving',
      description: 'Systematic approach to diagnosing and solving gas consumption and cost issues',
      type: 'Problem Solving',
      readTime: '20 min read',
      url: '/learn/gas-consumption-problem-solving',
      topics: ['Problem diagnosis', 'Root cause analysis', 'Solution implementation', 'Prevention strategies']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Technical Guide': 'bg-purple-100 text-purple-800',
      'Best Practices': 'bg-orange-100 text-orange-800',
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
          Comprehensive guides and tutorials to help you master gas consumption optimization and cost control
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
                <span>Gas Consumption Optimization Workshop (26 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Assist Gas Selection Guide (19 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Gas System Maintenance Best Practices (21 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Gas Consumption Standards Reference</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Gas Cost Benchmarking Database</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Gas Efficiency Optimization Guide</span>
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
              Get the latest gas consumption optimization tips and cost control strategies
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

export default GasConsumptionEducationalContent;
