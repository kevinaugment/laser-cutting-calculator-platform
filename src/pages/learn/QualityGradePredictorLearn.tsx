import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const QualityGradePredictorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand laser cutting quality standards and grading systems",
    "Learn to predict cut quality based on process parameters",
    "Master quality optimization techniques for different applications",
    "Apply quality assessment methods for process control",
    "Develop skills in quality-cost trade-off analysis"
  ];

  const keyFormulas = [
    {
      name: "Quality Index",
      formula: "QI = (Surface Roughness Score + Edge Squareness Score + Dross Score) / 3",
      description: "Overall quality index based on key quality parameters",
      variables: [
        { symbol: "Surface Roughness Score", description: "Normalized surface finish score", unit: "1-10" },
        { symbol: "Edge Squareness Score", description: "Normalized edge perpendicularity score", unit: "1-10" },
        { symbol: "Dross Score", description: "Normalized dross formation score", unit: "1-10" }
      ]
    },
    {
      name: "Surface Roughness Prediction",
      formula: "Ra = K × (Speed / Power)^0.3 × Thickness^0.2",
      description: "Predicts surface roughness based on cutting parameters",
      variables: [
        { symbol: "K", description: "Material-specific roughness constant", unit: "μm" },
        { symbol: "Speed", description: "Cutting speed", unit: "mm/min" },
        { symbol: "Power", description: "Laser power", unit: "W" },
        { symbol: "Thickness", description: "Material thickness", unit: "mm" }
      ]
    },
    {
      name: "Edge Squareness",
      formula: "Squareness = 90° - (Heat Input × Thermal Expansion × Thickness)",
      description: "Predicts edge angle deviation from perpendicular",
      variables: [
        { symbol: "Heat Input", description: "Energy per unit length", unit: "J/mm" },
        { symbol: "Thermal Expansion", description: "Material thermal expansion coefficient", unit: "1/°C" },
        { symbol: "Thickness", description: "Material thickness", unit: "mm" }
      ]
    },
    {
      name: "Quality Cost Factor",
      formula: "QCF = Base Cost × (1 + Quality Premium × (Target Grade - Standard Grade))",
      description: "Calculates cost impact of achieving higher quality grades",
      variables: [
        { symbol: "Base Cost", description: "Standard quality cutting cost", unit: "$" },
        { symbol: "Quality Premium", description: "Cost increase per quality grade", unit: "%" },
        { symbol: "Target Grade", description: "Desired quality grade", unit: "1-5" },
        { symbol: "Standard Grade", description: "Standard quality grade", unit: "1-5" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Stainless Steel Quality Prediction",
      scenario: "Predicting cut quality for 6mm stainless steel 316L using optimized parameters. Power: 2500W, Speed: 1800 mm/min, Nitrogen assist gas at 2.8 bar pressure.",
      inputs: [
        { parameter: "Material", value: "SS316L, 6mm", unit: "thickness" },
        { parameter: "Laser Power", value: "2500", unit: "W" },
        { parameter: "Cutting Speed", value: "1800", unit: "mm/min" },
        { parameter: "Gas Type", value: "Nitrogen", unit: "assist gas" },
        { parameter: "Gas Pressure", value: "2.8", unit: "bar" },
        { parameter: "Material Constant K", value: "2.5", unit: "μm" }
      ],
      calculation: "Surface Roughness Prediction:\nRa = K × (Speed / Power)^0.3 × Thickness^0.2\nRa = 2.5 × (1800 / 2500)^0.3 × 6^0.2\nRa = 2.5 × 0.72^0.3 × 1.43\nRa = 2.5 × 0.89 × 1.43 = 3.18 μm\n\nQuality Scores:\nSurface Roughness: 8/10 (excellent)\nEdge Squareness: 9/10 (excellent)\nDross Formation: 9/10 (minimal)\nQuality Index = (8 + 9 + 9) / 3 = 8.7/10",
      result: "Predicted Quality Grade: 4 (High Quality), Surface Roughness: 3.18 μm",
      insights: [
        "Nitrogen assist gas provides excellent edge quality",
        "Optimized parameters result in high quality grade",
        "Surface roughness is within acceptable limits for most applications",
        "Quality index of 8.7 indicates premium cut quality"
      ]
    },
    {
      title: "Quality vs Speed Trade-off Analysis",
      scenario: "Comparing quality outcomes for aluminum 5mm at different cutting speeds: 4000, 6000, and 8000 mm/min with 2000W power.",
      inputs: [
        { parameter: "Material", value: "Aluminum 5052, 5mm", unit: "thickness" },
        { parameter: "Laser Power", value: "2000", unit: "W" },
        { parameter: "Speed Option 1", value: "4000", unit: "mm/min" },
        { parameter: "Speed Option 2", value: "6000", unit: "mm/min" },
        { parameter: "Speed Option 3", value: "8000", unit: "mm/min" },
        { parameter: "Material Constant K", value: "1.8", unit: "μm" }
      ],
      calculation: "Speed 4000 mm/min:\nRa = 1.8 × (4000/2000)^0.3 × 5^0.2 = 2.8 μm, Grade: 4\n\nSpeed 6000 mm/min:\nRa = 1.8 × (6000/2000)^0.3 × 5^0.2 = 3.4 μm, Grade: 3\n\nSpeed 8000 mm/min:\nRa = 1.8 × (8000/2000)^0.3 × 5^0.2 = 4.1 μm, Grade: 2\n\nProductivity Comparison:\n4000 mm/min: 100% quality, 100% time\n6000 mm/min: 85% quality, 67% time\n8000 mm/min: 70% quality, 50% time",
      result: "Quality decreases with speed: Grade 4→3→2, Time savings: 0%→33%→50%",
      insights: [
        "Significant quality degradation at higher speeds",
        "50% time savings comes with 30% quality reduction",
        "Medium speed (6000) offers good balance",
        "Application requirements should drive speed selection"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Quality Assessment and Measurement",
      description: "Systematic approaches to measuring and evaluating cut quality",
      tips: [
        "Use standardized measurement procedures for consistency",
        "Implement statistical process control for quality monitoring",
        "Document quality standards for different applications",
        "Regular calibration of measurement equipment",
        "Train operators on quality assessment techniques"
      ],
      commonMistakes: [
        "Inconsistent measurement techniques between operators",
        "Not accounting for material property variations",
        "Using visual inspection only without quantitative measures",
        "Not correlating quality metrics with customer requirements",
        "Failing to update quality standards with process improvements"
      ]
    },
    {
      title: "Parameter Optimization for Quality",
      description: "Strategies for optimizing cutting parameters to achieve target quality",
      tips: [
        "Use design of experiments (DOE) for systematic optimization",
        "Focus on critical quality parameters for the application",
        "Consider the complete parameter interaction matrix",
        "Validate optimization results with production trials",
        "Document optimized parameters for different quality requirements"
      ],
      commonMistakes: [
        "Optimizing single parameters without considering interactions",
        "Not validating predictions with actual measurements",
        "Ignoring the cost impact of quality improvements",
        "Using outdated parameter databases",
        "Not considering material batch variations in optimization"
      ]
    },
    {
      title: "Quality-Cost Balance",
      description: "Methods for balancing quality requirements with cost considerations",
      tips: [
        "Define quality requirements based on end-use applications",
        "Calculate the true cost of quality including downstream processes",
        "Consider customer willingness to pay for quality improvements",
        "Implement tiered quality levels for different market segments",
        "Monitor quality costs and trends for continuous improvement"
      ],
      commonMistakes: [
        "Over-engineering quality beyond customer requirements",
        "Not considering the total cost of quality in pricing",
        "Focusing on quality metrics that don't add customer value",
        "Ignoring the cost of quality failures and rework",
        "Not communicating quality value to customers effectively"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9013",
      organization: "International Organization for Standardization",
      description: "Thermal cutting - Classification of thermal cuts with quality grades 1-5",
      applicability: ["Quality Classification", "Cut Quality Standards", "International Trade"]
    },
    {
      standard: "DIN EN ISO 9013",
      organization: "German Institute for Standardization",
      description: "European implementation of ISO 9013 quality standards",
      applicability: ["European Markets", "Quality Certification", "Technical Specifications"]
    },
    {
      standard: "AWS C7.1M",
      organization: "American Welding Society",
      description: "Recommended practices for thermal cutting including quality requirements",
      applicability: ["North American Standards", "Welding Industry", "Quality Specifications"]
    },
    {
      standard: "JIS B 0417",
      organization: "Japanese Industrial Standards",
      description: "Thermal cutting quality classification for Asian markets",
      applicability: ["Asian Markets", "Export Requirements", "Quality Certification"]
    }
  ];

  const relatedCalculators = [
    "Laser Parameter Optimizer",
    "Surface Finish Calculator",
    "Dimensional Accuracy Calculator",
    "Process Control Calculator",
    "Cost-Quality Analyzer"
  ];

  const downloadableResources = [
    {
      name: "Quality Assessment Checklist",
      url: "/resources/quality-assessment-checklist.pdf",
      type: "PDF"
    },
    {
      name: "Quality Grade Reference Chart",
      url: "/resources/quality-grade-chart.pdf",
      type: "PDF"
    },
    {
      name: "Quality Measurement Worksheet",
      url: "/resources/quality-measurement-worksheet.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Quality Grade Predictor"
      calculatorDescription="Master laser cutting quality prediction and optimization. Learn to assess and predict cut quality based on process parameters, understand quality standards, and optimize the balance between quality and cost for different applications."
      category="Quality Control"
      difficulty="Advanced"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/quality-grade-predictor"
      downloadableResources={downloadableResources}
    />
  );
};

export default QualityGradePredictorLearn;
