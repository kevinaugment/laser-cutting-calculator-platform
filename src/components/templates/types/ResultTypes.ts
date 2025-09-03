// Results Display Types
export interface ResultsDisplayConfig {
  showCharts?: boolean;
  showBreakdown?: boolean;
  showSensitivity?: boolean;
  showMetrics?: boolean;
  showRecommendations?: boolean;
  chartTypes?: ChartType[];
  customSections?: ResultSection[];
}

export interface ResultSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  order: number;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export type ChartType = 'pie' | 'bar' | 'line' | 'area' | 'scatter' | 'radar';

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
  category?: string;
}

export interface LineChartData {
  x: number | string;
  y: number;
  series?: string;
}

// Cost Breakdown Types
export interface CostBreakdown {
  [category: string]: CostItem;
}

export interface CostItem {
  amount: number;
  percentage: number;
  unit: string;
  description?: string;
  subcategories?: CostBreakdown;
}

export interface CostSummary {
  totalCost: number;
  costPerUnit: number;
  currency: string;
  breakdown: CostBreakdown;
  savings?: number;
  efficiency?: number;
}

// Sensitivity Analysis Types
export interface SensitivityAnalysis {
  parameters: SensitivityParameter[];
  baselineValue: number;
  unit: string;
  analysis: SensitivityResult[];
}

export interface SensitivityParameter {
  id: string;
  name: string;
  baseValue: number;
  variations: number[];
  unit: string;
}

export interface SensitivityResult {
  parameter: string;
  variation: string;
  change: number;
  impact: number;
  newValue: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// Efficiency Metrics Types
export interface EfficiencyMetrics {
  overall: number;
  categories: EfficiencyCategory[];
  benchmarks?: BenchmarkData[];
  trends?: TrendData[];
}

export interface EfficiencyCategory {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  description?: string;
}

export interface BenchmarkData {
  name: string;
  value: number;
  industry: string;
  source: string;
}

export interface TrendData {
  period: string;
  value: number;
  change: number;
}

// Recommendations Types
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  priority: number;
  savings?: number;
  timeframe?: string;
  steps?: string[];
}

export interface RecommendationGroup {
  category: string;
  title: string;
  description?: string;
  recommendations: Recommendation[];
}

// Results Summary Types
export interface ResultsSummary {
  title: string;
  subtitle?: string;
  primaryMetric: {
    label: string;
    value: number;
    unit: string;
    change?: number;
  };
  secondaryMetrics: {
    label: string;
    value: number;
    unit: string;
    status?: 'positive' | 'negative' | 'neutral';
  }[];
  status: 'optimal' | 'good' | 'warning' | 'critical';
  message?: string;
}

// Comparison Types
export interface ComparisonData {
  scenarios: ComparisonScenario[];
  metrics: string[];
  recommendations?: string[];
}

export interface ComparisonScenario {
  id: string;
  name: string;
  description?: string;
  values: { [metric: string]: number };
  isBaseline?: boolean;
  isRecommended?: boolean;
}

// Export Data Types
export interface ExportData {
  metadata: ExportMetadata;
  input: any;
  results: any;
  charts?: ChartExportData[];
  recommendations?: Recommendation[];
}

export interface ExportMetadata {
  calculatorName: string;
  calculatorVersion: string;
  generatedAt: string;
  generatedBy?: string;
  format: string;
  title: string;
}

export interface ChartExportData {
  type: ChartType;
  title: string;
  data: any;
  config?: any;
}

// Display Configuration Types
export interface DisplayConfig {
  currency: string;
  locale: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
  percentageFormat: 'decimal' | 'percentage';
  dateFormat: string;
  timeFormat: string;
}

export interface FormattingOptions {
  currency?: boolean;
  percentage?: boolean;
  decimal?: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
}

// Animation and Interaction Types
export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  delay?: number;
}

export interface InteractionConfig {
  enableHover: boolean;
  enableClick: boolean;
  enableZoom: boolean;
  enablePan: boolean;
  showTooltips: boolean;
  showLegend: boolean;
}

// Results Template Props
export interface ResultsTemplateProps {
  data: any;
  config: ResultsDisplayConfig;
  displayConfig: DisplayConfig;
  animationConfig?: AnimationConfig;
  interactionConfig?: InteractionConfig;
  onExport?: (format: string, data: ExportData) => void;
  onShare?: (data: any) => void;
  className?: string;
}
