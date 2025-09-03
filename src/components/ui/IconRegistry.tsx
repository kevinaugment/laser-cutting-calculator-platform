import React from 'react';
import {
  Calculator,
  Clock,
  Settings,
  Target,
  DollarSign,
  Zap,
  Wrench,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Shield,
  Globe,
  FileText,
  Users,
  Lock,
  Database,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  PieChart,
  Lightbulb,
  BookOpen,
  Info,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Download,
  Share,
  Copy,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Menu,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Upload,
  RefreshCw,
  HelpCircle,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Link,
  ExternalLink,
  Home,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// 图标尺寸标准化 - 增强版本，提供使用指导
export const ICON_SIZES = {
  xs: 'h-3 w-3',      // 12px - 小型图标，用于内联文本
  sm: 'h-4 w-4',      // 16px - 按钮图标，导航图标
  md: 'h-5 w-5',      // 20px - 默认尺寸，表单图标
  lg: 'h-6 w-6',      // 24px - 卡片标题图标
  xl: 'h-8 w-8',      // 32px - 页面标题图标
  '2xl': 'h-10 w-10', // 40px - 大型装饰图标
  '3xl': 'h-12 w-12'  // 48px - 特大图标，用于空状态
} as const;

// 图标颜色标准化 - 增强版本，支持暗色模式
export const ICON_COLORS = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-500 dark:text-blue-300',
  muted: 'text-gray-400 dark:text-gray-500',
  white: 'text-white',
  black: 'text-black dark:text-white',
  current: 'text-current',
  // 计算器专用颜色
  calculator: 'text-blue-700 dark:text-blue-300',
  tool: 'text-purple-600 dark:text-purple-400',
  metric: 'text-indigo-600 dark:text-indigo-400'
} as const;

// 计算器专用图标映射
export const CALCULATOR_ICONS = {
  'laser-cutting-cost': Calculator,
  'cutting-time-estimator': Clock,
  'laser-parameter-optimizer': Settings,
  'material-selection-assistant': Layers,
  'energy-cost': Zap,
  'profit-margin-optimizer': TrendingUp,
  'project-quoting': DollarSign,
  'maintenance-cost': Wrench,
  'gas-consumption': Activity,
  'batch-processing': BarChart3,
  'job-queue-optimizer': Clock,
  'production-capacity': Activity,
  'cut-path-optimizer': Target,
  'focus-height': Target,
  'kerf-width': Settings,
  'heat-affected-zone': Zap,
  'warping-risk': AlertTriangle,
  'quality-grade-predictor': CheckCircle,
  'edge-quality-predictor': Target,
  'material-nesting-optimizer': Layers,
  'equipment-comparison': BarChart3
} as const;

// 通用图标注册表
export const ICON_REGISTRY = {
  // 计算和数据
  calculator: Calculator,
  chart: BarChart3,
  trending: TrendingUp,
  activity: Activity,
  pie: PieChart,
  database: Database,
  
  // 时间和进度
  clock: Clock,
  calendar: Calendar,
  loader: Loader2,
  refresh: RefreshCw,
  
  // 设置和工具
  settings: Settings,
  wrench: Wrench,
  target: Target,
  layers: Layers,
  
  // 状态和反馈
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  help: HelpCircle,
  
  // 财务和商业
  dollar: DollarSign,
  zap: Zap,
  star: Star,
  
  // 导航和交互
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  home: Home,
  
  // 操作
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  download: Download,
  upload: Upload,
  share: Share,
  copy: Copy,
  save: Save,
  
  // 界面控制
  menu: Menu,
  x: X,
  search: Search,
  filter: Filter,
  sort: SortAsc,
  maximize: Maximize,
  minimize: Minimize,
  eye: Eye,
  eyeOff: EyeOff,
  
  // 内容和媒体
  book: BookOpen,
  file: FileText,
  link: Link,
  externalLink: ExternalLink,
  
  // 用户和社交
  users: Users,
  heart: Heart,
  bookmark: Bookmark,
  flag: Flag,
  tag: Tag,
  
  // 安全和系统
  shield: Shield,
  lock: Lock,
  globe: Globe,
  
  // 联系和位置
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  
  // 其他
  lightbulb: Lightbulb,
  reset: RotateCcw
} as const;

// 图标组件接口
export interface IconProps {
  name: keyof typeof ICON_REGISTRY | keyof typeof CALCULATOR_ICONS;
  size?: keyof typeof ICON_SIZES;
  color?: keyof typeof ICON_COLORS;
  className?: string;
  onClick?: () => void;
}

// 统一图标组件
export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'current',
  className = '',
  onClick
}) => {
  // 优先从计算器图标中查找
  const IconComponent = CALCULATOR_ICONS[name as keyof typeof CALCULATOR_ICONS] || 
                       ICON_REGISTRY[name as keyof typeof ICON_REGISTRY];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return <Calculator className={`${ICON_SIZES[size]} ${ICON_COLORS[color]} ${className}`} />;
  }
  
  const iconClasses = `${ICON_SIZES[size]} ${ICON_COLORS[color]} ${className} ${onClick ? 'cursor-pointer' : ''}`;
  
  return <IconComponent className={iconClasses} onClick={onClick} />;
};

// 计算器图标组件 - 专门用于计算器
export interface CalculatorIconProps {
  calculatorId: keyof typeof CALCULATOR_ICONS;
  size?: keyof typeof ICON_SIZES;
  color?: keyof typeof ICON_COLORS;
  className?: string;
}

export const CalculatorIcon: React.FC<CalculatorIconProps> = ({
  calculatorId,
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const IconComponent = CALCULATOR_ICONS[calculatorId];
  
  if (!IconComponent) {
    console.warn(`Calculator icon for "${calculatorId}" not found`);
    return <Calculator className={`${ICON_SIZES[size]} ${ICON_COLORS[color]} ${className}`} />;
  }
  
  return <IconComponent className={`${ICON_SIZES[size]} ${ICON_COLORS[color]} ${className}`} />;
};

// 状态图标组件 - 用于显示状态
export interface StatusIconProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'loading';
  size?: keyof typeof ICON_SIZES;
  className?: string;
  showText?: boolean;
  text?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'md',
  className = '',
  showText = false,
  text
}) => {
  const statusConfig = {
    success: { icon: CheckCircle, color: 'success' as const, defaultText: 'Success' },
    warning: { icon: AlertTriangle, color: 'warning' as const, defaultText: 'Warning' },
    error: { icon: AlertCircle, color: 'danger' as const, defaultText: 'Error' },
    info: { icon: Info, color: 'info' as const, defaultText: 'Info' },
    loading: { icon: Loader2, color: 'primary' as const, defaultText: 'Loading...' }
  };
  
  const config = statusConfig[status];
  const IconComponent = config.icon;
  const displayText = text || config.defaultText;
  
  const iconClasses = `${ICON_SIZES[size]} ${ICON_COLORS[config.color]} ${className} ${
    status === 'loading' ? 'animate-spin' : ''
  }`;
  
  if (showText) {
    return (
      <div className="flex items-center space-x-2">
        <IconComponent className={iconClasses} />
        <span className={`text-sm ${ICON_COLORS[config.color]}`}>{displayText}</span>
      </div>
    );
  }
  
  return <IconComponent className={iconClasses} />;
};

// 导出默认图标组件
export default Icon;
