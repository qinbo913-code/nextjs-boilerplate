// ===== 全局变量 =====
let currentApiProvider = localStorage.getItem('api_provider') || 'claude';
let apiConfigs = {
    claude: {
        key: localStorage.getItem('claude_api_key') || '',
        model: localStorage.getItem('claude_model') || 'claude-3-5-sonnet-20250219'
    },
    gemini: {
        key: localStorage.getItem('gemini_api_key') || '',
        model: localStorage.getItem('gemini_model') || 'gemini-2.0-flash-exp'
    },
    kimi: {
        key: localStorage.getItem('kimi_api_key') || '',
        model: localStorage.getItem('kimi_model') || 'moonshot-v1-128k'
    },
    relay: {
        key: localStorage.getItem('relay_api_key') || 'sk-6RyydCKCE0KAWFvqhESbv4Ld5MfyGNInTfzsmTXimqdZuFRH',
        model: localStorage.getItem('relay_model') || 'claude-3-5-sonnet-20250219',
        url: 'https://code.wenwen-ai.com'
    }
};

let currentStep = 1;
let novelData = {
    settings: {},
    plan: '',
    characters: [],
    characterStats: {}, // 新增：角色数据统计
    outline: [],
    chapters: {}
};

// ===== 博哥角色系统提示词 =====
const BOGE_SYSTEM_PROMPT = `[角色]
你是博哥，一名享誉国际的作家，从事文学创作工作超过20年，发布过众多热销网络文学小说作品，累计阅读量突破50亿人次。擅长写科幻、穿越、架空、悬疑类小说。曾获得"星云奖"和"雨果奖"等多项国际科幻文学大奖。你的写作风格以细腻的心理描写和宏大的世界观构建而闻名。

[技能]
- 故事讲述能力：构思并讲述吸引人的故事，包括情节、设定和角色构建。
- 创意思维：具备丰富的想象力，创造独特、原创的内容。
- 字符和对话创建：创造立体角色和真实可信，真实情感的对话。
- 文学技巧和语言运用：良好的语言表达能力和文学手法的运用。
- 编辑和修订能力：有效编辑和改进作品的能力。

[总体规则]
- 使用粗体来表示重要内容。
- 不要压缩或者缩短你生成的小说内容。
- 严格按照流程执行提示词。
- 每一章节的创作内容必须超过3000中文字
- 语言: 中文。`;

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化PDF数据库
    try {
        await initPDF_DB();
        initReferenceLibrary();
    } catch (error) {
        console.error('PDF数据库初始化失败:', error);
    }

    // 初始化创意工具
    try {
        initCreativeTools();
    } catch (error) {
        console.error('创意工具初始化失败:', error);
    }

    // 初始化头脑风暴
    try {
        initBrainstorm();
    } catch (error) {
        console.error('头脑风暴初始化失败:', error);
    }

    // 初始化数据管理
    try {
        initDataManager();
    } catch (error) {
        console.error('数据管理初始化失败:', error);
    }

    // 检查API密钥
    if (!apiConfigs[currentApiProvider].key) {
        showApiModal();
    }

    // 绑定所有事件
    bindEvents();

    // 加载保存的进度
    loadProgress();
});

// ===== 事件绑定 =====
function bindEvents() {
    // API相关
    document.getElementById('apiProvider').addEventListener('change', switchApiProvider);
    document.getElementById('saveApiBtn').addEventListener('click', saveApiConfig);
    document.getElementById('testApiBtn').addEventListener('click', testApiConnection);
    document.getElementById('closeModalBtn').addEventListener('click', hideApiModal);
    document.querySelector('footer').addEventListener('dblclick', showApiModal);

    // 步骤1
    document.getElementById('step1NextBtn').addEventListener('click', generatePlan);
    document.getElementById('step1SaveBtn').addEventListener('click', saveStep1Settings);
    document.getElementById('step1ResetBtn').addEventListener('click', resetStep1);

    // 步骤2
    document.getElementById('step2BackBtn').addEventListener('click', () => goToStep(1));
    document.getElementById('step2SaveBtn').addEventListener('click', () => {
        savePlan();
        updateStepCompletionStatus();
    });
    document.getElementById('step2ConfirmBtn').addEventListener('click', confirmPlan);
    document.getElementById('step2RegenerateBtn').addEventListener('click', generatePlan);

    // 步骤3
    document.getElementById('step3BackBtn').addEventListener('click', () => goToStep(2));
    document.getElementById('step3SaveBtn').addEventListener('click', () => {
        saveCharacters();
        updateStepCompletionStatus();
    });
    document.getElementById('step3ConfirmBtn').addEventListener('click', confirmCharacters);
    document.getElementById('step3RegenerateBtn').addEventListener('click', generateCharacters);

    // 步骤4
    document.getElementById('step4BackBtn').addEventListener('click', () => goToStep(3));
    document.getElementById('step4SaveBtn').addEventListener('click', () => {
        saveOutline();
        updateStepCompletionStatus();
    });
    document.getElementById('step4ConfirmBtn').addEventListener('click', confirmOutline);
    document.getElementById('step4RegenerateBtn').addEventListener('click', generateOutline);

    // 步骤5
    document.getElementById('step5BackBtn').addEventListener('click', () => goToStep(4));
    document.getElementById('writeChapterBtn').addEventListener('click', writeSelectedChapter);
    document.getElementById('viewContextBtn').addEventListener('click', viewChapterContext);
    document.getElementById('suggestDirectionBtn').addEventListener('click', suggestWritingDirection);
    document.getElementById('continueBtn').addEventListener('click', continueNextChapter);
    document.getElementById('expandChapterBtn').addEventListener('click', expandChapter);
    document.getElementById('copyChapterBtn').addEventListener('click', copyChapter);
    document.getElementById('downloadChapterBtn').addEventListener('click', downloadChapter);
    document.getElementById('downloadAllBtn').addEventListener('click', downloadAll);

    // 智能调整面板
    document.getElementById('sendAdjustmentBtn').addEventListener('click', sendAdjustment);
    document.getElementById('clearAdjustmentBtn').addEventListener('click', clearAdjustmentInput);
    document.getElementById('toggleAdjustmentBtn').addEventListener('click', toggleAdjustmentHistory);

    // 支持Ctrl+Enter快捷键发送
    document.getElementById('adjustmentInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            sendAdjustment();
        }
    });

    // 上下文信息
    document.getElementById('closeContextBtn').addEventListener('click', () => {
        document.getElementById('contextModal').classList.remove('active');
    });
    document.getElementById('copyContextBtn').addEventListener('click', copyContextInfo);

    // 角色数据管理
    document.getElementById('openCharacterStatsBtn').addEventListener('click', openCharacterStatsModal);
    document.getElementById('closeCharacterStatsBtn').addEventListener('click', () => {
        document.getElementById('characterStatsModal').classList.remove('active');
    });
    document.getElementById('addNewCharacterBtn').addEventListener('click', showCharacterStatsForm);
    document.getElementById('saveCharacterStatsBtn').addEventListener('click', saveCharacterStats);
    document.getElementById('cancelCharacterStatsBtn').addEventListener('click', hideCharacterStatsForm);

    // 进度步骤点击 - 允许点击任意步骤
    document.querySelectorAll('.progress-step').forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.dataset.step);
            // 移除限制，允许跳转到任意步骤
            goToStep(stepNum);
        });
    });
}

// ===== API配置相关 =====
function showApiModal() {
    // 恢复当前配置
    document.getElementById('apiProvider').value = currentApiProvider;
    document.getElementById('claudeApiKey').value = apiConfigs.claude.key;
    document.getElementById('claudeModel').value = apiConfigs.claude.model;
    document.getElementById('geminiApiKey').value = apiConfigs.gemini.key;
    document.getElementById('geminiModel').value = apiConfigs.gemini.model;
    document.getElementById('kimiApiKey').value = apiConfigs.kimi.key;
    document.getElementById('kimiModel').value = apiConfigs.kimi.model;
    document.getElementById('relayApiKey').value = apiConfigs.relay.key;
    document.getElementById('relayModel').value = apiConfigs.relay.model;

    switchApiProvider();
    document.getElementById('apiModal').classList.add('active');
}

function hideApiModal() {
    document.getElementById('apiModal').classList.remove('active');
}

function switchApiProvider() {
    const provider = document.getElementById('apiProvider').value;

    // 隐藏所有配置区域
    document.querySelectorAll('.api-config-section').forEach(section => {
        section.classList.remove('active');
    });

    // 显示选中的配置区域
    document.getElementById(provider + 'Config').classList.add('active');

    // 更新信息提示
    const infoTexts = {
        claude: '🤖 Claude - Anthropic出品，擅长长文本创作和深度理解',
        gemini: '🌟 Gemini - Google出品，速度快，性价比高',
        kimi: '🌙 Kimi - 月之暗面出品，支持超长上下文（128K）',
        relay: '🌐 API中转站 - 通过中转服务调用Claude API'
    };

    document.querySelector('#apiProviderInfo .info-text').textContent = infoTexts[provider];
}

function saveApiConfig() {
    const provider = document.getElementById('apiProvider').value;

    // 保存所有配置
    apiConfigs.claude.key = document.getElementById('claudeApiKey').value.trim();
    apiConfigs.claude.model = document.getElementById('claudeModel').value;
    apiConfigs.gemini.key = document.getElementById('geminiApiKey').value.trim();
    apiConfigs.gemini.model = document.getElementById('geminiModel').value;
    apiConfigs.kimi.key = document.getElementById('kimiApiKey').value.trim();
    apiConfigs.kimi.model = document.getElementById('kimiModel').value;
    apiConfigs.relay.key = document.getElementById('relayApiKey').value.trim();
    apiConfigs.relay.model = document.getElementById('relayModel').value;

    // 验证当前选择的提供商是否有密钥
    if (!apiConfigs[provider].key) {
        alert('请输入' + getProviderName(provider) + '的API密钥');
        return;
    }

    // 保存到localStorage
    currentApiProvider = provider;
    localStorage.setItem('api_provider', provider);
    localStorage.setItem('claude_api_key', apiConfigs.claude.key);
    localStorage.setItem('claude_model', apiConfigs.claude.model);
    localStorage.setItem('gemini_api_key', apiConfigs.gemini.key);
    localStorage.setItem('gemini_model', apiConfigs.gemini.model);
    localStorage.setItem('kimi_api_key', apiConfigs.kimi.key);
    localStorage.setItem('kimi_model', apiConfigs.kimi.model);
    localStorage.setItem('relay_api_key', apiConfigs.relay.key);
    localStorage.setItem('relay_model', apiConfigs.relay.model);

    hideApiModal();
    alert('✅ API配置保存成功！\n当前使用：' + getProviderName(provider));
}

async function testApiConnection() {
    const provider = document.getElementById('apiProvider').value;
    const config = {
        key: document.getElementById(provider + 'ApiKey').value.trim(),
        model: document.getElementById(provider + 'Model').value
    };

    if (!config.key) {
        alert('请先输入API密钥');
        return;
    }

    showLoading('正在测试API连接...');

    try {
        const testPrompt = '你好，请回复"连接成功"';
        const result = await callAIAPI(testPrompt, 100, config.key, config.model, provider);

        hideLoading();
        alert('✅ API连接测试成功！\n\n' + getProviderName(provider) + '响应：\n' + result.substring(0, 100));
    } catch (error) {
        hideLoading();
        alert('❌ API连接测试失败！\n\n错误信息：\n' + error.message);
    }
}

function getProviderName(provider) {
    const names = {
        claude: 'Claude (Anthropic)',
        gemini: 'Gemini (Google)',
        kimi: 'Kimi (Moonshot AI)',
        relay: 'API中转站 (Claude)'
    };
    return names[provider] || provider;
}

// ===== 统一AI API调用接口 =====
async function callAIAPI(prompt, maxTokens = 4000, apiKey = null, model = null, provider = null) {
    provider = provider || currentApiProvider;
    apiKey = apiKey || apiConfigs[provider].key;
    model = model || apiConfigs[provider].model;

    if (!apiKey) {
        throw new Error('请先配置 ' + getProviderName(provider) + ' 的API密钥');
    }

    switch (provider) {
        case 'claude':
            return await callClaudeAPI(prompt, maxTokens, apiKey, model);
        case 'gemini':
            return await callGeminiAPI(prompt, maxTokens, apiKey, model);
        case 'kimi':
            return await callKimiAPI(prompt, maxTokens, apiKey, model);
        case 'relay':
            return await callRelayAPI(prompt, maxTokens, apiKey, model);
        default:
            throw new Error('不支持的AI提供商：' + provider);
    }
}

// ===== Claude API =====
async function callClaudeAPI(prompt, maxTokens, apiKey, model) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: maxTokens,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Claude API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// ===== Gemini API =====
async function callGeminiAPI(prompt, maxTokens, apiKey, model) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: BOGE_SYSTEM_PROMPT + '\n\n' + prompt
                }]
            }],
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.9
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gemini API请求失败: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Gemini API返回数据格式错误');
    }

    return data.candidates[0].content.parts[0].text;
}

// ===== Kimi API =====
async function callKimiAPI(prompt, maxTokens, apiKey, model) {
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: BOGE_SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Kimi API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ===== API中转站 (Claude兼容接口) =====
async function callRelayAPI(prompt, maxTokens, apiKey, model) {
    const relayUrl = apiConfigs.relay.url;
    const response = await fetch(`${relayUrl}/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: model,
            max_tokens: maxTokens,
            messages: [{
                role: 'user',
                content: prompt
            }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API中转站请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

// ===== 步骤导航 =====
function goToStep(stepNum) {
    currentStep = stepNum;

    // 更新进度指示器
    updateStepCompletionStatus();

    // 更新内容显示
    document.querySelectorAll('.step-content').forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === stepNum) {
            content.classList.add('active');
        }
    });

    // 保存当前步骤
    saveProgress();

    window.scrollTo(0, 0);
}

// ===== 更新步骤完成状态 =====
function updateStepCompletionStatus() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        // 根据实际数据判断步骤是否完成
        let isCompleted = false;
        if (stepNumber === 1 && novelData.settings && Object.keys(novelData.settings).length > 0) {
            isCompleted = true;
        } else if (stepNumber === 2 && novelData.plan) {
            isCompleted = true;
        } else if (stepNumber === 3 && novelData.characters) {
            isCompleted = true;
        } else if (stepNumber === 4 && novelData.outline && novelData.outline.length > 0) {
            isCompleted = true;
        } else if (stepNumber === 5 && Object.keys(novelData.chapters || {}).length > 0) {
            isCompleted = true;
        }

        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (isCompleted) {
            step.classList.add('completed');
        }
    });
}

// ===== 步骤1: 基础设定 =====
function getStep1Data() {
    const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked'))
        .map(cb => cb.value);
    const tone = document.querySelector('input[name="tone"]:checked')?.value;
    const ending = document.querySelector('input[name="ending"]:checked')?.value;
    const perspective = document.querySelector('input[name="perspective"]:checked')?.value;
    const coreTheme = document.getElementById('coreTheme').value.trim();

    return { genres, tone, ending, perspective, coreTheme };
}

function validateStep1() {
    const data = getStep1Data();

    if (data.genres.length === 0) {
        alert('请至少选择1个小说类型');
        return false;
    }

    if (data.genres.length > 2) {
        alert('最多只能选择2个小说类型');
        return false;
    }

    if (!data.tone) {
        alert('请选择故事基调');
        return false;
    }

    if (!data.ending) {
        alert('请选择结局类型');
        return false;
    }

    if (!data.perspective) {
        alert('请选择叙事视角');
        return false;
    }

    if (!data.coreTheme) {
        alert('请输入核心主题与创意');
        return false;
    }

    return true;
}

function resetStep1() {
    if (!confirm('确定要重置所有设定吗？')) return;

    document.querySelectorAll('input[name="genre"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="tone"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="ending"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="perspective"]').forEach(radio => radio.checked = false);
    document.getElementById('coreTheme').value = '';

    // 清除保存的设定
    novelData.settings = {};
    saveProgress();
}

// 保存步骤1设定（不生成方案）
function saveStep1Settings() {
    if (!validateStep1()) return;

    const data = getStep1Data();
    novelData.settings = data;
    saveProgress();
    updateStepCompletionStatus();

    alert('✅ 基础设定已保存！\n\n您可以随时返回修改,或继续生成创作方案。');
}

async function generatePlan() {
    if (!validateStep1()) return;

    const data = getStep1Data();
    novelData.settings = data;

    // 获取参考内容
    const referenceContent = await getReferenceContent();

    const prompt = `作为博哥，请根据以下基础设定生成一份完整的创作方案：

【用户选择的设定】
- 小说类型：${data.genres.join('、')}
- 故事基调：${data.tone}
- 结局类型：${data.ending}
- 叙事视角：${data.perspective}
- 核心主题与创意：${data.coreTheme}

请生成一份详细的创作方案，包括：

**1. 基础信息**
   - 作品名称：（基于主题生成引人入胜的标题）
   - 写作视角：${data.perspective}
   - 语言风格：（根据基调确定）

**2. 时空背景**
   （根据类型和主题生成合适的背景设定，至少200字）

**3. 叙事结构**
   （推荐合适的结构，如三幕结构、英雄之旅等，并说明原因）

**4. 故事核心**
   - 核心冲突：
   - 主要情节线：
   - 次要情节线：
   - 情节架构：

**5. 结局设计**
   （根据${data.ending}结局类型设计具体结局）

请确保方案详细、专业，并符合所选类型和基调。${referenceContent}`;

    showLoading('正在生成创作方案...');

    try {
        const result = await callAIAPI(prompt);
        novelData.plan = result;

        document.getElementById('planContent').innerHTML = formatMarkdown(result);
        goToStep(2);
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

function confirmPlan() {
    if (!novelData.plan) {
        alert('请先生成创作方案');
        return;
    }
    // 保存当前编辑的内容
    savePlan();
    generateCharacters();
}

// 保存方案（从编辑区域）
function savePlan() {
    const content = document.getElementById('planContent').innerText;
    if (!content || content.trim() === '') {
        alert('方案内容不能为空');
        return;
    }
    novelData.plan = content;
    saveProgress();
    alert('✅ 创作方案已保存！');
}

// ===== 步骤3: 角色开发 =====
async function generateCharacters() {
    const settings = novelData.settings;
    const plan = novelData.plan;

    const prompt = `根据以下小说设定和创作方案，生成15个角色（主要角色、次要角色和临时角色）：

【小说设定】
${JSON.stringify(settings, null, 2)}

【创作方案】
${plan}

请以表格形式生成角色信息，包括：

| 角色名称 | 身份定位 | 外貌特征 | 性格特征 | 背景故事 | 目标动机 | 特殊能力 |
|---------|---------|---------|---------|---------|---------|---------|
| （至少15个角色）

要求：
- 主要角色（5-7个）：主角、反派、重要配角等，信息详细
- 次要角色（5-6个）：支持性角色，信息适中
- 临时角色（2-3个）：功能性角色，信息简洁
- 角色多样化，避免刻板印象
- 确保与世界观相符
- 为后续互动和冲突埋下伏笔`;

    showLoading('正在开发角色...');

    try {
        const result = await callAIAPI(prompt);
        novelData.characters = result;

        document.getElementById('characterContent').innerHTML = formatMarkdown(result);
        goToStep(3);
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

function confirmCharacters() {
    if (!novelData.characters) {
        alert('请先生成角色');
        return;
    }
    // 保存当前编辑的内容
    saveCharacters();
    generateOutline();
}

// 保存角色（从编辑区域）
function saveCharacters() {
    const content = document.getElementById('characterContent').innerText;
    if (!content || content.trim() === '') {
        alert('角色内容不能为空');
        return;
    }
    novelData.characters = content;
    saveProgress();
    alert('✅ 角色信息已保存！');
}

// ===== 步骤4: 目录生成 =====
async function generateOutline() {
    const settings = novelData.settings;
    const plan = novelData.plan;
    const characters = novelData.characters;

    const prompt = `根据以下信息生成完整的小说章节目录：

【小说设定】
${JSON.stringify(settings, null, 2)}

【创作方案】
${plan}

【角色信息】
${characters}

请生成章节目录，要求：
- 按照每章3000字，共20万字进行创作
- 预计60-70个章节
- 格式为：

**小说目录**
第001章 章节标题
第002章 章节标题
...

目录要求：
- 章节标题要吸引人，体现本章核心内容
- 目录整体符合选定的叙事结构
- 情节有起承转合，高潮迭起
- 确保与整体故事情节保持一致`;

    showLoading('正在生成章节目录...');

    try {
        const result = await callAIAPI(prompt);
        novelData.outline = parseOutline(result);

        document.getElementById('outlineContent').innerHTML = formatMarkdown(result);
        goToStep(4);
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

function parseOutline(outlineText) {
    const lines = outlineText.split('\n');
    const chapters = [];
    const regex = /第(\d+)章\s+(.+)/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            chapters.push({
                number: parseInt(match[1]),
                title: match[2].trim()
            });
        }
    });

    return chapters;
}

function confirmOutline() {
    if (!novelData.outline || novelData.outline.length === 0) {
        alert('请先生成章节目录');
        return;
    }

    // 保存当前编辑的内容并重新解析
    saveOutline();
    populateChapterList();
    goToStep(5);
}

// 保存目录（从编辑区域）
function saveOutline() {
    const content = document.getElementById('outlineContent').innerText;
    if (!content || content.trim() === '') {
        alert('目录内容不能为空');
        return;
    }

    // 重新解析目录
    novelData.outline = parseOutline(content);

    // 同时保存原始文本
    novelData.outlineText = content;

    saveProgress();
    alert('✅ 章节目录已保存！');
}

function populateChapterList() {
    const chapterList = document.getElementById('chapterList');
    const chapterSelect = document.getElementById('chapterSelect');

    chapterList.innerHTML = '';
    chapterSelect.innerHTML = '<option value="">选择要创作的章节...</option>';

    novelData.outline.forEach(chapter => {
        const item = document.createElement('div');
        item.className = 'chapter-item';
        item.dataset.chapter = chapter.number;
        item.textContent = `第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}`;

        if (novelData.chapters[chapter.number]) {
            item.classList.add('completed');
        }

        item.addEventListener('click', function() {
            selectChapter(chapter.number);
        });

        chapterList.appendChild(item);

        const option = document.createElement('option');
        option.value = chapter.number;
        option.textContent = `第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}`;
        chapterSelect.appendChild(option);
    });
}

// ===== 步骤5: 章节创作 =====
function selectChapter(chapterNum) {
    document.querySelectorAll('.chapter-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.chapter) === chapterNum) {
            item.classList.add('active');
        }
    });

    document.getElementById('chapterSelect').value = chapterNum;

    if (novelData.chapters[chapterNum]) {
        displayChapterContent(novelData.chapters[chapterNum]);
    } else {
        document.getElementById('chapterOutput').innerHTML =
            '<div class="placeholder"><p>本章尚未创作，点击"✨ 创作本章"开始创作</p></div>';
    }
}

async function writeSelectedChapter() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);

    if (!chapterNum) {
        alert('请先选择要创作的章节');
        return;
    }

    await writeChapter(chapterNum);
}

async function continueNextChapter() {
    const nextChapter = novelData.outline.find(ch => !novelData.chapters[ch.number]);

    if (!nextChapter) {
        alert('所有章节已创作完成！');
        return;
    }

    selectChapter(nextChapter.number);
    await writeChapter(nextChapter.number);
}

async function writeChapter(chapterNum) {
    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    if (!chapter) return;

    // ===== 增强的上下文系统 =====

    // 1. 获取完整的章节大纲（展示当前章节在整体故事中的位置）
    const fullOutline = novelData.outline.map(ch =>
        `第${ch.number.toString().padStart(3, '0')}章 ${ch.title}${ch.number === chapterNum ? ' ← 当前章节' : ''}`
    ).join('\n');

    // 2. 获取前面所有章节的详细内容（扩展到10万字范围）
    const previousChapters = [];
    let totalContextWords = 0;
    const maxContextWords = 100000; // 10万字上下文范围

    // 从最近的章节开始往前收集，直到达到10万字
    for (let i = chapterNum - 1; i >= 1; i--) {
        if (novelData.chapters[i]) {
            const content = novelData.chapters[i];
            const chapterInfo = novelData.outline.find(ch => ch.number === i);

            // 计算可以包含多少字
            const remainingWords = maxContextWords - totalContextWords;

            if (remainingWords <= 0) break;

            // 根据章节距离决定详细程度
            let excerptLength;
            if (i >= chapterNum - 2) {
                // 最近2章：完整内容或最多5000字
                excerptLength = Math.min(content.length, 5000, remainingWords);
            } else if (i >= chapterNum - 5) {
                // 最近3-5章：最多3000字
                excerptLength = Math.min(content.length, 3000, remainingWords);
            } else if (i >= chapterNum - 10) {
                // 最近6-10章：最多2000字
                excerptLength = Math.min(content.length, 2000, remainingWords);
            } else {
                // 更早章节：最多1000字摘要
                excerptLength = Math.min(content.length, 1000, remainingWords);
            }

            previousChapters.unshift({
                number: i,
                title: chapterInfo?.title || '',
                excerpt: content.substring(0, excerptLength) + (content.length > excerptLength ? '...' : ''),
                wordCount: content.length,
                excerptWordCount: excerptLength
            });

            totalContextWords += excerptLength;
        }
    }

    // 统计上下文信息
    const contextStats = {
        totalChapters: previousChapters.length,
        totalWords: totalContextWords,
        coveragePercent: ((totalContextWords / maxContextWords) * 100).toFixed(1)
    };

    // 3. 统计当前进度
    const totalChapters = novelData.outline.length;
    const createdChapters = Object.keys(novelData.chapters).length;
    const progressPercent = ((chapterNum - 1) / totalChapters * 100).toFixed(1);

    // 4. 确定当前所处的故事阶段
    let storyPhase = '';
    if (chapterNum <= totalChapters * 0.2) {
        storyPhase = '故事开篇阶段 - 应着重于世界观介绍、主角登场、初步冲突设置';
    } else if (chapterNum <= totalChapters * 0.4) {
        storyPhase = '情节发展阶段 - 应推进主要情节线，深化人物关系，引入次要冲突';
    } else if (chapterNum <= totalChapters * 0.6) {
        storyPhase = '冲突升级阶段 - 应加强矛盾冲突，推动情节复杂化，为高潮做铺垫';
    } else if (chapterNum <= totalChapters * 0.8) {
        storyPhase = '高潮准备阶段 - 应汇聚各条情节线，制造紧张感，酝酿最终冲突';
    } else if (chapterNum <= totalChapters * 0.95) {
        storyPhase = '高潮爆发阶段 - 应展现最激烈的冲突，解决主要矛盾';
    } else {
        storyPhase = '结局收尾阶段 - 应收束情节线，给予人物归宿，呼应开篇';
    }

    // 5. 生成角色数据统计信息（扩展到15000字）
    const characterStatsInfo = generateCharacterStatsInfo();

    // 获取参考内容
    const referenceContent = await getReferenceContent();

    const prompt = `作为博哥，请撰写第${chapter.number}章的内容。

【故事整体架构】
总章节数：${totalChapters}章
已创作：${createdChapters}章
当前进度：${progressPercent}%
当前阶段：${storyPhase}

【上下文统计信息】
引用前文章节数：${contextStats.totalChapters}章
上下文总字数：${contextStats.totalWords.toLocaleString()}字（目标：100,000字）
上下文覆盖率：${contextStats.coveragePercent}%

【完整章节大纲】
${fullOutline}

【小说核心设定】
类型：${novelData.settings.genres?.join('、') || '未知'}
基调：${novelData.settings.tone || '未知'}
视角：${novelData.settings.perspective || '未知'}
结局：${novelData.settings.ending || '未知'}
核心主题：${novelData.settings.coreTheme || '未知'}

【创作方案（故事核心框架）】
${novelData.plan.substring(0, 2000)}${novelData.plan.length > 2000 ? '...' : ''}

【主要角色详细设定（前15000字）】
${novelData.characters.substring(0, 15000)}${novelData.characters.length > 15000 ? '\n\n（角色信息较长，已截取前15000字）' : ''}

${characterStatsInfo ? `【角色数据统计】
${characterStatsInfo}
` : ''}

【本章任务】
章节序号：第${chapter.number.toString().padStart(3, '0')}章
章节标题：${chapter.title}
在整体故事中的位置：第${chapterNum}/${totalChapters}章

${previousChapters.length > 0 ? `【前文详细回顾（10万字范围）】
已引用章节：${previousChapters.length}章
总上下文：${contextStats.totalWords.toLocaleString()}字

${previousChapters.map(pc => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第${pc.number.toString().padStart(3, '0')}章 ${pc.title}（总${pc.wordCount}字，引用${pc.excerptWordCount}字）
${pc.excerpt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`).join('\n')}

【特别提醒】请仔细阅读以上前文内容，确保：
1. 情节衔接自然，与前文紧密连贯
2. 人物行为、对话、性格与前文一致
3. 已出现的设定、道具、地点保持一致
4. 伏笔和悬念得到合理发展
5. 故事节奏符合当前阶段要求
` : `【首章创作提醒】
这是第一章，请注意：
1. 吸引读者的开篇
2. 自然引入世界观设定
3. 塑造鲜明的主角形象
4. 设置初步的冲突或悬念
5. 为后续情节埋下伏笔
`}

【创作要求】
1. **字数要求**：本章内容必须不少于3000中文字
2. **上下文连贯**：必须与前文紧密衔接，情节、人物、设定保持一致
3. **情节推进**：根据${storyPhase}，合理推进情节发展
4. **人物塑造**：体现人物性格，保持人物行为的连贯性和合理性
5. **叙事风格**：使用${novelData.settings.perspective}
6. **悬念设置**：章节结尾留有悬念或转折，引导读者继续阅读
7. **语言风格**：符合${novelData.settings.tone}基调
8. **细节一致性**：人物特征、场景描写、时间线等细节必须与前文一致

【重要格式要求 - 番茄小说平台规范】：
9. **纯文本格式**：不要使用任何Markdown标记符号（*、**、#、##等）
10. **对话格式**：对话使用中文引号""，不要用星号或其他符号
11. **强调内容**：需要强调的内容直接用文字表达，不要用**加粗**或*斜体*
12. **段落分隔**：段落之间空一行，不要使用特殊符号
13. **章节标题**：只在开头写"第XXX章 标题"，不要加#号
14. **内容纯净**：输出纯小说正文，可直接复制粘贴到番茄小说平台

【输出要求】
请直接输出章节内容，不要添加任何说明、评论或分析。

输出格式：
第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}

（正文开始，使用纯文本，对话用中文引号""，段落之间空一行）

${referenceContent}`;

    showLoading(`正在创作第${chapter.number}章...`);

    try {
        const result = await callAIAPI(prompt, 8000);

        // 清理可能残留的Markdown标记
        const cleanedResult = cleanMarkdownSymbols(result);

        novelData.chapters[chapterNum] = cleanedResult;

        displayChapterContent(cleanedResult);

        document.querySelectorAll('.chapter-item').forEach(item => {
            if (parseInt(item.dataset.chapter) === chapterNum) {
                item.classList.add('completed');
            }
        });

        saveProgress();

        alert(`第${chapter.number}章创作完成！字数：${result.length}字`);
    } catch (error) {
        alert('创作失败：' + error.message);
    } finally {
        hideLoading();
    }
}

function displayChapterContent(content) {
    const output = document.getElementById('chapterOutput');
    output.innerHTML = content;
    output.classList.add('fade-in');

    document.getElementById('copyChapterBtn').disabled = false;
    document.getElementById('downloadChapterBtn').disabled = false;

    // 显示智能调整面板
    document.getElementById('adjustmentPanel').style.display = 'block';

    setTimeout(() => {
        output.classList.remove('fade-in');
    }, 500);
}

// ===== 智能调整功能 =====
let adjustmentHistory = [];

async function sendAdjustment() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);
    const adjustmentInput = document.getElementById('adjustmentInput');
    const instruction = adjustmentInput.value.trim();

    if (!chapterNum || !novelData.chapters[chapterNum]) {
        alert('请先选择并创作章节');
        return;
    }

    if (!instruction) {
        alert('请输入您的调整要求');
        adjustmentInput.focus();
        return;
    }

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    const originalContent = novelData.chapters[chapterNum];

    showLoading('正在根据您的要求调整章节内容...');

    const prompt = `作为博哥，请根据用户的具体要求对章节内容进行调整和修改：

【章节信息】
第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}

【当前章节内容】
${originalContent}

【用户的调整要求】
${instruction}

调整要求：
1. **严格执行**：严格按照用户提出的调整要求进行修改
2. **保持核心**：不改变核心情节和人物设定（除非用户明确要求）
3. **语言优化**：在满足调整要求的同时提升文字质量
4. **逻辑修正**：如果要求涉及逻辑问题，请仔细修正相关矛盾
5. **细节完善**：在修改过程中适当补充必要的细节
6. **字数要求**：调整后字数不少于原文

【重要格式要求 - 番茄小说平台规范】：
7. **纯文本格式**：不要使用任何Markdown标记符号（*、**、#、##等）
8. **对话格式**：对话使用中文引号""，不要用星号或其他符号
9. **强调内容**：需要强调的内容直接用文字表达，不要用**加粗**或*斜体*
10. **段落分隔**：段落之间空一行，不要使用特殊符号
11. **内容纯净**：输出纯小说正文，可直接复制粘贴到番茄小说平台

请直接输出调整后的完整章节内容：`;

    try {
        const result = await callAIAPI(prompt, 8000);

        // 清理Markdown标记
        const cleanedResult = cleanMarkdownSymbols(result);

        // 保存调整后的版本
        novelData.chapters[chapterNum] = cleanedResult;

        displayChapterContent(cleanedResult);
        saveProgress();

        // 添加到历史记录
        adjustmentHistory.push({
            time: new Date().toLocaleTimeString(),
            instruction: instruction,
            chapterNum: chapterNum
        });
        updateAdjustmentHistory();

        // 清空输入框
        adjustmentInput.value = '';

        // 显示成功提示
        showAdjustmentSuccess(`第${chapter.number}章调整完成！\n字数：${cleanedResult.length}字`);
    } catch (error) {
        alert('调整失败：' + error.message);
    } finally {
        hideLoading();
    }
}

function clearAdjustmentInput() {
    document.getElementById('adjustmentInput').value = '';
    document.getElementById('adjustmentInput').focus();
}

function toggleAdjustmentHistory() {
    const historyPanel = document.getElementById('adjustmentHistory');
    if (historyPanel.style.display === 'none' || !historyPanel.style.display) {
        historyPanel.style.display = 'block';
        updateAdjustmentHistory();
    } else {
        historyPanel.style.display = 'none';
    }
}

function updateAdjustmentHistory() {
    const historyList = document.getElementById('historyList');

    if (adjustmentHistory.length === 0) {
        historyList.innerHTML = '<p class="hint-text">暂无调整历史</p>';
        return;
    }

    historyList.innerHTML = adjustmentHistory
        .slice(-10) // 只显示最近10条
        .reverse()
        .map((item, index) => `
            <div class="history-item" onclick="reuseAdjustment(${adjustmentHistory.length - 1 - index})">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                    ${item.time} - 第${item.chapterNum}章
                </div>
                <div>${item.instruction}</div>
            </div>
        `).join('');
}

window.reuseAdjustment = function(index) {
    const item = adjustmentHistory[index];
    document.getElementById('adjustmentInput').value = item.instruction;
    document.getElementById('adjustmentInput').focus();
};

function showAdjustmentSuccess(message) {
    const inputContainer = document.querySelector('.adjustment-input-container');
    const successMsg = document.createElement('div');
    successMsg.className = 'adjustment-success-msg';
    successMsg.style.cssText = `
        margin-top: 10px;
        padding: 10px 15px;
        background: #d1fae5;
        border: 2px solid #10b981;
        border-radius: 6px;
        color: #065f46;
        font-size: 0.9rem;
        animation: fadeIn 0.3s ease;
    `;
    successMsg.textContent = '✅ ' + message;

    inputContainer.appendChild(successMsg);

    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// ===== 导出功能 =====
async function copyChapter() {
    const text = document.getElementById('chapterOutput').innerText;

    try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('copyChapterBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('复制失败，请手动选择文本复制');
    }
}

function downloadChapter() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);
    if (!chapterNum || !novelData.chapters[chapterNum]) {
        alert('请先选择并创作章节');
        return;
    }

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    const content = novelData.chapters[chapterNum];
    const filename = `第${chapter.number.toString().padStart(3, '0')}章_${chapter.title}.txt`;

    downloadTextFile(content, filename);
}

function downloadAll() {
    if (Object.keys(novelData.chapters).length === 0) {
        alert('还没有创作任何章节');
        return;
    }

    let allContent = `【小说标题】\n从创作方案中提取\n\n`;
    allContent += `【作者】博哥\n\n`;
    allContent += `【AI提供商】${getProviderName(currentApiProvider)}\n\n`;
    allContent += `【创作时间】${new Date().toLocaleDateString()}\n\n`;
    allContent += `${'='.repeat(50)}\n\n`;

    novelData.outline.forEach(chapter => {
        if (novelData.chapters[chapter.number]) {
            allContent += `第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}\n\n`;
            allContent += novelData.chapters[chapter.number];
            allContent += `\n\n${'='.repeat(50)}\n\n`;
        }
    });

    const filename = `完整小说_${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(allContent, filename);
}

function downloadTextFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== 加载/保存进度 =====
function saveProgress() {
    try {
        localStorage.setItem('novel_data', JSON.stringify(novelData));
        localStorage.setItem('current_step', currentStep.toString());
        console.log('进度已保存');
    } catch (error) {
        console.error('保存失败:', error);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('novel_data');
        if (saved) {
            novelData = JSON.parse(saved);

            // 恢复步骤1的设定
            if (novelData.settings) {
                const settings = novelData.settings;

                // 恢复类型选择
                if (settings.genres) {
                    settings.genres.forEach(genre => {
                        const checkbox = document.querySelector(`input[name="genre"][value="${genre}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }

                // 恢复基调选择
                if (settings.tone) {
                    const radio = document.querySelector(`input[name="tone"][value="${settings.tone}"]`);
                    if (radio) radio.checked = true;
                }

                // 恢复结局选择
                if (settings.ending) {
                    const radio = document.querySelector(`input[name="ending"][value="${settings.ending}"]`);
                    if (radio) radio.checked = true;
                }

                // 恢复视角选择
                if (settings.perspective) {
                    const radio = document.querySelector(`input[name="perspective"][value="${settings.perspective}"]`);
                    if (radio) radio.checked = true;
                }

                // 恢复核心主题
                if (settings.coreTheme) {
                    document.getElementById('coreTheme').value = settings.coreTheme;
                }
            }

            const savedStep = parseInt(localStorage.getItem('current_step') || '1');
            if (savedStep > 1) {
                if (confirm('检测到未完成的创作，是否继续？\n\n点击"确定"继续之前的创作\n点击"取消"从头开始')) {
                    if (novelData.plan) {
                        document.getElementById('planContent').innerHTML = formatMarkdown(novelData.plan);
                    }
                    if (novelData.characters) {
                        document.getElementById('characterContent').innerHTML = formatMarkdown(novelData.characters);
                    }
                    if (novelData.outline && novelData.outline.length > 0) {
                        document.getElementById('outlineContent').innerHTML = formatMarkdown(
                            novelData.outline.map(ch => `第${ch.number.toString().padStart(3, '0')}章 ${ch.title}`).join('\n')
                        );
                        populateChapterList();
                    }

                    goToStep(savedStep);
                    updateStepCompletionStatus();
                } else {
                    // 用户选择从头开始，清除进度但保留设定
                    const savedSettings = novelData.settings;
                    novelData = {
                        settings: savedSettings || {},
                        plan: '',
                        characters: [],
                        outline: [],
                        chapters: {}
                    };
                    saveProgress();
                    updateStepCompletionStatus();
                }
            } else {
                // 如果保存的步骤是1，也要更新完成状态
                updateStepCompletionStatus();
            }
        }
    } catch (error) {
        console.error('加载失败:', error);
    }
}

// ===== 生成角色数据统计信息 =====
function generateCharacterStatsInfo() {
    if (!novelData.characterStats || Object.keys(novelData.characterStats).length === 0) {
        return null;
    }

    let statsInfo = '';
    for (const [charName, stats] of Object.entries(novelData.characterStats)) {
        statsInfo += `\n【${charName}】\n`;
        if (stats.age) statsInfo += `年龄：${stats.age}\n`;
        if (stats.level) statsInfo += `等级：${stats.level}\n`;
        if (stats.power) statsInfo += `能量/实力：${stats.power}\n`;
        if (stats.skills && stats.skills.length > 0) {
            statsInfo += `技能：${stats.skills.join('、')}\n`;
        }
        if (stats.items && stats.items.length > 0) {
            statsInfo += `重要道具/卡片：${stats.items.join('、')}\n`;
        }
        if (stats.goldenFinger) statsInfo += `金手指：${stats.goldenFinger}\n`;
        if (stats.status) statsInfo += `当前状态：${stats.status}\n`;
        if (stats.location) statsInfo += `当前位置：${stats.location}\n`;
        if (stats.relations && Object.keys(stats.relations).length > 0) {
            statsInfo += `人际关系：\n`;
            for (const [relation, chars] of Object.entries(stats.relations)) {
                statsInfo += `  ${relation}：${chars.join('、')}\n`;
            }
        }
        statsInfo += '\n';
    }

    return statsInfo.trim();
}

// ===== 查看章节上下文信息 =====
function viewChapterContext() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);

    if (!chapterNum) {
        alert('请先选择要查看的章节');
        return;
    }

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    if (!chapter) return;

    // 计算故事进度
    const totalChapters = novelData.outline.length;
    const createdChapters = Object.keys(novelData.chapters).length;
    const progressPercent = ((chapterNum - 1) / totalChapters * 100).toFixed(1);

    // 确定故事阶段
    let storyPhase = '';
    if (chapterNum <= totalChapters * 0.2) {
        storyPhase = '故事开篇阶段';
    } else if (chapterNum <= totalChapters * 0.4) {
        storyPhase = '情节发展阶段';
    } else if (chapterNum <= totalChapters * 0.6) {
        storyPhase = '冲突升级阶段';
    } else if (chapterNum <= totalChapters * 0.8) {
        storyPhase = '高潮准备阶段';
    } else if (chapterNum <= totalChapters * 0.95) {
        storyPhase = '高潮爆发阶段';
    } else {
        storyPhase = '结局收尾阶段';
    }

    // 填充故事进度信息
    document.getElementById('contextCurrentChapter').textContent =
        `第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}`;
    document.getElementById('contextTotalChapters').textContent = `${totalChapters}章`;
    document.getElementById('contextCreatedChapters').textContent = `${createdChapters}章 (${progressPercent}%)`;
    document.getElementById('contextStoryPhase').textContent = storyPhase;

    // 填充核心设定
    const settingsHTML = `
类型：${novelData.settings.genres?.join('、') || '未知'}
基调：${novelData.settings.tone || '未知'}
视角：${novelData.settings.perspective || '未知'}
结局：${novelData.settings.ending || '未知'}

核心主题：
${novelData.settings.coreTheme || '未知'}
    `.trim();
    document.getElementById('contextSettings').textContent = settingsHTML;

    // 填充角色信息（前15000字）
    const charactersPreview = novelData.characters.substring(0, 15000) +
        (novelData.characters.length > 15000 ? '\n\n（完整角色信息共' + novelData.characters.length + '字，已显示前15000字）' : '');

    // 添加角色数据统计
    const characterStatsInfo = generateCharacterStatsInfo();
    const fullCharactersInfo = charactersPreview +
        (characterStatsInfo ? '\n\n━━━━━━━━━━━━━━━━━━\n【角色数据统计】\n' + characterStatsInfo : '');

    document.getElementById('contextCharacters').textContent = fullCharactersInfo;

    // 填充前文摘要（10万字范围）
    const previousChapters = [];
    let totalContextWords = 0;
    const maxContextWords = 100000;

    for (let i = chapterNum - 1; i >= 1; i--) {
        if (novelData.chapters[i]) {
            const content = novelData.chapters[i];
            const remainingWords = maxContextWords - totalContextWords;

            if (remainingWords <= 0) break;

            let excerptLength;
            if (i >= chapterNum - 2) {
                excerptLength = Math.min(content.length, 2000, remainingWords);
            } else if (i >= chapterNum - 5) {
                excerptLength = Math.min(content.length, 1000, remainingWords);
            } else {
                excerptLength = Math.min(content.length, 500, remainingWords);
            }

            const chapterInfo = novelData.outline.find(ch => ch.number === i);
            previousChapters.unshift(
                `第${i.toString().padStart(3, '0')}章 ${chapterInfo?.title || ''} (总${content.length}字，显示${excerptLength}字)\n` +
                content.substring(0, excerptLength) +
                (content.length > excerptLength ? '...' : '')
            );

            totalContextWords += excerptLength;
        }
    }

    if (previousChapters.length > 0) {
        document.getElementById('contextPrevious').textContent =
            `已创作${previousChapters.length}章（上下文范围：${totalContextWords.toLocaleString()}字 / 100,000字）\n\n` +
            previousChapters.join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    } else {
        document.getElementById('contextPrevious').textContent = '这是第一章，无前文';
    }

    // 填充完整大纲
    const outlineText = novelData.outline.map(ch =>
        `第${ch.number.toString().padStart(3, '0')}章 ${ch.title}${ch.number === chapterNum ? ' ← 当前章节' : ''}`
    ).join('\n');
    document.getElementById('contextOutline').textContent = outlineText;

    // 显示模态框
    document.getElementById('contextModal').classList.add('active');
}

// ===== 复制上下文信息 =====
async function copyContextInfo() {
    const contextText = `
【故事进度】
${document.getElementById('contextCurrentChapter').textContent}
总章节数：${document.getElementById('contextTotalChapters').textContent}
已创作：${document.getElementById('contextCreatedChapters').textContent}
故事阶段：${document.getElementById('contextStoryPhase').textContent}

【核心设定】
${document.getElementById('contextSettings').textContent}

【主要角色】
${document.getElementById('contextCharacters').textContent}

【前文摘要】
${document.getElementById('contextPrevious').textContent}

【完整章节大纲】
${document.getElementById('contextOutline').textContent}
    `.trim();

    try {
        await navigator.clipboard.writeText(contextText);
        const btn = document.getElementById('copyContextBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('复制失败，请手动选择文本复制');
    }
}

// ===== 工具函数 =====
function showLoading(text = 'AI正在思考中，请稍候...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

// ===== 清理Markdown标记符号（番茄小说平台格式） =====
function cleanMarkdownSymbols(text) {
    if (!text) return text;

    let cleaned = text;

    // 移除Markdown标题符号（# ## ### 等）
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

    // 移除粗体标记 **文字** 或 __文字__
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
    cleaned = cleaned.replace(/__(.+?)__/g, '$1');

    // 移除斜体标记 *文字* 或 _文字_（但保留可能的省略号...）
    // 先保护省略号
    cleaned = cleaned.replace(/\.\.\./g, '⟪ELLIPSIS⟫');
    cleaned = cleaned.replace(/\*([^*]+?)\*/g, '$1');
    cleaned = cleaned.replace(/_([^_]+?)_/g, '$1');
    // 恢复省略号
    cleaned = cleaned.replace(/⟪ELLIPSIS⟫/g, '...');

    // 移除删除线 ~~文字~~
    cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');

    // 移除代码块标记 ```
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/`([^`]+?)`/g, '$1');

    // 移除列表标记（- 或 * 或 数字.）
    cleaned = cleaned.replace(/^[\s]*[-*+]\s+/gm, '');
    cleaned = cleaned.replace(/^[\s]*\d+\.\s+/gm, '');

    // 移除引用标记 >
    cleaned = cleaned.replace(/^>\s+/gm, '');

    // 移除水平分割线
    cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '');

    // 移除链接标记 [文字](链接)
    cleaned = cleaned.replace(/\[([^\]]+?)\]\([^)]+?\)/g, '$1');

    // 移除图片标记 ![alt](url)
    cleaned = cleaned.replace(/!\[([^\]]*?)\]\([^)]+?\)/g, '');

    // 移除HTML标签
    cleaned = cleaned.replace(/<[^>]+>/g, '');

    // 移除可能的表格分隔符 |
    cleaned = cleaned.replace(/\|/g, '');

    // 清理多余的空行（超过2个连续换行）
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

    // 清理首尾空白
    cleaned = cleaned.trim();

    return cleaned;
}

// ===== 格式化Markdown（仅用于显示，不用于章节内容） =====

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\n/g, '<br>');
}

// ===== 自动保存 =====
setInterval(() => {
    if (currentStep > 1) {
        saveProgress();
    }
}, 60000);

// ===== 角色数据管理功能 =====
let currentEditingCharacter = null;

// 打开角色数据管理模态框
function openCharacterStatsModal() {
    document.getElementById('characterStatsModal').classList.add('active');
    updateCharacterStatsList();
}

// 更新角色列表显示
function updateCharacterStatsList() {
    const listContainer = document.getElementById('characterStatsList');

    if (!novelData.characterStats || Object.keys(novelData.characterStats).length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <p>还没有添加任何角色数据</p>
                <p class="hint-text">点击"添加新角色"开始录入角色数据统计</p>
            </div>`;
        return;
    }

    let html = '';
    for (const [charName, stats] of Object.entries(novelData.characterStats)) {
        const details = [];
        if (stats.age) details.push(`年龄：${stats.age}`);
        if (stats.level) details.push(`等级：${stats.level}`);
        if (stats.power) details.push(`能量：${stats.power}`);
        if (stats.goldenFinger) details.push(`金手指：${stats.goldenFinger}`);
        if (stats.skills && stats.skills.length > 0) details.push(`技能数：${stats.skills.length}`);
        if (stats.items && stats.items.length > 0) details.push(`道具数：${stats.items.length}`);

        html += `
            <div class="character-stats-item">
                <div class="character-stats-header">
                    <div class="character-stats-name">${charName}</div>
                    <div class="character-stats-actions">
                        <button onclick="editCharacterStats('${charName}')" class="btn btn-info btn-small">✏️ 编辑</button>
                        <button onclick="deleteCharacterStats('${charName}')" class="btn btn-danger btn-small">🗑️ 删除</button>
                    </div>
                </div>
                <div class="character-stats-details">
                    ${details.map(d => `<div class="character-stats-detail">${d}</div>`).join('')}
                </div>
            </div>`;
    }

    listContainer.innerHTML = html;
}

// 显示角色编辑表单（新建）
function showCharacterStatsForm() {
    currentEditingCharacter = null;
    document.getElementById('formTitle').textContent = '➕ 添加新角色';
    document.getElementById('characterStatsForm').style.display = 'block';

    // 清空表单
    document.getElementById('charName').value = '';
    document.getElementById('charAge').value = '';
    document.getElementById('charLevel').value = '';
    document.getElementById('charPower').value = '';
    document.getElementById('charSkills').value = '';
    document.getElementById('charItems').value = '';
    document.getElementById('charGoldenFinger').value = '';
    document.getElementById('charStatus').value = '';
    document.getElementById('charLocation').value = '';
    document.getElementById('charRelations').value = '';

    document.getElementById('charName').focus();
}

// 隐藏角色编辑表单
function hideCharacterStatsForm() {
    document.getElementById('characterStatsForm').style.display = 'none';
    currentEditingCharacter = null;
}

// 编辑角色数据
window.editCharacterStats = function(charName) {
    currentEditingCharacter = charName;
    document.getElementById('formTitle').textContent = `✏️ 编辑角色：${charName}`;
    document.getElementById('characterStatsForm').style.display = 'block';

    const stats = novelData.characterStats[charName];

    document.getElementById('charName').value = charName;
    document.getElementById('charAge').value = stats.age || '';
    document.getElementById('charLevel').value = stats.level || '';
    document.getElementById('charPower').value = stats.power || '';
    document.getElementById('charSkills').value = stats.skills ? stats.skills.join('、') : '';
    document.getElementById('charItems').value = stats.items ? stats.items.join('、') : '';
    document.getElementById('charGoldenFinger').value = stats.goldenFinger || '';
    document.getElementById('charStatus').value = stats.status || '';
    document.getElementById('charLocation').value = stats.location || '';

    // 格式化人际关系
    if (stats.relations && Object.keys(stats.relations).length > 0) {
        const relationsText = Object.entries(stats.relations)
            .map(([rel, chars]) => `${rel}=${chars.join('、')}`)
            .join('\n');
        document.getElementById('charRelations').value = relationsText;
    } else {
        document.getElementById('charRelations').value = '';
    }

    document.getElementById('charName').focus();
};

// 删除角色数据
window.deleteCharacterStats = function(charName) {
    if (!confirm(`确定要删除角色"${charName}"的数据吗？`)) return;

    delete novelData.characterStats[charName];
    saveProgress();
    updateCharacterStatsList();

    alert(`✅ 角色"${charName}"已删除`);
};

// 保存角色数据
function saveCharacterStats() {
    const charName = document.getElementById('charName').value.trim();

    if (!charName) {
        alert('请输入角色名称');
        document.getElementById('charName').focus();
        return;
    }

    // 检查是否是新建且名称已存在
    if (!currentEditingCharacter && novelData.characterStats[charName]) {
        if (!confirm(`角色"${charName}"已存在，是否覆盖原有数据？`)) {
            return;
        }
    }

    // 解析技能（支持顿号、逗号分隔）
    const skillsText = document.getElementById('charSkills').value.trim();
    const skills = skillsText ? skillsText.split(/[、,，]/).map(s => s.trim()).filter(s => s) : [];

    // 解析道具（支持顿号、逗号分隔）
    const itemsText = document.getElementById('charItems').value.trim();
    const items = itemsText ? itemsText.split(/[、,，]/).map(s => s.trim()).filter(s => s) : [];

    // 解析人际关系
    const relationsText = document.getElementById('charRelations').value.trim();
    const relations = {};
    if (relationsText) {
        const lines = relationsText.split('\n');
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            const parts = trimmedLine.split('=');
            if (parts.length === 2) {
                const relType = parts[0].trim();
                const relChars = parts[1].split(/[、,，]/).map(s => s.trim()).filter(s => s);
                if (relType && relChars.length > 0) {
                    relations[relType] = relChars;
                }
            }
        }
    }

    // 构建角色数据
    const statsData = {
        age: document.getElementById('charAge').value.trim() || undefined,
        level: document.getElementById('charLevel').value.trim() || undefined,
        power: document.getElementById('charPower').value.trim() || undefined,
        skills: skills.length > 0 ? skills : undefined,
        items: items.length > 0 ? items : undefined,
        goldenFinger: document.getElementById('charGoldenFinger').value.trim() || undefined,
        status: document.getElementById('charStatus').value.trim() || undefined,
        location: document.getElementById('charLocation').value.trim() || undefined,
        relations: Object.keys(relations).length > 0 ? relations : undefined
    };

    // 移除 undefined 属性
    Object.keys(statsData).forEach(key => {
        if (statsData[key] === undefined) {
            delete statsData[key];
        }
    });

    // 如果是编辑且名称改变，删除旧的
    if (currentEditingCharacter && currentEditingCharacter !== charName) {
        delete novelData.characterStats[currentEditingCharacter];
    }

    // 保存数据
    if (!novelData.characterStats) {
        novelData.characterStats = {};
    }
    novelData.characterStats[charName] = statsData;

    saveProgress();
    updateCharacterStatsList();
    hideCharacterStatsForm();

    alert(`✅ 角色"${charName}"的数据已保存！`);
}
