# Technical Architecture - Laser Cutting Calculator Platform

## Architecture Overview

The Laser Cutting Calculator Platform is built as a modern, scalable web application using React 18, TypeScript, and Vite. The architecture follows clean architecture principles with clear separation of concerns, comprehensive testing, and production-ready deployment capabilities.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Material-UI + Vite               │
│  • 27 Calculator Components                                │
│  • Responsive UI with Mobile Support                       │
│  • Real-time Calculations                                  │
│  • Progressive Web App (PWA) Capabilities                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  • Business Logic & Calculation Engines                    │
│  • State Management (React Context + Hooks)                │
│  • Routing & Navigation (React Router v6)                  │
│  • Data Validation & Error Handling                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                             │
├─────────────────────────────────────────────────────────────┤
│  • Calculator Services (27 specialized calculators)        │
│  • Unit Conversion Service                                  │
│  • Material Database Service                               │
│  • Export/Import Services                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  • Local Storage (Browser)                                 │
│  • Session Storage (Temporary Data)                        │
│  • IndexedDB (Large Data Sets)                            │
│  • External APIs (Material Properties, Market Data)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Architecture

```
src/
├── components/
│   ├── calculators/           # Calculator implementations
│   │   ├── cost/             # Cost & pricing calculators
│   │   ├── time/             # Time & efficiency calculators
│   │   ├── parameters/       # Technical parameter calculators
│   │   └── quality/          # Quality control calculators
│   ├── hubs/                 # Category hub pages
│   │   ├── CostHub.tsx
│   │   ├── TimeHub.tsx
│   │   ├── ParametersHub.tsx
│   │   └── QualityHub.tsx
│   ├── ui/                   # Reusable UI components
│   │   ├── CalculatorCard.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── InputField.tsx
│   │   └── ExportButton.tsx
│   └── feedback/             # User feedback system
│       └── UATFeedbackSystem.tsx
├── hooks/                    # Custom React hooks
│   ├── useCalculator.ts
│   ├── useUnitConversion.ts
│   ├── useLocalStorage.ts
│   └── useSecurity.ts
├── utils/                    # Utility functions
│   ├── calculations/         # Calculation utilities
│   ├── validation.ts         # Input validation
│   ├── formatting.ts         # Data formatting
│   └── export.ts            # Export functionality
├── types/                    # TypeScript definitions
│   ├── calculator.types.ts
│   ├── material.types.ts
│   └── common.types.ts
├── context/                  # React context providers
│   ├── CalculatorContext.tsx
│   ├── ThemeContext.tsx
│   └── UserContext.tsx
└── pages/                    # Page components
    ├── HomePage.tsx
    ├── CalculatorsPage.tsx
    ├── FeaturesPage.tsx
    └── LearnPage.tsx
```

### State Management

The application uses React Context API with custom hooks for state management:

```typescript
// Calculator Context
interface CalculatorContextType {
  calculations: Calculation[];
  currentCalculation: Calculation | null;
  saveCalculation: (calc: Calculation) => void;
  loadCalculation: (id: string) => void;
  exportCalculation: (format: ExportFormat) => void;
}

// Custom Hook Usage
const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
};
```

---

## Calculator Engine Architecture

### Calculator Service Pattern

Each calculator follows a consistent service pattern:

```typescript
interface CalculatorService<TInput, TOutput> {
  calculate(input: TInput): Promise<TOutput>;
  validate(input: TInput): ValidationResult;
  getRecommendations(input: TInput, output: TOutput): Recommendation[];
}

// Example: Laser Cutting Cost Calculator
class LaserCuttingCostCalculator implements CalculatorService<CostInput, CostOutput> {
  async calculate(input: CostInput): Promise<CostOutput> {
    // Validation
    const validation = this.validate(input);
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    // Core calculations
    const materialCost = this.calculateMaterialCost(input);
    const laborCost = this.calculateLaborCost(input);
    const overheadCost = this.calculateOverheadCost(input);
    const gasCost = this.calculateGasCost(input);

    // Result compilation
    return {
      totalCost: materialCost + laborCost + overheadCost + gasCost,
      costPerPart: (materialCost + laborCost + overheadCost + gasCost) / input.quantity,
      breakdown: {
        materialCost,
        laborCost,
        overheadCost,
        gasCost
      },
      recommendations: this.getRecommendations(input, result)
    };
  }
}
```

### Unit Conversion System

Comprehensive unit conversion system supporting metric and imperial units:

```typescript
class UnitConverter {
  private conversions: Map<string, ConversionFunction> = new Map();

  convert(value: number, fromUnit: Unit, toUnit: Unit): number {
    const conversionKey = `${fromUnit.type}_${fromUnit.unit}_to_${toUnit.unit}`;
    const converter = this.conversions.get(conversionKey);
    
    if (!converter) {
      throw new Error(`Conversion not supported: ${fromUnit.unit} to ${toUnit.unit}`);
    }
    
    return converter(value);
  }

  // Length conversions
  private initializeLengthConversions() {
    this.conversions.set('length_mm_to_inch', (mm) => mm / 25.4);
    this.conversions.set('length_inch_to_mm', (inch) => inch * 25.4);
    // ... more conversions
  }
}
```

---

## Performance Architecture

### Code Splitting Strategy

```typescript
// Route-based code splitting
const HomePage = lazy(() => import('../pages/HomePage'));
const CalculatorsPage = lazy(() => import('../pages/CalculatorsPage'));

// Calculator-specific code splitting
const LaserCuttingCostCalculator = lazy(() => 
  import('../components/calculators/cost/LaserCuttingCostCalculator')
);

// Bundle optimization configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react'],
          'calculators': ['./src/components/calculators/*'],
          'hubs': ['./src/components/hubs/*'],
          'utils': ['./src/utils', './src/hooks']
        }
      }
    }
  }
});
```

### Caching Strategy

```typescript
// Service Worker caching strategy
const CACHE_STRATEGIES = {
  static: 'cache-first',      // CSS, JS, Images
  api: 'network-first',       // API requests
  pages: 'stale-while-revalidate', // HTML pages
  dynamic: 'network-first'    // Dynamic content
};

// Implementation in service worker
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const strategy = getCacheStrategy(request.url);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});
```

---

## Security Architecture

### Input Validation & Sanitization

```typescript
// Comprehensive input validation
class InputValidator {
  static validateCalculatorInput(input: any, schema: ValidationSchema): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Type validation
    for (const [field, rules] of Object.entries(schema)) {
      const value = input[field];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }
      
      if (value !== undefined) {
        // Range validation
        if (rules.min !== undefined && value < rules.min) {
          errors.push({ field, message: `${field} must be >= ${rules.min}` });
        }
        
        if (rules.max !== undefined && value > rules.max) {
          errors.push({ field, message: `${field} must be <= ${rules.max}` });
        }
        
        // Custom validation
        if (rules.validator && !rules.validator(value)) {
          errors.push({ field, message: rules.message || `${field} is invalid` });
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### Security Headers Configuration

```typescript
// Security configuration
const securityConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.lasercalc.com"]
    }
  },
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};
```

---

## Testing Architecture

### Testing Strategy

```typescript
// Unit Testing - Calculator Services
describe('LaserCuttingCostCalculator', () => {
  let calculator: LaserCuttingCostCalculator;
  
  beforeEach(() => {
    calculator = new LaserCuttingCostCalculator();
  });
  
  it('should calculate basic cutting cost correctly', async () => {
    const input: CostInput = {
      material: { type: 'steel', thickness: 3.0 },
      dimensions: { length: 100, width: 100 },
      quantity: 10
    };
    
    const result = await calculator.calculate(input);
    
    expect(result.totalCost).toBeGreaterThan(0);
    expect(result.costPerPart).toBe(result.totalCost / input.quantity);
    expect(result.breakdown).toHaveProperty('materialCost');
  });
});

// Integration Testing - Component Integration
describe('Calculator Integration', () => {
  it('should integrate calculator service with UI component', async () => {
    render(
      <CalculatorProvider>
        <LaserCuttingCostCalculator />
      </CalculatorProvider>
    );
    
    // Simulate user input
    fireEvent.change(screen.getByLabelText('Material Thickness'), {
      target: { value: '3.0' }
    });
    
    fireEvent.click(screen.getByText('Calculate'));
    
    // Verify results display
    await waitFor(() => {
      expect(screen.getByText(/Total Cost/)).toBeInTheDocument();
    });
  });
});
```

### Performance Testing

```typescript
// Performance benchmarks
describe('Performance Tests', () => {
  it('should complete calculations within performance thresholds', async () => {
    const calculator = new LaserCuttingCostCalculator();
    const input = createTestInput();
    
    const startTime = performance.now();
    await calculator.calculate(input);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    expect(executionTime).toBeLessThan(100); // 100ms threshold
  });
  
  it('should handle concurrent calculations efficiently', async () => {
    const calculator = new LaserCuttingCostCalculator();
    const inputs = Array(100).fill(null).map(() => createTestInput());
    
    const startTime = performance.now();
    await Promise.all(inputs.map(input => calculator.calculate(input)));
    const endTime = performance.now();
    
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(1000); // 1 second for 100 calculations
  });
});
```

---

## Deployment Architecture

### Build Optimization

```typescript
// Vite configuration for production
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Strategic code splitting for optimal loading
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    react(),
    // PWA plugin for offline capabilities
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

### Monitoring Integration

```typescript
// Performance monitoring
class PerformanceMonitor {
  static trackCalculation(calculatorType: string, duration: number) {
    // Track calculation performance
    if (window.gtag) {
      window.gtag('event', 'calculation_completed', {
        calculator_type: calculatorType,
        duration: Math.round(duration),
        custom_map: {
          metric1: 'calculation_time'
        }
      });
    }
  }
  
  static trackError(error: Error, context: string) {
    // Track errors for monitoring
    console.error(`Error in ${context}:`, error);
    
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          context: context
        }
      });
    }
  }
}
```

---

## Scalability Considerations

### Horizontal Scaling

- **CDN Distribution**: Static assets served via global CDN
- **Edge Computing**: Calculator logic can run on edge servers
- **Microservices**: Calculator services can be extracted to separate services
- **Database Sharding**: User data can be partitioned by region/user

### Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Virtual Scrolling**: Large lists rendered efficiently
- **Service Workers**: Offline capabilities and caching

### Future Architecture Evolution

- **API Gateway**: Centralized API management
- **Event-Driven Architecture**: Real-time updates via WebSockets
- **Machine Learning**: AI-powered parameter optimization
- **Blockchain**: Immutable calculation audit trail

---

## Technology Stack Summary

### Core Technologies
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Material-UI v5, Emotion
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite with Rollup

### Development Tools
- **Code Quality**: ESLint, Prettier, Husky
- **Type Checking**: TypeScript strict mode
- **Package Management**: npm with lock files
- **Version Control**: Git with conventional commits

### Production Infrastructure
- **Hosting**: Vercel/Netlify (recommended)
- **CDN**: CloudFlare/CloudFront
- **Monitoring**: Prometheus + Grafana
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics 4

---

**Architecture Version**: 1.0  
**Last Updated**: $(date)  
**Next Review**: Quarterly architecture review
