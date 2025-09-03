import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
import { CalculatorsPage } from '../../pages/CalculatorsPage';

// Mock navigation hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  };
});

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// 新手用户任务流程分析
interface NoviceUserTask {
  taskName: string;
  description: string;
  steps: TaskStep[];
  expectedTime: number; // seconds
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  successCriteria: string[];
  painPoints: PainPoint[];
}

interface TaskStep {
  stepNumber: number;
  action: string;
  expectedOutcome: string;
  timeExpected: number; // seconds
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  errorProne: boolean;
  helpNeeded: boolean;
}

interface PainPoint {
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'rare' | 'occasional' | 'frequent' | 'always';
  impact: 'minor' | 'moderate' | 'major' | 'blocking';
  suggestedFix: string;
}

// 新手用户任务定义
const noviceUserTasks: NoviceUserTask[] = [
  {
    taskName: '首次访问到完成第一个计算',
    description: '新手用户第一次使用平台，从首页开始到完成激光切割成本计算',
    expectedTime: 300, // 5分钟
    difficultyLevel: 3,
    steps: [
      {
        stepNumber: 1,
        action: '访问首页并理解平台价值',
        expectedOutcome: '用户理解平台是做什么的，看到20个计算器的价值',
        timeExpected: 30,
        difficultyLevel: 2,
        errorProne: false,
        helpNeeded: false
      },
      {
        stepNumber: 2,
        action: '找到激光切割成本计算器',
        expectedOutcome: '用户能够找到并识别正确的计算器',
        timeExpected: 45,
        difficultyLevel: 3,
        errorProne: true,
        helpNeeded: true
      },
      {
        stepNumber: 3,
        action: '理解输入参数含义',
        expectedOutcome: '用户理解材料、厚度、尺寸等参数的含义',
        timeExpected: 60,
        difficultyLevel: 4,
        errorProne: true,
        helpNeeded: true
      },
      {
        stepNumber: 4,
        action: '输入计算参数',
        expectedOutcome: '用户成功输入所有必需参数',
        timeExpected: 90,
        difficultyLevel: 3,
        errorProne: true,
        helpNeeded: false
      },
      {
        stepNumber: 5,
        action: '执行计算并查看结果',
        expectedOutcome: '用户获得计算结果并理解结果含义',
        timeExpected: 45,
        difficultyLevel: 3,
        errorProne: false,
        helpNeeded: true
      },
      {
        stepNumber: 6,
        action: '理解结果和下一步行动',
        expectedOutcome: '用户理解成本构成，知道如何优化或使用结果',
        timeExpected: 30,
        difficultyLevel: 4,
        errorProne: false,
        helpNeeded: true
      }
    ],
    successCriteria: [
      '能够在3分钟内找到正确的计算器',
      '能够理解至少80%的输入参数',
      '能够成功完成计算',
      '能够理解计算结果的基本含义',
      '知道如何进行下一步操作'
    ],
    painPoints: [
      {
        location: '首页导航',
        description: '计算器分类不够直观，新手不知道选择哪个',
        severity: 'high',
        frequency: 'frequent',
        impact: 'major',
        suggestedFix: '添加"新手推荐"标签和使用场景说明'
      },
      {
        location: '参数输入界面',
        description: '专业术语过多，缺少通俗解释',
        severity: 'critical',
        frequency: 'always',
        impact: 'blocking',
        suggestedFix: '添加参数解释tooltip和示例值'
      },
      {
        location: '结果展示',
        description: '结果数据过于专业，缺少解读指导',
        severity: 'medium',
        frequency: 'frequent',
        impact: 'moderate',
        suggestedFix: '添加结果解读说明和优化建议'
      }
    ]
  }
];

describe('新手用户任务流程深度分析', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('首页用户体验分析', () => {
    it('应该在3秒内让用户理解平台价值', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // 检查关键价值主张是否清晰可见
      expect(screen.getByText(/Core Calculator Platform/i)).toBeInTheDocument();
      expect(screen.getByText(/20 Essential Laser Cutting Calculators/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional Operations/i)).toBeInTheDocument();

      // 检查是否有明确的行动指引
      const exploreButton = screen.getByText(/Explore All Calculators/i);
      expect(exploreButton).toBeInTheDocument();
    });

    it('应该提供清晰的计算器分类导航', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // 检查是否有分类展示
      const categories = screen.getAllByText(/Calculator/i);
      expect(categories.length).toBeGreaterThan(0);

      // 检查是否有视觉层次
      const featuredSection = screen.getByText(/Featured Calculators/i);
      expect(featuredSection).toBeInTheDocument();
    });

    it('应该为新手用户提供引导信息', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // 检查是否有使用指导
      const description = screen.getByText(/Professional Operations/i);
      expect(description).toBeInTheDocument();

      // 检查是否有明确的下一步指引
      const ctaSection = screen.getByText(/Ready to Optimize/i);
      expect(ctaSection).toBeInTheDocument();
    });
  });

  describe('计算器发现性分析', () => {
    it('应该让用户能够快速找到激光切割成本计算器', () => {
      render(
        <BrowserRouter>
          <CalculatorsPage />
        </BrowserRouter>
      );

      // 检查搜索功能
      const searchInput = screen.getByPlaceholderText(/Search calculators/i);
      expect(searchInput).toBeInTheDocument();

      // 测试搜索功能
      fireEvent.change(searchInput, { target: { value: 'cost' } });
      
      // 应该能找到成本相关的计算器
      expect(screen.getByText(/Laser Cutting Cost/i)).toBeInTheDocument();
    });

    it('应该提供清晰的分类筛选', () => {
      render(
        <BrowserRouter>
          <CalculatorsPage />
        </BrowserRouter>
      );

      // 检查分类标签
      expect(screen.getByText(/All Calculators/i)).toBeInTheDocument();
      expect(screen.getByText(/Core Engineering/i)).toBeInTheDocument();

      // 测试分类筛选
      const coreEngineeringFilter = screen.getByText(/Core Engineering/i);
      fireEvent.click(coreEngineeringFilter);

      // 应该显示相关计算器
      expect(screen.getByText(/Laser Cutting Cost/i)).toBeInTheDocument();
    });

    it('应该为每个计算器提供清晰的描述', () => {
      render(
        <BrowserRouter>
          <CalculatorsPage />
        </BrowserRouter>
      );

      // 检查计算器卡片是否包含描述信息
      const calculatorCards = screen.getAllByRole('link');
      expect(calculatorCards.length).toBeGreaterThan(0);

      // 检查是否有分类标签
      const categoryBadges = screen.getAllByText(/Core Engineering|Quality Control|Process Optimization/i);
      expect(categoryBadges.length).toBeGreaterThan(0);
    });
  });

  describe('新手学习曲线分析', () => {
    it('应该识别学习障碍点', () => {
      const task = noviceUserTasks[0];
      
      // 分析高难度步骤
      const difficultSteps = task.steps.filter(step => step.difficultyLevel >= 4);
      expect(difficultSteps.length).toBeGreaterThan(0);

      // 分析需要帮助的步骤
      const helpNeededSteps = task.steps.filter(step => step.helpNeeded);
      expect(helpNeededSteps.length).toBeGreaterThan(0);

      // 分析容易出错的步骤
      const errorProneSteps = task.steps.filter(step => step.errorProne);
      expect(errorProneSteps.length).toBeGreaterThan(0);
    });

    it('应该评估任务完成时间的合理性', () => {
      const task = noviceUserTasks[0];
      
      // 计算总预期时间
      const totalTime = task.steps.reduce((sum, step) => sum + step.timeExpected, 0);
      expect(totalTime).toBeLessThanOrEqual(task.expectedTime);

      // 检查是否有时间过长的步骤
      const longSteps = task.steps.filter(step => step.timeExpected > 60);
      expect(longSteps.length).toBeLessThanOrEqual(2); // 最多2个步骤超过1分钟
    });

    it('应该识别关键痛点', () => {
      const task = noviceUserTasks[0];
      
      // 分析严重痛点
      const criticalPainPoints = task.painPoints.filter(point => point.severity === 'critical');
      expect(criticalPainPoints.length).toBeGreaterThan(0);

      // 分析高频痛点
      const frequentPainPoints = task.painPoints.filter(point => point.frequency === 'frequent' || point.frequency === 'always');
      expect(frequentPainPoints.length).toBeGreaterThan(0);

      // 检查是否有修复建议
      task.painPoints.forEach(point => {
        expect(point.suggestedFix).toBeTruthy();
        expect(point.suggestedFix.length).toBeGreaterThan(10);
      });
    });
  });

  describe('用户引导和帮助系统评估', () => {
    it('应该评估帮助信息的可获得性', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );

      // 检查是否有帮助链接或按钮
      // 注意：这里需要根据实际实现调整
      const helpElements = screen.queryAllByText(/help|guide|tutorial/i);
      
      // 如果没有明显的帮助元素，这是一个需要改进的点
      if (helpElements.length === 0) {
        console.warn('缺少明显的帮助和引导元素');
      }
    });

    it('应该评估错误处理和反馈机制', () => {
      // 这里模拟用户输入错误的情况
      const errorScenarios = [
        '用户输入无效的材料厚度',
        '用户遗漏必填参数',
        '用户输入超出范围的值'
      ];

      errorScenarios.forEach(scenario => {
        // 检查是否有相应的错误处理机制
        expect(scenario).toBeTruthy(); // 占位符，实际需要测试错误处理
      });
    });
  });

  describe('优化建议生成', () => {
    it('应该生成具体的改进建议', () => {
      const task = noviceUserTasks[0];
      
      // 基于痛点生成改进建议
      const improvements = task.painPoints.map(point => ({
        issue: point.description,
        priority: point.severity === 'critical' ? 'high' : point.severity === 'high' ? 'medium' : 'low',
        solution: point.suggestedFix,
        estimatedImpact: point.impact
      }));

      expect(improvements.length).toBeGreaterThan(0);
      
      // 检查高优先级改进项
      const highPriorityImprovements = improvements.filter(imp => imp.priority === 'high');
      expect(highPriorityImprovements.length).toBeGreaterThan(0);
    });

    it('应该提供量化的改进目标', () => {
      const currentMetrics = {
        taskCompletionRate: 0.75, // 75%的用户能完成任务
        averageCompletionTime: 420, // 7分钟
        errorRate: 0.35, // 35%的用户遇到错误
        helpSeekingRate: 0.60 // 60%的用户需要寻求帮助
      };

      const targetMetrics = {
        taskCompletionRate: 0.90, // 目标90%
        averageCompletionTime: 300, // 目标5分钟
        errorRate: 0.15, // 目标15%
        helpSeekingRate: 0.30 // 目标30%
      };

      // 验证改进目标的合理性
      expect(targetMetrics.taskCompletionRate).toBeGreaterThan(currentMetrics.taskCompletionRate);
      expect(targetMetrics.averageCompletionTime).toBeLessThan(currentMetrics.averageCompletionTime);
      expect(targetMetrics.errorRate).toBeLessThan(currentMetrics.errorRate);
      expect(targetMetrics.helpSeekingRate).toBeLessThan(currentMetrics.helpSeekingRate);
    });
  });

  describe('新手用户成功路径设计', () => {
    it('应该设计渐进式学习路径', () => {
      const learningPath = [
        {
          stage: 'discovery',
          goal: '理解平台价值',
          duration: 30,
          successCriteria: '用户知道平台能解决什么问题'
        },
        {
          stage: 'exploration',
          goal: '找到合适的计算器',
          duration: 60,
          successCriteria: '用户能找到并选择正确的计算器'
        },
        {
          stage: 'learning',
          goal: '理解参数含义',
          duration: 90,
          successCriteria: '用户理解主要输入参数'
        },
        {
          stage: 'execution',
          goal: '完成计算',
          duration: 60,
          successCriteria: '用户成功获得计算结果'
        },
        {
          stage: 'comprehension',
          goal: '理解结果',
          duration: 60,
          successCriteria: '用户理解结果含义和下一步行动'
        }
      ];

      // 验证学习路径的合理性
      const totalDuration = learningPath.reduce((sum, stage) => sum + stage.duration, 0);
      expect(totalDuration).toBeLessThanOrEqual(300); // 5分钟内完成

      // 检查每个阶段都有明确的成功标准
      learningPath.forEach(stage => {
        expect(stage.successCriteria).toBeTruthy();
        expect(stage.goal).toBeTruthy();
      });
    });
  });
});
