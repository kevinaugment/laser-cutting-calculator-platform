# QualityGradeCalculator Integration Guide

## Steps to Complete Integration

1. **Update Original Component**
// Enhanced QualityGradeCalculator to support external input management
// Add these props to your existing calculator component:

interface EnhancedQualityGradeCalculatorProps {
  inputs?: any; // External input state
  onInputChange?: (field: string, value: any) => void; // External input handler
  // ... existing props
}

// In your component, use external inputs when provided:
const QualityGradeCalculator: React.FC<EnhancedQualityGradeCalculatorProps> = ({
  inputs: externalInputs,
  onInputChange: externalOnInputChange,
  // ... other props
}) => {
  // Use external inputs if provided, otherwise use internal state
  const [internalInputs, setInternalInputs] = useState(defaultInputs);
  const inputs = externalInputs || internalInputs;
  
  const handleInputChange = (field: string, value: any) => {
    if (externalOnInputChange) {
      externalOnInputChange(field, value);
    } else {
      setInternalInputs(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Rest of your component logic...
};

2. **Test Integration**
   - Verify preset loading works
   - Test parameter synchronization
   - Check backward compatibility

3. **Update Routes**
   - Replace original component with WithPresets version
   - Update any direct imports

## Generated Files
- `QualityGradeCalculatorWithPresets.tsx` - Preset-enabled wrapper
- `INTEGRATION_GUIDE.md` - This guide

## Next Steps
- [ ] Update original component to accept external inputs
- [ ] Test preset functionality
- [ ] Update routing configuration
- [ ] Add integration tests
