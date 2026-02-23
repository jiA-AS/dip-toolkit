// DIP轻量工具包 - 主JavaScript文件

// 工具切换功能
let currentTool = null;

function openTool(toolName) {
    // 隐藏所有工具内容
    document.querySelectorAll('.tool-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示返回按钮
    document.querySelector('.back-btn').style.display = 'flex';
    
    // 根据工具名称显示对应内容
    const toolContent = document.getElementById(`${toolName}-content`);
    if (toolContent) {
        toolContent.style.display = 'block';
        currentTool = toolName;
        
        // 更新标题
        const toolTitles = {
            'lookup': '预分组速查表',
            'checklist': '病案首页自检清单',
            'calculator': '费用偏离预警计算器',
            'report': 'DIP体检报告模板',
            'language': '医保土话清单',
            'rejection': '拒付逻辑速查表',
            'nlp': '慧读——NLP病历智能初筛器',
            'rule': '慧审——DIP规则可视化引擎',
            'control': '慧管——三层递进管控体系',
            'offline': '简行——离线版DIP轻量工具包'
        };
        document.getElementById('current-tool-title').textContent = toolTitles[toolName] || toolName;
        
        // 初始化工具
        if (toolName === 'lookup') {
            initLookupTool();
        } else if (toolName === 'checklist') {
            initChecklistTool();
        } else if (toolName === 'calculator') {
            initCalculatorTool();
        } else if (toolName === 'report') {
            initReportTool();
        } else if (toolName === 'language') {
            initLanguageTool();
        } else if (toolName === 'rejection') {
            initRejectionTool();
        } else if (toolName === 'nlp') {
            initNlpTool();
        } else if (toolName === 'rule') {
            initRuleTool();
        } else if (toolName === 'control') {
            initControlTool();
        } else if (toolName === 'offline') {
            initOfflineTool();
        }
    }
}

function closeTool() {
    // 隐藏所有工具内容
    document.querySelectorAll('.tool-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 隐藏返回按钮
    document.querySelector('.back-btn').style.display = 'none';
    
    // 重置标题
    document.getElementById('current-tool-title').textContent = '请选择一个工具开始使用';
    currentTool = null;
}

// 预分组速查表功能
function initLookupTool() {
    // 加载示例数据
    loadLookupData();
    
    // 绑定搜索事件
    document.getElementById('disease-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDisease();
        }
    });
    
    // 绑定筛选事件
    document.getElementById('department-filter').addEventListener('change', searchDisease);
    document.getElementById('severity-filter').addEventListener('change', searchDisease);
}

function loadLookupData() {
    // 示例DIP分组数据
    const dipData = [
        {
            id: 1,
            disease: '社区获得性肺炎',
            icd10: 'J18.9',
            dipCode: 'DIP001',
            department: '内科',
            severity: '中',
            score: 1.2,
            standardCost: 8500,
            description: '无并发症的社区获得性肺炎，需住院治疗'
        },
        {
            id: 2,
            disease: '急性阑尾炎',
            icd10: 'K35.9',
            dipCode: 'DIP002',
            department: '外科',
            severity: '中',
            score: 1.5,
            standardCost: 12000,
            description: '急性阑尾炎，需手术治疗'
        },
        {
            id: 3,
            disease: '高血压病',
            icd10: 'I10',
            dipCode: 'DIP003',
            department: '内科',
            severity: '低',
            score: 0.8,
            standardCost: 4500,
            description: '原发性高血压，无严重并发症'
        },
        {
            id: 4,
            disease: '糖尿病',
            icd10: 'E11.9',
            dipCode: 'DIP004',
            department: '内科',
            severity: '中',
            score: 1.1,
            standardCost: 6800,
            description: '2型糖尿病，需胰岛素治疗'
        },
        {
            id: 5,
            disease: '脑梗死',
            icd10: 'I63.9',
            dipCode: 'DIP005',
            department: '神经内科',
            severity: '高',
            score: 2.3,
            standardCost: 18500,
            description: '急性脑梗死，需溶栓治疗'
        },
        {
            id: 6,
            disease: '骨折',
            icd10: 'S82.9',
            dipCode: 'DIP006',
            department: '骨科',
            severity: '高',
            score: 2.0,
            standardCost: 15000,
            description: '四肢骨折，需手术治疗'
        },
        {
            id: 7,
            disease: '慢性阻塞性肺疾病',
            icd10: 'J44.9',
            dipCode: 'DIP007',
            department: '呼吸内科',
            severity: '中',
            score: 1.4,
            standardCost: 9200,
            description: 'COPD急性加重期'
        },
        {
            id: 8,
            disease: '冠心病',
            icd10: 'I25.1',
            dipCode: 'DIP008',
            department: '心内科',
            severity: '高',
            score: 1.8,
            standardCost: 13500,
            description: '冠状动脉粥样硬化性心脏病'
        }
    ];
    
    // 保存到本地存储
    localStorage.setItem('dipLookupData', JSON.stringify(dipData));
}

function searchDisease() {
    const searchTerm = document.getElementById('disease-search').value.toLowerCase();
    const departmentFilter = document.getElementById('department-filter').value;
    const severityFilter = document.getElementById('severity-filter').value;
    
    // 从本地存储获取数据
    const dipData = JSON.parse(localStorage.getItem('dipLookupData') || '[]');
    
    // 筛选数据
    let filteredData = dipData.filter(item => {
        const matchesSearch = !searchTerm || 
            item.disease.toLowerCase().includes(searchTerm) ||
            item.icd10.toLowerCase().includes(searchTerm) ||
            item.dipCode.toLowerCase().includes(searchTerm);
        
        const matchesDepartment = !departmentFilter || item.department === departmentFilter;
        const matchesSeverity = !severityFilter || item.severity === severityFilter;
        
        return matchesSearch && matchesDepartment && matchesSeverity;
    });
    
    // 显示结果
    displaySearchResults(filteredData);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('lookup-results');
    const resultCount = document.getElementById('result-count');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="result-item"><p>未找到匹配的记录</p></div>';
        resultCount.textContent = '共 0 条记录';
        return;
    }
    
    let html = '';
    results.forEach(item => {
        html += `
            <div class="result-item" onclick="showDiseaseDetails(${item.id})">
                <h4>${item.disease} (${item.icd10})</h4>
                <p><strong>DIP编码:</strong> ${item.dipCode} | <strong>科室:</strong> ${item.department} | <strong>严重程度:</strong> ${item.severity}</p>
                <p><strong>分值:</strong> ${item.score} | <strong>标准费用:</strong> ${item.standardCost.toLocaleString()}元</p>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
    resultCount.textContent = `共 ${results.length} 条记录`;
}

function showDiseaseDetails(id) {
    const dipData = JSON.parse(localStorage.getItem('dipLookupData') || '[]');
    const disease = dipData.find(item => item.id === id);
    
    if (disease) {
        alert(`疾病详情：
疾病名称: ${disease.disease}
ICD-10编码: ${disease.icd10}
DIP分组编码: ${disease.dipCode}
所属科室: ${disease.department}
严重程度: ${disease.severity}
DIP分值: ${disease.score}
标准费用: ${disease.standardCost.toLocaleString()}元
疾病描述: ${disease.description}

注意事项:
1. 请确保诊断编码准确
2. 核对入组条件
3. 注意并发症处理`);
    }
}

// 病案首页自检清单功能
function initChecklistTool() {
    // 加载检查清单
    loadChecklistItems();
    
    // 初始化进度
    updateChecklistProgress();
}

function loadChecklistItems() {
    // 病案首页检查项
    const checklistItems = [
        { id: 1, text: '患者基本信息完整（姓名、性别、年龄、身份证号）', category: '基本信息', checked: false },
        { id: 2, text: '入院诊断填写规范，使用标准诊断名称', category: '诊断信息', checked: false },
        { id: 3, text: '出院诊断填写完整，包括主要诊断和次要诊断', category: '诊断信息', checked: false },
        { id: 4, text: '手术及操作名称填写规范，有对应ICD-9-CM-3编码', category: '手术信息', checked: false },
        { id: 5, text: '入院病情评估完整（危、急、一般）', category: '病情评估', checked: false },
        { id: 6, text: '住院天数计算准确', category: '时间信息', checked: false },
        { id: 7, text: '费用分类填写完整（药品费、检查费、治疗费等）', category: '费用信息', checked: false },
        { id: 8, text: '离院方式填写正确（医嘱离院、非医嘱离院等）', category: '出院信息', checked: false },
        { id: 9, text: '抢救次数及成功次数填写准确', category: '抢救信息', checked: false },
        { id: 10, text: '有无药物过敏标识明确', category: '安全信息', checked: false },
        { id: 11, text: '血型及Rh因子填写完整', category: '检验信息', checked: false },
        { id: 12, text: '病理诊断结果填写（如有）', category: '病理信息', checked: false },
        { id: 13, text: '损伤中毒外部原因填写（如有）', category: '外部原因', checked: false },
        { id: 14, text: '诊断符合情况填写完整', category: '质量信息', checked: false },
        { id: 15, text: '科主任、主治医师、住院医师签名完整', category: '签名信息', checked: false }
    ];
    
    // 保存到本地存储
    localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
    
    // 显示检查项
    displayChecklistItems(checklistItems);
}

function displayChecklistItems(items) {
    const container = document.getElementById('checklist-items');
    let html = '';
    
    items.forEach(item => {
        html += `
            <div class="checklist-item">
                <input type="checkbox" id="check-${item.id}" ${item.checked ? 'checked' : ''} onchange="toggleChecklistItem(${item.id})">
                <label for="check-${item.id}">${item.text} <span class="item-category">${item.category}</span></label>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function toggleChecklistItem(id) {
    const items = JSON.parse(localStorage.getItem('checklistItems') || '[]');
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        items[itemIndex].checked = !items[itemIndex].checked;
        localStorage.setItem('checklistItems', JSON.stringify(items));
        updateChecklistProgress();
    }
}

function updateChecklistProgress() {
    const items = JSON.parse(localStorage.getItem('checklistItems') || '[]');
    const totalItems = items.length;
    const completedItems = items.filter(item => item.checked).length;
    const problemItems = Math.max(0, Math.floor(totalItems * 0.1) - completedItems); // 模拟问题项
    
    // 计算进度百分比
    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // 计算质量评分（满分100分）
    const qualityScore = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    // 更新UI
    document.getElementById('checklist-progress').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = `完成度: ${progressPercent}%`;
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('completed-items').textContent = completedItems;
    document.getElementById('problem-items').textContent = problemItems;
    document.getElementById('quality-score').textContent = qualityScore;
}

function generateReport() {
    const items = JSON.parse(localStorage.getItem('checklistItems') || '[]');
    const completedItems = items.filter(item => item.checked).length;
    const totalItems = items.length;
    const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    const report = `病案首页质量自检报告
生成时间: ${new Date().toLocaleString('zh-CN')}
检查项目总数: ${totalItems}
已完成项目: ${completedItems}
完成进度: ${progressPercent}%
质量评分: ${Math.round((completedItems / totalItems) * 100)}分

存在问题:
${items.filter(item => !item.checked).map(item => `- ${item.text} (${item.category})`).join('\n')}

改进建议:
1. 完善未完成项目的填写
2. 核对诊断编码的准确性
3. 确保所有必填字段完整
4. 检查签名是否齐全

注: 本报告仅供参考，请结合实际情况进行修改。`;
    
    alert(report);
}

// 费用偏离预警计算器功能
function initCalculatorTool() {
    // 设置默认值
    document.getElementById('standard-cost').value = 10000;
    document.getElementById('actual-cost').value = 11000;
    
    // 绑定计算事件
    document.getElementById('standard-cost').addEventListener('input', calculateDeviation);
    document.getElementById('actual-cost').addEventListener('input', calculateDeviation);
    document.getElementById('hospital-level').addEventListener('change', calculateDeviation);
}

function calculateDeviation() {
    const standardCost = parseFloat(document.getElementById('standard-cost').value) || 0;
    const actualCost = parseFloat(document.getElementById('actual-cost').value) || 0;
    const hospitalLevel = document.getElementById('hospital-level').value;
    
    if (standardCost <= 0 || actualCost <= 0) {
        resetCalculatorResults();
        return;
    }
    
    // 计算偏离度和偏离金额
    const deviationAmount = actualCost - standardCost;
    const deviationPercent = Math.abs((deviationAmount / standardCost) * 100);
    
    // 确定预警等级
    let warningLevel = '正常';
    let warningClass = 'warning-low';
    let suggestion = '费用在正常范围内，无需特别关注';
    
    if (deviationPercent > 20) {
        warningLevel = '高风险';
        warningClass = 'warning-high';
        suggestion = '费用偏离较大，建议进行病例评审，分析原因并采取控制措施';
    } else if (deviationPercent > 10) {
        warningLevel = '关注';
        warningClass = 'warning-medium';
        suggestion = '费用偏离需关注，建议分析费用构成，优化治疗方案';
    }
    
    // 根据医院等级调整建议
    if (hospitalLevel === '1') {
        suggestion += '（一级医院可适当放宽标准）';
    } else if (hospitalLevel === '3') {
        suggestion += '（三级医院应严格控制费用）';
    }
    
    // 更新UI
    document.getElementById('deviation-percent').textContent = `${deviationPercent.toFixed(2)}%`;
    document.getElementById('deviation-amount').textContent = `${deviationAmount.toLocaleString()}元`;
    document.getElementById('warning-level').textContent = warningLevel;
    document.getElementById('warning-level').className = `result-value ${warningClass}`;
    document.getElementById('suggestion').textContent = suggestion;
}

function resetCalculatorResults() {
    document.getElementById('deviation-percent').textContent = '--';
    document.getElementById('deviation-amount').textContent = '--';
    document.getElementById('warning-level').textContent = '--';
    document.getElementById('warning-level').className = 'result-value';
    document.getElementById('suggestion').textContent = '--';
}

// 通用功能
function showHelp() {
    document.getElementById('help-modal').classList.add('show');
}

function closeHelp() {
    document.getElementById('help-modal').classList.remove('show');
}

function exportData() {
    // 导出所有数据
    const data = {
        dipLookupData: JSON.parse(localStorage.getItem('dipLookupData') || '[]'),
        checklistItems: JSON.parse(localStorage.getItem('checklistItems') || '[]'),
        exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `DIP工具包数据_${new Date().toLocaleDateString('zh-CN')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('数据已导出为JSON文件');
}

function resetData() {
    if (confirm('确定要重置所有数据吗？这将清除所有已保存的检查记录和设置。')) {
        localStorage.clear();
        
        // 重新初始化数据
        if (currentTool === 'lookup') {
            loadLookupData();
            searchDisease();
        } else if (currentTool === 'checklist') {
            loadChecklistItems();
            updateChecklistProgress();
        } else if (currentTool === 'calculator') {
            initCalculatorTool();
        }
        
        alert('数据已重置');
    }
}

// DIP体检报告模板功能
function initReportTool() {
    // 初始化报告模板功能
    console.log('DIP体检报告模板已初始化');
}

function generateDepartmentReport() {
    const report = `科室分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、科室DIP执行情况概览
1. 内科: 平均费用偏离度 +12.5%
2. 外科: 平均费用偏离度 +8.2%
3. 妇产科: 平均费用偏离度 -3.1%
4. 儿科: 平均费用偏离度 +15.8%

二、优势科室识别
• 妇产科: 费用控制良好，低于标准费用
• 外科: 费用控制较好，接近标准费用

三、待改进科室
• 儿科: 费用偏离较大，需重点关注
• 内科: 费用偏离明显，需优化治疗方案

四、改进建议
1. 儿科: 加强高值耗材管理，优化用药方案
2. 内科: 建立费用预警机制，实时监控
3. 全院: 推广妇产科费用控制经验

注: 本报告基于示例数据生成，实际使用时请导入真实数据。`;
    
    alert(report);
}

function generateDiseaseGroupReport() {
    const report = `病组分析报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、高倍率病组识别
1. DIP005 (脑梗死): 偏离度 +35.2%
2. DIP006 (骨折): 偏离度 +28.7%
3. DIP008 (冠心病): 偏离度 +22.1%

二、低倍率病组识别
1. DIP003 (高血压病): 偏离度 -15.3%
2. DIP013 (白内障): 偏离度 -8.7%

三、异常原因分析
• 高倍率病组: 主要原因为高值耗材使用、住院天数偏长
• 低倍率病组: 主要原因为治疗方案优化、成本控制良好

四、优化建议
1. 建立高倍率病组专项管理
2. 制定标准化临床路径
3. 加强费用实时监控

注: 本报告基于示例数据生成，实际使用时请导入真实数据。`;
    
    alert(report);
}

function generateHighRateReport() {
    const report = `高倍率预警报告
生成时间: ${new Date().toLocaleString('zh-CN')}

一、高倍率病例筛查结果
共筛查病例: 156例
高倍率病例: 23例 (14.7%)
预警级别: 关注

二、高倍率病例分布
1. 脑梗死: 8例 (偏离度 > 30%)
2. 骨折: 7例 (偏离度 > 25%)
3. 冠心病: 5例 (偏离度 > 20%)
4. 其他: 3例 (偏离度 > 15%)

三、主要原因分析
1. 高值耗材使用不当: 12例 (52.2%)
2. 住院天数偏长: 8例 (34.8%)
3. 检查项目过多: 3例 (13.0%)

四、预防措施
1. 建立高值耗材使用审批制度
2. 优化临床路径，控制住院天数
3. 加强检查项目合理性评估

注: 本报告基于示例数据生成，实际使用时请导入真实数据。`;
    
    alert(report);
}

// 医保土话清单功能
function initLanguageTool() {
    // 初始化分类切换
    showCategory('dip');
}

function searchPolicy() {
    const searchTerm = document.getElementById('policy-search').value.toLowerCase();
    if (!searchTerm) {
        alert('请输入搜索关键词');
        return;
    }
    
    // 示例搜索逻辑
    const policies = [
        { term: 'DIP', explanation: '就像"套餐价"，不同病种有固定价格' },
        { term: '病种分值', explanation: '病的"价格标签"，复杂病价格高' },
        { term: '门诊统筹', explanation: '看门诊也能报销，有年度限额' },
        { term: '报销比例', explanation: '医保能给你报多少钱的比例' }
    ];
    
    const results = policies.filter(policy => 
        policy.term.toLowerCase().includes(searchTerm) || 
        policy.explanation.toLowerCase().includes(searchTerm)
    );
    
    if (results.length > 0) {
        let resultText = '搜索结果:\n\n';
        results.forEach((policy, index) => {
            resultText += `${index + 1}. ${policy.term}\n   解释: ${policy.explanation}\n\n`;
        });
        alert(resultText);
    } else {
        alert('未找到相关术语，请尝试其他关键词');
    }
}

function showCategory(categoryId) {
    // 隐藏所有分类内容
    document.querySelectorAll('.category-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有标签的active类
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 显示选中的分类内容
    const content = document.getElementById(`${categoryId}-category`);
    if (content) {
        content.classList.add('active');
    }
    
    // 激活对应的标签
    const tab = document.querySelector(`.category-tab[onclick*="${categoryId}"]`);
    if (tab) {
        tab.classList.add('active');
    }
}

// 拒付逻辑速查表功能
function initRejectionTool() {
    // 初始化筛选功能
    document.getElementById('rejection-type').addEventListener('change', filterRejections);
    document.getElementById('rejection-severity').addEventListener('change', filterRejections);
}

function filterRejections() {
    const type = document.getElementById('rejection-type').value;
    const severity = document.getElementById('rejection-severity').value;
    
    // 这里应该实现实际的筛选逻辑
    // 目前只是示例，实际使用时需要根据筛选条件显示不同的拒付项
    console.log(`筛选条件: 类型=${type}, 严重程度=${severity}`);
    
    // 显示筛选提示
    if (type || severity) {
        alert(`已筛选: ${type || '所有类型'} ${severity || '所有严重程度'}的拒付原因`);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化模态框
    const modal = document.getElementById('help-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close')) {
            closeHelp();
        }
    });
    
    // 点击模态框内容时不关闭
    document.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 初始化工具（如果有默认打开的工具）
    const urlParams = new URLSearchParams(window.location.search);
    const defaultTool = urlParams.get('tool');
    const allTools = ['lookup', 'checklist', 'calculator', 'report', 'language', 'rejection'];
    if (defaultTool && allTools.includes(defaultTool)) {
        openTool(defaultTool);
    }
    
    console.log('DIP轻量工具包已加载完成，欢迎使用！包含10个核心工具模块。');
});

// 成果一：慧读——NLP病历智能初筛器功能
function initNlpTool() {
    console.log('NLP病历智能初筛器已初始化');
    
    // 绑定分析按钮事件
    const analyzeBtn = document.querySelector('.demo-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeMedicalText);
    }
}

function analyzeMedicalText() {
    const medicalText = document.getElementById('medical-text').value;
    
    if (!medicalText.trim()) {
        alert('请输入病历文本');
        return;
    }
    
    // 模拟NLP分析结果
    const resultBox = document.getElementById('nlp-result');
    resultBox.innerHTML = `
        <div class="nlp-result-item">
            <h5>📋 病历分析结果</h5>
            <p><strong>识别到的手术：</strong>腰椎间盘髓核摘除术</p>
            <p><strong>手术权重：</strong>1.2（中等复杂度）</p>
            <p><strong>建议编码：</strong>80.51 椎间盘髓核摘除术</p>
        </div>
        <div class="nlp-result-item">
            <h5>⚠️ 异常检测</h5>
            <p><strong>检测结果：</strong>未发现高套低编风险</p>
            <p><strong>置信度：</strong>92%</p>
            <p><strong>建议：</strong>病历记录完整，编码准确</p>
        </div>
        <div class="nlp-result-item">
            <h5>📊 质量评估</h5>
            <p><strong>完整性评分：</strong>85/100</p>
            <p><strong>规范性评分：</strong>90/100</p>
            <p><strong>总体评价：</strong>良好</p>
        </div>
    `;
}

// 成果二：慧审——DIP规则可视化引擎功能
function initRuleTool() {
    console.log('DIP规则可视化引擎已初始化');
    
    // 绑定模板使用按钮事件
    document.querySelectorAll('.use-template').forEach(btn => {
        btn.addEventListener('click', function() {
            const templateName = this.parentElement.querySelector('h5').textContent;
            alert(`已应用模板：${templateName}\n\n现在可以在配置界面中修改参数。`);
        });
    });
    
    // 绑定测试按钮事件
    document.querySelectorAll('.test-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('正在导入测试病例...\n（演示模式：使用示例数据进行测试）');
        });
    });
    
    // 绑定保存按钮事件
    const saveBtn = document.querySelector('.action-btn.primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            alert('规则已保存！\n\n规则名称：慢性肾衰竭与急性肾衰竭鉴别规则\n规则ID：R-2025-0601\n状态：已启用');
        });
    }
}

// 成果三：慧管——三层递进管控体系功能
function initControlTool() {
    console.log('三层递进管控体系已初始化');
    
    // 模拟实时数据更新
    updateControlDashboard();
    
    // 设置定时更新
    setInterval(updateControlDashboard, 30000); // 每30秒更新一次
}

function updateControlDashboard() {
    // 模拟数据更新
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });
    
    // 更新高风险拦截数据
    const highRiskValue = Math.floor(Math.random() * 5) + 10; // 10-14之间的随机数
    document.querySelector('.stat-card.high .stat-value').textContent = `${highRiskValue}例`;
    document.querySelector('.stat-card.high .stat-change').textContent = `更新时间: ${timeStr}`;
    
    // 更新中风险数据
    const mediumRiskValue = Math.floor(Math.random() * 10) + 40; // 40-49之间的随机数
    const overdueCount = Math.floor(Math.random() * 3) + 4; // 4-6之间的随机数
    document.querySelector('.stat-card.medium .stat-value').textContent = `${mediumRiskValue}例`;
    document.querySelector('.stat-card.medium .stat-change').textContent = `超时${overdueCount}例⚠️`;
    
    // 更新低风险数据
    const lowRiskValue = Math.floor(Math.random() * 20) + 140; // 140-159之间的随机数
    const processedPercent = Math.floor(Math.random() * 20) + 60; // 60-79之间的随机数
    document.querySelector('.stat-card.low .stat-value').textContent = `${lowRiskValue}例`;
    document.querySelector('.stat-card.low .stat-change').textContent = `已处理${processedPercent}%`;
    
    // 更新倒计时列表
    updateCountdownList();
}

function updateCountdownList() {
    // 模拟倒计时更新
    const rows = document.querySelectorAll('.dashboard-list tbody tr');
    rows.forEach(row => {
        const timeCell = row.cells[3];
        if (timeCell && !timeCell.textContent.includes('已超时')) {
            // 随机减少一些时间
            const currentTime = timeCell.textContent;
            const [hours, minutes, seconds] = currentTime.split(':').map(Number);
            
            // 减少随机秒数（1-10秒）
            let newSeconds = seconds - Math.floor(Math.random() * 10) - 1;
            let newMinutes = minutes;
            let newHours = hours;
            
            if (newSeconds < 0) {
                newSeconds += 60;
                newMinutes -= 1;
            }
            
            if (newMinutes < 0) {
                newMinutes += 60;
                newHours -= 1;
            }
            
            if (newHours < 0) {
                timeCell.textContent = '⚠️已超时';
                timeCell.parentElement.classList.add('overdue');
            } else {
                timeCell.textContent = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
            }
        }
    });
}

// 成果四：简行——离线版DIP轻量工具包功能
function initOfflineTool() {
    console.log('离线版DIP轻量工具包已初始化');
    
    // 绑定下载按钮事件
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolName = this.parentElement.querySelector('h5').textContent;
            alert(`正在下载：${toolName}\n\n由于安全限制，浏览器无法直接下载文件。\n请右键点击链接选择"另存为"，或联系管理员获取完整工具包。`);
            
            // 创建模拟下载
            const data = {
                tool: toolName,
                downloadTime: new Date().toISOString(),
                version: '1.0.0'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', `${toolName}_配置信息.json`);
            linkElement.click();
        });
    });
}
