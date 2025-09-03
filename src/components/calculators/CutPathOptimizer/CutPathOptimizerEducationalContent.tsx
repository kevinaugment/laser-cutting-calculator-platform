import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const CutPathOptimizerEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Cut Path Optimization Fundamentals',
      description: 'Understanding the principles and algorithms behind efficient cutting path generation',
      type: 'Technical Guide',
      readTime: '25 min read',
      url: '/learn/cut-path-optimization-fundamentals',
      topics: ['Path algorithms', 'Optimization theory', 'Efficiency metrics', 'Quality factors']
    },
    {
      title: 'Thermal Management in Path Planning',
      description: 'How cutting sequence affects heat distribution and part quality',
      type: 'Process Guide',
      readTime: '22 min read',
      url: '/learn/thermal-management-path-planning',
      topics: ['Heat distribution', 'Thermal stress', 'Cooling strategies', 'Distortion control']
    },
    {
      title: 'Advanced Optimization Algorithms',
      description: 'Genetic algorithms, simulated annealing, and TSP solutions for cutting paths',
      type: 'Algorithm Guide',
      readTime: '30 min read',
      url: '/learn/advanced-optimization-algorithms',
      topics: ['Genetic algorithms', 'Simulated annealing', 'TSP solutions', 'Heuristic methods']
    },
    {
      title: 'Production Efficiency Strategies',
      description: 'Maximizing throughput through intelligent path planning and sequencing',
      type: 'Efficiency Guide',
      readTime: '20 min read',
      url: '/learn/production-efficiency-strategies',
      topics: ['Throughput optimization', 'Batch processing', 'Setup reduction', 'Workflow design']
    },
    {
      title: 'Quality Impact of Path Selection',
      description: 'How cutting sequence and path strategy affect edge quality and precision',
      type: 'Quality Guide',
      readTime: '24 min read',
      url: '/learn/quality-impact-path-selection',
      topics: ['Edge quality', 'Precision factors', 'Heat effects', 'Distortion prevention']
    },
    {
      title: 'CNC Programming for Optimized Paths',
      description: 'Implementing optimized cutting paths in CNC programs and CAM systems',
      type: 'Programming Guide',
      readTime: '28 min read',
      url: '/learn/cnc-programming-optimized-paths',
      topics: ['G-code optimization', 'CAM integration', 'Tool path generation', 'Program efficiency']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Technical Guide': 'bg-blue-100 text-blue-800',
      'Process Guide': 'bg-green-100 text-green-800',
      'Algorithm Guide': 'bg-purple-100 text-purple-800',
      'Efficiency Guide': 'bg-orange-100 text-orange-800',
      'Quality Guide': 'bg-red-100 text-red-800',
      'Programming Guide': 'bg-yellow-100 text-yellow-800'
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
          Comprehensive guides and tutorials to help you master cut path optimization and production efficiency
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
                <span>Path Optimization Masterclass (32 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Thermal Management Strategies (26 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Advanced Algorithm Implementation (38 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Path Optimization Algorithms Library</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>CNC G-code Templates</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Thermal Analysis Spreadsheets</span>
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
              Get the latest path optimization techniques and production efficiency insights
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

export default CutPathOptimizerEducationalContent;
