# JobQueueOptimizer Integration Guide

## Integration Status
- [x] Integration wrapper created
- [ ] Original component updated to accept external inputs
- [ ] Parameter mapping configured
- [ ] Tests added
- [ ] Routes updated

## Default Parameters
```typescript
{
    jobCount: 10,
    machineCount: 2,
    priorityWeights: { urgency: 0.4, profit: 0.3, efficiency: 0.3 },
    workingHours: 8,
  }
```

## Next Steps
1. Update original JobQueueOptimizer component to accept `inputs` and `onInputChange` props
2. Configure parameter mapping in calculatorPresetMapping.ts
3. Add type definition to preset.ts
4. Test preset functionality
5. Update routing configuration
