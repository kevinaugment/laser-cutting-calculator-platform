# MaterialNestingOptimizer Integration Guide

## Integration Status
- [x] Integration wrapper created
- [ ] Original component updated to accept external inputs
- [ ] Parameter mapping configured
- [ ] Tests added
- [ ] Routes updated

## Default Parameters
```typescript
{
    parts: [],
    sheetSize: { width: 1500, height: 3000 },
    materialCost: 2.5,
    wasteFactor: 0.1,
  }
```

## Next Steps
1. Update original MaterialNestingOptimizer component to accept `inputs` and `onInputChange` props
2. Configure parameter mapping in calculatorPresetMapping.ts
3. Add type definition to preset.ts
4. Test preset functionality
5. Update routing configuration
