// DIP轻量工具包 - 主JavaScript文件

// 工具弹窗功能
let currentModalTool = null;

function openToolModal(toolName) {
    currentModalTool = toolName;
    
    // 设置弹窗标题
    const toolTitles = {
        'lookup': '预分组速查表',
        'checklist': '病案首页自检清单',
        'calculator': '费用偏离预警计算器',
        'achievement': '实践团成果展示'
    };
    
    const modalTitle = document.getElementById('tool-modal-title');
    if (modalTitle) {
        modalTitle.textContent = toolTitles[toolName] || toolName;
    }
    
    // 设置弹窗内容
    const modalBody = document.getElementById('tool-modal-body');
    if (modalBody) {
        // 根据工具名称加载不同的内容
        let content = '';
        
        if (toolName === 'lookup') {
            content = `
                <div class="search-box">
                    <input type="text" id="modal-disease-search" placeholder="输入疾病名称、ICD编码或关键词...">
                    <button onclick="searchDiseaseModal()"><i class="fas fa-search"></i> 搜索</button>
                </div>
                
                <div class="filter-options">
                    <select id="modal-department-filter">
                        <option value="">所有科室</option>
                        <option value="内科">内科</option>
                        <option value="外科">外科</option>
                        <option value="妇产科">妇产科</option>
                        <option value="儿科">儿科</option>
                        <option value="急诊科">急诊科</option>
                    </select>
                    <select id="modal-severity-filter">
                        <option value="">所有严重程度</option>
                        <option value="低">低</option>
                        <option value="中">中</option>
                        <option value="高">高</option>
                    </select>
                </div>
                
                <div class="results-container">
                    <div class="results-header">
                        <h3>常见DIP分组速查表</h3>
                        <span id="modal-result-count">共 0 条记录</span>
                    </div>
                    <div id="modal-lookup-results" class="results-list">
                        <!-- 搜索结果将动态显示在这里 -->
                    </div>
                </div>
            `;
        } else if (toolName === 'checklist') {
            content = `
                <div class="checklist-header">
                    <h3>病案首页质量自检清单</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="modal-checklist-progress" style="width: 0%"></div>
                        </div>
                        <span id="modal-progress-text">完成度: 0%</span>
                    </div>
                </div>
                
                <div class="checklist-container">
                    <div id="modal-checklist-items">
                        <!-- 检查项将动态生成 -->
                    </div>
                </div>
                
                <div class="checklist-summary">
                    <h4><i class="fas fa-chart-bar"></i> 检查结果汇总</h4>
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-label">总检查项</span>
                            <span class="stat-value" id="modal-total-items">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">已完成</span>
                            <span class="stat-value" id="modal-completed-items">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">存在问题</span>
                            <span class="stat-value" id="modal-problem-items">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">质量评分</span>
                            <span class="stat-value" id="modal-quality-score">0</span>
                        </div>
                    </div>
                    <button class="generate-report" onclick="generateReportModal()">
                        <i class="fas fa-file-pdf"></i> 生成检查报告
                    </button>
                </div>
            `;
        } else if (toolName === 'calculator') {
            content = `
                <div class="calculator-container">
                    <div class="input-section">
                        <h3>费用数据输入</h3>
                        <div class="input-group">
                            <label for="modal-dip-group">DIP分组编码</label>
                            <input type="text" id="modal-dip-group" placeholder="如: DIP001">
                        </div>
                        <div class="input-group">
                            <label for="modal-standard-cost">标准费用（元）</label>
                            <input type="number" id="modal-standard-cost" placeholder="请输入标准费用">
                        </div>
                        <div class="input-group">
                            <label for="modal-actual-cost">实际发生费用（元）</label>
                            <input type="number" id="modal-actual-cost" placeholder="请输入实际费用">
                        </div>
                        <div class="input-group">
                            <label for="modal-hospital-level">医院等级</label>
                            <select id="modal-hospital-level">
                                <option value="1">一级医院</option>
                                <option value="2" selected>二级医院</option>
                                <option value="3">三级医院</option>
                            </select>
                        </div>
                        <button class="calculate-btn" onclick="calculateDeviationModal()">
                            <i class="fas fa-calculator"></i> 计算偏离度
                        </button>
                    </div>
                    
                    <div class="result-section">
                        <h3>计算结果</h3>
                        <div class="result-card" id="modal-deviation-result">
                            <div class="result-header">
                                <i class="fas fa-chart-line"></i>
                                <h4>费用偏离分析</h4>
                            </div>
                            <div class="result-content">
                                <div class="result-item">
                                    <span>偏离度</span>
                                    <span id="modal-deviation-percent" class="result-value">--</span>
                                </div>
                                <div class="result-item">
                                    <span>偏离金额</span>
                                    <span id="modal-deviation-amount" class="result-value">--</span>
                                </div>
                                <div class="result-item">
                                    <span>预警等级</span>
                                    <span id="modal-warning-level" class="result-value">--</span>
                                </div>
                                <div class="result-item">
                                    <span>建议措施</span>
                                    <span id="modal-suggestion" class="result-value">--</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="warning-info">
                            <h4><i class="fas fa-exclamation-triangle"></i> 预警标准说明</h4>
                            <ul>
                                <li><span class="warning-low">绿色</span>: 偏离度 ≤ 10% (正常范围)</li>
                                <li><span class="warning-medium">黄色</span>: 10% < 偏离度 ≤ 20% (关注范围)</li>
                                <li><span class="warning-high">红色</span>: 偏离度 > 20% (预警范围)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        } else if (toolName === 'achievement') {
            content = `
                <div class="achievement-grid">
                    <div class="achievement-card">
                        <div class="achievement-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h4>成果一：慧读——NLP病历智能初筛器</h4>
                        <p>从"首页阅读器"升级为"全病历智能分析器"，识别高套低编等异常</p>
                        <div class="achievement-features">
                            <span><i class="fas fa-check"></i> 全病历分析</span>
                            <span><i class="fas fa-check"></i> 高套低编识别</span>
                            <span><i class="fas fa-check"></i> 智能标注</span>
                        </div>
                        <button class="achievement-btn" onclick="showAchievementDetails('nlp')">查看详情</button>
                    </div>
                    
                    <div class="achievement-card">
                        <div class="achievement-icon">
                            <i class="fas fa-sliders-h"></i>
                        </div>
                        <h4>成果二：慧审——DIP规则可视化引擎</h4>
                        <p>从"人工逐条录入"升级为"可视化拖拽配置"，月新增规则提升10倍</p>
                        <div class="achievement-features">
                            <span><i class="fas fa-check"></i> 拖拽配置</span>
                            <span><i class="fas fa-check"></i> 规则模板库</span>
                            <span><i class="fas fa-check"></i> 模拟测试</span>
                        </div>
                        <button class="achievement-btn" onclick="showAchievementDetails('rule')">查看详情</button>
                    </div>
                    
                    <div class="achievement-card">
                        <div class="achievement-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>成果三：慧管——三层递进管控体系</h4>
                        <p>从"提醒级"升级为"限制级"刚性管控，响应率从37%提升至95%+</p>
                        <div class="achievement-features">
                            <span><i class="fas fa-check"></i> 三层管控</span>
                            <span><i class="fas fa-check"></i> 实时看板</span>
                            <span><i class="fas fa-check"></i> 绩效联动</span>
                        </div>
                        <button class="achievement-btn" onclick="showAchievementDetails('control')">查看详情</button>
                    </div>
                    
                    <div class="achievement-card">
                        <div class="achievement-icon">
                            <i class="fas fa-laptop-medical"></i>
                        </div>
                        <h4>成果四：简行——离线版DIP轻量工具包</h4>
                        <p>为社区卫生中心设计零门槛、离线可用的DIP管理工具</p>
                        <div class="achievement-features">
                            <span><i class="fas fa-check"></i> 完全离线</span>
                            <span><i class="fas fa-check"></i> Excel工具</span>
                            <span><i class="fas fa-check"></i> 培训手册</span>
                        </div>
                        <button class="achievement-btn" onclick="showAchievementDetails('offline')">查看详情</button>
                    </div>
                </div>
            `;
        }
        
        modalBody.innerHTML = content;
        
        // 初始化工具
        if (toolName === 'lookup') {
            initLookupToolModal();
        } else if (toolName === 'checklist') {
            initChecklistToolModal();
        } else if (toolName === 'calculator') {
            initCalculatorToolModal();
        }
    }
    
    // 显示弹窗
    const modal = document.getElementById('tool-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeToolModal() {
    const modal = document.getElementById('tool-modal');
    if (modal) {
        modal.classList.remove('show');
    }
    currentModalTool = null;
}

// 四大中心跳转新页面功能
function openCenterPage(centerName) {
    // 创建新页面URL
    const pageNames = {
        'data-center': 'data-center.html',
        'quality-center': 'quality-center.html',
        'application-center': 'application-center.html',
        'audit-center': 'audit-center.html'
    };
    
    const pageName = pageNames[centerName];
    if (pageName) {
        // 在实际应用中，这里应该跳转到对应的页面
        // 由于我们是在单页面应用中，这里使用alert模拟跳转
        const centerTitles = {
            'data-center': '全院一库数据中心',
            'quality-center': '数据质量控制中心',
            'application-center': '医保数据应用中心',
            'audit-center': '医保智能审核中心'
        };
        
        // 真正跳转到新页面
        window.open(pageName, '_blank');
    }
}

// 工具切换功能（保留原有功能，用于其他页面）
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
            'offline': '简行——离线版DIP轻量工具包',
            'data-center': '全院一库数据中心',
            'quality-center': '数据质量控制中心',
            'application-center': '医保数据应用中心',
            'audit-center': '医保智能审核中心',
            'achievement': '实践团成果展示'
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
        } else if (toolName === 'data-center') {
            initDataCenterTool();
        } else if (toolName === 'quality-center') {
            initQualityCenterTool();
        } else if (toolName === 'application-center') {
            initApplicationCenterTool();
        } else if (toolName === 'audit-center') {
            initAuditCenterTool();
        } else if (toolName === 'achievement') {
            initAchievementTool();
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
    
    // 初始化工具弹窗点击关闭
    const toolModal = document.getElementById('tool-modal');
    if (toolModal) {
        toolModal.addEventListener('click', function(e) {
            if (e.target === toolModal) {
                closeToolModal();
            }
        });
    }
    
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

// 四大中心功能实现

// 1. 全院一库数据中心功能
function initDataCenterTool() {
    console.log('全院一库数据中心已初始化');
    
    // 加载数据中心数据
    loadDataCenterData();
    
    // 绑定数据采集按钮事件
    const dataCollectionBtn = document.querySelector('#data-center-content .data-collection-btn');
    if (dataCollectionBtn) {
        dataCollectionBtn.addEventListener('click', startDataCollection);
    }
    
    // 绑定数据治理按钮事件
    const dataGovernanceBtn = document.querySelector('#data-center-content .data-governance-btn');
    if (dataGovernanceBtn) {
        dataGovernanceBtn.addEventListener('click', startDataGovernance);
    }
    
    // 绑定NLP处理按钮事件
    const nlpProcessBtn = document.querySelector('#data-center-content .nlp-process-btn');
    if (nlpProcessBtn) {
        nlpProcessBtn.addEventListener('click', startNLPProcessing);
    }
}

function loadDataCenterData() {
    // 数据中心示例数据
    const dataCenterData = {
        dataSources: [
            { name: 'HIS系统', status: '正常', lastSync: '2025-02-23 08:00:00', records: 12543 },
            { name: 'EMR系统', status: '正常', lastSync: '2025-02-23 08:05:00', records: 8921 },
            { name: '病案系统', status: '正常', lastSync: '2025-02-23 08:10:00', records: 6543 },
            { name: '检验系统', status: '正常', lastSync: '2025-02-23 08:15:00', records: 23456 }
        ],
        campuses: [
            { name: '总院', status: '在线', patients: 1256, beds: 800, utilization: '85%' },
            { name: '东院区', status: '在线', patients: 543, beds: 300, utilization: '72%' },
            { name: '西院区', status: '在线', patients: 321, beds: 200, utilization: '65%' }
        ],
        dataQuality: {
            accuracy: '98.5%',
            completeness: '96.2%',
            timeliness: '99.1%',
            consistency: '97.8%'
        }
    };
    
    localStorage.setItem('dataCenterData', JSON.stringify(dataCenterData));
}

function startDataCollection() {
    alert('开始数据采集...\n\n采集任务已启动，预计需要5-10分钟完成。\n采集过程中系统将继续正常运行。');
    
    // 模拟数据采集进度
    simulateProgress('data-collection-progress', '数据采集进度');
}

function startDataGovernance() {
    alert('开始数据治理...\n\n数据治理包括：\n1. 数据清洗\n2. 数据标准化\n3. 数据质量检查\n4. 数据建模\n\n预计需要15-20分钟完成。');
    
    // 模拟数据治理进度
    simulateProgress('data-governance-progress', '数据治理进度');
}

function startNLPProcessing() {
    const medicalText = prompt('请输入需要处理的医疗文书文本：', '患者因腰痛入院，行腰椎间盘髓核摘除术，术程顺利。术后恢复良好。');
    
    if (medicalText) {
        alert(`开始NLP处理...\n\n输入文本：${medicalText}\n\n处理内容：\n1. 自动分段分句\n2. 医学实体识别\n3. 语义关系抽取\n4. 异常检测\n\n预计需要3-5秒完成。`);
        
        // 模拟NLP处理结果
        setTimeout(() => {
            const nlpResult = `NLP处理结果：
            
1. 自动分段结果：
   - 入院情况：患者因腰痛入院
   - 诊疗经过：行腰椎间盘髓核摘除术，术程顺利
   - 出院情况：术后恢复良好

2. 医学实体识别：
   - 诊断：腰痛
   - 手术：腰椎间盘髓核摘除术
   - 结果：顺利、恢复良好

3. 语义关系：
   - 手术与诊断：治疗关系
   - 手术与结果：因果关系

4. 异常检测：
   - 未发现高套低编风险
   - 病历记录完整规范`;
            
            alert(nlpResult);
        }, 3000);
    }
}

function simulateProgress(progressBarId, progressName) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            alert(`${progressName}完成！`);
        }
        
        const progressBar = document.getElementById(progressBarId);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }
    }, 500);
}

// 2. 数据质量控制中心功能
function initQualityCenterTool() {
    console.log('数据质量控制中心已初始化');
    
    // 加载质控数据
    loadQualityCenterData();
    
    // 绑定病案质控按钮事件
    const medicalRecordBtn = document.querySelector('#quality-center-content .medical-record-btn');
    if (medicalRecordBtn) {
        medicalRecordBtn.addEventListener('click', startMedicalRecordQC);
    }
    
    // 绑定清单质控按钮事件
    const settlementListBtn = document.querySelector('#quality-center-content .settlement-list-btn');
    if (settlementListBtn) {
        settlementListBtn.addEventListener('click', startSettlementListQC);
    }
    
    // 绑定入组分析按钮事件
    const groupingAnalysisBtn = document.querySelector('#quality-center-content .grouping-analysis-btn');
    if (groupingAnalysisBtn) {
        groupingAnalysisBtn.addEventListener('click', startGroupingAnalysis);
    }
}

function loadQualityCenterData() {
    // 质控中心示例数据
    const qualityCenterData = {
        medicalRecords: {
            total: 12543,
            checked: 8921,
            problems: 654,
            accuracy: '94.8%'
        },
        settlementLists: {
            total: 8921,
            checked: 6543,
            problems: 321,
            accuracy: '96.4%'
        },
        groupingResults: {
            dipGroups: 234,
            drgGroups: 189,
            ungrouped: 56,
            groupingRate: '97.6%'
        },
        qualityScores: {
            excellent: 6543,
            qualified: 4321,
            unqualified: 123,
            averageScore: '92.5'
        }
    };
    
    localStorage.setItem('qualityCenterData', JSON.stringify(qualityCenterData));
}

function startMedicalRecordQC() {
    alert('开始病案首页质控...\n\n质控内容包括：\n1. 基本信息完整性检查\n2. 诊断编码准确性检查\n3. 手术操作规范性检查\n4. 费用合理性检查\n\n预计需要2-3分钟完成。');
    
    // 模拟质控进度
    simulateProgress('medical-record-qc-progress', '病案首页质控');
}

function startSettlementListQC() {
    alert('开始医保结算清单质控...\n\n质控内容包括：\n1. 清单数据完整性检查\n2. 医保编码转码检查\n3. 费用项目合规性检查\n4. 分组预判准确性检查\n\n预计需要3-5分钟完成。');
    
    // 模拟质控进度
    simulateProgress('settlement-list-qc-progress', '医保结算清单质控');
}

function startGroupingAnalysis() {
    alert('开始入组分析...\n\n分析内容包括：\n1. DIP入组分布分析\n2. 未入组病例原因分析\n3. 高低倍率病例识别\n4. 风险病例筛查\n\n预计需要1-2分钟完成。');
    
    // 模拟分析结果
    setTimeout(() => {
        const analysisResult = `入组分析结果：
        
1. DIP入组分布：
   - 成功入组：12,321例 (98.2%)
   - 未入组：222例 (1.8%)

2. 未入组原因：
   - 诊断编码问题：123例 (55.4%)
   - 手术编码问题：56例 (25.2%)
   - 费用异常：43例 (19.4%)

3. 高低倍率病例：
   - 高倍率病例：234例 (1.9%)
   - 低倍率病例：123例 (1.0%)
   - 正常倍率：11,964例 (97.1%)

4. 风险病例：
   - 低风险死亡：12例
   - 费用极高：45例
   - 费用极低：34例`;
        
        alert(analysisResult);
    }, 2000);
}

// 3. 医保数据应用中心功能
function initApplicationCenterTool() {
    console.log('医保数据应用中心已初始化');
    
    // 加载应用中心数据
    loadApplicationCenterData();
    
    // 绑定医保助手按钮事件
    const medicalInsuranceBtn = document.querySelector('#application-center-content .medical-insurance-btn');
    if (medicalInsuranceBtn) {
        medicalInsuranceBtn.addEventListener('click', openMedicalInsuranceAssistant);
    }
    
    // 绑定指标分析按钮事件
    const indicatorAnalysisBtn = document.querySelector('#application-center-content .indicator-analysis-btn');
    if (indicatorAnalysisBtn) {
        indicatorAnalysisBtn.addEventListener('click', startIndicatorAnalysis);
    }
    
    // 绑定运营报告按钮事件
    const operationReportBtn = document.querySelector('#application-center-content .operation-report-btn');
    if (operationReportBtn) {
        operationReportBtn.addEventListener('click', generateOperationReport);
    }
}

function loadApplicationCenterData() {
    // 应用中心示例数据
    const applicationCenterData = {
        medicalInsurance: {
            totalCost: 125430000,
            reimbursement: 89210000,
            selfPay: 36220000,
            reimbursementRate: '71.1%'
        },
        indicators: {
            cmi: 1.25,
            groupingRate: '97.6%',
            averageStay: 8.5,
            drugRatio: '28.5%',
            materialRatio: '15.2%'
        },
        operationAnalysis: {
            surplus: 1254300,
            deficit: -321000,
            breakEven: 933300,
            profitMargin: '8.7%'
        }
    };
    
    localStorage.setItem('applicationCenterData', JSON.stringify(applicationCenterData));
}

function openMedicalInsuranceAssistant() {
    const diagnosis = prompt('请输入诊断编码或名称：', 'I10 高血压病');
    const surgery = prompt('请输入手术编码或名称（如无则留空）：', '');
    
    if (diagnosis) {
        alert(`医保助手分析结果：
        
诊断：${diagnosis}
${surgery ? `手术：${surgery}` : '无手术操作'}

DIP预分组结果：
- 病组编码：DIP003
- 病组名称：高血压病
- 病组分值：0.8
- 标准费用：4,500元
- 费用倍率：正常范围

医保结算信息：
- 预计报销比例：75%
- 自付比例：25%
- 结算标准：按DIP分值结算

建议：
1. 确保诊断编码准确
2. 核对手术操作必要性
3. 控制费用在标准范围内`);
    }
}

function startIndicatorAnalysis() {
    alert('开始医保指标分析...\n\n分析维度：\n1. 全院指标分析\n2. 科室指标分析\n3. 医师指标分析\n4. 病组指标分析\n\n预计需要2-3分钟完成。');
    
    // 模拟分析结果
    setTimeout(() => {
        const analysisResult = `医保指标分析结果：
        
一、全院指标（本月）：
- CMI值：1.25 ↑0.05
- 入组率：97.6% ↑0.8%
- 平均住院日：8.5天 ↓0.3天
- 药占比：28.5% ↓1.2%
- 耗材占比：15.2% ↓0.8%

二、科室指标TOP3：
1. 心内科：结余 +125,300元
2. 骨科：结余 +98,700元  
3. 妇产科：结余 +76,500元

三、异常指标预警：
- 儿科：费用偏离度 +18.5% ⚠️
- 神内科：药占比 32.1% ⚠️
- 急诊科：再入院率 8.2% ⚠️

四、改进建议：
1. 加强儿科费用控制
2. 优化神内科用药方案
3. 降低急诊科再入院率`;
        
        alert(analysisResult);
    }, 3000);
}

function generateOperationReport() {
    const reportType = prompt('请选择报告类型：\n1. 全院运营报告\n2. 科室运营报告\n3. 病组运营报告\n4. 医师运营报告', '1');
    
    const reportTypes = {
        '1': '全院运营报告',
        '2': '科室运营报告', 
        '3': '病组运营报告',
        '4': '医师运营报告'
    };
    
    const selectedType = reportTypes[reportType] || '全院运营报告';
    
    alert(`正在生成${selectedType}...\n\n报告内容包括：\n1. 指标完成情况\n2. 主要原因分析\n3. 费用结构分析\n4. 重点问题识别\n5. 改进建议\n\n预计需要1-2分钟完成。`);
    
    // 模拟报告生成
    setTimeout(() => {
        const report = `${selectedType}
生成时间：${new Date().toLocaleString('zh-CN')}

一、指标完成情况
- 收入指标：完成98.5%
- 成本指标：控制在预算内
- 质量指标：达标率96.2%
- 效率指标：完成率94.8%

二、主要原因分析
1. 优势因素：
   - 临床路径执行规范
   - 费用控制措施有效
   - 医疗质量持续改进

2. 待改进因素：
   - 部分科室费用偏离
   - 个别病组入组异常
   - 少数医师质控得分偏低

三、费用结构分析
- 药品费用：28.5% (目标≤30%)
- 耗材费用：15.2% (目标≤18%)
- 检查费用：12.3% (目标≤15%)
- 治疗费用：44.0% (目标≥40%)

四、重点问题识别
1. 高倍率病例：234例 (需重点监控)
2. 未入组病例：222例 (需编码改进)
3. 质控不合格：123例 (需培训提升)

五、改进建议
1. 加强高值耗材管理
2. 优化临床路径
3. 提升编码准确性
4. 强化医师培训`;
        
        alert(report);
    }, 2000);
}

// 4. 医保智能审核中心功能
function initAuditCenterTool() {
    console.log('医保智能审核中心已初始化');
    
    // 加载审核中心数据
    loadAuditCenterData();
    
    // 绑定门诊审核按钮事件
    const outpatientAuditBtn = document.querySelector('#audit-center-content .outpatient-audit-btn');
    if (outpatientAuditBtn) {
        outpatientAuditBtn.addEventListener('click', startOutpatientAudit);
    }
    
    // 绑定住院审核按钮事件
    const inpatientAuditBtn = document.querySelector('#audit-center-content .inpatient-audit-btn');
    if (inpatientAuditBtn) {
        inpatientAuditBtn.addEventListener('click', startInpatientAudit);
    }
    
    // 绑定护士审核按钮事件
    const nurseAuditBtn = document.querySelector('#audit-center-content .nurse-audit-btn');
    if (nurseAuditBtn) {
        nurseAuditBtn.addEventListener('click', startNurseAudit);
    }
    
    // 绑定大数据分析按钮事件
    const bigDataAnalysisBtn = document.querySelector('#audit-center-content .big-data-analysis-btn');
    if (bigDataAnalysisBtn) {
        bigDataAnalysisBtn.addEventListener('click', startBigDataAnalysis);
    }
}

function loadAuditCenterData() {
    // 审核中心示例数据
    const auditCenterData = {
        outpatientAudit: {
            totalPrescriptions: 12543,
            problemPrescriptions: 654,
            problemRate: '5.2%',
            commonProblems: ['特病处方超量', '诊断医嘱不符', '药品超限']
        },
        inpatientAudit: {
            totalCases: 8921,
            problemCases: 321,
            problemRate: '3.6%',
            commonProblems: ['费用超标', '用药不合理', '检查过多']
        },
        nurseAudit: {
            totalOrders: 23456,
            problemOrders: 1234,
            problemRate: '5.3%',
            commonProblems: ['医嘱超量', '疗程过长', '总金额超标']
        },
        bigDataAnalysis: {
            violationTrend: '下降趋势',
            topViolationDept: '心内科',
            topViolationDoctor: '张医生',
            commonViolationType: '费用超标'
        }
    };
    
    localStorage.setItem('auditCenterData', JSON.stringify(auditCenterData));
}

function startOutpatientAudit() {
    alert('开始门诊医生工作站审核...\n\n审核内容包括：\n1. 特病处方超量检查\n2. 月处方不能超过31天用量\n3. 年处方不能超过365天用量\n4. 诊断医嘱符合性检查\n\n预计需要1-2分钟完成。');
    
    // 模拟审核进度
    simulateProgress('outpatient-audit-progress', '门诊审核');
    
    // 模拟审核结果
    setTimeout(() => {
        const auditResult = `门诊审核结果：
        
一、门诊智能审核规则知识库检查：
1. 门诊特病限制：检查通过
2. 门诊单项费用门诊生育累计：检查通过
3. 门诊开立总量限制：发现3例超量
4. 门诊开立间隔限制：检查通过
5. 门诊季度最大用量限制：发现2例超限
6. 门诊开立天数限制：检查通过
7. 门诊累计天数限制：发现1例超限
8. 门诊适应症限制：检查通过

二、审核统计：
- 总处方数：1,254张
- 问题处方：6张（0.48%）
- 主要问题：开立总量超限、季度用量超限

三、问题处方明细：
1. 处方号：20250223001，问题：抗生素开立总量超限
2. 处方号：20250223002，问题：降压药季度用量超限
3. 处方号：20250223003，问题：降糖药开立总量超限

四、改进建议：
1. 加强门诊处方总量控制
2. 建立季度用药量预警机制
3. 完善适应症审核规则`;
        
        alert(auditResult);
    }, 2000);
}

function startInpatientAudit() {
    alert('开始住院医生工作站审核...\n\n审核内容包括：\n1. 医院等级权限检查\n2. 职称级别权限检查\n3. 险种类别检查\n4. 性别年龄合理性检查\n5. 单次用量频率检查\n\n预计需要2-3分钟完成。');
    
    // 模拟审核进度
    simulateProgress('inpatient-audit-progress', '住院审核');
    
    // 模拟审核结果
    setTimeout(() => {
        const auditResult = `住院审核结果：
        
一、住院智能审核规则知识库检查：
1. 医院等级权限检查：检查通过
2. 职称级别权限检查：发现2例越级开药
3. 险种类别检查：检查通过
4. 性别年龄合理性检查：发现1例年龄诊断不符
5. 单次用量频率检查：发现3例用量超限
6. 日最大用量检查：发现2例超限
7. 日最大金额检查：发现1例超限
8. 特殊人群检查（儿童/孕妇/老人）：检查通过

二、诊断、费用、医嘱、病历符合性检查：
1. 使用前提检查：发现5例缺少必要检查
2. 排斥项目检查：发现3例用药冲突
3. 禁忌症检查：发现2例禁忌用药
4. 适应症检查：检查通过
5. 病历类型检查：检查通过
6. 临床表现检查：发现4例描述不完整
7. 病历描述检查：检查通过
8. 同类项目检查：发现2例重复检查
9. 同一小分类检查：检查通过
10. 病历时限检查：发现3例记录不及时

三、限制药品合理性检查：
1. 抗生素分级管理：发现8例越级使用
2. 麻醉药品管理：检查通过
3. 精神药品管理：发现2例用量超限
4. 高值药品管理：发现5例使用不合理

四、审核统计：
- 总医嘱数：8,921条
- 问题医嘱：45条（0.50%）
- 主要问题：越级开药、用量超限、用药冲突

五、改进建议：
1. 加强医师权限管理
2. 完善用药合理性审核
3. 强化病历书写规范
4. 建立药品分级管理制度`;
        
        alert(auditResult);
    }, 3000);
}

function startNurseAudit() {
    alert('开始住院护士工作站审核...\n\n审核内容包括：\n1. 医嘱总量检查\n2. 总金额检查\n3. 疗程合理性检查\n4. 用药频率检查\n\n预计需要1-2分钟完成。');
    
    // 模拟审核进度
    simulateProgress('nurse-audit-progress', '护士审核');
    
    // 模拟审核结果
    setTimeout(() => {
        const auditResult = `护士审核结果：
        
一、护士工作站智能审核规则检查：
1. 医嘱总量检查：发现12例总量超标
2. 总金额检查：发现8例金额超标
3. 疗程合理性检查：发现15例疗程过长
4. 用药频率检查：发现6例频率不当
5. 药品配伍禁忌检查：发现3例配伍禁忌
6. 输液速度检查：发现5例速度不当
7. 给药途径检查：发现2例途径错误
8. 用药时间检查：发现7例时间错误

二、特殊药品管理检查：
1. 高危药品管理：发现4例管理不规范
2. 冷藏药品管理：发现3例温度控制不当
3. 毒麻药品管理：检查通过
4. 精神药品管理：发现2例记录不完整

三、护理操作规范检查：
1. 无菌操作规范：发现8例不规范
2. 消毒隔离制度：发现5例执行不到位
3. 护理记录规范：发现12例记录不完整
4. 交接班制度：发现6例交接不清

四、审核统计：
- 总医嘱数：23,456条
- 问题医嘱：84条（0.36%）
- 主要问题：疗程过长、记录不完整、操作不规范

五、问题医嘱明细：
1. 医嘱号：N20250223001，问题：抗生素疗程过长（14天）
2. 医嘱号：N20250223002，问题：输液速度过快
3. 医嘱号：N20250223003，问题：高危药品管理不规范

六、改进建议：
1. 加强护士培训，提高操作规范性
2. 完善护理记录制度，确保记录完整
3. 建立药品管理责任制
4. 强化交接班管理，避免信息遗漏`;
        
        alert(auditResult);
    }, 2500);
}

function startBigDataAnalysis() {
    alert('开始医保大数据分析...\n\n分析内容包括：\n1. 违规趋势分析\n2. 科室违规排名\n3. 医生违规排名\n4. 违规规则占比\n5. 违规项目排行\n\n预计需要3-5分钟完成。');
    
    // 模拟分析结果
    setTimeout(() => {
        const analysisResult = `医保大数据分析结果：
        
一、违规趋势分析（近6个月）：
- 1月：违规率 6.2%
- 2月：违规率 5.8%
- 3月：违规率 5.5%
- 4月：违规率 5.1%
- 5月：违规率 4.8%
- 6月：违规率 4.5%
趋势：持续下降 📉

二、科室违规排名：
1. 心内科：违规 123例
2. 骨科：违规 98例
3. 神内科：违规 76例
4. 儿科：违规 65例
5. 急诊科：违规 54例

三、医生违规排名：
1. 张医生：违规 23例
2. 李医生：违规 18例
3. 王医生：违规 15例
4. 赵医生：违规 12例
5. 刘医生：违规 10例

四、违规规则占比：
- 费用超标：45.2%
- 用药不合理：28.5%
- 检查过多：15.3%
- 其他：11.0%

五、违规项目排行：
1. 高值耗材使用：234例
2. 抗生素滥用：189例
3. 检查项目重复：156例
4. 住院天数过长：123例

改进建议：
1. 加强高值耗材管理
2. 规范抗生素使用
3. 优化检查项目
4. 控制住院天数`;
        
        alert(analysisResult);
    }, 4000);
}

// 5. 实践团成果展示功能
function initAchievementTool() {
    console.log('实践团成果展示已初始化');
    
    // 绑定成果展示按钮事件
    const achievementBtns = document.querySelectorAll('#achievement-content .achievement-btn');
    achievementBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const achievementName = this.getAttribute('data-achievement');
            showAchievementDetails(achievementName);
        });
    });
}

function showAchievementDetails(achievementName) {
    const achievements = {
        'nlp': {
            name: '慧读——NLP病历智能初筛器',
            description: '从"首页阅读器"升级为"全病历智能分析器"，识别高套低编等异常',
            features: ['全病历分析', '高套低编识别', '智能标注', '异常检测'],
            impact: '编码准确率提升25%，审核效率提升3倍'
        },
        'rule': {
            name: '慧审——DIP规则可视化引擎',
            description: '从"人工逐条录入"升级为"可视化拖拽配置"，月新增规则提升10倍',
            features: ['拖拽配置', '规则模板库', '模拟测试', '可视化界面'],
            impact: '规则配置效率提升10倍，维护成本降低80%'
        },
        'control': {
            name: '慧管——三层递进管控体系',
            description: '从"提醒级"升级为"限制级"刚性管控，响应率从37%提升至95%+',
            features: ['三层管控', '实时看板', '绩效联动', '刚性拦截'],
            impact: '问题响应率从37%提升至95%，违规率下降60%'
        },
        'offline': {
            name: '简行——离线版DIP轻量工具包',
            description: '为社区卫生中心设计零门槛、离线可用的DIP管理工具',
            features: ['完全离线', 'Excel工具', '培训手册', '零门槛使用'],
            impact: '社区医院DIP适应周期从6个月缩短至1个月'
        }
    };
    
    const achievement = achievements[achievementName];
    if (achievement) {
        alert(`成果详情：${achievement.name}
        
描述：${achievement.description}

核心功能：
${achievement.features.map(feature => `• ${feature}`).join('\n')}

实施效果：
${achievement.impact}

应用场景：
1. 医院病案质控
2. 医保费用审核
3. 医疗质量管理
4. 基层医院培训

技术特点：
• 基于实际需求开发
• 注重用户体验
• 强调实用性和易用性
• 支持离线使用`);
    }
}
