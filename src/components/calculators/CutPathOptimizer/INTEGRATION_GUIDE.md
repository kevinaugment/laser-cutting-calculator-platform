# CutPathOptimizer Integration Guide

## Integration Status
- [x] Integration wrapper created
- [ ] Original component updated to accept external inputs
- [ ] Parameter mapping configured
- [ ] Tests added
- [ ] Routes updated

## Default Parameters
```typescript
{
    partCount: 10,
    sheetSize: { width: 1500, height: 3000 },
    materialThickness: 3,
    optimizationGoal: 'time',
  }
```

## Next Steps
1. Update original CutPathOptimizer component to accept `inputs` and `onInputChange` props
2. Configure parameter mapping in calculatorPresetMapping.ts
3. Add type definition to preset.ts
4. Test preset functionality
5. Update routing configuration
