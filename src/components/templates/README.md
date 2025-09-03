# Calculator Template Components Library

This directory contains reusable template components for building standardized calculator pages across the Laser Cutting Calculator Platform.

## Directory Structure

```
templates/
├── README.md                           # This file
├── CalculatorPageTemplate.tsx          # Main page template
├── FormulaExplanation/                 # Formula explanation components
│   ├── FormulaExplanationTemplate.tsx
│   ├── VariablesTable.tsx
│   ├── CalculationSteps.tsx
│   └── DataSources.tsx
├── RelatedTools/                       # Related tools components
│   ├── RelatedToolsTemplate.tsx
│   ├── RecommendedCalculators.tsx
│   ├── EducationalResources.tsx
│   └── FAQ.tsx
├── EnhancedInput/                      # Enhanced input components
│   ├── EnhancedInputTemplate.tsx
│   ├── ParameterInput.tsx
│   ├── UnitSelector.tsx
│   └── ValidationMessage.tsx
├── ResultsDisplay/                     # Results display components
│   ├── ResultsDisplayTemplate.tsx
│   ├── CostBreakdownChart.tsx
│   ├── SensitivityAnalysis.tsx
│   └── EfficiencyMetrics.tsx
├── ExportTools/                        # Export tools components
│   ├── ExportToolsTemplate.tsx
│   ├── DataExporter.tsx
│   ├── ShareTools.tsx
│   └── PrintTools.tsx
└── types/                              # TypeScript type definitions
    ├── CalculatorTypes.ts
    ├── FormulaTypes.ts
    ├── ResultTypes.ts
    └── ExportTypes.ts
```

## Component Templates

### 1. Calculator Page Template
- **File**: `CalculatorPageTemplate.tsx`
- **Purpose**: Main page structure with all 7 standard modules
- **Features**: Header, breadcrumbs, input area, results, formula explanation, related tools, export tools

### 2. Formula Explanation Template
- **File**: `FormulaExplanation/FormulaExplanationTemplate.tsx`
- **Purpose**: Standardized formula explanation with tabs
- **Features**: Variables table, calculation steps, data sources, scope definition

### 3. Related Tools Template
- **File**: `RelatedTools/RelatedToolsTemplate.tsx`
- **Purpose**: Related calculators and educational resources
- **Features**: Recommended calculators, educational content, FAQ, support

### 4. Enhanced Input Template
- **File**: `EnhancedInput/EnhancedInputTemplate.tsx`
- **Purpose**: Advanced input interface with validation
- **Features**: Parameter inputs, unit selectors, validation, tooltips

### 5. Results Display Template
- **File**: `ResultsDisplay/ResultsDisplayTemplate.tsx`
- **Purpose**: Comprehensive results visualization
- **Features**: Charts, breakdowns, sensitivity analysis, metrics

### 6. Export Tools Template
- **File**: `ExportTools/ExportToolsTemplate.tsx`
- **Purpose**: Complete export and sharing functionality
- **Features**: Multiple formats, sharing, embedding, printing

## Usage Guidelines

### 1. Template Customization
Each template accepts configuration props to customize:
- Calculator-specific data and labels
- Industry-specific terminology
- Custom validation rules
- Specialized chart types

### 2. Type Safety
All templates use TypeScript interfaces for:
- Input parameters
- Calculation results
- Configuration options
- Event handlers

### 3. Styling Consistency
Templates use:
- Tailwind CSS classes for styling
- Consistent color schemes
- Standard spacing and typography
- Responsive design patterns

### 4. Accessibility
All templates include:
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## Implementation Example

```tsx
import { CalculatorPageTemplate } from './templates/CalculatorPageTemplate';
import { LaserCuttingCostConfig } from './config/LaserCuttingCostConfig';

const LaserCuttingCostCalculator = () => {
  return (
    <CalculatorPageTemplate
      config={LaserCuttingCostConfig}
      onCalculate={handleCalculation}
      onExport={handleExport}
    />
  );
};
```

## Benefits

1. **Consistency**: All calculators follow the same structure and design patterns
2. **Maintainability**: Changes to templates automatically apply to all calculators
3. **Development Speed**: New calculators can be built quickly using templates
4. **Quality Assurance**: Templates ensure all calculators meet quality standards
5. **User Experience**: Consistent interface across all calculators

## Next Steps

1. Extract common functionality from existing calculators
2. Create reusable template components
3. Define configuration interfaces
4. Implement template-based calculators
5. Test and refine templates
6. Document usage patterns
