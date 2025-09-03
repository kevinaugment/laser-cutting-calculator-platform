import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const QualityGradeEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Laser Cutting Quality Fundamentals',
      description: 'Understanding quality metrics, ISO 9013 standards, and measurement techniques',
      type: 'Guide',
      readTime: '15 min read',
      url: '/learn/laser-cutting-quality-fundamentals',
      topics: ['ISO 9013 standards', 'Quality metrics', 'Measurement methods', 'Grade classification']
    },
    {
      title: 'Surface Roughness and Edge Quality',
      description: 'Comprehensive guide to surface finish, edge characteristics, and quality optimization',
      type: 'Tutorial',
      readTime: '22 min read',
      url: '/learn/surface-roughness-edge-quality',
      topics: ['Surface roughness', 'Edge perpendicularity', 'Dross formation', 'Quality improvement']
    },
    {
      title: 'Parameter Optimization for Quality',
      description: 'Systematic approach to optimizing laser parameters for target quality grades',
      type: 'Best Practices',
      readTime: '18 min read',
      url: '/learn/parameter-optimization-quality',
      topics: ['Power-speed optimization', 'Gas selection', 'Focus control', 'Quality trade-offs']
    },
    {
      title: 'Quality Control and Inspection',
      description: 'Quality control processes, inspection methods, and measurement equipment',
      type: 'Technical Guide',
      readTime: '20 min read',
      url: '/learn/quality-control-inspection',
      topics: ['Inspection methods', 'Measurement tools', 'Quality standards', 'Process control']
    },
    {
      title: 'Advanced Quality Prediction Models',
      description: 'Machine learning and statistical models for quality prediction and optimization',
      type: 'Advanced Guide',
      readTime: '25 min read',
      url: '/learn/advanced-quality-prediction',
      topics: ['Predictive models', 'Machine learning', 'Statistical analysis', 'Process monitoring']
    },
    {
      title: 'Quality Troubleshooting Guide',
      description: 'Systematic approach to diagnosing and solving quality problems in laser cutting',
      type: 'Problem Solving',
      readTime: '16 min read',
      url: '/learn/quality-troubleshooting-guide',
      topics: ['Problem diagnosis', 'Root cause analysis', 'Solution strategies', 'Prevention methods']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Best Practices': 'bg-purple-100 text-purple-800',
      'Technical Guide': 'bg-orange-100 text-orange-800',
      'Advanced Guide': 'bg-red-100 text-red-800',
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
          Comprehensive guides and tutorials to help you master laser cutting quality control and optimization
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
                <span>Quality Grade Prediction Basics (19 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>ISO 9013 Standards Workshop (28 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Quality Optimization Case Studies (24 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quality Control White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Surface Roughness Measurement Guide</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quality Standards Reference Manual</span>
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
              Get the latest quality control tips and laser cutting optimization insights
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

export default QualityGradeEducationalContent;
