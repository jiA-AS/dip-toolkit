// DIP轻量工具包 - 数据文件
// 包含更多的DIP分组数据和配置信息

// 扩展的DIP分组数据
const extendedDIPData = [
    {
        id: 9,
        disease: '胆囊结石伴慢性胆囊炎',
        icd10: 'K80.1',
        dipCode: 'DIP009',
        department: '普外科',
        severity: '中',
        score: 1.3,
        standardCost: 9800,
        description: '胆囊结石伴慢性胆囊炎，需腹腔镜胆囊切除术'
    },
    {
        id: 10,
        disease: '腰椎间盘突出症',
        icd10: 'M51.1',
        dipCode: 'DIP010',
        department: '骨科',
        severity: '中',
        score: 1.6,
        standardCost: 12500,
        description: '腰椎间盘突出症，保守治疗或手术治疗'
    },
    {
        id: 11,
        disease: '支气管哮喘',
        icd10: 'J45.9',
        dipCode: 'DIP011',
        department: '呼吸内科',
        severity: '中',
        score: 1.0,
        standardCost: 5200,
        description: '支气管哮喘急性发作'
    },
    {
        id: 12,
        disease: '消化性溃疡',
        icd10: 'K27.9',
        dipCode: 'DIP012',
        department: '消化内科',
        severity: '中',
        score: 1.2,
        standardCost: 7600,
        description: '胃或十二指肠溃疡，无并发症'
    },
    {
        id: 13,
        disease: '白内障',
        icd10: 'H25.9',
        dipCode: 'DIP013',
        department: '眼科',
        severity: '低',
        score: 0.9,
        standardCost: 6800,
        description: '老年性白内障，需手术治疗'
    },
    {
        id: 14,
        disease: '前列腺增生',
        icd10: 'N40',
        dipCode: 'DIP014',
        department: '泌尿外科',
        severity: '中',
        score: 1.4,
        standardCost: 10500,
        description: '良性前列腺增生，需手术治疗'
    },
    {
        id: 15,
        disease: '子宫肌瘤',
        icd10: 'D25.9',
        dipCode: 'DIP015',
        department: '妇产科',
        severity: '中',
        score: 1.5,
        standardCost: 11500,
        description: '子宫肌瘤，需手术治疗'
    }
];

// 医院等级配置
const hospitalLevelConfig = {
    '1': {
        name: '一级医院',
        deviationThresholds: {
            normal: 15,    // 正常范围 ≤ 15%
            warning: 25,   // 预警范围 15%-25%
            high: 25       // 高风险 > 25%
        },
        adjustmentFactor: 1.2  // 调整系数
    },
    '2': {
        name: '二级医院',
        deviationThresholds: {
            normal: 10,    // 正常范围 ≤ 10%
            warning: 20,   // 预警范围 10%-20%
            high: 20       // 高风险 > 20%
        },
        adjustmentFactor: 1.0  // 调整系数
    },
    '3': {
        name: '三级医院',
        deviationThresholds: {
            normal: 8,     // 正常范围 ≤ 8%
            warning: 15,   // 预警范围 8%-15%
            high: 15       // 高风险 > 15%
        },
        adjustmentFactor: 0.8  // 调整系数
    }
};

// 科室分类
const departmentCategories = [
    { value: '内科', label: '内科' },
    { value: '外科', label: '外科' },
    { value: '妇产科', label: '妇产科' },
    { value: '儿科', label: '儿科' },
    { value: '急诊科', label: '急诊科' },
    { value: '神经内科', label: '神经内科' },
    { value: '心内科', label: '心内科' },
    { value: '呼吸内科', label: '呼吸内科' },
    { value: '消化内科', label: '消化内科' },
    { value: '骨科', label: '骨科' },
    { value: '泌尿外科', label: '泌尿外科' },
    { value: '普外科', label: '普外科' },
    { value: '眼科', label: '眼科' }
];

// 严重程度分类
const severityCategories = [
    { value: '低', label: '低' },
    { value: '中', label: '中' },
    { value: '高', label: '高' }
];

// 费用分类
const costCategories = [
    { id: 1, name: '药品费', description: '西药、中成药、中草药费用' },
    { id: 2, name: '检查费', description: '化验、影像学检查费用' },
    { id: 3, name: '治疗费', description: '治疗、手术、麻醉费用' },
    { id: 4, name: '材料费', description: '医用材料、耗材费用' },
    { id: 5, name: '床位费', description: '住院床位费用' },
    { id: 6, name: '护理费', description: '护理服务费用' },
    { id: 7, name: '其他费', description: '其他杂项费用' }
];

// 病案首页检查项分类
const checklistCategories = [
    { id: '基本信息', color: '#2c7be5', description: '患者基本信息相关检查项' },
    { id: '诊断信息', color: '#00a854', description: '诊断相关检查项' },
    { id: '手术信息', color: '#ffa726', description: '手术操作相关检查项' },
    { id: '病情评估', color: '#f44336', description: '病情评估相关检查项' },
    { id: '时间信息', color: '#9c27b0', description: '时间相关检查项' },
    { id: '费用信息', color: '#3f51b5', description: '费用相关检查项' },
    { id: '出院信息', color: '#009688', description: '出院相关检查项' },
    { id: '抢救信息', color: '#ff5722', description: '抢救相关检查项' },
    { id: '安全信息', color: '#795548', description: '安全相关检查项' },
    { id: '检验信息', color: '#607d8b', description: '检验相关检查项' },
    { id: '病理信息', color: '#e91e63', description: '病理相关检查项' },
    { id: '外部原因', color: '#673ab7', description: '外部原因相关检查项' },
    { id: '质量信息', color: '#2196f3', description: '质量相关检查项' },
    { id: '签名信息', color: '#4caf50', description: '签名相关检查项' }
];

// 预警级别配置
const warningLevels = {
    low: {
        name: '正常',
        color: '#00a854',
        description: '费用在正常范围内，无需特别关注',
        action: '继续正常诊疗流程'
    },
    medium: {
        name: '关注',
        color: '#ffa726',
        description: '费用偏离需关注，建议分析费用构成',
        action: '分析费用构成，优化治疗方案'
    },
    high: {
        name: '高风险',
        color: '#f44336',
        description: '费用偏离较大，建议进行病例评审',
        action: '进行病例评审，分析原因并采取控制措施'
    }
};

// 工具函数：获取医院等级配置
function getHospitalLevelConfig(level) {
    return hospitalLevelConfig[level] || hospitalLevelConfig['2'];
}

// 工具函数：根据偏离度确定预警级别
function getWarningLevel(deviationPercent, hospitalLevel = '2') {
    const config = getHospitalLevelConfig(hospitalLevel);
    const thresholds = config.deviationThresholds;
    
    if (deviationPercent <= thresholds.normal) {
        return warningLevels.low;
    } else if (deviationPercent <= thresholds.warning) {
        return warningLevels.medium;
    } else {
        return warningLevels.high;
    }
}

// 工具函数：获取所有DIP数据
function getAllDIPData() {
    // 从主文件获取基础数据
    const mainData = JSON.parse(localStorage.getItem('dipLookupData') || '[]');
    
    // 合并扩展数据
    const allData = [...mainData, ...extendedDIPData];
    
    // 按疾病名称排序
    return allData.sort((a, b) => a.disease.localeCompare(b.disease, 'zh-CN'));
}

// 工具函数：根据科室获取DIP数据
function getDIPDataByDepartment(department) {
    const allData = getAllDIPData();
    if (!department) return allData;
    return allData.filter(item => item.department === department);
}

// 工具函数：根据严重程度获取DIP数据
function getDIPDataBySeverity(severity) {
    const allData = getAllDIPData();
    if (!severity) return allData;
    return allData.filter(item => item.severity === severity);
}

// 工具函数：搜索DIP数据
function searchDIPData(keyword, department = '', severity = '') {
    let results = getAllDIPData();
    
    // 按关键词筛选
    if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        results = results.filter(item => 
            item.disease.toLowerCase().includes(lowerKeyword) ||
            item.icd10.toLowerCase().includes(lowerKeyword) ||
            item.dipCode.toLowerCase().includes(lowerKeyword) ||
            item.description.toLowerCase().includes(lowerKeyword)
        );
    }
    
    // 按科室筛选
    if (department) {
        results = results.filter(item => item.department === department);
    }
    
    // 按严重程度筛选
    if (severity) {
        results = results.filter(item => item.severity === severity);
    }
    
    return results;
}

// 工具函数：计算费用偏离分析
function calculateCostDeviation(standardCost, actualCost, hospitalLevel = '2') {
    if (standardCost <= 0 || actualCost <= 0) {
        return {
            deviationAmount: 0,
            deviationPercent: 0,
            warningLevel: warningLevels.low,
            suggestion: '请输入有效的费用数据'
        };
    }
    
    const deviationAmount = actualCost - standardCost;
    const deviationPercent = Math.abs((deviationAmount / standardCost) * 100);
    const warningLevel = getWarningLevel(deviationPercent, hospitalLevel);
    
    // 根据医院等级调整建议
    const config = getHospitalLevelConfig(hospitalLevel);
    let suggestion = warningLevel.description;
    
    if (hospitalLevel === '1') {
        suggestion += '（一级医院可适当放宽标准）';
    } else if (hospitalLevel === '3') {
        suggestion += '（三级医院应严格控制费用）';
    }
    
    // 添加具体建议
    if (deviationAmount > 0) {
        suggestion += `。实际费用超出标准费用${deviationAmount.toLocaleString()}元，建议分析超支原因。`;
    } else if (deviationAmount < 0) {
        suggestion += `。实际费用低于标准费用${Math.abs(deviationAmount).toLocaleString()}元，需关注诊疗质量。`;
    }
    
    return {
        deviationAmount,
        deviationPercent,
        warningLevel,
        suggestion,
        isOverBudget: deviationAmount > 0
    };
}

// 工具函数：导出数据为CSV格式
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        alert('没有数据可导出');
        return;
    }
    
    // 获取表头
    const headers = Object.keys(data[0]);
    
    // 创建CSV内容
    let csvContent = headers.join(',') + '\n';
    
    // 添加数据行
    data.forEach(item => {
        const row = headers.map(header => {
            const value = item[header];
            // 处理包含逗号的值
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',');
        csvContent += row + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `dip_data_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 工具函数：导入数据
function importFromJSON(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        // 验证数据结构
        if (!data.dipLookupData || !Array.isArray(data.dipLookupData)) {
            throw new Error('无效的数据格式：缺少DIP查找数据');
        }
        
        if (!data.checklistItems || !Array.isArray(data.checklistItems)) {
            throw new Error('无效的数据格式：缺少检查清单数据');
        }
        
        // 保存到本地存储
        localStorage.setItem('dipLookupData', JSON.stringify(data.dipLookupData));
        localStorage.setItem('checklistItems', JSON.stringify(data.checklistItems));
        
        return {
            success: true,
            message: `成功导入${data.dipLookupData.length}条DIP数据和${data.checklistItems.length}条检查项`,
            data: data
        };
    } catch (error) {
        return {
            success: false,
            message: `导入失败：${error.message}`,
            error: error
        };
    }
}

// 初始化数据（如果主数据为空）
function initializeDataIfNeeded() {
    const dipData = JSON.parse(localStorage.getItem('dipLookupData') || '[]');
    const checklistData = JSON.parse(localStorage.getItem('checklistItems') || '[]');
    
    if (dipData.length === 0) {
        // 合并基础数据和扩展数据
        const allDIPData = getAllDIPData();
        localStorage.setItem('dipLookupData', JSON.stringify(allDIPData));
    }
    
    if (checklistData.length === 0) {
        // 从主文件重新加载检查清单
        if (typeof loadChecklistItems === 'function') {
            loadChecklistItems();
        }
    }
}

// 页面加载时初始化数据
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeDataIfNeeded, 1000);
});
