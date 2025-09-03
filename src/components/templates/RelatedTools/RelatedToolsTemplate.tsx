import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Calculator, 
  BookOpen, 
  HelpCircle, 
  ExternalLink,
  ArrowRight,
  Clock,
  Star,
  Users,
  Mail,
  MessageCircle,
  Phone
} from 'lucide-react';

// Types
export interface RelatedCalculator {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  popularity: number;
  href: string;
  tags: string[];
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'tutorial' | 'best_practices' | 'advanced_guide' | 'case_study';
  readTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  href?: string;
  isExternal?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  popularity: number;
  tags: string[];
}

export interface SupportOption {
  type: 'email' | 'chat' | 'phone' | 'documentation';
  title: string;
  description: string;
  availability: string;
  responseTime: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

export interface WorkflowStep {
  step: number;
  calculator: string;
  description: string;
}

export interface RelatedToolsConfig {
  calculatorName: string;
  relatedCalculators: RelatedCalculator[];
  educationalResources: EducationalResource[];
  faqItems: FAQItem[];
  supportOptions: SupportOption[];
  workflow?: WorkflowStep[];
  additionalResources?: {
    videoTutorials: string[];
    industryReports: string[];
    webinars: string[];
  };
}

interface RelatedToolsTemplateProps {
  config: RelatedToolsConfig;
  className?: string;
}

const RelatedToolsTemplate: React.FC<RelatedToolsTemplateProps> = ({
  config,
  className = ''
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-800';
      case 'tutorial': return 'bg-purple-100 text-purple-800';
      case 'best_practices': return 'bg-green-100 text-green-800';
      case 'advanced_guide': return 'bg-red-100 text-red-800';
      case 'case_study': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Related Calculators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Related Calculators
          </CardTitle>
          <p className="text-sm text-gray-600">
            Explore other calculators that complement your {config.calculatorName} workflow
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.relatedCalculators.map((calculator) => (
              <Card key={calculator.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(calculator.difficulty)}>
                      {calculator.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(calculator.popularity / 20))}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg">{calculator.name}</h3>
                  <p className="text-sm text-gray-600">{calculator.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {calculator.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {calculator.popularity}% use
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {calculator.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = calculator.href}
                  >
                    Open Calculator
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Workflow Section */}
          {config.workflow && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Complete Cost Analysis Workflow</h4>
              <p className="text-sm text-gray-600 mb-4">
                For comprehensive cost optimization, use these calculators in sequence:
              </p>
              <div className="flex flex-wrap gap-2">
                {config.workflow.map((step, index) => (
                  <div key={step.step} className="flex items-center">
                    <Badge variant="outline">{step.step}. {step.calculator}</Badge>
                    {index < config.workflow!.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Educational Resources
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive guides and tutorials to help you master laser cutting cost optimization
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.educationalResources.map((resource) => (
              <Card key={resource.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{resource.readTime}</Badge>
                  </div>
                  
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-1">
                      {resource.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => resource.href && window.open(resource.href, resource.isExternal ? '_blank' : '_self')}
                  >
                    Read Article
                    {resource.isExternal && <ExternalLink className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          {config.additionalResources && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Additional Learning Resources</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Video Tutorials</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {config.additionalResources.videoTutorials.map((tutorial, index) => (
                      <li key={index}>• {tutorial}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Industry Reports</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {config.additionalResources.industryReports.map((report, index) => (
                      <li key={index}>• {report}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Webinars</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {config.additionalResources.webinars.map((webinar, index) => (
                      <li key={index}>• {webinar}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button variant="outline">View All Resources</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Common questions about {config.calculatorName.toLowerCase()} and optimization
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {config.faqItems.slice(0, 5).map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50"
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ArrowRight 
                    className={`h-4 w-4 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-3 text-sm text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Still Have Questions?</CardTitle>
          <p className="text-sm text-gray-600">
            Our technical support team is here to help you optimize your laser cutting costs and improve your operations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {config.supportOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={option.action}
              >
                <option.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{option.title}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.responseTime}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <strong>Response Time:</strong> Within 4 hours during business hours (Mon-Fri, 8AM-6PM EST)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatedToolsTemplate;
