import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const WarpingRiskEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Warping Fundamentals in Laser Cutting',
      description: 'Understanding the physics and mechanisms behind thermal warping in laser cutting operations',
      type: 'Technical Guide',
      readTime: '24 min read',
      url: '/learn/warping-fundamentals-laser-cutting',
      topics: ['Thermal stress', 'Material behavior', 'Warping mechanisms', 'Physics principles']
    },
    {
      title: 'Thermal Management Strategies',
      description: 'Comprehensive approaches to minimize thermal stress and prevent warping',
      type: 'Process Guide',
      readTime: '28 min read',
      url: '/learn/thermal-management-strategies',
      topics: ['Heat control', 'Cooling techniques', 'Process optimization', 'Temperature monitoring']
    },
    {
      title: 'Material-Specific Warping Behavior',
      description: 'How different materials respond to thermal stress and warping prevention techniques',
      type: 'Material Guide',
      readTime: '22 min read',
      url: '/learn/material-specific-warping-behavior',
      topics: ['Steel warping', 'Aluminum behavior', 'Stainless steel', 'Material selection']
    },
    {
      title: 'Geometric Design for Warp Prevention',
      description: 'Design principles and geometric considerations to minimize warping susceptibility',
      type: 'Design Guide',
      readTime: '26 min read',
      url: '/learn/geometric-design-warp-prevention',
      topics: ['Part geometry', 'Feature placement', 'Support design', 'Constraint planning']
    },
    {
      title: 'Advanced Warping Prediction Methods',
      description: 'Finite element analysis and advanced modeling techniques for warping prediction',
      type: 'Analysis Guide',
      readTime: '32 min read',
      url: '/learn/advanced-warping-prediction-methods',
      topics: ['FEA modeling', 'Thermal simulation', 'Stress analysis', 'Validation methods']
    },
    {
      title: 'Warping Measurement and Correction',
      description: 'Techniques for measuring warping and post-process correction methods',
      type: 'Quality Guide',
      readTime: '20 min read',
      url: '/learn/warping-measurement-correction',
      topics: ['Measurement tools', 'Inspection methods', 'Correction techniques', 'Quality control']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Technical Guide': 'bg-blue-100 text-blue-800',
      'Process Guide': 'bg-green-100 text-green-800',
      'Material Guide': 'bg-purple-100 text-purple-800',
      'Design Guide': 'bg-orange-100 text-orange-800',
      'Analysis Guide': 'bg-red-100 text-red-800',
      'Quality Guide': 'bg-yellow-100 text-yellow-800'
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
          Comprehensive guides and tutorials to help you master warping risk assessment and thermal management
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
                <span>Warping Risk Assessment Masterclass (29 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Thermal Management Best Practices (24 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Material-Specific Warping Solutions (31 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Warping Risk Assessment Checklists</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Thermal Analysis Spreadsheets</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Material Property Databases</span>
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
              Get the latest warping prevention techniques and thermal management insights
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

export default WarpingRiskEducationalContent;
