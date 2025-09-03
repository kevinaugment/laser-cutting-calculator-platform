import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { BookOpen, Play, FileText, Users } from 'lucide-react';

const CuttingTimeEducationalContent: React.FC = () => {
  const articles = [
    {
      type: 'Guide',
      readTime: '12 min read',
      title: 'Cutting Time Estimation Fundamentals',
      description: 'Understanding the factors that influence laser cutting time and how to optimize for efficiency',
      topics: ['Time calculation methods', 'Speed optimization', 'Process efficiency', 'Production planning'],
      category: 'fundamentals'
    },
    {
      type: 'Tutorial',
      readTime: '18 min read',
      title: 'Advanced Time Optimization Strategies',
      description: 'Professional techniques for minimizing cutting time while maintaining quality standards',
      topics: ['Parameter optimization', 'Path planning', 'Batch processing', 'Quality balance'],
      category: 'advanced'
    },
    {
      type: 'Technical Guide',
      readTime: '15 min read',
      title: 'Material-Specific Time Factors',
      description: 'How different materials affect cutting time and the optimization strategies for each',
      topics: ['Material properties', 'Speed adjustments', 'Gas selection', 'Quality considerations'],
      category: 'materials'
    },
    {
      type: 'Best Practices',
      readTime: '10 min read',
      title: 'Production Planning with Time Estimates',
      description: 'Using cutting time estimates for accurate production scheduling and capacity planning',
      topics: ['Schedule optimization', 'Capacity planning', 'Bottleneck analysis', 'Delivery planning'],
      category: 'planning'
    },
    {
      type: 'Case Study',
      readTime: '14 min read',
      title: 'Time Reduction Success Stories',
      description: 'Real-world examples of companies that achieved significant time savings through optimization',
      topics: ['Process improvements', 'ROI analysis', 'Implementation strategies', 'Results measurement'],
      category: 'case-studies'
    },
    {
      type: 'Problem Solving',
      readTime: '8 min read',
      title: 'Troubleshooting Time Estimation Issues',
      description: 'Common problems in time estimation and systematic approaches to solving them',
      topics: ['Accuracy issues', 'Variance analysis', 'Calibration methods', 'Validation techniques'],
      category: 'troubleshooting'
    }
  ];

  const videos = [
    {
      title: 'Cutting Time Calculation Basics',
      duration: '16 min',
      description: 'Step-by-step guide to calculating cutting time for different materials and geometries'
    },
    {
      title: 'Speed Optimization Techniques',
      duration: '22 min',
      description: 'Advanced methods for optimizing cutting speed without compromising quality'
    },
    {
      title: 'Production Planning Workshop',
      duration: '28 min',
      description: 'Complete workflow for using time estimates in production planning and scheduling'
    }
  ];

  const resources = [
    {
      title: 'Cutting Time Optimization White Paper',
      description: 'Comprehensive guide to time optimization strategies and best practices'
    },
    {
      title: 'Material Speed Reference Charts',
      description: 'Quick reference for cutting speeds across different materials and thicknesses'
    },
    {
      title: 'Time Estimation Accuracy Study',
      description: 'Research on estimation accuracy and methods for improving precision'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Educational Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Educational Resources
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive guides and tutorials to help you master cutting time estimation and optimization
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {article.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {article.readTime}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {article.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="mr-2 h-3 w-3" />
                  Read Article
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-red-600" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-red-50 rounded">
                    <Play className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                      <Badge variant="outline" className="text-xs">{video.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Technical Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="p-2 bg-green-50 rounded">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-World Time Estimation Experience */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Users className="h-5 w-5" />
            My Time Estimation Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-800 mb-6">
            Based on my hands-on experience in laser cutting manufacturing, here's what I've learned about
            accurate time estimation and the factors that really matter in production environments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Time Estimation Reality Check</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Theoretical vs. Actual Speeds</h5>
                  <p className="text-sm text-gray-700">
                    Machine specs show maximum speeds, but real-world cutting is 60-80% of that due to
                    acceleration/deceleration, corner speeds, and quality requirements.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Pierce Time Variables</h5>
                  <p className="text-sm text-gray-700">
                    Pierce time isn't just thickness-dependent. Material type, condition, and even ambient
                    temperature affect it. Stainless steel takes 2-3x longer than mild steel.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Hidden Time Factors</h5>
                  <p className="text-sm text-gray-700">
                    Positioning moves, lead-ins/outs, and quality checks add 20-40% to pure cutting time.
                    Complex shapes with many small features take disproportionately longer.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-green-800 mb-3">Speed Optimization Strategies</h4>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Path Optimization Impact</h5>
                  <p className="text-sm text-gray-700">
                    Good nesting software with path optimization can reduce total cutting time by 25-35%
                    by minimizing travel moves and optimizing cutting sequence.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Parameter Tuning Benefits</h5>
                  <p className="text-sm text-gray-700">
                    Spending time to optimize parameters for each material/thickness can increase cutting
                    speed by 15-25% while maintaining or improving quality.
                  </p>
                </div>
                <div className="bg-white p-3 rounded border border-green-200">
                  <h5 className="font-medium text-gray-900 mb-1">Batch Processing Gains</h5>
                  <p className="text-sm text-gray-700">
                    Grouping similar parts reduces setup time per piece by 40-60%. The time savings
                    compound when you can optimize parameters for the entire batch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Estimation Framework */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-900">My Time Estimation Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">
            This is the step-by-step process I use for accurate time estimation, refined through years of
            comparing estimates to actual production times.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">1</div>
              <h4 className="font-medium text-gray-900 mb-2">Base Cutting Time</h4>
              <p className="text-sm text-gray-600 mb-2">Calculate using realistic speeds (70-80% of max)</p>
              <div className="text-xs text-gray-500">
                Account for: Material type, thickness, geometry complexity
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">2</div>
              <h4 className="font-medium text-gray-900 mb-2">Pierce & Position Time</h4>
              <p className="text-sm text-gray-600 mb-2">Add pierce time + positioning moves</p>
              <div className="text-xs text-gray-500">
                Include: Pierce count, travel distance, lead-in/out time
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">3</div>
              <h4 className="font-medium text-gray-900 mb-2">Process Overhead</h4>
              <p className="text-sm text-gray-600 mb-2">Add setup, loading, quality checks</p>
              <div className="text-xs text-gray-500">
                Include: Material handling, parameter setup, inspection
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mb-3 text-sm font-bold">4</div>
              <h4 className="font-medium text-gray-900 mb-2">Reality Buffer</h4>
              <p className="text-sm text-gray-600 mb-2">Add 10-20% for real-world factors</p>
              <div className="text-xs text-gray-500">
                Account for: Interruptions, minor issues, operator variance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Time Estimation Mistakes */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Common Time Estimation Mistakes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 mb-6">
            These are the most common mistakes I see people make when estimating cutting times,
            based on my experience helping others improve their accuracy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-800 mb-3">❌ What Not to Do</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Using maximum machine speeds from specifications</li>
                <li>• Ignoring pierce time for parts with many holes</li>
                <li>• Not accounting for positioning and travel moves</li>
                <li>• Using the same speed for all materials of same thickness</li>
                <li>• Forgetting setup and material handling time</li>
                <li>• Not considering geometry complexity impact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-3">✅ Better Approach</h4>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Use 70-80% of max speed for realistic estimates</li>
                <li>• Calculate pierce time based on material and thickness</li>
                <li>• Include travel time between cuts and features</li>
                <li>• Adjust speeds for different materials and conditions</li>
                <li>• Always include setup and handling time</li>
                <li>• Apply complexity factors for intricate geometries</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Users className="h-5 w-5" />
            Recommended Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                <h4 className="font-medium text-blue-900 mb-1">Fundamentals</h4>
                <p className="text-sm text-blue-700">Learn realistic time calculation principles and factors</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                <h4 className="font-medium text-blue-900 mb-1">Optimization</h4>
                <p className="text-sm text-blue-700">Master speed optimization without compromising quality</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                <h4 className="font-medium text-blue-900 mb-1">Implementation</h4>
                <p className="text-sm text-blue-700">Apply knowledge to improve production efficiency</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Learning Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Stay Updated</CardTitle>
          <p className="text-center text-gray-600">
            Get the latest cutting time optimization tips and industry insights
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CuttingTimeEducationalContent;
