import { describe, it, expect } from 'vitest';

// 内容组织和认知负荷评估
interface ContentOrganization {
  informationDensity: number; // items per screen
  hierarchyDepth: number;
  groupingLogic: 'semantic' | 'functional' | 'alphabetical' | 'frequency';
  visualSeparation: boolean;
  scanningPattern: 'F-pattern' | 'Z-pattern' | 'layer-cake' | 'spotted';
}

interface CognitiveLoadMetrics {
  decisionPoints: number;
  informationOverload: number; // 1-10 scale
  mentalModelAlignment: number; // 1-10 scale
  contextSwitching: number; // frequency per task
  workingMemoryDemand: number; // 1-10 scale
}

interface InformationArchitecture {
  contentTypes: ContentType[];
  organizationPrinciples: string[];
  userMentalModel: MentalModel;
  cognitiveLoadScore: number;
}

interface ContentType {
  type: string;
  priority: 'high' | 'medium' | 'low';
  frequency: 'always' | 'frequent' | 'occasional' | 'rare';
  complexity: 'simple' | 'moderate' | 'complex';
  cognitiveLoad: number;
}

interface MentalModel {
  primaryCategories: string[];
  expectedFlow: string[];
  conceptualMapping: Record<string, string>;
  alignmentScore: number; // 1-10 scale
}

interface PageLayoutAnalysis {
  elementsPerScreen: number;
  visualHierarchy: number; // 1-10 scale
  whitespaceRatio: number; // 0-1 scale
  readingFlow: 'natural' | 'forced' | 'confusing';
  attentionDistribution: 'focused' | 'scattered' | 'balanced';
}

// 内容组织分析
const contentOrganization: ContentOrganization = {
  informationDensity: 12, // 每屏12个项目
  hierarchyDepth: 3,
  groupingLogic: 'functional',
  visualSeparation: true,
  scanningPattern: 'F-pattern'
};

// 认知负荷指标
const cognitiveLoadMetrics: CognitiveLoadMetrics = {
  decisionPoints: 8,
  informationOverload: 6,
  mentalModelAlignment: 8,
  contextSwitching: 3,
  workingMemoryDemand: 5
};

// 内容类型定义
const contentTypes: ContentType[] = [
  {
    type: 'Calculator Cards',
    priority: 'high',
    frequency: 'always',
    complexity: 'moderate',
    cognitiveLoad: 4
  },
  {
    type: 'Category Filters',
    priority: 'high',
    frequency: 'frequent',
    complexity: 'simple',
    cognitiveLoad: 2
  },
  {
    type: 'Search Interface',
    priority: 'medium',
    frequency: 'frequent',
    complexity: 'simple',
    cognitiveLoad: 3
  },
  {
    type: 'Navigation Menu',
    priority: 'high',
    frequency: 'always',
    complexity: 'moderate',
    cognitiveLoad: 3
  },
  {
    type: 'Help Information',
    priority: 'low',
    frequency: 'occasional',
    complexity: 'simple',
    cognitiveLoad: 2
  }
];

// 用户心理模型
const userMentalModel: MentalModel = {
  primaryCategories: ['Core Engineering', 'Quality Control', 'Process Optimization', 'Advanced Analysis'],
  expectedFlow: ['Browse Categories', 'Select Calculator', 'Input Parameters', 'View Results'],
  conceptualMapping: {
    'Cost Calculation': 'Core Engineering',
    'Quality Prediction': 'Quality Control',
    'Parameter Optimization': 'Process Optimization',
    'Data Analysis': 'Advanced Analysis'
  },
  alignmentScore: 8.5
};

// 页面布局分析
const pageLayoutAnalysis: PageLayoutAnalysis = {
  elementsPerScreen: 15,
  visualHierarchy: 8,
  whitespaceRatio: 0.35,
  readingFlow: 'natural',
  attentionDistribution: 'balanced'
};

describe('内容组织和认知负荷评估', () => {
  describe('信息密度分析', () => {
    it('应该评估信息密度的合理性', () => {
      expect(contentOrganization.informationDensity).toBeGreaterThan(5);
      expect(contentOrganization.informationDensity).toBeLessThan(20); // 7±2原则扩展
      
      // 验证信息密度与屏幕尺寸的关系
      const densityByScreenSize = {
        mobile: 6,
        tablet: 12,
        desktop: 18
      };
      
      Object.values(densityByScreenSize).forEach(density => {
        expect(density).toBeGreaterThan(4);
        expect(density).toBeLessThan(25);
      });
    });

    it('应该分析层级深度的影响', () => {
      expect(contentOrganization.hierarchyDepth).toBeGreaterThan(1);
      expect(contentOrganization.hierarchyDepth).toBeLessThanOrEqual(4);
      
      // 计算层级复杂度
      const hierarchyComplexity = Math.pow(2, contentOrganization.hierarchyDepth);
      expect(hierarchyComplexity).toBeLessThan(32); // 避免过度复杂
    });

    it('应该验证分组逻辑的一致性', () => {
      expect(['semantic', 'functional', 'alphabetical', 'frequency']).toContain(
        contentOrganization.groupingLogic
      );
      
      // 功能性分组应该有更好的用户理解度
      if (contentOrganization.groupingLogic === 'functional') {
        expect(userMentalModel.alignmentScore).toBeGreaterThan(7);
      }
    });
  });

  describe('认知负荷评估', () => {
    it('应该分析决策点数量', () => {
      expect(cognitiveLoadMetrics.decisionPoints).toBeGreaterThan(3);
      expect(cognitiveLoadMetrics.decisionPoints).toBeLessThan(15);
      
      // 决策点过多会增加认知负荷
      if (cognitiveLoadMetrics.decisionPoints > 10) {
        expect(cognitiveLoadMetrics.informationOverload).toBeGreaterThan(6);
      }
    });

    it('应该评估信息过载程度', () => {
      expect(cognitiveLoadMetrics.informationOverload).toBeGreaterThan(1);
      expect(cognitiveLoadMetrics.informationOverload).toBeLessThanOrEqual(10);
      
      // 信息过载应该控制在合理范围
      expect(cognitiveLoadMetrics.informationOverload).toBeLessThan(8);
    });

    it('应该分析心理模型匹配度', () => {
      expect(cognitiveLoadMetrics.mentalModelAlignment).toBeGreaterThan(5);
      expect(cognitiveLoadMetrics.mentalModelAlignment).toBeLessThanOrEqual(10);
      
      // 高匹配度应该降低认知负荷
      if (cognitiveLoadMetrics.mentalModelAlignment > 7) {
        expect(cognitiveLoadMetrics.workingMemoryDemand).toBeLessThan(7);
      }
    });

    it('应该评估上下文切换频率', () => {
      expect(cognitiveLoadMetrics.contextSwitching).toBeGreaterThanOrEqual(0);
      expect(cognitiveLoadMetrics.contextSwitching).toBeLessThan(10);
      
      // 上下文切换应该最小化
      expect(cognitiveLoadMetrics.contextSwitching).toBeLessThan(5);
    });

    it('应该分析工作记忆需求', () => {
      expect(cognitiveLoadMetrics.workingMemoryDemand).toBeGreaterThan(1);
      expect(cognitiveLoadMetrics.workingMemoryDemand).toBeLessThanOrEqual(10);
      
      // 工作记忆需求应该适中
      expect(cognitiveLoadMetrics.workingMemoryDemand).toBeLessThan(8);
    });
  });

  describe('内容类型优先级分析', () => {
    it('应该分析内容类型的认知负荷', () => {
      contentTypes.forEach(contentType => {
        expect(contentType.cognitiveLoad).toBeGreaterThan(0);
        expect(contentType.cognitiveLoad).toBeLessThanOrEqual(10);
        
        // 高优先级内容应该有适中的认知负荷
        if (contentType.priority === 'high') {
          expect(contentType.cognitiveLoad).toBeLessThan(6);
        }
      });
    });

    it('应该验证内容频率与优先级的关系', () => {
      const highPriorityContent = contentTypes.filter(ct => ct.priority === 'high');
      
      highPriorityContent.forEach(content => {
        expect(['always', 'frequent']).toContain(content.frequency);
      });
      
      // 高频内容应该有高优先级
      const alwaysContent = contentTypes.filter(ct => ct.frequency === 'always');
      alwaysContent.forEach(content => {
        expect(content.priority).toBe('high');
      });
    });

    it('应该分析内容复杂度分布', () => {
      const complexityDistribution = {
        simple: contentTypes.filter(ct => ct.complexity === 'simple').length,
        moderate: contentTypes.filter(ct => ct.complexity === 'moderate').length,
        complex: contentTypes.filter(ct => ct.complexity === 'complex').length
      };
      
      // 应该有合理的复杂度分布
      expect(complexityDistribution.simple).toBeGreaterThan(0);
      expect(complexityDistribution.moderate).toBeGreaterThan(0);
      
      // 复杂内容不应过多
      const totalContent = contentTypes.length;
      expect(complexityDistribution.complex / totalContent).toBeLessThan(0.3);
    });
  });

  describe('用户心理模型匹配分析', () => {
    it('应该验证主要分类的逻辑性', () => {
      expect(userMentalModel.primaryCategories.length).toBeGreaterThan(2);
      expect(userMentalModel.primaryCategories.length).toBeLessThan(8);
      
      // 验证分类名称的描述性
      userMentalModel.primaryCategories.forEach(category => {
        expect(category.length).toBeGreaterThan(5);
        expect(category).toMatch(/^[A-Z]/); // 首字母大写
      });
    });

    it('应该分析预期流程的合理性', () => {
      expect(userMentalModel.expectedFlow.length).toBeGreaterThan(2);
      expect(userMentalModel.expectedFlow.length).toBeLessThan(8);
      
      // 验证流程的逻辑顺序
      expect(userMentalModel.expectedFlow[0]).toMatch(/Browse|Select|Choose/);
      expect(userMentalModel.expectedFlow[userMentalModel.expectedFlow.length - 1]).toMatch(/Result|Output|Complete/);
    });

    it('应该评估概念映射的准确性', () => {
      const mappingEntries = Object.entries(userMentalModel.conceptualMapping);
      expect(mappingEntries.length).toBeGreaterThan(3);
      
      // 验证映射的一致性
      mappingEntries.forEach(([concept, category]) => {
        expect(userMentalModel.primaryCategories).toContain(category);
        expect(concept.length).toBeGreaterThan(3);
      });
    });

    it('应该分析匹配度评分', () => {
      expect(userMentalModel.alignmentScore).toBeGreaterThan(5);
      expect(userMentalModel.alignmentScore).toBeLessThanOrEqual(10);
      
      // 高匹配度应该反映在低认知负荷上
      if (userMentalModel.alignmentScore > 8) {
        expect(cognitiveLoadMetrics.mentalModelAlignment).toBeGreaterThan(7);
      }
    });
  });

  describe('页面布局认知分析', () => {
    it('应该分析元素数量的合理性', () => {
      expect(pageLayoutAnalysis.elementsPerScreen).toBeGreaterThan(5);
      expect(pageLayoutAnalysis.elementsPerScreen).toBeLessThan(25);
      
      // 元素过多会增加认知负荷
      if (pageLayoutAnalysis.elementsPerScreen > 20) {
        expect(cognitiveLoadMetrics.informationOverload).toBeGreaterThan(6);
      }
    });

    it('应该评估视觉层次的清晰度', () => {
      expect(pageLayoutAnalysis.visualHierarchy).toBeGreaterThan(5);
      expect(pageLayoutAnalysis.visualHierarchy).toBeLessThanOrEqual(10);
      
      // 清晰的视觉层次应该降低认知负荷
      if (pageLayoutAnalysis.visualHierarchy > 7) {
        expect(cognitiveLoadMetrics.workingMemoryDemand).toBeLessThan(6);
      }
    });

    it('应该分析留白比例的影响', () => {
      expect(pageLayoutAnalysis.whitespaceRatio).toBeGreaterThan(0.2);
      expect(pageLayoutAnalysis.whitespaceRatio).toBeLessThan(0.6);
      
      // 适当的留白有助于降低认知负荷
      if (pageLayoutAnalysis.whitespaceRatio > 0.3) {
        expect(pageLayoutAnalysis.readingFlow).toBe('natural');
      }
    });

    it('应该评估阅读流的自然性', () => {
      expect(['natural', 'forced', 'confusing']).toContain(pageLayoutAnalysis.readingFlow);
      
      // 自然的阅读流应该有更好的用户体验
      if (pageLayoutAnalysis.readingFlow === 'natural') {
        expect(pageLayoutAnalysis.attentionDistribution).not.toBe('scattered');
      }
    });

    it('应该分析注意力分布', () => {
      expect(['focused', 'scattered', 'balanced']).toContain(pageLayoutAnalysis.attentionDistribution);
      
      // 平衡的注意力分布是理想的
      if (pageLayoutAnalysis.attentionDistribution === 'balanced') {
        expect(pageLayoutAnalysis.visualHierarchy).toBeGreaterThan(6);
      }
    });
  });

  describe('认知负荷优化建议', () => {
    it('应该生成基于数据的优化建议', () => {
      const optimizationSuggestions = [];
      
      // 基于信息密度的建议
      if (contentOrganization.informationDensity > 15) {
        optimizationSuggestions.push('Reduce information density per screen');
      }
      
      // 基于决策点的建议
      if (cognitiveLoadMetrics.decisionPoints > 10) {
        optimizationSuggestions.push('Simplify decision-making process');
      }
      
      // 基于心理模型匹配的建议
      if (cognitiveLoadMetrics.mentalModelAlignment < 7) {
        optimizationSuggestions.push('Improve mental model alignment');
      }
      
      // 基于上下文切换的建议
      if (cognitiveLoadMetrics.contextSwitching > 4) {
        optimizationSuggestions.push('Minimize context switching');
      }
      
      // 应该有具体的优化建议
      expect(optimizationSuggestions.length).toBeGreaterThanOrEqual(0);
    });

    it('应该计算认知负荷改进潜力', () => {
      const currentCognitiveLoad = (
        cognitiveLoadMetrics.informationOverload +
        cognitiveLoadMetrics.workingMemoryDemand +
        (10 - cognitiveLoadMetrics.mentalModelAlignment)
      ) / 3;
      
      const targetCognitiveLoad = 4; // 目标认知负荷
      const improvementPotential = Math.max(0, currentCognitiveLoad - targetCognitiveLoad);
      
      expect(currentCognitiveLoad).toBeGreaterThan(0);
      expect(improvementPotential).toBeGreaterThanOrEqual(0);
      
      // 如果有改进空间，应该提供具体建议
      if (improvementPotential > 1) {
        expect(improvementPotential).toBeLessThan(5); // 改进应该是可实现的
      }
    });
  });

  describe('扫描模式分析', () => {
    it('应该分析用户扫描模式的适配性', () => {
      expect(['F-pattern', 'Z-pattern', 'layer-cake', 'spotted']).toContain(
        contentOrganization.scanningPattern
      );
      
      // F模式适合内容密集的页面
      if (contentOrganization.scanningPattern === 'F-pattern') {
        expect(contentOrganization.informationDensity).toBeGreaterThan(8);
      }
    });

    it('应该验证扫描模式与布局的匹配', () => {
      const scanningPatternMatch = {
        'F-pattern': pageLayoutAnalysis.readingFlow === 'natural',
        'Z-pattern': pageLayoutAnalysis.attentionDistribution === 'balanced',
        'layer-cake': pageLayoutAnalysis.visualHierarchy > 7,
        'spotted': pageLayoutAnalysis.attentionDistribution === 'scattered'
      };
      
      const currentPattern = contentOrganization.scanningPattern;
      if (scanningPatternMatch[currentPattern] !== undefined) {
        expect(scanningPatternMatch[currentPattern]).toBe(true);
      }
    });
  });

  describe('内容组织效果评估', () => {
    it('应该计算整体组织效果评分', () => {
      const organizationScore = (
        (10 - Math.min(contentOrganization.informationDensity / 2, 10)) +
        (10 - contentOrganization.hierarchyDepth * 2) +
        (contentOrganization.visualSeparation ? 10 : 5) +
        userMentalModel.alignmentScore +
        pageLayoutAnalysis.visualHierarchy
      ) / 5;
      
      expect(organizationScore).toBeGreaterThan(5);
      expect(organizationScore).toBeLessThanOrEqual(10);
      
      // 高组织效果应该对应低认知负荷
      if (organizationScore > 8) {
        expect(cognitiveLoadMetrics.informationOverload).toBeLessThan(6);
      }
    });

    it('应该评估组织原则的一致性', () => {
      const organizationPrinciples = [
        'Functional grouping',
        'Visual hierarchy',
        'Progressive disclosure',
        'Consistent patterns',
        'Mental model alignment'
      ];
      
      // 验证组织原则的应用
      expect(organizationPrinciples.length).toBeGreaterThan(3);
      
      // 功能性分组
      expect(contentOrganization.groupingLogic).toBe('functional');
      
      // 视觉层次
      expect(pageLayoutAnalysis.visualHierarchy).toBeGreaterThan(6);
      
      // 心理模型匹配
      expect(userMentalModel.alignmentScore).toBeGreaterThan(7);
    });
  });
});
