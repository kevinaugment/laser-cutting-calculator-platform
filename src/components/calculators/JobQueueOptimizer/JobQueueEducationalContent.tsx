import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, ExternalLink, Play, FileText } from 'lucide-react';

const JobQueueEducationalContent: React.FC = () => {
  const educationalContent = [
    {
      title: 'Production Scheduling Fundamentals',
      description: 'Understanding job shop scheduling, priority systems, and resource allocation principles',
      type: 'Guide',
      readTime: '18 min read',
      url: '/learn/production-scheduling-fundamentals',
      topics: ['Job shop scheduling', 'Priority systems', 'Resource allocation', 'Scheduling algorithms']
    },
    {
      title: 'Queue Optimization Strategies',
      description: 'Advanced techniques for optimizing job queues and minimizing makespan',
      type: 'Tutorial',
      readTime: '24 min read',
      url: '/learn/queue-optimization-strategies',
      topics: ['Makespan minimization', 'Bottleneck management', 'Load balancing', 'Dynamic scheduling']
    },
    {
      title: 'Multi-Objective Scheduling',
      description: 'Balancing competing objectives in production scheduling and optimization',
      type: 'Advanced Guide',
      readTime: '22 min read',
      url: '/learn/multi-objective-scheduling',
      topics: ['Objective functions', 'Pareto optimization', 'Trade-off analysis', 'Decision making']
    },
    {
      title: 'Real-Time Schedule Management',
      description: 'Managing dynamic changes and disruptions in production schedules',
      type: 'Best Practices',
      readTime: '16 min read',
      url: '/learn/real-time-schedule-management',
      topics: ['Dynamic rescheduling', 'Disruption handling', 'Contingency planning', 'Adaptive systems']
    },
    {
      title: 'Performance Metrics and KPIs',
      description: 'Key performance indicators for measuring scheduling effectiveness',
      type: 'Management Guide',
      readTime: '14 min read',
      url: '/learn/scheduling-performance-metrics',
      topics: ['KPI definition', 'Performance tracking', 'Benchmarking', 'Continuous improvement']
    },
    {
      title: 'Scheduling Problem Solving',
      description: 'Systematic approach to diagnosing and solving scheduling problems',
      type: 'Problem Solving',
      readTime: '19 min read',
      url: '/learn/scheduling-problem-solving',
      topics: ['Problem diagnosis', 'Root cause analysis', 'Solution strategies', 'Implementation']
    }
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Tutorial': 'bg-green-100 text-green-800',
      'Advanced Guide': 'bg-purple-100 text-purple-800',
      'Best Practices': 'bg-orange-100 text-orange-800',
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
          Comprehensive guides and tutorials to help you master production scheduling and job queue optimization
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
                <span>Job Queue Optimization Basics (22 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Advanced Scheduling Algorithms (31 min)</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <span>Real-World Scheduling Case Studies (26 min)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Technical Resources</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Production Scheduling White Paper</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Manufacturing KPI Benchmarks</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Scheduling Algorithm Reference</span>
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
              Get the latest production scheduling tips and optimization insights
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

export default JobQueueEducationalContent;
