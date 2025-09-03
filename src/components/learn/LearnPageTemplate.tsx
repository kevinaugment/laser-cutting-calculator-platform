import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calculator, 
  Lightbulb, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  Download
} from 'lucide-react';

interface Formula {
  name: string;
  formula: string;
  description: string;
  variables: { symbol: string; description: string; unit?: string }[];
}

interface Example {
  title: string;
  scenario: string;
  inputs: { parameter: string; value: string; unit?: string }[];
  calculation: string;
  result: string;
  insights: string[];
}

interface BestPractice {
  title: string;
  description: string;
  tips: string[];
  commonMistakes: string[];
}

interface IndustryStandard {
  standard: string;
  organization: string;
  description: string;
  applicability: string[];
}

interface LearnPageProps {
  calculatorName: string;
  calculatorDescription: string;
  category: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  learningObjectives: string[];
  keyFormulas: Formula[];
  practicalExamples: Example[];
  bestPractices: BestPractice[];
  industryStandards: IndustryStandard[];
  relatedCalculators: string[];
  videoTutorialUrl?: string;
  downloadableResources?: { name: string; url: string; type: string }[];
}

const LearnPageTemplate: React.FC<LearnPageProps> = ({
  calculatorName,
  calculatorDescription,
  category,
  difficulty,
  learningObjectives,
  keyFormulas,
  practicalExamples,
  bestPractices,
  industryStandards,
  relatedCalculators,
  videoTutorialUrl,
  downloadableResources
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Basic': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{calculatorName}</h1>
                  <p className="text-lg text-gray-600 mt-1">{category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </span>
                {videoTutorialUrl && (
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Watch Tutorial</span>
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{calculatorDescription}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Objectives */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Learning Objectives
              </h2>
              <ul className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Key Formulas */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                Key Formulas
              </h2>
              <div className="space-y-6">
                {keyFormulas.map((formula, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{formula.name}</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <code className="text-lg font-mono text-blue-600">{formula.formula}</code>
                    </div>
                    <p className="text-gray-700 mb-3">{formula.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formula.variables.map((variable, vIndex) => (
                        <div key={vIndex} className="flex items-center space-x-2">
                          <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                            {variable.symbol}
                          </code>
                          <span className="text-sm text-gray-600">
                            {variable.description}
                            {variable.unit && <span className="text-gray-500"> ({variable.unit})</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Practical Examples */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
                Practical Examples
              </h2>
              <div className="space-y-6">
                {practicalExamples.map((example, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{example.title}</h3>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Scenario:</h4>
                      <p className="text-blue-800">{example.scenario}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Input Parameters:</h4>
                        <div className="space-y-2">
                          {example.inputs.map((input, iIndex) => (
                            <div key={iIndex} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-600">{input.parameter}:</span>
                              <span className="text-sm font-medium">
                                {input.value} {input.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Calculation:</h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <code className="text-sm font-mono text-gray-800">{example.calculation}</code>
                        </div>
                        <div className="mt-3 p-3 bg-green-50 rounded">
                          <span className="text-sm text-green-700 font-medium">Result: {example.result}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
                      <ul className="space-y-1">
                        {example.insights.map((insight, insIndex) => (
                          <li key={insIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Best Practices */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                Best Practices
              </h2>
              <div className="space-y-6">
                {bestPractices.map((practice, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{practice.title}</h3>
                    <p className="text-gray-700 mb-4">{practice.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Recommended Practices
                        </h4>
                        <ul className="space-y-2">
                          {practice.tips.map((tip, tIndex) => (
                            <li key={tIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Common Mistakes to Avoid
                        </h4>
                        <ul className="space-y-2">
                          {practice.commonMistakes.map((mistake, mIndex) => (
                            <li key={mIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{mistake}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Industry Standards */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Industry Standards
              </h3>
              <div className="space-y-4">
                {industryStandards.map((standard, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">{standard.standard}</h4>
                    <p className="text-sm text-gray-600 mb-2">{standard.organization}</p>
                    <p className="text-sm text-gray-700 mb-2">{standard.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {standard.applicability.map((app, aIndex) => (
                        <span key={aIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Related Calculators */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h3>
              <div className="space-y-2">
                {relatedCalculators.map((calculator, index) => (
                  <a
                    key={index}
                    href={`#`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-blue-600 hover:text-blue-800">{calculator}</span>
                  </a>
                ))}
              </div>
            </motion.section>

            {/* Downloadable Resources */}
            {downloadableResources && downloadableResources.length > 0 && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-blue-600" />
                  Resources
                </h3>
                <div className="space-y-2">
                  {downloadableResources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{resource.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{resource.type}</span>
                    </a>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPageTemplate;
