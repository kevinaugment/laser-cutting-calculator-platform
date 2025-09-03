import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const BatchProcessingEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Batch Processing Fundamentals',
      description: 'Understanding batch processing principles, optimization theory, and efficiency metrics',
      type: 'Guide',
      readTime: '12 min read',
      url: '/learn/batch-processing-fundamentals',
      topics: ['Batch sizing theory', 'Setup optimization', 'Efficiency metrics', 'Cost modeling']
    },
    {
      title: 'Advanced Batching Strategies',
      description: 'Professional techniques for optimizing batch sizes and minimizing setup times',
      type: 'Tutorial',
      readTime: '18 min read',
      url: '/learn/advanced-batching-strategies',
      topics: ['Multi-criteria optimization', 'Dynamic batching', 'Constraint handling', 'Real-time adjustments']
    },
    {
      title: 'Setup Time Reduction Techniques',
      description: 'Methods to minimize setup and changeover times for improved batch efficiency',
      type: 'Best Practices',
      readTime: '10 min read',
      url: '/learn/setup-time-reduction',
      topics: ['SMED methodology', 'Quick changeover', 'Tool organization', 'Process standardization']
    },
    {
      title: 'Production Scheduling Integration',
      description: 'Integrating batch processing with production scheduling and capacity planning',
      type: 'Technical Guide',
      readTime: '15 min read',
      url: '/learn/production-scheduling-integration',
      topics: ['Schedule optimization', 'Capacity planning', 'Resource allocation', 'Bottleneck management']
    },
    {
      title: 'Lean Manufacturing and Batching',
      description: 'Applying lean principles to batch processing for waste reduction and efficiency',
      type: 'Management Guide',
      readTime: '13 min read',
      url: '/learn/lean-manufacturing-batching',
      topics: ['Waste elimination', 'Flow optimization', 'Value stream mapping', 'Continuous improvement']
    },
    {
      title: 'Batch Processing Troubleshooting',
      description: 'Common batch processing problems and their solutions for improved performance',
      type: 'Problem Solving',
      readTime: '11 min read',
      url: '/learn/batch-processing-troubleshooting',
      topics: ['Common issues', 'Root cause analysis', 'Performance bottlenecks', 'Solution strategies']
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
          Comprehensive guides and tutorials to help you master batch processing optimization and production efficiency
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
                <span>Batch Processing Optimization Basics (16 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Setup Time Reduction Techniques (24 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Production Efficiency Case Studies (20 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Batch Processing Optimization White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Production Efficiency Benchmarks</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Lean Manufacturing Implementation Guide</span>
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
              Get the latest batch processing optimization tips and production efficiency insights
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

export default BatchProcessingEducationalContent;
