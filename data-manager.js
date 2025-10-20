// ===== 数据管理模块 =====

// ===== 初始化数据管理功能 =====
function initDataManager() {
    // 打开数据管理模态框
    document.getElementById('openDataManagerBtn').addEventListener('click', openDataManager);
    document.getElementById('closeDataModalBtn').addEventListener('click', () => {
        document.getElementById('dataModal').classList.remove('active');
    });

    // 快捷操作
    document.getElementById('viewDataBtn').addEventListener('click', viewDataDetails);
    document.getElementById('exportJsonBtn').addEventListener('click', exportDataAsJson);
    document.getElementById('importJsonBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
    });
    document.getElementById('importFileInput').addEventListener('change', importDataFromJson);
    document.getElementById('backupDataBtn').addEventListener('click', backupAllData);

    // 高级操作
    document.getElementById('clearProgressBtn').addEventListener('click', clearProgress);
    document.getElementById('resetAllBtn').addEventListener('click', resetAll);
}

// ===== 打开数据管理器 =====
async function openDataManager() {
    document.getElementById('dataModal').classList.add('active');

    // 更新数据信息
    await updateDataInfo();
}

// ===== 更新数据信息 =====
async function updateDataInfo() {
    try {
        // 计算LocalStorage大小
        const novelDataStr = localStorage.getItem('novel_data') || '{}';
        const apiDataSize = JSON.stringify({
            api_provider: localStorage.getItem('api_provider'),
            claude_api_key: localStorage.getItem('claude_api_key'),
            claude_model: localStorage.getItem('claude_model'),
            gemini_api_key: localStorage.getItem('gemini_api_key'),
            gemini_model: localStorage.getItem('gemini_model'),
            kimi_api_key: localStorage.getItem('kimi_api_key'),
            kimi_model: localStorage.getItem('kimi_model')
        }).length;

        const totalSize = novelDataStr.length + apiDataSize;
        const sizeInKB = (totalSize / 1024).toFixed(2);
        document.getElementById('dataSize').textContent = `${sizeInKB} KB`;

        // 获取创作进度
        const novelData = JSON.parse(novelDataStr);
        const chaptersCount = Object.keys(novelData.chapters || {}).length;
        const outlineCount = (novelData.outline || []).length;

        let progressText = '未开始';
        if (novelData.settings && Object.keys(novelData.settings).length > 0) {
            progressText = `步骤${currentStep || 1}`;
            if (chaptersCount > 0) {
                progressText += ` - 已创作 ${chaptersCount}/${outlineCount} 章`;
            }
        }
        document.getElementById('progressInfo').textContent = progressText;

    } catch (error) {
        console.error('更新数据信息失败:', error);
        document.getElementById('dataSize').textContent = '计算失败';
        document.getElementById('progressInfo').textContent = '获取失败';
    }
}

// ===== 查看数据详情 =====
async function viewDataDetails() {
    const detailsDiv = document.getElementById('dataDetails');

    if (detailsDiv.style.display === 'none') {
        detailsDiv.style.display = 'block';

        // 更新各项状态
        const novelDataStr = localStorage.getItem('novel_data') || '{}';
        const novelData = JSON.parse(novelDataStr);

        // 基础设定
        if (novelData.settings && Object.keys(novelData.settings).length > 0) {
            const genres = novelData.settings.genres?.join('、') || '未设置';
            document.getElementById('settingsStatus').textContent =
                `✅ 已设置（${genres}）`;
        } else {
            document.getElementById('settingsStatus').textContent = '❌ 未设置';
        }

        // 创作方案
        if (novelData.plan) {
            const planLength = novelData.plan.length;
            document.getElementById('planStatus').textContent =
                `✅ 已生成（${planLength}字）`;
        } else {
            document.getElementById('planStatus').textContent = '❌ 未生成';
        }

        // 角色信息
        if (novelData.characters) {
            const charLength = novelData.characters.length || novelData.characters.toString().length;
            document.getElementById('charactersStatus').textContent =
                `✅ 已生成（${charLength}字）`;
        } else {
            document.getElementById('charactersStatus').textContent = '❌ 未生成';
        }

        // 章节目录
        if (novelData.outline && novelData.outline.length > 0) {
            document.getElementById('outlineStatus').textContent =
                `✅ 已生成（${novelData.outline.length}章）`;
        } else {
            document.getElementById('outlineStatus').textContent = '❌ 未生成';
        }

        // 已创作章节
        const chaptersCount = Object.keys(novelData.chapters || {}).length;
        if (chaptersCount > 0) {
            const totalWords = Object.values(novelData.chapters).reduce((sum, ch) => sum + ch.length, 0);
            document.getElementById('chaptersStatus').textContent =
                `✅ ${chaptersCount}章（共${totalWords}字）`;
        } else {
            document.getElementById('chaptersStatus').textContent = '❌ 未创作';
        }

        // PDF参考库
        try {
            if (typeof getAllPDFs === 'function') {
                const pdfs = await getAllPDFs();
                if (pdfs.length > 0) {
                    document.getElementById('pdfStatus').textContent =
                        `✅ ${pdfs.length}个PDF文件`;
                } else {
                    document.getElementById('pdfStatus').textContent = '❌ 未上传';
                }
            } else {
                document.getElementById('pdfStatus').textContent = '未启用';
            }
        } catch (error) {
            document.getElementById('pdfStatus').textContent = '获取失败';
        }

        document.getElementById('viewDataBtn').textContent = '👁️ 隐藏详情';
    } else {
        detailsDiv.style.display = 'none';
        document.getElementById('viewDataBtn').textContent = '👁️ 查看数据';
    }
}

// ===== 导出数据为JSON =====
async function exportDataAsJson() {
    try {
        // 收集所有数据
        const exportData = {
            version: '5.0.0',
            exportDate: new Date().toISOString(),
            novelData: JSON.parse(localStorage.getItem('novel_data') || '{}'),
            currentStep: localStorage.getItem('current_step'),
            apiProvider: localStorage.getItem('api_provider'),
            // 注意：不导出API密钥，保护安全
        };

        // 添加PDF参考库信息（但不包含实际文件内容，文件太大）
        if (typeof getAllPDFs === 'function') {
            const pdfs = await getAllPDFs();
            exportData.pdfLibrary = {
                count: pdfs.length,
                files: pdfs.map(pdf => ({
                    name: pdf.name,
                    size: pdf.size,
                    uploadDate: pdf.uploadDate
                }))
            };
        }

        // 生成JSON文件
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `小说创作数据_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✅ 数据导出成功！\n\n文件已下载到浏览器默认下载文件夹。\n\n💡 建议：\n1. 将文件移动到：D:\\小说网站\\数据备份\n2. 或手动选择保存位置\n\n注意：PDF参考库文件未包含在导出中，请单独备份。');
    } catch (error) {
        alert('❌ 导出失败：' + error.message);
    }
}

// ===== 导入数据从JSON =====
async function importDataFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!confirm('⚠️ 导入数据将覆盖当前所有创作内容，是否继续？\n\n建议先导出备份当前数据。')) {
        event.target.value = ''; // 清空文件选择
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const importData = JSON.parse(e.target.result);

                // 验证数据格式
                if (!importData.novelData) {
                    throw new Error('无效的数据文件格式');
                }

                // 导入小说数据
                localStorage.setItem('novel_data', JSON.stringify(importData.novelData));

                if (importData.currentStep) {
                    localStorage.setItem('current_step', importData.currentStep);
                }

                if (importData.apiProvider) {
                    localStorage.setItem('api_provider', importData.apiProvider);
                }

                alert('✅ 数据导入成功！\n\n页面将刷新以加载新数据。');

                // 刷新页面
                setTimeout(() => {
                    location.reload();
                }, 1000);

            } catch (error) {
                alert('❌ 导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
    } catch (error) {
        alert('❌ 读取文件失败：' + error.message);
    }

    // 清空文件选择
    event.target.value = '';
}

// ===== 备份所有数据 =====
async function backupAllData() {
    try {
        const backupData = {
            version: '5.0.0',
            backupDate: new Date().toISOString(),

            // 小说创作数据
            novelData: JSON.parse(localStorage.getItem('novel_data') || '{}'),
            currentStep: localStorage.getItem('current_step'),

            // API配置（包含密钥，注意安全）
            apiConfig: {
                provider: localStorage.getItem('api_provider'),
                claude: {
                    key: localStorage.getItem('claude_api_key'),
                    model: localStorage.getItem('claude_model')
                },
                gemini: {
                    key: localStorage.getItem('gemini_api_key'),
                    model: localStorage.getItem('gemini_model')
                },
                kimi: {
                    key: localStorage.getItem('kimi_api_key'),
                    model: localStorage.getItem('kimi_model')
                }
            }
        };

        // PDF信息
        if (typeof getAllPDFs === 'function') {
            const pdfs = await getAllPDFs();
            backupData.pdfLibrary = {
                count: pdfs.length,
                files: pdfs.map(pdf => ({
                    name: pdf.name,
                    size: pdf.size,
                    uploadDate: pdf.uploadDate
                }))
            };
        }

        // 生成备份文件
        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        a.download = `完整备份_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✅ 完整备份成功！\n\n文件已下载到浏览器默认下载文件夹。\n\n💡 建议保存位置：D:\\小说网站\\数据备份\n\n包含内容：\n✓ 创作数据\n✓ API配置和密钥\n\n⚠️ 备份文件包含API密钥，请妥善保管！\n\n注意：PDF文件未包含，请单独备份。');
    } catch (error) {
        alert('❌ 备份失败：' + error.message);
    }
}

// ===== 清空进度（保留API配置）=====
function clearProgress() {
    if (!confirm('⚠️ 确定要清空所有创作进度吗？\n\n这将删除：\n- 基础设定\n- 创作方案\n- 角色信息\n- 章节目录\n- 已创作章节\n\nAPI配置将保留。\n\n此操作不可恢复！')) {
        return;
    }

    if (!confirm('⚠️⚠️ 再次确认：真的要删除所有创作内容吗？\n\n建议先导出备份！')) {
        return;
    }

    try {
        // 清空创作数据
        localStorage.removeItem('novel_data');
        localStorage.removeItem('current_step');

        // 重置全局变量
        if (typeof novelData !== 'undefined') {
            novelData = {
                settings: {},
                plan: '',
                characters: [],
                outline: [],
                chapters: {}
            };
        }

        alert('✅ 创作进度已清空！\n\n页面将刷新。');

        setTimeout(() => {
            location.reload();
        }, 1000);

    } catch (error) {
        alert('❌ 清空失败：' + error.message);
    }
}

// ===== 重置全部（包括API配置）=====
function resetAll() {
    if (!confirm('⚠️⚠️⚠️ 危险操作！\n\n确定要重置全部数据吗？\n\n这将删除：\n- 所有创作内容\n- API配置和密钥\n- PDF参考库\n\n此操作不可恢复！')) {
        return;
    }

    if (!confirm('⚠️⚠️⚠️ 最后确认：真的要删除一切吗？\n\n强烈建议先完整备份！\n\n输入"确认重置"继续：') !== '确认重置') {
        return;
    }

    try {
        // 清空LocalStorage
        localStorage.clear();

        // 清空IndexedDB（PDF库）
        if (typeof clearAllPDFs === 'function') {
            clearAllPDFs();
        }

        alert('✅ 所有数据已重置！\n\n页面将刷新。');

        setTimeout(() => {
            location.reload();
        }, 1000);

    } catch (error) {
        alert('❌ 重置失败：' + error.message);
    }
}

// 导出函数供全局使用
window.initDataManager = initDataManager;
