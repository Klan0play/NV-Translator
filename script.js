document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const swapLangs = document.getElementById('swapLangs');
    const charCount = document.getElementById('charCount');
    const voiceInput = document.getElementById('voiceInput');
    const copyTranslation = document.getElementById('copyTranslation');
    const speakTranslation = document.getElementById('speakTranslation');
    const saveTranslation = document.getElementById('saveTranslation');
    const clearInput = document.getElementById('clearInput');
    const pasteText = document.getElementById('pasteText');
    const toggleHistory = document.getElementById('toggleHistory');
    const historyPanel = document.getElementById('historyPanel');
    const clearHistory = document.getElementById('clearHistory');
    const showSettings = document.getElementById('showSettings');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const resetSettings = document.getElementById('resetSettings');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const timeTaken = document.getElementById('timeTaken');
    const charTranslated = document.getElementById('charTranslated');
    const historyList = document.getElementById('historyList');
    const themeSelect = document.getElementById('themeSelect');
    const textSize = document.getElementById('textSize');

    // Имитация переводов
    const translations = {
        'ru-en': {
            'привет': 'hello',
            'как дела': 'how are you',
            'спасибо': 'thank you',
            'до свидания': 'goodbye'
        },
        'en-ru': {
            'hello': 'привет',
            'how are you': 'как дела',
            'thank you': 'спасибо',
            'goodbye': 'до свидания'
        },
        'ru-kk': {
            'привет': 'сәлем',
            'спасибо': 'рахмет',
            'до свидания': 'сау болыңыз'
        }
    };

    // Показать уведомление
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const text = document.getElementById('notificationText');
        
        text.textContent = message;
        
        if (type === 'error') {
            notification.style.borderColor = '#ff5050';
        } else if (type === 'success') {
            notification.style.borderColor = '#00ff00';
        } else {
            notification.style.borderColor = '#00f0ff';
        }
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Обновить счетчик символов
    function updateCharCount() {
        const length = inputText.value.length;
        charCount.textContent = length;
        
        if (length > 4500) {
            charCount.style.color = '#ff5050';
        } else if (length > 3000) {
            charCount.style.color = '#ffaa00';
        } else {
            charCount.style.color = '#00f0ff';
        }
    }

    // Перевод текста
    function translateText() {
        const text = inputText.value.trim();
        
        if (!text) {
            showNotification('Введите текст для перевода', 'error');
            return;
        }
        
        if (text.length > 5000) {
            showNotification('Превышен лимит 5000 символов', 'error');
            return;
        }
        
        const from = sourceLang.value;
        const to = targetLang.value;
        
        // Показать загрузку
        outputText.innerHTML = `
            <div class="output-placeholder">
                <i class="fas fa-cog fa-spin"></i>
                <p>Обработка нейросетью...</p>
                <small>NanoVault AI v3.0</small>
            </div>
        `;
        
        translateBtn.disabled = true;
        const startTime = Date.now();
        
        // Имитация работы AI
        setTimeout(() => {
            let translated;
            const key = `${from}-${to}`;
            
            if (from === 'auto') {
                // Определяем язык (простая логика)
                const isEnglish = /^[a-zA-Z\s]+$/.test(text);
                const detectedLang = isEnglish ? 'en' : 'ru';
                translated = `[Определен язык: ${detectedLang === 'en' ? 'Английский' : 'Русский'}]\n${text}`;
            } else if (translations[key]) {
                // Ищем точный перевод
                const lowerText = text.toLowerCase();
                translated = translations[key][lowerText] || 
                           `Перевод "${text}" с ${getLangName(from)} на ${getLangName(to)}`;
            } else {
                // Общий случай
                translated = `[${getLangName(from)} → ${getLangName(to)}]\n"${text}"\n\n(Имитация перевода AI NanoVault)`;
            }
            
            const endTime = Date.now();
            const time = (endTime - startTime) / 1000;
            
            outputText.innerHTML = `
                <div class="translated-content">
                    <div class="translation-header">
                        <span class="lang-pair">${getLangCode(from)} → ${getLangCode(to)}</span>
                        <span class="ai-badge">NanoVault AI</span>
                    </div>
                    <div class="translation-text">${translated}</div>
                </div>
            `;
            
            timeTaken.textContent = `${time.toFixed(2)}с`;
            charTranslated.textContent = text.length;
            
            translateBtn.disabled = false;
            
            // Сохранить в историю
            saveToHistory(text, translated, from, to);
            showNotification('Перевод выполнен нейросетью NV AI', 'success');
        }, 800 + Math.random() * 1200);
    }

    // Получить название языка
    function getLangName(code) {
        const names = {
            'ru': 'Русский', 'en': 'Английский', 'kk': 'Казахский',
            'de': 'Немецкий', 'fr': 'Французский', 'es': 'Испанский',
            'zh': 'Китайский', 'ja': 'Японский', 'auto': 'Автоопределение'
        };
        return names[code] || code;
    }

    // Получить код языка для отображения
    function getLangCode(code) {
        const codes = {
            'ru': 'RU', 'en': 'EN', 'kk': 'KK', 'de': 'DE',
            'fr': 'FR', 'es': 'ES', 'zh': 'ZH', 'ja': 'JA',
            'auto': 'AUTO'
        };
        return codes[code] || code;
    }

    // Сохранить в историю
    function saveToHistory(original, translation, from, to) {
        const history = JSON.parse(localStorage.getItem('nvTranslationHistory') || '[]');
        const historyItem = {
            id: Date.now(),
            original,
            translation,
            from,
            to,
            timestamp: new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        history.unshift(historyItem);
        if (history.length > 50) history.pop();
        
        localStorage.setItem('nvTranslationHistory', JSON.stringify(history));
        loadHistory();
    }

    // Загрузить историю
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('nvTranslationHistory') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-server"></i>
                    <p>База данных пуста</p>
                    <small>Переводы будут сохраняться здесь</small>
                </div>
            `;
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-original">${item.original.substring(0, 60)}${item.original.length > 60 ? '...' : ''}</div>
                <div class="history-translation">${item.translation.substring(0, 60)}${item.translation.length > 60 ? '...' : ''}</div>
                <div class="history-time">${item.timestamp} • ${getLangCode(item.from)}→${getLangCode(item.to)}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                inputText.value = item.original;
                outputText.innerHTML = `
                    <div class="translated-content">
                        <div class="translation-header">
                            <span class="lang-pair">${getLangCode(item.from)} → ${getLangCode(item.to)}</span>
                            <span class="history-badge">Из истории</span>
                        </div>
                        <div class="translation-text">${item.translation}</div>
                    </div>
                `;
                sourceLang.value = item.from;
                targetLang.value = item.to;
                updateCharCount();
                showNotification('Загружено из истории переводов');
            });
            
            historyList.appendChild(historyItem);
        });
    }

    // Очистить историю
    function clearHistoryFunc() {
        if (confirm('Очистить всю историю переводов?\nЭто действие нельзя отменить.')) {
            localStorage.removeItem('nvTranslationHistory');
            loadHistory();
            showNotification('История очищена', 'success');
        }
    }

    // Голосовой ввод
    function startVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            showNotification('Голосовой ввод не поддерживается в вашем браузере', 'error');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = sourceLang.value === 'auto' ? 'ru-RU' : `${sourceLang.value}-${sourceLang.value.toUpperCase()}`;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.start();
        voiceInput.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceInput.disabled = true;
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputText.value = transcript;
            updateCharCount();
            showNotification('Текст распознан', 'success');
        };
        
        recognition.onerror = () => {
            showNotification('Ошибка распознавания речи', 'error');
        };
        
        recognition.onend = () => {
            voiceInput.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceInput.disabled = false;
        };
    }

    // Озвучить перевод
    function speakTranslationFunc() {
        const text = outputText.textContent;
        if (!text || text.includes('Перевод появится здесь')) {
            showNotification('Нет текста для озвучивания', 'error');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang.value === 'en' ? 'en-US' : `${targetLang.value}-${targetLang.value.toUpperCase()}`;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
        showNotification('Озвучивание запущено');
    }

    // Копировать перевод
    function copyToClipboard() {
        const text = outputText.textContent;
        if (!text || text.includes('Перевод появится здесь')) {
            showNotification('Нет текста для копирования', 'error');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => showNotification('Перевод скопирован', 'success'))
            .catch(() => showNotification('Ошибка копирования', 'error'));
    }

    // Сохранить перевод
    function saveTranslationFunc() {
        const text = outputText.textContent;
        if (!text || text.includes('Перевод появится здесь')) {
            showNotification('Нет перевода для сохранения', 'error');
            return;
        }
        
        const blob = new Blob([`Перевод от NanoVault AI\n\n${text}\n\n© Команда KLAN_PLAY`], { 
            type: 'text/plain;charset=utf-8' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nv_translation_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Перевод сохранен в файл', 'success');
    }

    // Поменять языки местами
    function swapLanguages() {
        const temp = sourceLang.value;
        sourceLang.value = targetLang.value === 'auto' ? 'en' : targetLang.value;
        targetLang.value = temp === 'auto' ? 'en' : temp;
        
        if (inputText.value.trim()) {
            setTimeout(translateText, 300);
        }
        
        showNotification('Языки поменяны местами');
    }

    // Вставить текст из буфера
    async function pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateCharCount();
            showNotification('Текст вставлен из буфера', 'success');
        } catch {
            showNotification('Не удалось получить доступ к буферу обмена', 'error');
        }
    }

    // Изменить размер текста
    function updateTextSize() {
        document.documentElement.style.fontSize = `${textSize.value}px`;
        localStorage.setItem('nvTextSize', textSize.value);
    }

    // Изменить тему
    function updateTheme() {
        const theme = themeSelect.value;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('nvTheme', theme);
    }

    // Инициализация
    function init() {
        // Загрузить настройки
        const savedTheme = localStorage.getItem('nvTheme') || 'dark';
        const savedSize = localStorage.getItem('nvTextSize') || '16';
        
        document.body.setAttribute('data-theme', savedTheme);
        themeSelect.value = savedTheme;
        textSize.value = savedSize;
        updateTextSize();
        
        // Загрузить историю
        loadHistory();
        
        // Установить обработчики событий
        inputText.addEventListener('input', updateCharCount);
        
        inputText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                translateText();
            }
        });
        
        translateBtn.addEventListener('click', translateText);
        swapLangs.addEventListener('click', swapLanguages);
        voiceInput.addEventListener('click', startVoiceInput);
        copyTranslation.addEventListener('click', copyToClipboard);
        speakTranslation.addEventListener('click', speakTranslationFunc);
        saveTranslation.addEventListener('click', saveTranslationFunc);
        
        clearInput.addEventListener('click', () => {
            inputText.value = '';
            outputText.innerHTML = `
                <div class="output-placeholder">
                    <i class="fas fa-arrow-right"></i>
                    <p>Перевод появится здесь</p>
                    <small>Использует нейросеть NanoVault AI</small>
                </div>
            `;
            updateCharCount();
            showNotification('Поля очищены');
        });
        
        pasteText.addEventListener('click', pasteFromClipboard);
        
        toggleHistory.addEventListener('click', () => {
            historyPanel.classList.toggle('hidden');
            toggleHistory.textContent = historyPanel.classList.contains('hidden') ? 
                'Показать' : 'Скрыть';
        });
        
        clearHistory.addEventListener('click', clearHistoryFunc);
        
        showSettings.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
        
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
        
        saveSettings.addEventListener('click', () => {
            updateTheme();
            updateTextSize();
            settingsModal.classList.add('hidden');
            showNotification('Настройки сохранены', 'success');
        });
        
        resetSettings.addEventListener('click', () => {
            themeSelect.value = 'dark';
            textSize.value = '16';
            updateTheme();
            updateTextSize();
            showNotification('Настройки сброшены', 'success');
        });
        
        textSize.addEventListener('input', updateTextSize);
        themeSelect.addEventListener('change', updateTheme);
        
        // Закрыть модальное окно при клике вне его
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
        
        // Приветственное сообщение
        setTimeout(() => {
            showNotification('Добро пожаловать! NanoVault Translator готов к работе.');
        }, 1000);
    }

    // Запуск приложения
    init();
});

// Добавьте в конец функции init() в script.js:
// Анимация при наведении на аватарки
document.querySelectorAll('.member-avatar-large').forEach(avatar => {
    avatar.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    avatar.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Эффект для командной фотографии
const teamPhoto = document.querySelector('.team-photo-frame');
if (teamPhoto) {
    teamPhoto.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 40px rgba(0, 240, 255, 0.3)';
    });
    
    teamPhoto.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.2)';
    });
}

// Проверка загрузки аватарок
function checkAvatars() {
    const avatars = document.querySelectorAll('.avatar-image, .leader-avatar img');
    avatars.forEach(img => {
        img.addEventListener('error', function() {
            console.log(`Аватарка не загружена: ${this.src}`);
            // Можно добавить fallback на стандартный аватар
            if (this.parentElement.querySelector('.avatar-fallback')) {
                this.style.display = 'none';
            }
        });
        
        img.addEventListener('load', function() {
            console.log(`Аватарка загружена: ${this.src}`);
        });
    });
}

// Вызовите в init()
function init() {
    // ... существующий код ...
    checkAvatars();
    // ... остальной код ...
}