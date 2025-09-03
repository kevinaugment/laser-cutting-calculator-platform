import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const HeatAffectedZoneEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Heat Affected Zone Fundamentals',
      description: 'Understanding HAZ formation, thermal cycles, and metallurgical changes in laser cutting',
      type: 'Guide',
      readTime: '8 min read',
      url: '/learn/haz-fundamentals',
      topics: ['Thermal cycles', 'Metallurgy', 'Phase transformations', 'HAZ zones']
    },
    {
      title: 'HAZ Control Strategies',
      description: 'Practical methods to minimize and control heat affected zone width in various materials',
      type: 'Tutorial',
      readTime: '12 min read',
      url: '/learn/haz-control-strategies',
      topics: ['Parameter optimization', 'Cooling techniques', 'Pulsed cutting', 'Heat sinks']
    },
    {
      title: 'Material Property Changes in HAZ',
      description: 'How laser cutting affects hardness, strength, and microstructure in the HAZ',
      type: 'Technical Guide',
      readTime: '10 min read',
      url: '/learn/haz-material-changes',
      topics: ['Hardness changes', 'Microstructure', 'Residual stress', 'Mechanical properties']
    },
    {
      title: 'HAZ Measurement and Testing',
      description: 'Methods for measuring HAZ width and evaluating thermal effects',
      type: 'Best Practices',
      readTime: '9 min read',
      url: '/learn/haz-measurement-testing',
      topics: ['Measurement techniques', 'Metallography', 'Hardness testing', 'Quality control']
    },
    {
      title: 'Advanced HAZ Modeling',
      description: 'Finite element analysis and thermal modeling for HAZ prediction',
      type: 'Advanced Guide',
      readTime: '15 min read',
      url: '/learn/advanced-haz-modeling',
      topics: ['FEA modeling', 'Thermal simulation', 'Validation methods', 'Software tools']
    },
    {
      title: 'HAZ-Related Defects and Solutions',
      description: 'Common HAZ-related problems and their prevention strategies',
      type: 'Problem Solving',
      readTime: '7 min read',
      url: '/learn/haz-defects-solutions',
      topics: ['Cracking', 'Distortion', 'Hardness variations', 'Prevention methods']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Best Practices': 'bg-purple-100 text-purple-800',
      'Advanced Guide': 'bg-orange-100 text-orange-800',
      'Technical Guide': 'bg-red-100 text-red-800',
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
          Comprehensive guides and tutorials to help you master heat affected zone control and thermal management
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
                <span>HAZ Formation and Control (12 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Metallographic Analysis of HAZ (18 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Parameter Optimization for HAZ Control (15 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>HAZ Control Best Practices White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Thermal Modeling Reference Guide</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Material Property Database</span>
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
              Get the latest HAZ control techniques and thermal management insights
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

export default HeatAffectedZoneEducationalContent;
