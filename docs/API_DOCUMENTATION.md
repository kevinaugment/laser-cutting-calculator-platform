# Laser Cutting Calculator Platform - API Documentation

## Overview

The Laser Cutting Calculator Platform provides a comprehensive REST API for accessing calculation engines, cost analytics, and performance optimization features.

## Base URL

```
Production: https://api.lasercalc.com/v1
Development: http://localhost:3001/v1
```

## Authentication

All API requests require authentication using API keys:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1,000 requests/hour  
- **Enterprise**: 10,000 requests/hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Core Endpoints

### Calculator Operations

#### Execute Calculator
```http
POST /calculators/{calculatorId}/calculate
```

**Parameters:**
- `calculatorId` (string): Calculator identifier (e.g., "operating-cost-analyzer")

**Request Body:**
```json
{
  "inputs": {
    "operatingHoursPerDay": 8,
    "workingDaysPerMonth": 22,
    "laserPowerRating": 3000,
    "electricityRate": 0.12,
    "operatorWage": 25,
    "assistGasConsumption": 50,
    "gasType": "nitrogen",
    "maintenanceBudget": 500,
    "facilityOverhead": 2000
  },
  "options": {
    "enableCaching": true,
    "includeAnalytics": true,
    "precision": 2
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calculatorId": "operating-cost-analyzer",
    "results": {
      "costBreakdown": {
        "energy": 288.00,
        "labor": 4400.00,
        "materials": 1100.00,
        "overhead": 2000.00,
        "maintenance": 500.00,
        "total": 8288.00
      },
      "hourlyRates": {
        "totalHourlyRate": 47.32,
        "energyHourlyRate": 1.64,
        "laborHourlyRate": 25.00
      },
      "optimizationOpportunities": [
        {
          "category": "Energy Efficiency",
          "description": "Optimize cutting parameters",
          "potentialSaving": 43.20,
          "difficulty": "medium"
        }
      ],
      "benchmarking": {
        "performance": "good",
        "industryAverage": 52.00,
        "topQuartile": 42.00
      }
    },
    "metadata": {
      "calculationTime": 45,
      "cacheHit": false,
      "version": "1.0.0"
    }
  },
  "timestamp": "2024-12-19T10:30:00Z"
}
```

#### Get Calculator Configuration
```http
GET /calculators/{calculatorId}/config
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "operating-cost-analyzer",
    "name": "Operating Cost Analyzer",
    "description": "Comprehensive analysis of laser cutting operating costs",
    "category": "cost-control",
    "inputs": [
      {
        "id": "operatingHoursPerDay",
        "label": "Operating Hours per Day",
        "type": "number",
        "required": true,
        "min": 1,
        "max": 24,
        "default": 8
      }
    ],
    "outputs": [
      {
        "id": "costBreakdown",
        "label": "Cost Breakdown",
        "type": "object",
        "format": "cost-analysis"
      }
    ]
  }
}
```

#### List Available Calculators
```http
GET /calculators
```

**Query Parameters:**
- `category` (string): Filter by category
- `search` (string): Search by name or description
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "calculators": [
      {
        "id": "operating-cost-analyzer",
        "name": "Operating Cost Analyzer",
        "category": "cost-control",
        "description": "Analyze operating costs",
        "tags": ["cost", "analysis", "optimization"]
      }
    ],
    "pagination": {
      "total": 90,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### Cost Analytics

#### Get Cost Trends
```http
GET /analytics/cost-trends
```

**Query Parameters:**
- `period` (string): Time period (week|month|quarter|year)
- `granularity` (string): Data granularity (hour|day|week|month)
- `categories` (array): Cost categories to include

**Response:**
```json
{
  "success": true,
  "data": {
    "overallTrend": {
      "direction": "increasing",
      "magnitude": 0.05,
      "confidence": 85.2,
      "r2": 0.78
    },
    "categoryTrends": [
      {
        "category": "Energy",
        "trend": {
          "direction": "stable",
          "magnitude": 0.01,
          "confidence": 92.1
        },
        "contribution": 15.2,
        "volatility": 8.5
      }
    ],
    "insights": [
      {
        "type": "opportunity",
        "description": "Energy costs show optimization potential",
        "impact": "medium",
        "confidence": 78.5
      }
    ]
  }
}
```

#### Generate Variance Report
```http
POST /analytics/variance-report
```

**Request Body:**
```json
{
  "budget": {
    "totalBudget": 10000,
    "categoryBudgets": [
      {
        "category": "energy",
        "amount": 1500,
        "flexibility": "variable"
      }
    ]
  },
  "actual": {
    "totalActual": 10500,
    "categoryActuals": [
      {
        "category": "energy",
        "amount": 1650
      }
    ]
  },
  "period": {
    "start": "2024-12-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalVariance": 500,
      "totalVariancePercent": 5.0,
      "favorableVariance": 0,
      "unfavorableVariance": 500,
      "significantVariances": 2
    },
    "categoryVariances": [
      {
        "category": "energy",
        "budgeted": 1500,
        "actual": 1650,
        "variance": 150,
        "variancePercent": 10.0,
        "status": "unfavorable",
        "significance": "medium"
      }
    ],
    "recommendations": [
      {
        "category": "energy",
        "action": "Implement energy monitoring system",
        "priority": "high",
        "expectedImpact": "15-20% cost reduction"
      }
    ]
  }
}
```

### Performance Optimization

#### Get Performance Metrics
```http
GET /performance/metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calculationTimes": [
      {
        "calculatorId": "operating-cost-analyzer",
        "averageTime": 45.2,
        "p95Time": 89.5,
        "p99Time": 156.8,
        "throughput": 1250,
        "errorRate": 0.02
      }
    ],
    "memoryUsage": [
      {
        "timestamp": "2024-12-19T10:30:00Z",
        "heapUsed": 45678912,
        "heapTotal": 67108864
      }
    ],
    "cacheStats": {
      "hitRate": 85.2,
      "size": 1024,
      "memoryUsage": 2048576
    }
  }
}
```

#### Optimize Performance
```http
POST /performance/optimize
```

**Request Body:**
```json
{
  "optimizations": ["caching", "memoization", "lazy-loading"],
  "strategy": {
    "type": "hybrid",
    "ttl": 300000,
    "maxSize": 1000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimizationResult": {
      "calculationSpeedup": 2.3,
      "memoryReduction": 35,
      "cacheHitRate": 85,
      "optimizations": [
        {
          "type": "calculation",
          "description": "Implemented memoization",
          "impact": 65,
          "implemented": true
        }
      ]
    }
  }
}
```

### Scheduling & Time Management

#### Optimize Job Schedule
```http
POST /scheduling/optimize
```

**Request Body:**
```json
{
  "jobs": [
    {
      "id": "job_001",
      "materialType": "steel",
      "thickness": 3,
      "estimatedDuration": 45,
      "priority": "high",
      "dueDate": "2024-12-20T14:00:00Z"
    }
  ],
  "constraints": {
    "workingHours": {
      "start": "08:00",
      "end": "17:00"
    },
    "setupTimeMatrix": {
      "steel_aluminum": 15,
      "aluminum_steel": 12
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimizedSchedule": {
      "jobs": [
        {
          "id": "job_001",
          "scheduledStart": "2024-12-20T08:00:00Z",
          "scheduledEnd": "2024-12-20T08:45:00Z",
          "setupTime": 15,
          "position": 1
        }
      ],
      "totalSetupTime": 45,
      "totalProductionTime": 180,
      "efficiency": 87.5,
      "setupReductions": 25
    },
    "recommendations": [
      {
        "type": "grouping",
        "description": "Group similar materials together",
        "impact": "15 minutes saved daily"
      }
    ]
  }
}
```

### Pricing Intelligence

#### Calculate Competitive Pricing
```http
POST /pricing/competitive
```

**Request Body:**
```json
{
  "marketData": {
    "competitorPrices": [
      {
        "competitor": "Competitor A",
        "price": 125.00,
        "marketShare": 25,
        "serviceLevel": "premium"
      }
    ],
    "targetMargin": 30,
    "orderVolume": 100,
    "customerType": "enterprise"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pricingRecommendation": {
      "recommendedPrice": 118.50,
      "priceRange": {
        "minimum": 110.00,
        "optimal": 118.50,
        "maximum": 125.00
      },
      "confidence": 87.5,
      "marketPosition": "competitive"
    },
    "strategies": [
      {
        "strategy": "Value-Based Pricing",
        "basePrice": 115.00,
        "adjustments": [
          {
            "factor": "Quality Premium",
            "adjustment": 3.50
          }
        ]
      }
    ]
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "operatingHoursPerDay",
        "message": "Must be between 1 and 24",
        "code": "OUT_OF_RANGE"
      }
    ]
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | Invalid or missing API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit exceeded |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `CALCULATOR_NOT_FOUND` | 404 | Calculator not found |
| `CALCULATION_ERROR` | 500 | Error during calculation |
| `INSUFFICIENT_DATA` | 422 | Insufficient data for analysis |

## Webhooks

### Configuration
```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/laser-calc",
  "events": ["calculation.completed", "analysis.generated"],
  "secret": "your_webhook_secret"
}
```

### Event Types

#### calculation.completed
```json
{
  "event": "calculation.completed",
  "data": {
    "calculatorId": "operating-cost-analyzer",
    "calculationId": "calc_123456",
    "results": { /* calculation results */ },
    "userId": "user_789",
    "timestamp": "2024-12-19T10:30:00Z"
  }
}
```

#### analysis.generated
```json
{
  "event": "analysis.generated",
  "data": {
    "analysisType": "cost-trends",
    "analysisId": "analysis_456789",
    "insights": [ /* analysis insights */ ],
    "userId": "user_789",
    "timestamp": "2024-12-19T10:30:00Z"
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { LaserCalcAPI } from '@laser-calc/sdk';

const api = new LaserCalcAPI({
  apiKey: 'your_api_key',
  baseURL: 'https://api.lasercalc.com/v1'
});

// Execute calculator
const result = await api.calculators.execute('operating-cost-analyzer', {
  operatingHoursPerDay: 8,
  workingDaysPerMonth: 22,
  laserPowerRating: 3000,
  electricityRate: 0.12
});

// Get cost trends
const trends = await api.analytics.getCostTrends({
  period: 'month',
  granularity: 'day'
});

// Optimize schedule
const schedule = await api.scheduling.optimize({
  jobs: jobsArray,
  constraints: constraintsObject
});
```

### Python
```python
from laser_calc_sdk import LaserCalcAPI

api = LaserCalcAPI(
    api_key='your_api_key',
    base_url='https://api.lasercalc.com/v1'
)

# Execute calculator
result = api.calculators.execute('operating-cost-analyzer', {
    'operatingHoursPerDay': 8,
    'workingDaysPerMonth': 22,
    'laserPowerRating': 3000,
    'electricityRate': 0.12
})

# Get performance metrics
metrics = api.performance.get_metrics()

# Generate variance report
report = api.analytics.generate_variance_report(
    budget=budget_data,
    actual=actual_data
)
```

## Testing

### Test Environment
```
Base URL: https://api-test.lasercalc.com/v1
API Key: test_key_123456789
```

### Sample Test Data
```json
{
  "testCalculatorInputs": {
    "operating-cost-analyzer": {
      "operatingHoursPerDay": 8,
      "workingDaysPerMonth": 22,
      "laserPowerRating": 3000,
      "electricityRate": 0.12,
      "operatorWage": 25
    }
  }
}
```

## Changelog

### v1.0.0 (2024-12-19)
- Initial API release
- 90 calculator endpoints
- Cost analytics suite
- Performance optimization
- Scheduling algorithms
- Pricing intelligence

### v1.1.0 (Planned)
- Real-time notifications
- Advanced ML predictions
- Custom calculator builder
- Enhanced reporting

## Support

- **Documentation**: https://docs.lasercalc.com
- **Status Page**: https://status.lasercalc.com
- **Support Email**: api-support@lasercalc.com
- **Community Forum**: https://community.lasercalc.com

---

**API Version**: 1.0.0  
**Last Updated**: December 19, 2024
