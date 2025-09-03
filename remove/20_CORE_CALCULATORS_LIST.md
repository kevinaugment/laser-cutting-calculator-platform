# 20个核心计算器正确列表

根据 `docs/CORE_CALCULATORS_API.md` 文档，确认的20个核心计算器：

## Epic 1: Core Engineering (5个)
1. `laser-cutting-cost` - Laser Cutting Cost Calculator
2. `cutting-time-estimator` - Cutting Time Estimator  
3. `laser-parameter-optimizer` - Laser Parameter Optimizer
4. `material-selection-assistant` - Material Selection Assistant
5. `gas-consumption-calculator` - Gas Consumption Calculator

## Epic 2: Quality Control (5个)
6. `edge-quality-predictor` - Edge Quality Predictor
7. `warping-risk-calculator` - Warping Risk Calculator
8. `burn-mark-preventer` - Burn Mark Preventer
9. `dross-formation-calculator` - Dross Formation Calculator
10. `tolerance-stack-calculator` - Tolerance Stack Calculator

## Epic 3: Process Optimization (5个)
11. `focus-height-calculator` - Focus Height Calculator
12. `gas-pressure-setting-guide` - Gas Pressure Setting Guide
13. `frequency-setting-assistant` - Frequency Setting Assistant
14. `multiple-pass-calculator` - Multiple Pass Calculator
15. `power-speed-matching` - Power-Speed Matching

## Epic 4: Advanced Analysis (5个)
16. `sensitivity-analysis-calculator` - Sensitivity Analysis Calculator
17. `process-optimization-engine` - Process Optimization Engine
18. `predictive-quality-model` - Predictive Quality Model
19. `cost-benefit-analyzer` - Cost-Benefit Analyzer ✅ (用户询问的这个)
20. `performance-benchmarking-tool` - Performance Benchmarking Tool

## 问题分析
- `cost-benefit-analyzer` 确实在20个核心计算器中，属于Epic 4
- 当前系统有路由配置冲突，导致Component Error
- 需要清理旧的计算器注册系统，统一使用LazyCalculatorRoutes
