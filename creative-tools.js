// ===== 创意工具箱模块 =====

// ===== 初始化事件绑定 =====
function initCreativeTools() {
    // 创意工具箱
    document.getElementById('openToolsBtn').addEventListener('click', () => {
        document.getElementById('toolsModal').classList.add('active');
    });

    document.getElementById('closeToolsBtn').addEventListener('click', () => {
        document.getElementById('toolsModal').classList.remove('active');
    });

    document.getElementById('generateTitleBtn').addEventListener('click', generateTitle);
    document.getElementById('generateSynopsisBtn').addEventListener('click', generateSynopsis);

    // AI拆书
    document.getElementById('openAIAnalysisBtn').addEventListener('click', () => {
        document.getElementById('aiAnalysisModal').classList.add('active');
    });

    document.getElementById('closeAnalysisBtn').addEventListener('click', () => {
        document.getElementById('aiAnalysisModal').classList.remove('active');
    });

    document.getElementById('analyzeBtn').addEventListener('click', analyzeNovel);
    document.getElementById('copyAnalysisBtn').addEventListener('click', copyAnalysis);

    // 一键检查
    document.getElementById('checkChapterBtn').addEventListener('click', () => {
        document.getElementById('checkModal').classList.add('active');
    });

    document.getElementById('closeCheckBtn').addEventListener('click', () => {
        document.getElementById('checkModal').classList.remove('active');
    });

    document.getElementById('startCheckBtn').addEventListener('click', performChapterCheck);
    document.getElementById('copyCheckBtn').addEventListener('click', copyCheckReport);
}

// ===== 书名生成器 =====
async function generateTitle() {
    const theme = document.getElementById('titleThemeInput').value.trim();

    if (!theme) {
        alert('请输入小说类型和主题');
        return;
    }

    showLoading('正在生成书名...');

    const prompt = `作为博哥，一位资深作家，请根据以下小说主题生成10个吸引人的书名：

【主题描述】
${theme}

要求：
1. 书名要简洁有力，3-8个字为宜
2. 能够体现小说的核心特色和类型
3. 具有吸引力和记忆点
4. 符合网络小说命名习惯
5. 提供多样化的风格选择

请以列表形式输出10个书名，每个书名后简要说明其特点：

1. 书名 - 特点说明
2. ...`;

    try {
        const result = await callAIAPI(prompt, 1500);
        document.getElementById('titleOutput').innerHTML = formatMarkdown(result);
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 简介生成器 =====
async function generateSynopsis() {
    const title = document.getElementById('synopsisTitle').value.trim();
    const theme = document.getElementById('synopsisThemeInput').value.trim();

    if (!title || !theme) {
        alert('请输入书名和核心设定');
        return;
    }

    showLoading('正在生成简介...');

    const prompt = `作为博哥，请为以下小说生成精彩的简介：

【书名】
${title}

【核心设定】
${theme}

要求：
1. 简介长度200-300字
2. 开头要有吸引力，设置悬念或亮点
3. 突出主角特色和核心冲突
4. 体现小说的独特卖点
5. 结尾留有期待感
6. 语言精炼，节奏紧凑

请直接输出简介内容：`;

    try {
        const result = await callAIAPI(prompt, 1000);
        document.getElementById('synopsisOutput').innerHTML = formatMarkdown(result);
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== AI拆书分析 =====
async function analyzeNovel() {
    const content = document.getElementById('analysisInput').value.trim();
    const analysisType = document.querySelector('input[name="analysisType"]:checked').value;

    if (!content) {
        alert('请输入要分析的小说内容');
        return;
    }

    showLoading('正在分析小说...');

    const analysisPrompts = {
        structure: `作为博哥，一位资深写作导师，请深度分析以下小说片段的结构特点：

【小说片段】
${content}

请从以下角度进行结构分析：

1. **叙事结构**：开头、发展、转折、高潮等
2. **情节架构**：主线、副线、伏笔设置
3. **节奏控制**：信息释放、紧张度调节
4. **章节设计**：悬念设置、结尾钩子
5. **可借鉴技巧**：哪些结构方法值得学习

请提供详细分析和创作建议。`,

        technique: `作为博哥，请分析以下小说片段的写作技巧：

【小说片段】
${content}

请从以下角度分析写作技巧：

1. **语言风格**：词汇运用、句式特点
2. **人物塑造**：对话、动作、心理描写
3. **场景构建**：环境描写、氛围营造
4. **细节处理**：细节选择、感官体验
5. **修辞手法**：比喻、排比等技巧运用
6. **可学习要点**：具体的写作技巧建议

请提供详细分析和示例。`,

        creativity: `作为博哥，请从以下小说片段中提取创意灵感：

【小说片段】
${content}

请提取以下创意元素：

1. **核心创意**：最吸引人的创意点是什么
2. **设定亮点**：世界观、能力体系、规则设定
3. **人物特色**：角色设计的独特之处
4. **情节创新**：新颖的情节设计
5. **可迁移创意**：哪些创意可以用于其他题材
6. **衍生灵感**：基于此产生的新创意想法

请提供详细的创意分析和启发建议。`,

        comprehensive: `作为博哥，请全面分析以下小说片段：

【小说片段】
${content}

请进行综合分析：

## 一、结构分析
- 叙事结构特点
- 情节组织方式

## 二、写作技巧
- 语言特色
- 描写手法

## 三、创意提取
- 核心创意点
- 可借鉴元素

## 四、优缺点评价
- 优秀之处
- 可改进之处

## 五、创作建议
- 如何借鉴学习
- 避免的问题

请提供详细、系统的分析。`
    };

    const prompt = analysisPrompts[analysisType];

    try {
        const result = await callAIAPI(prompt, 3000);
        const output = document.getElementById('analysisOutput');
        output.innerHTML = formatMarkdown(result);
        output.style.display = 'block';
        document.getElementById('copyAnalysisBtn').disabled = false;
    } catch (error) {
        alert('分析失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 复制分析结果 =====
async function copyAnalysis() {
    const text = document.getElementById('analysisOutput').innerText;

    try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('copyAnalysisBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    } catch (error) {
        alert('复制失败，请手动选择文本复制');
    }
}

// ===== 润色章节 =====
async function polishChapter() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);

    if (!chapterNum || !novelData.chapters[chapterNum]) {
        alert('请先选择已创作的章节');
        return;
    }

    // 弹出风格选择对话框
    const style = await selectPolishStyle();
    if (!style) return;

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    const originalContent = novelData.chapters[chapterNum];

    // 检查是否为自定义要求
    const isCustom = typeof style === 'object' && style.custom;
    const displayStyle = isCustom ? '自定义' : style;

    showLoading(`正在以${displayStyle}方式润色章节...`);

    let prompt;

    if (isCustom) {
        // 自定义润色要求
        prompt = `作为博哥，请根据以下自定义要求对章节内容进行润色和修改：

【章节信息】
第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}

【原文内容】
${originalContent}

【自定义润色要求】
${style.requirement}

润色要求：
1. **重点关注**：严格按照用户提出的自定义要求进行修改
2. **保持核心**：不改变核心情节和人物设定
3. **语言优化**：在满足自定义要求的同时提升文字质量
4. **逻辑修正**：如果要求涉及逻辑问题，请仔细修正相关矛盾
5. **细节完善**：在修改过程中适当补充必要的细节
6. **字数要求**：修改后字数不少于原文

【重要格式要求 - 番茄小说平台规范】：
7. **纯文本格式**：不要使用任何Markdown标记符号（*、**、#、##等）
8. **对话格式**：对话使用中文引号""，不要用星号或其他符号
9. **强调内容**：需要强调的内容直接用文字表达，不要用**加粗**或*斜体*
10. **段落分隔**：段落之间空一行，不要使用特殊符号
11. **内容纯净**：输出纯小说正文，可直接复制粘贴到番茄小说平台

请直接输出润色后的章节内容：`;
    } else {
        // 预设风格润色
        const stylePrompts = {
            '文艺优美': '使用优美的文学语言，增强意境和诗意，提升文字的艺术性',
            '热血激昂': '强化动作描写和情绪渲染，增加紧张感和激情，使用更有力的词汇',
            '悬疑紧张': '增强悬念和神秘感，加强氛围营造，使用暗示和铺垫',
            '轻松幽默': '增加幽默元素和轻松对话，使用诙谐的语言，缓和紧张气氛',
            '深沉厚重': '增强历史感和厚重感，使用庄重的语言，深化主题',
            '清新自然': '使用简洁明快的语言，注重自然流畅，避免过度修饰'
        };

        prompt = `作为博哥，请对以下章节内容进行**${style}风格**的润色：

【章节信息】
第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}

【原文内容】
${originalContent}

【润色风格】
${stylePrompts[style]}

润色要求：
1. **风格一致**：全文贯彻${style}风格
2. **语言优化**：提升文字的流畅性和表现力
3. **细节增强**：丰富环境、动作、心理描写
4. **节奏调整**：优化叙事节奏，增强可读性
5. **对话打磨**：使对话更自然、更有个性
6. **保持原意**：不改变核心情节和人物设定
7. **字数要求**：润色后字数不少于原文

【重要格式要求 - 番茄小说平台规范】：
8. **纯文本格式**：不要使用任何Markdown标记符号（*、**、#、##等）
9. **对话格式**：对话使用中文引号""，不要用星号或其他符号
10. **强调内容**：需要强调的内容直接用文字表达，不要用**加粗**或*斜体*
11. **段落分隔**：段落之间空一行，不要使用特殊符号
12. **内容纯净**：输出纯小说正文，可直接复制粘贴到番茄小说平台

请直接输出润色后的章节内容：`;
    }

    try {
        const result = await callAIAPI(prompt, 8000);

        // 清理Markdown标记
        const cleanedResult = cleanMarkdownSymbols(result);

        // 保存润色版本
        if (!novelData.polishedChapters) {
            novelData.polishedChapters = {};
        }
        novelData.polishedChapters[chapterNum] = cleanedResult;

        displayChapterContent(cleanedResult);
        saveProgress();

        const styleDesc = isCustom ? `自定义（${style.requirement.substring(0, 20)}...）` : style;
        alert(`第${chapter.number}章润色完成（${styleDesc}）！\n字数：${cleanedResult.length}字\n\n提示：已保存润色版本，原文仍保留`);
    } catch (error) {
        alert('润色失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 选择润色风格 =====
function selectPolishStyle() {
    return new Promise((resolve) => {
        const styles = ['文艺优美', '热血激昂', '悬疑紧张', '轻松幽默', '深沉厚重', '清新自然', '其他'];

        const styleList = styles.map((s, i) => `${i + 1}. ${s}`).join('\n');
        const choice = prompt(`请选择润色风格（输入数字1-7）：\n\n${styleList}\n\n输入0取消`, '1');

        if (choice === null || choice === '0') {
            resolve(null);
            return;
        }

        const index = parseInt(choice) - 1;
        if (index >= 0 && index < styles.length - 1) {
            resolve(styles[index]);
        } else if (index === styles.length - 1) {
            // 选择了"其他"，让用户输入自定义要求
            const customRequirement = prompt('请输入您的自定义润色要求（例如：修正逻辑错误、调整人物对话、优化情节衔接等）：');
            if (customRequirement && customRequirement.trim()) {
                resolve({ custom: true, requirement: customRequirement.trim() });
            } else {
                alert('未输入有效要求，已取消');
                resolve(null);
            }
        } else {
            alert('选择无效，已取消');
            resolve(null);
        }
    });
}

// ===== 扩写章节 =====
async function expandChapter() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);

    if (!chapterNum || !novelData.chapters[chapterNum]) {
        alert('请先选择已创作的章节');
        return;
    }

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);
    const originalContent = novelData.chapters[chapterNum];

    showLoading('正在扩写章节...');

    const prompt = `作为博哥，请对以下章节进行扩写：

【章节信息】
第${chapter.number.toString().padStart(3, '0')}章 ${chapter.title}

【原文内容】
${originalContent}

扩写要求：
1. **增加细节**：丰富场景描写、人物动作、心理活动
2. **补充对话**：增加人物间的互动对话，展现性格
3. **深化情感**：加强情感渲染和氛围营造
4. **扩展情节**：适当增加次要情节和细节事件
5. **保持连贯**：确保扩写内容自然融入原文
6. **字数要求**：扩写后字数至少为原文的1.5倍（不少于4500字）

【重要格式要求 - 番茄小说平台规范】：
7. **纯文本格式**：不要使用任何Markdown标记符号（*、**、#、##等）
8. **对话格式**：对话使用中文引号""，不要用星号或其他符号
9. **强调内容**：需要强调的内容直接用文字表达，不要用**加粗**或*斜体*
10. **段落分隔**：段落之间空一行，不要使用特殊符号
11. **内容纯净**：输出纯小说正文，可直接复制粘贴到番茄小说平台

请直接输出扩写后的完整章节内容：`;

    try {
        const result = await callAIAPI(prompt, 10000);

        // 清理Markdown标记
        const cleanedResult = cleanMarkdownSymbols(result);

        // 更新章节内容
        novelData.chapters[chapterNum] = cleanedResult;

        displayChapterContent(cleanedResult);
        saveProgress();

        alert(`第${chapter.number}章扩写完成！\n原文字数：${originalContent.length}字\n扩写后：${cleanedResult.length}字`);
    } catch (error) {
        alert('扩写失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 续写方向建议 =====
async function suggestWritingDirection() {
    const chapterNum = parseInt(document.getElementById('chapterSelect').value);

    if (!chapterNum) {
        alert('请先选择要创作的章节');
        return;
    }

    const chapter = novelData.outline.find(ch => ch.number === chapterNum);

    // 获取前面章节内容
    const previousChapters = [];
    for (let i = Math.max(1, chapterNum - 3); i < chapterNum; i++) {
        if (novelData.chapters[i]) {
            previousChapters.push({
                number: i,
                title: novelData.outline.find(ch => ch.number === i)?.title,
                content: novelData.chapters[i].substring(0, 500) + '...'
            });
        }
    }

    showLoading('正在生成续写建议...');

    const prompt = `作为博哥，请为第${chapter.number}章提供3-5个不同的续写方向建议：

【小说设定】
${JSON.stringify(novelData.settings, null, 2)}

【创作方案】
${novelData.plan.substring(0, 1000)}...

【本章信息】
章节序号：第${chapter.number.toString().padStart(3, '0')}章
章节标题：${chapter.title}

${previousChapters.length > 0 ? `【前文摘要】\n${previousChapters.map(pc => `第${pc.number}章 ${pc.title}\n${pc.content}`).join('\n\n')}` : ''}

请为本章提供3-5个不同的续写方向，每个方向包括：

## 方向 1：（简短标题）
- **核心思路**：这个方向的主要写作思路
- **情节要点**：主要情节安排
- **冲突设置**：主要冲突或矛盾
- **情感基调**：情感氛围（激昂/温馨/紧张等）
- **亮点**：这个方向的独特吸引力
- **适合场景**：最适合什么样的后续发展

## 方向 2：...

要求：
1. 方向之间要有差异化
2. 都要符合整体设定和前文
3. 提供具体可操作的建议
4. 说明每个方向的优劣

请生成完整的续写方向建议。`;

    try {
        const result = await callAIAPI(prompt, 3000);

        // 显示在输出区域
        const output = document.getElementById('chapterOutput');
        output.innerHTML = `<div class="suggestion-box">
            <h3>💡 第${chapter.number}章续写方向建议</h3>
            ${formatMarkdown(result)}
            <div class="suggestion-actions">
                <button onclick="closeSuggestion()" class="btn btn-secondary">关闭建议</button>
                <button onclick="copySuggestion()" class="btn btn-small">📋 复制建议</button>
            </div>
        </div>`;

        // 保存建议以供复制
        window.currentSuggestion = result;

        alert('续写方向建议已生成！请查看输出区域。');
    } catch (error) {
        alert('生成失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// 关闭建议
window.closeSuggestion = function() {
    const output = document.getElementById('chapterOutput');
    output.innerHTML = '<div class="placeholder"><p>请选择章节开始创作，或点击"继续下一章"按钮</p></div>';
};

// 复制建议
window.copySuggestion = async function() {
    try {
        await navigator.clipboard.writeText(window.currentSuggestion);
        alert('✅ 续写建议已复制到剪贴板');
    } catch (error) {
        alert('复制失败，请手动选择文本复制');
    }
};

// ===== 一键检查功能 =====
async function performChapterCheck() {
    const checkCharacter = document.getElementById('checkCharacter').checked;
    const checkConsistency = document.getElementById('checkConsistency').checked;
    const checkPlot = document.getElementById('checkPlot').checked;
    const checkAtmosphere = document.getElementById('checkAtmosphere').checked;

    if (!checkCharacter && !checkConsistency && !checkPlot && !checkAtmosphere) {
        alert('请至少选择一项检查内容');
        return;
    }

    // 获取所有已创作的章节
    const createdChapters = Object.keys(novelData.chapters || {}).map(num => parseInt(num)).sort((a, b) => a - b);

    if (createdChapters.length === 0) {
        alert('还没有创作任何章节，无法进行检查');
        return;
    }

    showLoading('正在进行全面质量检查...');

    // 收集所有章节内容（只取前500字作为摘要）
    const chaptersContent = createdChapters.map(num => {
        const chapter = novelData.outline.find(ch => ch.number === num);
        return `第${num}章 ${chapter?.title || ''}：\n${novelData.chapters[num].substring(0, 500)}...`;
    }).join('\n\n');

    // 构建检查提示词
    let checkSections = [];

    if (checkCharacter) {
        checkSections.push(`## 一、人物塑造检查

对已创作的${createdChapters.length}个章节进行人物塑造方面的检查，重点关注：

### 1. 人物行为合理性
- 行为是否符合人设
- 决策是否符合性格
- 情感反应是否真实
- 成长轨迹是否自然

### 2. 对话真实性
- 是否符合人物身份
- 是否符合说话场景
- 是否体现人物特色
- 是否推动情节发展

请列出发现的问题，并提供具体的修改建议。`);
    }

    if (checkConsistency) {
        checkSections.push(`## 二、内容一致性检查

对已创作的${createdChapters.length}个章节进行内容一致性检查，重点关注：

### 1. 逻辑一致性
- 情节发展的因果关系
- 时间线是否存在矛盾
- 人物行为动机是否合理
- 世界设定是否自洽

### 2. 细节一致性
- 人物特征描写（外貌、习惯、说话方式等）
- 场景描写的前后呼应
- 重要道具的出现与使用
- 关键信息的前后对应

请列出发现的矛盾或不一致之处，并提供优先级排序的修改建议（高/中/低）。`);
    }

    if (checkPlot) {
        checkSections.push(`## 三、情节控制检查

对已创作的${createdChapters.length}个章节进行情节控制检查，重点关注：

### 1. 节奏把控
- 重要情节是否铺垫充分
- 高潮迭起是否合理
- 是否存在节奏断档
- 悬念设置是否适当

### 2. 剧情完整性
- 主要情节线是否完整
- 次要情节线是否收束
- 伏笔是否合理回收
- 结局是否合理交代

请指出情节发展中的问题，并提供调整建议。`);
    }

    if (checkAtmosphere) {
        checkSections.push(`## 四、氛围营造检查

对已创作的${createdChapters.length}个章节进行氛围营造检查，重点关注：

### 1. 场景描写
- 环境描写是否到位
- 氛围渲染是否恰当
- 细节描写是否生动
- 意境营造是否成功

### 2. 情感渲染
- 情感递进是否自然
- 感情表达是否真实
- 情绪调动是否恰当
- 共情效果是否达到

请评价氛围营造效果，并提供改进建议。`);
    }

    const prompt = `作为博哥，请对以下小说的已创作章节进行全面质量检查：

【小说基本信息】
类型：${novelData.settings?.genres?.join('、') || '未知'}
基调：${novelData.settings?.tone || '未知'}
视角：${novelData.settings?.perspective || '未知'}

【已创作章节摘要】
${chaptersContent}

【检查要求】
${checkSections.join('\n\n')}

---

**检查输出格式要求：**

对于每个检查部分，请按照以下格式输出：

### [检查项目名称]

**存在的问题：**
1. [具体问题描述] - 优先级：[高/中/低]
   - 出现位置：第X章
   - 问题详情：[详细说明]
   - 修改建议：[具体建议]

2. ...

**总体评价：**
[对该方面的总体评价，50-100字]

**后续创作注意事项：**
- [注意事项1]
- [注意事项2]
- ...

---

请生成完整的检查报告。`;

    try {
        const result = await callAIAPI(prompt, 5000);
        const output = document.getElementById('checkOutput');
        output.innerHTML = formatMarkdown(result);
        output.style.display = 'block';
        document.getElementById('copyCheckBtn').disabled = false;

        // 保存检查报告
        if (!novelData.checkReports) {
            novelData.checkReports = [];
        }
        novelData.checkReports.push({
            date: new Date().toLocaleString(),
            chapters: createdChapters,
            report: result
        });
        saveProgress();

        alert(`✅ 质量检查完成！\n\n已检查 ${createdChapters.length} 个章节\n检查报告已生成，请查看详细内容。`);
    } catch (error) {
        alert('检查失败：' + error.message);
    } finally {
        hideLoading();
    }
}

// ===== 复制检查报告 =====
async function copyCheckReport() {
    const text = document.getElementById('checkOutput').innerText;

    try {
        await navigator.clipboard.writeText(text);
        const btn = document.getElementById('copyCheckBtn');
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
window.initCreativeTools = initCreativeTools;
window.polishChapter = polishChapter;
window.expandChapter = expandChapter;
window.suggestWritingDirection = suggestWritingDirection;
