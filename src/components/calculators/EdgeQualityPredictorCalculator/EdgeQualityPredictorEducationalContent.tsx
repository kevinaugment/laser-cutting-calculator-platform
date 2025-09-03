import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const EdgeQualityPredictorEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Edge Quality Fundamentals',
      description: 'Understanding edge quality characteristics, measurement methods, and quality standards',
      type: 'Guide',
      readTime: '18 min read',
      url: '/learn/edge-quality-fundamentals',
      topics: ['Quality standards', 'Measurement methods', 'Edge characteristics', 'Quality classification']
    },
    {
      title: 'Laser Cutting Edge Formation',
      description: 'Physics of edge formation during laser cutting and factors affecting quality',
      type: 'Technical Guide',
      readTime: '25 min read',
      url: '/learn/laser-cutting-edge-formation',
      topics: ['Cutting physics', 'Heat transfer', 'Material removal', 'Edge formation mechanisms']
    },
    {
      title: 'Edge Quality Optimization Strategies',
      description: 'Proven techniques for achieving superior edge quality in laser cutting',
      type: 'Best Practices',
      readTime: '22 min read',
      url: '/learn/edge-quality-optimization',
      topics: ['Parameter optimization', 'Process control', 'Quality improvement', 'Troubleshooting']
    },
    {
      title: 'Edge Quality Measurement and Testing',
      description: 'Comprehensive guide to measuring and evaluating laser cut edge quality',
      type: 'Process Guide',
      readTime: '20 min read',
      url: '/learn/edge-quality-measurement',
      topics: ['Measurement equipment', 'Testing procedures', 'Quality assessment', 'Documentation standards']
    },
    {
      title: 'Material-Specific Edge Quality',
      description: 'Edge quality considerations for different materials and applications',
      type: 'Material Guide',
      readTime: '24 min read',
      url: '/learn/material-specific-edge-quality',
      topics: ['Material properties', 'Cutting strategies', 'Quality expectations', 'Application requirements']
    },
    {
      title: 'Edge Quality Problem Solving',
      description: 'Systematic approach to diagnosing and solving edge quality issues',
      type: 'Problem Solving',
      readTime: '19 min read',
      url: '/learn/edge-quality-problem-solving',
      topics: ['Problem diagnosis', 'Root cause analysis', 'Solution implementation', 'Prevention strategies']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Technical Guide': 'bg-purple-100 text-purple-800',
      'Best Practices': 'bg-green-100 text-green-800',
      'Process Guide': 'bg-orange-100 text-orange-800',
      'Material Guide': 'bg-red-100 text-red-800',
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
          Comprehensive guides and tutorials to help you master edge quality prediction and optimization
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
                <span>Edge Quality Assessment Masterclass (29 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Parameter Optimization for Quality (22 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Edge Quality Troubleshooting Guide (26 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Edge Quality Standards Reference</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quality Measurement Procedures</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Material-Specific Quality Guidelines</span>
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
              Get the latest edge quality optimization techniques and industry best practices
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

export default EdgeQualityPredictorEducationalContent;
