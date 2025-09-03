import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const BatchProcessingOptimizerLearn: React.FC = () => {
  const learningObjectives = [
    "Understand batch processing principles and optimization strategies",
    "Learn to calculate optimal batch sizes for different production scenarios",
    "Master setup time reduction and changeover optimization techniques",
    "Apply batch scheduling algorithms for maximum efficiency",
    "Develop skills in production flow optimization and bottleneck management"
  ];

  const keyFormulas = [
    {
      name: "Economic Batch Quantity",
      formula: "EBQ = √((2 × Setup Cost × Demand) / (Holding Cost × (1 - Production Rate/Demand Rate)))",
      description: "Optimal batch size balancing setup and holding costs",
      variables: [
        { symbol: "Setup Cost", description: "Cost of setting up for production", unit: "$" },
        { symbol: "Demand", description: "Annual demand for the product", unit: "units/year" },
        { symbol: "Holding Cost", description: "Cost to hold one unit in inventory", unit: "$/unit/year" },
        { symbol: "Production Rate", description: "Production rate during manufacturing", unit: "units/year" }
      ]
    },
    {
      name: "Batch Processing Time",
      formula: "Total Time = Setup Time + (Batch Size × Unit Processing Time)",
      description: "Total time required to complete a batch",
      variables: [
        { symbol: "Setup Time", description: "Time to prepare for batch", unit: "minutes" },
        { symbol: "Batch Size", description: "Number of units in batch", unit: "pieces" },
        { symbol: "Unit Processing Time", description: "Time to process one unit", unit: "minutes/piece" }
      ]
    },
    {
      name: "Setup Time Efficiency",
      formula: "Setup Efficiency = Processing Time / (Setup Time + Processing Time) × 100",
      description: "Percentage of time spent on value-added processing",
      variables: [
        { symbol: "Processing Time", description: "Time spent cutting/processing", unit: "minutes" },
        { symbol: "Setup Time", description: "Time spent on setup activities", unit: "minutes" }
      ]
    },
    {
      name: "Batch Cost per Unit",
      formula: "Cost per Unit = (Setup Cost + Material Cost + Processing Cost) / Batch Size",
      description: "Total cost per unit including setup cost allocation",
      variables: [
        { symbol: "Setup Cost", description: "Total setup cost for batch", unit: "$" },
        { symbol: "Material Cost", description: "Total material cost for batch", unit: "$" },
        { symbol: "Processing Cost", description: "Total processing cost for batch", unit: "$" },
        { symbol: "Batch Size", description: "Number of units in batch", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Optimal Batch Size Calculation",
      scenario: "Determining optimal batch size for steel brackets. Setup time: 30 minutes, processing time: 2 minutes/piece, setup cost: $45, holding cost: $2/unit/year, annual demand: 5000 units.",
      inputs: [
        { parameter: "Setup Time", value: "30", unit: "minutes" },
        { parameter: "Processing Time", value: "2", unit: "minutes/piece" },
        { parameter: "Setup Cost", value: "$45", unit: "per batch" },
        { parameter: "Holding Cost", value: "$2", unit: "per unit/year" },
        { parameter: "Annual Demand", value: "5000", unit: "units" },
        { parameter: "Production Rate", value: "15000", unit: "units/year" }
      ],
      calculation: "Economic Batch Quantity:\nEBQ = √((2 × 45 × 5000) / (2 × (1 - 5000/15000)))\nEBQ = √(450000 / (2 × 0.667))\nEBQ = √(450000 / 1.334)\nEBQ = √337331 = 581 units\n\nBatch Analysis:\nBatches per Year = 5000 / 581 = 8.6 batches\nTotal Setup Time = 8.6 × 30 = 258 minutes/year\nSetup Efficiency = (5000 × 2) / (258 + 10000) = 97.5%",
      result: "Optimal batch size: 581 units, Setup efficiency: 97.5%",
      insights: [
        "Large batch size minimizes setup time impact",
        "High setup efficiency indicates good batch optimization",
        "8.6 batches per year reduces setup frequency",
        "Balance between setup costs and inventory holding costs"
      ]
    },
    {
      title: "Multi-Product Batch Scheduling",
      scenario: "Optimizing batch sequence for 3 products on one laser. Product A: 200 units, 15 min setup. Product B: 150 units, 25 min setup. Product C: 100 units, 20 min setup. Common setup between A&B: 5 min.",
      inputs: [
        { parameter: "Product A Quantity", value: "200", unit: "units" },
        { parameter: "Product A Setup", value: "15", unit: "minutes" },
        { parameter: "Product B Quantity", value: "150", unit: "units" },
        { parameter: "Product B Setup", value: "25", unit: "minutes" },
        { parameter: "Product C Quantity", value: "100", unit: "units" },
        { parameter: "Product C Setup", value: "20", unit: "minutes" },
        { parameter: "A→B Changeover", value: "5", unit: "minutes" },
        { parameter: "Processing Time", value: "1.5", unit: "min/unit" }
      ],
      calculation: "Sequence Analysis:\nOption 1 (A→B→C): Setup = 15 + 5 + 20 = 40 min\nOption 2 (A→C→B): Setup = 15 + 20 + 25 = 60 min\nOption 3 (B→A→C): Setup = 25 + 5 + 20 = 50 min\n\nOptimal Sequence (A→B→C):\nTotal Setup Time = 40 minutes\nTotal Processing = (200 + 150 + 100) × 1.5 = 675 minutes\nTotal Time = 40 + 675 = 715 minutes\nSetup Efficiency = 675 / 715 = 94.4%",
      result: "Optimal sequence: A→B→C, Total time: 715 min, Efficiency: 94.4%",
      insights: [
        "Sequence optimization saves 20 minutes vs worst case",
        "Common setups between similar products reduce changeover time",
        "Setup efficiency remains high with optimized sequencing",
        "Scheduling algorithms can significantly impact productivity"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Batch Size Optimization",
      description: "Strategies for determining optimal batch sizes in different scenarios",
      tips: [
        "Consider both setup costs and inventory holding costs",
        "Account for demand variability and seasonality",
        "Factor in material shelf life and obsolescence risk",
        "Consider capacity constraints and bottleneck operations",
        "Regular review and adjustment of batch sizes based on actual data"
      ],
      commonMistakes: [
        "Using fixed batch sizes without considering cost trade-offs",
        "Not accounting for setup time in batch size calculations",
        "Ignoring the impact of batch size on cash flow",
        "Not considering quality issues that may arise with large batches",
        "Failing to coordinate batch sizes across dependent operations"
      ]
    },
    {
      title: "Setup Time Reduction",
      description: "Techniques for minimizing setup and changeover times",
      tips: [
        "Implement Single Minute Exchange of Die (SMED) principles",
        "Standardize tooling and fixtures across similar products",
        "Prepare setup materials and tools in advance",
        "Use quick-change systems and automated setup procedures",
        "Train operators on efficient setup procedures"
      ],
      commonMistakes: [
        "Not distinguishing between internal and external setup activities",
        "Performing setup activities that could be done while machine is running",
        "Not investing in setup reduction when benefits justify costs",
        "Lack of standardization leading to inconsistent setup times",
        "Not measuring and tracking setup time improvements"
      ]
    },
    {
      title: "Batch Scheduling and Sequencing",
      description: "Methods for optimizing the sequence and timing of batch production",
      tips: [
        "Group similar products to minimize changeover times",
        "Consider material flow and logistics in sequencing decisions",
        "Use scheduling software for complex multi-product scenarios",
        "Balance batch sizes with delivery requirements",
        "Implement pull systems to reduce work-in-process inventory"
      ],
      commonMistakes: [
        "Not considering the impact of sequence on total setup time",
        "Ignoring downstream operations in batch scheduling",
        "Not coordinating batch schedules with material deliveries",
        "Optimizing individual operations without considering system impact",
        "Not having contingency plans for schedule disruptions"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 22400-2",
      organization: "International Organization for Standardization",
      description: "Manufacturing operations management - Key performance indicators for batch processing",
      applicability: ["Batch Management", "Performance Measurement", "Process Optimization"]
    },
    {
      standard: "ISA-88",
      organization: "International Society of Automation",
      description: "Batch control systems standards for manufacturing operations",
      applicability: ["Batch Control", "Process Automation", "Manufacturing Systems"]
    },
    {
      standard: "ANSI/ISA-95",
      organization: "International Society of Automation",
      description: "Enterprise-control system integration for batch manufacturing",
      applicability: ["Production Planning", "Batch Scheduling", "Manufacturing Execution"]
    }
  ];

  const relatedCalculators = [
    "Production Capacity Planner",
    "Setup Time Calculator",
    "Inventory Optimization Calculator",
    "Production Scheduling Calculator",
    "Lean Manufacturing Calculator"
  ];

  const downloadableResources = [
    {
      name: "Batch Size Optimization Worksheet",
      url: "/resources/batch-size-optimization.xlsx",
      type: "XLSX"
    },
    {
      name: "Setup Reduction Checklist",
      url: "/resources/setup-reduction-checklist.pdf",
      type: "PDF"
    },
    {
      name: "Batch Scheduling Template",
      url: "/resources/batch-scheduling-template.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Batch Processing Optimizer"
      calculatorDescription="Master batch processing optimization for laser cutting operations. Learn to calculate optimal batch sizes, minimize setup times, and optimize production sequences for maximum efficiency and cost-effectiveness."
      category="Production Management"
      difficulty="Advanced"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/batch-processing-optimizer"
      downloadableResources={downloadableResources}
    />
  );
};

export default BatchProcessingOptimizerLearn;
