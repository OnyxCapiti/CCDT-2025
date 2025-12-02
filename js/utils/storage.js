/**
 * storage.js
 * Các hàm tiện ích để làm việc với LocalStorage
 */

const STORAGE_KEYS = {
    PRACTICE_PROGRESS: 'quiz_practice_progress',
    EXAM_ANSWERS: 'quiz_exam_answers',
    EXAM_QUESTIONS: 'quiz_exam_questions',
    EXAM_START_TIME: 'quiz_exam_start_time',
    EXAM_TIME_LEFT: 'quiz_exam_time_left',
    USER_STATS: 'quiz_user_stats'
};

/**
 * Lưu dữ liệu vào LocalStorage
 * @param {string} key - Key để lưu
 * @param {*} value - Giá trị cần lưu (sẽ được chuyển thành JSON)
 * @returns {boolean} - True nếu lưu thành công
 */
function saveToStorage(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
}

/**
 * Lấy dữ liệu từ LocalStorage
 * @param {string} key - Key cần lấy
 * @param {*} defaultValue - Giá trị mặc định nếu không tìm thấy
 * @returns {*} - Dữ liệu đã parse hoặc defaultValue
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue === null) {
            return defaultValue;
        }
        return JSON.parse(jsonValue);
    } catch (error) {
        console.error('Error reading from storage:', error);
        return defaultValue;
    }
}

/**
 * Xóa dữ liệu từ LocalStorage
 * @param {string} key - Key cần xóa
 * @returns {boolean} - True nếu xóa thành công
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from storage:', error);
        return false;
    }
}

/**
 * Xóa tất cả dữ liệu quiz
 * @returns {boolean} - True nếu xóa thành công
 */
function clearAllQuizData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        return true;
    } catch (error) {
        console.error('Error clearing quiz data:', error);
        return false;
    }
}

/**
 * Lưu tiến trình ôn luyện
 * @param {Object} answers - Object chứa câu trả lời {questionId: answer}
 * @returns {boolean} - True nếu lưu thành công
 */
function savePracticeProgress(answers) {
    return saveToStorage(STORAGE_KEYS.PRACTICE_PROGRESS, answers);
}

/**
 * Lấy tiến trình ôn luyện
 * @returns {Object} - Object chứa câu trả lời đã lưu
 */
function getPracticeProgress() {
    return getFromStorage(STORAGE_KEYS.PRACTICE_PROGRESS, {});
}

/**
 * Xóa tiến trình ôn luyện
 * @returns {boolean} - True nếu xóa thành công
 */
function clearPracticeProgress() {
    return removeFromStorage(STORAGE_KEYS.PRACTICE_PROGRESS);
}

/**
 * Lưu câu trả lời thi thử
 * @param {Object} answers - Object chứa câu trả lời
 * @returns {boolean} - True nếu lưu thành công
 */
function saveExamAnswers(answers) {
    return saveToStorage(STORAGE_KEYS.EXAM_ANSWERS, answers);
}

/**
 * Lấy câu trả lời thi thử
 * @returns {Object} - Object chứa câu trả lời
 */
function getExamAnswers() {
    return getFromStorage(STORAGE_KEYS.EXAM_ANSWERS, {});
}

/**
 * Lưu danh sách câu hỏi thi thử
 * @param {Array} questions - Mảng câu hỏi
 * @returns {boolean} - True nếu lưu thành công
 */
function saveExamQuestions(questions) {
    return saveToStorage(STORAGE_KEYS.EXAM_QUESTIONS, questions);
}

/**
 * Lấy danh sách câu hỏi thi thử
 * @returns {Array} - Mảng câu hỏi hoặc null
 */
function getExamQuestions() {
    return getFromStorage(STORAGE_KEYS.EXAM_QUESTIONS, null);
}

/**
 * Lưu thời gian bắt đầu thi
 * @param {number} timestamp - Timestamp bắt đầu
 * @returns {boolean} - True nếu lưu thành công
 */
function saveExamStartTime(timestamp) {
    return saveToStorage(STORAGE_KEYS.EXAM_START_TIME, timestamp);
}

/**
 * Lấy thời gian bắt đầu thi
 * @returns {number|null} - Timestamp hoặc null
 */
function getExamStartTime() {
    return getFromStorage(STORAGE_KEYS.EXAM_START_TIME, null);
}

/**
 * Lưu thời gian còn lại
 * @param {number} timeLeft - Số giây còn lại
 * @returns {boolean} - True nếu lưu thành công
 */
function saveExamTimeLeft(timeLeft) {
    return saveToStorage(STORAGE_KEYS.EXAM_TIME_LEFT, timeLeft);
}

/**
 * Lấy thời gian còn lại
 * @returns {number|null} - Số giây còn lại hoặc null
 */
function getExamTimeLeft() {
    return getFromStorage(STORAGE_KEYS.EXAM_TIME_LEFT, null);
}

/**
 * Xóa tất cả dữ liệu thi thử
 * @returns {boolean} - True nếu xóa thành công
 */
function clearExamData() {
    try {
        removeFromStorage(STORAGE_KEYS.EXAM_ANSWERS);
        removeFromStorage(STORAGE_KEYS.EXAM_QUESTIONS);
        removeFromStorage(STORAGE_KEYS.EXAM_START_TIME);
        removeFromStorage(STORAGE_KEYS.EXAM_TIME_LEFT);
        return true;
    } catch (error) {
        console.error('Error clearing exam data:', error);
        return false;
    }
}

/**
 * Lưu thống kê người dùng
 * @param {Object} stats - Object chứa thống kê
 * @returns {boolean} - True nếu lưu thành công
 */
function saveUserStats(stats) {
    return saveToStorage(STORAGE_KEYS.USER_STATS, stats);
}

/**
 * Lấy thống kê người dùng
 * @returns {Object} - Object thống kê
 */
function getUserStats() {
    return getFromStorage(STORAGE_KEYS.USER_STATS, {
        totalExams: 0,
        totalPassed: 0,
        totalFailed: 0,
        bestScore: 0,
        averageScore: 0,
        examHistory: []
    });
}

/**
 * Cập nhật thống kê sau khi thi
 * @param {number} score - Điểm số
 * @param {boolean} passed - Đạt hay không
 * @returns {Object} - Thống kê mới
 */
function updateUserStats(score, passed) {
    const stats = getUserStats();
    
    stats.totalExams++;
    if (passed) {
        stats.totalPassed++;
    } else {
        stats.totalFailed++;
    }
    
    if (score > stats.bestScore) {
        stats.bestScore = score;
    }
    
    // Tính điểm trung bình
    stats.averageScore = stats.examHistory.length > 0
        ? (stats.examHistory.reduce((sum, exam) => sum + exam.score, 0) + score) / (stats.examHistory.length + 1)
        : score;
    
    // Thêm vào lịch sử (giữ tối đa 10 lần thi gần nhất)
    stats.examHistory.unshift({
        date: new Date().toISOString(),
        score: score,
        passed: passed
    });
    
    if (stats.examHistory.length > 10) {
        stats.examHistory = stats.examHistory.slice(0, 10);
    }
    
    saveUserStats(stats);
    return stats;
}

/**
 * Kiểm tra xem LocalStorage có khả dụng không
 * @returns {boolean} - True nếu khả dụng
 */
function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.warn('LocalStorage is not available:', error);
        return false;
    }
}

/**
 * Lấy dung lượng đã sử dụng của LocalStorage (ước tính)
 * @returns {number} - Số bytes đã sử dụng
 */
function getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
}

/**
 * Format dung lượng storage thành KB hoặc MB
 * @param {number} bytes - Số bytes
 * @returns {string} - Chuỗi đã format
 */
function formatStorageSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

// Export functions (nếu sử dụng modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEYS,
        saveToStorage,
        getFromStorage,
        removeFromStorage,
        clearAllQuizData,
        savePracticeProgress,
        getPracticeProgress,
        clearPracticeProgress,
        saveExamAnswers,
        getExamAnswers,
        saveExamQuestions,
        getExamQuestions,
        saveExamStartTime,
        getExamStartTime,
        saveExamTimeLeft,
        getExamTimeLeft,
        clearExamData,
        saveUserStats,
        getUserStats,
        updateUserStats,
        isStorageAvailable,
        getStorageSize,
        formatStorageSize
    };
}