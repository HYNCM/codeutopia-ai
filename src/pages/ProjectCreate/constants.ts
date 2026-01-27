import {
    ProjectCreateFormData,
    BudgetType,
    CurrencyType,
    ProjectPhase,
    MilestoneConfig,
    AIRoleConfig,
    TalentRequirement,
    SettlementConfig,
    CrossRegionConfig,
    ProjectReviewStatus
} from '../../types';

// 初始表单状态
export const INITIAL_FORM_DATA: ProjectCreateFormData = {
    basicInfo: {
        title: '',
        category: '',
        subcategory: '',
        description: '',
        attachments: [],
        region: 'GLOBAL',
        duration: 'flexible',
        budgetType: 'fixed',
        budgetMin: 0,
        budgetMax: 0,
        currency: 'USD',
    },
    talentRequirement: {
        skills: [],
        level: 'mid',
        regionPreference: [],
        count: 1,
        minRate: 0,
        maxRate: 0,
        requireCase: false,
        requireTest: false,
        workMode: 'remote',
    },
    aiConfig: {
        enabled: true,
        roles: [],
    },
    projectFlow: {
        phases: [
            {
                id: 'p1',
                name: '需求分析與設計',
                description: '確認需求文檔、原型設計與交互邏輯',
                order: 1,
                estimatedDays: 14,
                humanDeliverables: ['PRD文檔', 'UI/UX設計稿'],
                aiDeliverables: ['需求梳理報告', '交互原型'],
            },
            {
                id: 'p2',
                name: '開發實現',
                description: '核心功能代碼開發與單元測試',
                order: 2,
                estimatedDays: 30,
                humanDeliverables: ['源代碼', '部署文檔'],
                aiDeliverables: ['代碼框架', 'API文檔'],
            },
            {
                id: 'p3',
                name: '測試與驗收',
                description: '集成測試、性能測試與功能驗收',
                order: 3,
                estimatedDays: 14,
                humanDeliverables: ['測試報告', '驗收報告'],
                aiDeliverables: ['測試用例', '自動化測試腳本'],
            },
        ],
        developmentType: 'cloud',
        collaborationTools: ['CodeUtopia'],
        visibility: 'public',
    },
    milestones: [
        {
            id: 'm1',
            title: '項目啟動與需求確認',
            description: '完成需求分析，確認PRD文檔與UI設計',
            order: 1,
            plannedStartDate: new Date().toISOString().split('T')[0],
            plannedEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budgetAmount: 0,
            budgetPercentage: 20,
            depositRequired: true,
            depositPercentage: 20,
            humanDeliverables: [
                {
                    id: 'hd1',
                    name: '項目需求規格說明書 (PRD)',
                    description: '詳細的功能需求與非功能需求定義',
                    type: 'document',
                    required: true
                }
            ],
            aiDeliverables: [
                {
                    id: 'ad1',
                    name: 'AI需求梳理報告',
                    description: '基於溝通記錄生成的初步需求分析',
                    type: 'document',
                    required: false
                }
            ],
            acceptanceCriteria: ['所有核心功能需求已確認', 'UI風格已確認'],
            reviewMethod: 'manual',
            reviewDeadlineHours: 72,
        },
        {
            id: 'm2',
            title: '核心功能開發',
            description: '完成後端API接口與前端核心頁面',
            order: 2,
            plannedStartDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            plannedEndDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budgetAmount: 0,
            budgetPercentage: 50,
            depositRequired: false,
            depositPercentage: 0,
            humanDeliverables: [
                {
                    id: 'hd2',
                    name: '源代碼庫',
                    description: '包含所有前後端代碼',
                    type: 'code',
                    required: true
                }
            ],
            aiDeliverables: [
                {
                    id: 'ad2',
                    name: '代碼質量分析報告',
                    description: 'AI自動生成的代碼審查報告',
                    type: 'test_report',
                    required: true
                }
            ],
            acceptanceCriteria: ['API接口功能正常', '前端頁面交互流暢', '代碼通過Lint檢查'],
            reviewMethod: 'auto_with_manual',
            reviewDeadlineHours: 72,
        },
        {
            id: 'm3',
            title: '測試驗收與交付',
            description: '完成系統測試，修復Bug，正式部署上線',
            order: 3,
            plannedStartDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            plannedEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budgetAmount: 0,
            budgetPercentage: 30,
            depositRequired: false,
            depositPercentage: 0,
            humanDeliverables: [
                {
                    id: 'hd3',
                    name: '系統使用手冊',
                    description: '用戶操作指南與運維部署文檔',
                    type: 'document',
                    required: true
                }
            ],
            aiDeliverables: [
                {
                    id: 'ad3',
                    name: '自動化測試報告',
                    description: '全量回歸測試結果',
                    type: 'test_report',
                    required: true
                }
            ],
            acceptanceCriteria: ['所有P0/P1級Bug已修復', '系統成功部署至生產環境'],
            reviewMethod: 'manual',
            reviewDeadlineHours: 48,
        }
    ],
    settlement: {
        paymentChannel: 'paypal',
        currency: 'USD',
        escrowEnabled: true,
        lateFeePercentage: 0.5,
        lateFeeMaxPercentage: 10,
        invoiceRequired: true,
        invoiceType: 'electronic',
    },
    crossRegion: {
        targetRegions: ['global'],
        primaryTimezone: 'UTC+8',
        languagePreferences: ['zh', 'en'],
        meetingFrequency: 'weekly',
        responseTimeHours: 24,
        documentPermissions: 'all',
        disputeHandling: 'regional_first',
    }
};
