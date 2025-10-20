// ===== 头脑风暴工具集模块 =====

let currentBrainstormOutput = '';

// ===== 初始化头脑风暴工具 =====
function initBrainstorm() {
    // 打开/关闭头脑风暴
    document.getElementById('openBrainstormBtn').addEventListener('click', () => {
        document.getElementById('brainstormModal').classList.add('active');
    });

    document.getElementById('closeBrainstormBtn').addEventListener('click', () => {
        document.getElementById('brainstormModal').classList.remove('active');
    });

    // Tab切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });

    // 各个生成器按钮
    document.getElementById('generateWorldBtn').addEventListener('click', generateWorld);
    document.getElementById('generateNameBtn').addEventListener('click', generateNames);
    document.getElementById('generateItemBtn').addEventListener('click', generateItem);
    document.getElementById('generateLocationBtn').addEventListener('click', generateLocation);
    document.getElementById('generatePlotBtn').addEventListener('click', generatePlot);
    document.getElementById('copyBrainstormBtn').addEventListener('click', copyBrainstormResult);
}

// ===== Tab切换 =====
function switchTab(tabName) {
    // 切换按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 切换内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// ===== 世界架构生成器 =====
async function generateWorld() {
    const worldType = document.getElementById('worldType').value;
    const concept = document.getElementById('worldConcept').value.trim();

    if (!concept) {
        alert('请输入核心设定');
        return;
    }

    showLoading('正在生成世界架构...');

    const prompt = `作为博哥，请为以下${worldType}小说设计完整的世界架构：

【核心设定】
${concept}

请生成详细的世界架构，包括：

## 一、地理环境
- 世界格局（大陆、海洋、特殊区域等）
- 主要区域划分
- 重要地标和地点

## 二、势力体系
- 主要势力/门派/组织（至少3-5个）
- 各势力的特点、实力、关系
- 势力分布和影响范围

## 三、等级/力量体系
- 力量等级划分（修为/等级/职业等）
- 每个等级的特点和能力
- 晋升条件和难度

## 四、社会规则
- 基本社会结构
- 重要规则和法则
- 常见习俗和文化

## 五、特殊设定
- 独特的世界法则
- 特殊能力或物品
- 神秘元素或传说

请确保设定完整、合理、有吸引力。`;

    try {
        const result = await callAIAPI(prompt, 3000);
        currentBrainstormOutput = result;
        document.getElementById('worldOutput').innerHTML = formatMarkdown(result);
        document.getElementById('copyBrainstormBtn').disabled = false;
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 取名工具 =====
async function generateNames() {
    const nameType = document.querySelector('input[name="nameType"]:checked').value;
    const style = document.getElementById('nameStyle').value;
    const description = document.getElementById('nameDescription').value.trim();
    const count = parseInt(document.getElementById('nameCount').value);

    if (!description) {
        alert('请输入相关描述');
        return;
    }

    showLoading('正在生成名称...');

    const typeNames = {
        character: '角色名',
        location: '地名',
        item: '物品名',
        skill: '技能/功法名'
    };

    const prompt = `作为博哥，请生成${count}个${style}风格的${typeNames[nameType]}：

【相关描述】
${description}

要求：
1. 名称要符合${style}风格
2. 名称要有意境和内涵
3. 朗朗上口，易于记忆
4. 每个名称后简要说明含义或特点

请以列表形式输出：

1. 名称 - 含义说明
2. ...`;

    try {
        const result = await callAIAPI(prompt, 1500);
        currentBrainstormOutput = result;
        document.getElementById('nameOutput').innerHTML = formatMarkdown(result);
        document.getElementById('copyBrainstormBtn').disabled = false;
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 物品设定生成器 =====
async function generateItem() {
    const itemType = document.getElementById('itemType').value;
    const concept = document.getElementById('itemConcept').value.trim();

    if (!concept) {
        alert('请输入核心特点');
        return;
    }

    showLoading('正在生成物品设定...');

    const prompt = `作为博哥，请为以下${itemType}设计完整的设定：

【核心特点】
${concept}

请生成详细的物品设定：

## 基本信息
- **名称**：（富有意境的名称）
- **类型**：${itemType}
- **等级/品质**：

## 外观描述
- 详细描述外观、材质、特殊标记

## 能力/效果
- 主要能力或效果
- 特殊功能
- 使用条件或限制

## 背景故事
- 来历和历史
- 与重要人物或事件的关联
- 相关传说

## 获取与使用
- 如何获得
- 使用方法
- 潜在风险或副作用

请确保设定丰富、有吸引力。`;

    try {
        const result = await callAIAPI(prompt, 2000);
        currentBrainstormOutput = result;
        document.getElementById('itemOutput').innerHTML = formatMarkdown(result);
        document.getElementById('copyBrainstormBtn').disabled = false;
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 地方设定生成器 =====
async function generateLocation() {
    const locationType = document.getElementById('locationType').value;
    const concept = document.getElementById('locationConcept').value.trim();

    if (!concept) {
        alert('请输入核心特点');
        return;
    }

    showLoading('正在生成地方设定...');

    const prompt = `作为博哥，请为以下${locationType}设计完整的设定：

【核心特点】
${concept}

请生成详细的地方设定：

## 基本信息
- **名称**：（富有特色的名称）
- **类型**：${locationType}
- **位置**：在世界中的位置

## 环境描述
- 地理环境和地貌特征
- 气候和自然条件
- 标志性建筑或景观

## 势力与人物
- 主要势力或统治者
- 重要人物
- 居民特点

## 特殊之处
- 独特的规则或传统
- 特殊资源或宝物
- 危险或机遇

## 历史背景
- 建立历史
- 重要事件
- 相关传说

## 在剧情中的作用
- 可能发生的情节
- 与主角的关联

请确保设定详细、有吸引力。`;

    try {
        const result = await callAIAPI(prompt, 2500);
        currentBrainstormOutput = result;
        document.getElementById('locationOutput').innerHTML = formatMarkdown(result);
        document.getElementById('copyBrainstormBtn').disabled = false;
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 剧情节点生成器 =====
async function generatePlot() {
    const current = document.getElementById('plotCurrent').value.trim();
    const direction = document.getElementById('plotDirection').value.trim();

    if (!current || !direction) {
        alert('请填写当前情况和期望方向');
        return;
    }

    showLoading('正在生成剧情节点...');

    const prompt = `作为博哥，请根据当前情况和期望方向，生成3-5个可选的剧情节点：

【当前情况】
${current}

【期望方向】
${direction}

请为每个剧情节点提供：

## 节点 1：（简短标题）
- **核心事件**：发生什么事
- **冲突点**：矛盾和张力
- **角色发展**：主角如何成长或改变
- **后续影响**：对后续剧情的影响
- **悬念设置**：留下什么悬念

## 节点 2：...

要求：
1. 节点之间有差异化，提供不同的发展可能
2. 符合人物性格和世界观设定
3. 有吸引力和可读性
4. 为后续情节留下空间

请生成完整的剧情节点建议。`;

    try {
        const result = await callAIAPI(prompt, 3000);
        currentBrainstormOutput = result;
        document.getElementById('plotOutput').innerHTML = formatMarkdown(result);
        document.getElementById('copyBrainstormBtn').disabled = false;
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 复制头脑风暴结果 =====
async function copyBrainstormResult() {
    try {
        await navigator.clipboard.writeText(currentBrainstormOutput);
        const btn = document.getElementById('copyBrainstormBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('复制失败，请手动选择文本复制');
    }
}

// 导出函数供全局使用
window.initBrainstorm = initBrainstorm;
