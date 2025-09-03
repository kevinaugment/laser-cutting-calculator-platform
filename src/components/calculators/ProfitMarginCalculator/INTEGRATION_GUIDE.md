# ProfitMarginCalculator Integration Guide

## Integration Status
- [x] Integration wrapper created
- [ ] Original component updated to accept external inputs
- [ ] Parameter mapping configured
- [ ] Tests added
- [ ] Routes updated

## Default Parameters
```typescript
{
    totalCost: 100,
    targetMargin: 0.3,
    marketPrice: 150,
    competitionLevel: 'medium',
  }
```

## Next Steps
1. Update original ProfitMarginCalculator component to accept `inputs` and `onInputChange` props
2. Configure parameter mapping in calculatorPresetMapping.ts
3. Add type definition to preset.ts
4. Test preset functionality
5. Update routing configuration
