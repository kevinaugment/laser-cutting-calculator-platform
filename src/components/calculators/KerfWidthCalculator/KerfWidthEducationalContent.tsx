import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const KerfWidthEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Kerf Width Fundamentals',
      description: 'Understanding kerf width formation, measurement techniques, and factors affecting precision',
      type: 'Guide',
      readTime: '14 min read',
      url: '/learn/kerf-width-fundamentals',
      topics: ['Kerf formation', 'Measurement methods', 'Thermal effects', 'Beam geometry']
    },
    {
      title: 'Precision Cutting Techniques',
      description: 'Advanced techniques for achieving consistent kerf width and dimensional accuracy',
      type: 'Tutorial',
      readTime: '19 min read',
      url: '/learn/precision-cutting-techniques',
      topics: ['Parameter optimization', 'Focus control', 'Path compensation', 'Quality control']
    },
    {
      title: 'Material Effects on Kerf Width',
      description: 'How different materials affect kerf width and cutting characteristics',
      type: 'Technical Guide',
      readTime: '16 min read',
      url: '/learn/material-effects-kerf-width',
      topics: ['Material properties', 'Thermal conductivity', 'Melting behavior', 'Gas interactions']
    },
    {
      title: 'CAD/CAM Path Compensation',
      description: 'Implementing kerf width compensation in CAD/CAM systems for accurate parts',
      type: 'Best Practices',
      readTime: '12 min read',
      url: '/learn/cad-cam-path-compensation',
      topics: ['Path offset', 'Compensation strategies', 'Software integration', 'Verification methods']
    },
    {
      title: 'Kerf Width Measurement and Control',
      description: 'Methods for measuring and controlling kerf width in production environments',
      type: 'Quality Control',
      readTime: '17 min read',
      url: '/learn/kerf-width-measurement-control',
      topics: ['Measurement tools', 'Statistical control', 'Process monitoring', 'Corrective actions']
    },
    {
      title: 'Troubleshooting Kerf Width Problems',
      description: 'Systematic approach to diagnosing and solving kerf width inconsistencies',
      type: 'Problem Solving',
      readTime: '15 min read',
      url: '/learn/troubleshooting-kerf-width-problems',
      topics: ['Problem diagnosis', 'Root cause analysis', 'Solution strategies', 'Prevention methods']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Technical Guide': 'bg-purple-100 text-purple-800',
      'Best Practices': 'bg-orange-100 text-orange-800',
      'Quality Control': 'bg-red-100 text-red-800',
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
          Comprehensive guides and tutorials to help you master kerf width control and precision cutting
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
                <span>Kerf Width Measurement Techniques (16 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>CAD/CAM Compensation Setup (23 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Precision Cutting Case Studies (18 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Kerf Width Standards Reference</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Material Property Database</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Precision Cutting Best Practices</span>
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
              Get the latest precision cutting tips and kerf width optimization insights
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

export default KerfWidthEducationalContent;
