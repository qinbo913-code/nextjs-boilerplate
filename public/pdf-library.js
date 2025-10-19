// ===== PDF参考库管理模块 =====

// IndexedDB初始化
let pdfDB;

async function initPDF_DB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NovelReferenceDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            pdfDB = request.result;
            resolve(pdfDB);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pdfs')) {
                const store = db.createObjectStore('pdfs', { keyPath: 'id', autoIncrement: true });
                store.createIndex('name', 'name', { unique: false });
                store.createIndex('uploadDate', 'uploadDate', { unique: false });
            }
        };
    });
}

// 配置PDF.js
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// PDF提取文本
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

// 保存PDF到IndexedDB
async function savePDFToDatabase(file, text) {
    return new Promise((resolve, reject) => {
        const transaction = pdfDB.transaction(['pdfs'], 'readwrite');
        const store = transaction.objectStore('pdfs');

        const pdfData = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            text: text,
            excerpt: text.substring(0, 200) + '...' // 摘要
        };

        const request = store.add(pdfData);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 获取所有PDF
async function getAllPDFs() {
    return new Promise((resolve, reject) => {
        const transaction = pdfDB.transaction(['pdfs'], 'readonly');
        const store = transaction.objectStore('pdfs');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 删除PDF
async function deletePDF(id) {
    return new Promise((resolve, reject) => {
        const transaction = pdfDB.transaction(['pdfs'], 'readwrite');
        const store = transaction.objectStore('pdfs');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 清空所有PDF
async function clearAllPDFs() {
    return new Promise((resolve, reject) => {
        const transaction = pdfDB.transaction(['pdfs'], 'readwrite');
        const store = transaction.objectStore('pdfs');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// 获取参考内容（用于创作时引用）
async function getReferenceContent() {
    const enableReference = document.getElementById('enableReference')?.checked ?? true;
    if (!enableReference) return '';

    const pdfs = await getAllPDFs();
    if (pdfs.length === 0) return '';

    const smartReference = document.getElementById('smartReference')?.checked ?? true;

    let referenceText = '\n\n【写作参考资料】\n';

    pdfs.forEach((pdf, index) => {
        if (smartReference) {
            // 智能模式：只取摘要
            referenceText += `\n参考${index + 1}：《${pdf.name}》摘要\n${pdf.excerpt}\n`;
        } else {
            // 完整模式：取全文（限制长度）
            const maxLength = 1000;
            const text = pdf.text.length > maxLength ?
                pdf.text.substring(0, maxLength) + '...' : pdf.text;
            referenceText += `\n参考${index + 1}：《${pdf.name}》\n${text}\n`;
        }
    });

    referenceText += '\n以上为参考资料，请在创作时适当借鉴，但保持原创性。\n';

    return referenceText;
}

// UI更新函数
async function updatePDFList() {
    const container = document.getElementById('pdfListContainer');
    const countSpan = document.getElementById('pdfCount');

    const pdfs = await getAllPDFs();
    countSpan.textContent = pdfs.length;

    if (pdfs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>还没有上传任何参考资料</p>
                <p class="hint-text">上传PDF文件后，创作时会自动引用相关内容</p>
            </div>
        `;
        return;
    }

    container.innerHTML = pdfs.map(pdf => `
        <div class="pdf-item" data-id="${pdf.id}">
            <div class="pdf-info">
                <div class="pdf-icon">📄</div>
                <div class="pdf-details">
                    <div class="pdf-name">${pdf.name}</div>
                    <div class="pdf-meta">
                        ${(pdf.size / 1024).toFixed(1)} KB |
                        上传于 ${new Date(pdf.uploadDate).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div class="pdf-actions">
                <button class="btn btn-small btn-icon btn-danger" onclick="handleDeletePDF(${pdf.id})">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// 处理PDF上传
async function handlePDFUpload(files) {
    if (!files || files.length === 0) return;

    showLoading('正在处理PDF文件...');

    try {
        for (const file of files) {
            if (file.type !== 'application/pdf') {
                console.warn(`跳过非PDF文件: ${file.name}`);
                continue;
            }

            // 提取文本
            const text = await extractTextFromPDF(file);

            // 保存到数据库
            await savePDFToDatabase(file, text);
        }

        await updatePDFList();
        hideLoading();
        alert(`✅ 成功上传 ${files.length} 个PDF文件！`);
    } catch (error) {
        hideLoading();
        alert('❌ PDF处理失败: ' + error.message);
        console.error(error);
    }
}

// 删除单个PDF
async function handleDeletePDF(id) {
    if (!confirm('确定要删除这个参考资料吗？')) return;

    try {
        await deletePDF(id);
        await updatePDFList();
    } catch (error) {
        alert('删除失败: ' + error.message);
    }
}

// 清空所有PDF
async function handleClearAllPDFs() {
    if (!confirm('确定要清空所有参考资料吗？此操作不可恢复！')) return;

    try {
        await clearAllPDFs();
        await updatePDFList();
        alert('✅ 已清空所有参考资料');
    } catch (error) {
        alert('清空失败: ' + error.message);
    }
}

// 初始化参考库事件
function initReferenceLibrary() {
    // 打开参考库
    document.getElementById('openReferenceBtn').addEventListener('click', async () => {
        document.getElementById('referenceModal').classList.add('active');
        await updatePDFList();
    });

    // 关闭参考库
    document.getElementById('closeReferenceBtn').addEventListener('click', () => {
        document.getElementById('referenceModal').classList.remove('active');
    });

    // 选择文件按钮
    document.getElementById('selectPdfBtn').addEventListener('click', () => {
        document.getElementById('pdfFileInput').click();
    });

    // 文件选择
    document.getElementById('pdfFileInput').addEventListener('change', (e) => {
        handlePDFUpload(e.target.files);
        e.target.value = ''; // 重置input
    });

    // 拖拽上传
    const uploadBox = document.getElementById('uploadBox');

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        handlePDFUpload(e.dataTransfer.files);
    });

    // 清空全部
    document.getElementById('clearAllPdfsBtn').addEventListener('click', handleClearAllPDFs);

    // 点击上传区域
    uploadBox.addEventListener('click', (e) => {
        if (e.target === uploadBox || e.target.closest('.upload-icon, .upload-text')) {
            document.getElementById('pdfFileInput').click();
        }
    });
}

// 导出函数供全局使用
window.handleDeletePDF = handleDeletePDF;
window.initReferenceLibrary = initReferenceLibrary;
window.getReferenceContent = getReferenceContent;
window.initPDF_DB = initPDF_DB;
