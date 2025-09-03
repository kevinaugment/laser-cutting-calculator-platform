import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';

const CuttingTimeFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems = [
    {
      question: "How accurate are the cutting time estimates?",
      category: "Accuracy",
      answer: "Our cutting time estimates are typically accurate within ±15% for standard materials and operating conditions. Accuracy can be improved to ±10% when using well-characterized processes and materials. For complex geometries or new materials, expect ±20-25% variance until process optimization is complete. The calculator uses industry-standard formulas and empirical data from thousands of cutting operations."
    },
    {
      question: "What factors most significantly affect cutting time?",
      category: "Process Factors",
      answer: "The most significant factors affecting cutting time are: 1) Cutting speed (directly proportional to time), 2) Total cut length (linear relationship), 3) Number of pierces (each pierce adds setup time), 4) Material type and thickness (affects optimal speed), 5) Quality requirements (higher quality = slower speeds), and 6) Geometry complexity (complex shapes require slower speeds for accuracy)."
    },
    {
      question: "How should I handle batch processing time calculations?",
      category: "Batch Processing",
      answer: "For batch processing, multiply the single-part time by the quantity, but consider these factors: 1) Setup time is typically shared across the batch, 2) Material handling time increases with batch size, 3) Nesting efficiency can reduce total cutting time, 4) Machine warm-up time is amortized across larger batches, and 5) Quality control time scales with batch size. Use our Batch Processing Calculator for more detailed analysis."
    },
    {
      question: "Why do my actual times differ from the estimates?",
      category: "Troubleshooting",
      answer: "Common reasons for time differences include: 1) Machine-specific variations (different acceleration/deceleration profiles), 2) Operator skill and setup efficiency, 3) Material quality variations affecting cutting speed, 4) Environmental factors (temperature, humidity), 5) Machine maintenance status, 6) CAM software path optimization differences, and 7) Quality requirements stricter than assumed. Regular calibration with actual data improves accuracy."
    },
    {
      question: "How do I optimize cutting time without sacrificing quality?",
      category: "Optimization",
      answer: "To optimize cutting time while maintaining quality: 1) Use the highest safe cutting speed for your material/thickness combination, 2) Minimize pierce points through design optimization, 3) Optimize cutting path sequence to reduce positioning time, 4) Use appropriate assist gas for speed/quality balance, 5) Maintain optimal focus position, 6) Consider pulsed cutting for thick materials, and 7) Implement proper material handling to reduce setup time."
    },
    {
      question: "What's the difference between cutting time and total process time?",
      category: "Time Components",
      answer: "Cutting time is only the time the laser is actively cutting material. Total process time includes: 1) Cutting time (laser on, cutting), 2) Pierce time (laser on, piercing), 3) Positioning time (laser off, moving between cuts), 4) Setup time (material loading, fixturing), 5) Programming time (if applicable), and 6) Quality inspection time. Process efficiency is the ratio of cutting time to total process time."
    }
  ];

  return (
    <div className="space-y-8">
      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Frequently Asked Questions
          </CardTitle>
          <p className="text-sm text-gray-600">
            Common questions about cutting time estimation and optimization
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{item.question}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-4 pb-4">
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
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
            Our cutting time optimization experts are here to help you improve your production efficiency and accuracy.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Email Support</span>
              <span className="text-xs text-gray-500">Response within 4 hours</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Live Chat</span>
              <span className="text-xs text-gray-500">Available 9 AM - 6 PM EST</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Phone Consultation</span>
              <span className="text-xs text-gray-500">Schedule a call</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Expert Consultation Available</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Need help with complex time optimization challenges? Our laser cutting experts can provide personalized guidance.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <strong>Response Time:</strong> Within 4 hours during business hours (Mon-Fri, 8AM-6PM EST)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">💡 Cutting Time Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Speed Optimization:</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Material Selection:</strong> Choose materials with higher cutting speeds when possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Parameter Optimization:</strong> Fine-tune power and speed for each material</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Gas Selection:</strong> Use oxygen for speed, nitrogen for quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Focus Control:</strong> Maintain optimal focus position throughout cutting</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-green-800 mb-3">Efficiency Improvement:</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Path Optimization:</strong> Minimize rapid traverse distances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Pierce Reduction:</strong> Combine features to reduce pierce points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Batch Processing:</strong> Group similar parts for efficiency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Setup Standardization:</strong> Reduce setup time through standardization</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CuttingTimeFAQ;
