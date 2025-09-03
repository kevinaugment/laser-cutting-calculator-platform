# Core Calculators API Documentation
## 20 Essential Calculators REST API v2.0

**Version**: 2.0.0  
**Last Updated**: January 2025  
**Base URL**: `https://api.dfoffer.com/v2/core`
**Focus**: 20 Core Calculators across 4 Epic Categories

---

## 📋 Quick Reference

### Epic Categories and Endpoints

| **Epic** | **Calculators** | **Base Endpoint** |
|----------|-----------------|-------------------|
| **Core Engineering** | 5 calculators | `/v2/core/engineering/` |
| **Quality Control** | 5 calculators | `/v2/core/quality/` |
| **Process Optimization** | 5 calculators | `/v2/core/optimization/` |
| **Advanced Analysis** | 5 calculators | `/v2/core/analysis/` |

### Authentication
```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## 🔧 Epic 1: Core Engineering Calculators

### 1. Laser Cutting Cost Calculator
```http
POST /v2/core/engineering/laser-cutting-cost
```

**Request:**
```json
{
  "materialType": "steel",
  "thickness": 3.0,
  "length": 100.0,
  "width": 100.0,
  "quantity": 10,
  "laborRate": 50.0,
  "energyRate": 0.12
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "totalCost": 125.50,
    "costPerPart": 12.55,
    "breakdown": {
      "materialCost": 75.00,
      "laborCost": 30.00,
      "energyCost": 8.50,
      "overheadCost": 12.00
    }
  }
}
```

### 2. Cutting Time Estimator
```http
POST /v2/core/engineering/cutting-time-estimator
```

### 3. Laser Parameter Optimizer
```http
POST /v2/core/engineering/laser-parameter-optimizer
```

### 4. Material Selection Assistant
```http
POST /v2/core/engineering/material-selection-assistant
```

### 5. Gas Consumption Calculator
```http
POST /v2/core/engineering/gas-consumption-calculator
```

---

## 🎯 Epic 2: Quality Control Calculators

### 1. Edge Quality Predictor
```http
POST /v2/core/quality/edge-quality-predictor
```

**Request:**
```json
{
  "materialType": "aluminum",
  "thickness": 4.0,
  "power": 2500,
  "speed": 2000,
  "gasType": "nitrogen",
  "gasPressure": 12.0
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "qualityScore": 8.7,
    "surfaceRoughness": {
      "ra": 3.2,
      "rz": 15.8
    },
    "perpendicularity": 0.05,
    "drossRisk": "low"
  }
}
```

### 2. Warping Risk Calculator
```http
POST /v2/core/quality/warping-risk-calculator
```

### 3. Burn Mark Preventer
```http
POST /v2/core/quality/burn-mark-preventer
```

### 4. Dross Formation Calculator
```http
POST /v2/core/quality/dross-formation-calculator
```

### 5. Tolerance Stack Calculator
```http
POST /v2/core/quality/tolerance-stack-calculator
```

---

## ⚙️ Epic 3: Process Optimization Calculators

### 1. Focus Height Calculator
```http
POST /v2/core/optimization/focus-height-calculator
```

### 2. Gas Pressure Setting Guide
```http
POST /v2/core/optimization/gas-pressure-setting-guide
```

### 3. Frequency Setting Assistant
```http
POST /v2/core/optimization/frequency-setting-assistant
```

### 4. Multiple Pass Calculator
```http
POST /v2/core/optimization/multiple-pass-calculator
```

### 5. Power-Speed Matching
```http
POST /v2/core/optimization/power-speed-matching
```

---

## 🧠 Epic 4: Advanced Analysis Calculators

### 1. Sensitivity Analysis Calculator
```http
POST /v2/core/analysis/sensitivity-analysis-calculator
```

### 2. Process Optimization Engine
```http
POST /v2/core/analysis/process-optimization-engine
```

**Request:**
```json
{
  "currentProcess": {
    "materialType": "steel",
    "thickness": 6.0,
    "power": 3000,
    "speed": 1500
  },
  "optimizationGoals": {
    "speed": 0.4,
    "quality": 0.4,
    "cost": 0.2
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "optimizedProcess": {
      "power": 3200,
      "speed": 1800,
      "gasType": "oxygen"
    },
    "improvements": {
      "speedIncrease": 20.0,
      "qualityScore": 8.9,
      "costReduction": 12.5
    }
  }
}
```

### 3. Predictive Quality Model
```http
POST /v2/core/analysis/predictive-quality-model
```

### 4. Cost-Benefit Analyzer
```http
POST /v2/core/analysis/cost-benefit-analyzer
```

### 5. Performance Benchmarking Tool
```http
POST /v2/core/analysis/performance-benchmarking-tool
```

---

## 📊 Batch Operations

### Batch Calculator Execution
```http
POST /v2/core/batch
```

**Request:**
```json
{
  "calculations": [
    {
      "id": "cost-calc-1",
      "calculator": "laser-cutting-cost",
      "epic": "engineering",
      "inputs": {
        "materialType": "steel",
        "thickness": 3.0,
        "quantity": 10
      }
    },
    {
      "id": "time-calc-1",
      "calculator": "cutting-time-estimator", 
      "epic": "engineering",
      "inputs": {
        "materialType": "steel",
        "thickness": 3.0,
        "perimeter": 400.0
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "batchId": "batch_abc123",
  "results": [
    {
      "id": "cost-calc-1",
      "success": true,
      "results": { /* cost calculation results */ }
    },
    {
      "id": "time-calc-1", 
      "success": true,
      "results": { /* time calculation results */ }
    }
  ]
}
```

---

## 🔍 Metadata and Discovery

### List All Core Calculators
```http
GET /v2/core/calculators
```

**Response:**
```json
{
  "success": true,
  "calculators": [
    {
      "id": "laser-cutting-cost",
      "name": "Laser Cutting Cost Calculator",
      "epic": "Core Engineering",
      "difficulty": "Intermediate",
      "badge": "Standard",
      "estimatedTime": "< 1s",
      "endpoint": "/v2/core/engineering/laser-cutting-cost"
    }
  ],
  "metadata": {
    "totalCalculators": 20,
    "epics": 4,
    "version": "2.0.0"
  }
}
```

### Get Calculator Schema
```http
GET /v2/core/calculators/{calculator-id}/schema
```

**Response:**
```json
{
  "success": true,
  "schema": {
    "inputs": {
      "materialType": {
        "type": "string",
        "required": true,
        "enum": ["steel", "aluminum", "stainless_steel"]
      },
      "thickness": {
        "type": "number",
        "required": true,
        "min": 0.1,
        "max": 50.0,
        "unit": "mm"
      }
    },
    "outputs": {
      "totalCost": {
        "type": "number",
        "unit": "USD"
      }
    }
  }
}
```

---

## ⚡ SDK Examples

### JavaScript/TypeScript
```typescript
import { CoreCalculatorClient } from '@laser-calc/core-sdk';

const client = new CoreCalculatorClient({
  apiKey: 'sk_live_abc123...',
  baseUrl: 'https://api.dfoffer.com/v2/core'
});

// Engineering calculators
const costResult = await client.engineering.laserCuttingCost({
  materialType: 'steel',
  thickness: 3.0,
  quantity: 10
});

// Quality calculators
const qualityResult = await client.quality.edgeQualityPredictor({
  materialType: 'aluminum',
  thickness: 4.0,
  power: 2500
});

// Optimization calculators
const focusResult = await client.optimization.focusHeightCalculator({
  materialType: 'steel',
  thickness: 8.0
});

// Analysis calculators
const optimizationResult = await client.analysis.processOptimizationEngine({
  currentProcess: { /* ... */ },
  optimizationGoals: { /* ... */ }
});
```

### Python
```python
from laser_calc_core import CoreCalculatorClient

client = CoreCalculatorClient(api_key='sk_live_abc123...')

# Engineering calculations
cost_result = client.engineering.laser_cutting_cost(
    material_type='steel',
    thickness=3.0,
    quantity=10
)

# Quality predictions
quality_result = client.quality.edge_quality_predictor(
    material_type='aluminum',
    thickness=4.0,
    power=2500
)
```

---

## 🚦 Rate Limits and Quotas

### Rate Limits by Epic
- **Core Engineering**: 1000 requests/hour
- **Quality Control**: 500 requests/hour (AI Enhanced)
- **Process Optimization**: 750 requests/hour
- **Advanced Analysis**: 250 requests/hour (Premium)

### Quota Management
```http
GET /v2/core/quota
```

**Response:**
```json
{
  "success": true,
  "quota": {
    "engineering": {
      "limit": 1000,
      "used": 245,
      "remaining": 755,
      "resetTime": "2025-01-27T11:00:00Z"
    },
    "quality": {
      "limit": 500,
      "used": 89,
      "remaining": 411,
      "resetTime": "2025-01-27T11:00:00Z"
    }
  }
}
```

---

## 🔧 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Material thickness must be between 0.1 and 50.0 mm",
    "epic": "engineering",
    "calculator": "laser-cutting-cost",
    "field": "thickness",
    "value": 75.0
  }
}
```

### Epic-Specific Error Codes
- **Engineering**: `ENG_001` - `ENG_099`
- **Quality**: `QUA_001` - `QUA_099`
- **Optimization**: `OPT_001` - `OPT_099`
- **Analysis**: `ANA_001` - `ANA_099`

---

## 📈 Monitoring and Analytics

### Usage Analytics
```http
GET /v2/core/analytics/usage
```

### Performance Metrics
```http
GET /v2/core/analytics/performance
```

### Popular Calculators
```http
GET /v2/core/analytics/popular
```

---

## 🔗 Webhooks

### Calculator Completion Webhook
```json
{
  "event": "calculation.completed",
  "calculatorId": "laser-cutting-cost",
  "epic": "engineering",
  "batchId": "batch_abc123",
  "results": { /* calculation results */ },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

### Error Notification Webhook
```json
{
  "event": "calculation.failed",
  "calculatorId": "edge-quality-predictor",
  "epic": "quality",
  "error": {
    "code": "QUA_001",
    "message": "Invalid material type for quality prediction"
  },
  "timestamp": "2025-01-27T10:30:00Z"
}
```

---

**Core Calculators API Version**: 2.0.0  
**Last Updated**: January 2025  
**Support**: core-api@laser-calc.com

For complete examples and advanced integration patterns, visit [developer.laser-calc.com/core](https://developer.laser-calc.com/core)
