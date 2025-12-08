/**
 * shuffle.js
 * Các hàm tiện ích để random và xáo trộn câu hỏi
 */

/**
 * Xáo trộn một mảng bằng thuật toán Fisher-Yates
 * @param {Array} array - Mảng cần xáo trộn
 * @returns {Array} - Mảng đã được xáo trộn
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Tạo bản sao để không thay đổi mảng gốc
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Tạo index ngẫu nhiên từ 0 đến i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Hoán đổi phần tử tại vị trí i và j
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

/**
 * Lấy n câu hỏi ngẫu nhiên từ danh sách
 * @param {Array} questions - Danh sách câu hỏi
 * @param {number} count - Số lượng câu hỏi cần lấy
 * @returns {Array} - Mảng câu hỏi ngẫu nhiên
 */
function getRandomQuestions(questions, count) {
    // Kiểm tra đầu vào
    if (!Array.isArray(questions) || questions.length === 0) {
        console.error('Invalid questions array');
        return [];
    }
    
    if (count > questions.length) {
        console.warn(`Requested ${count} questions but only ${questions.length} available`);
        count = questions.length;
    }
    
    // Xáo trộn và lấy n phần tử đầu
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count);
}

/**
 * Xáo trộn các đáp án của một câu hỏi
 * @param {Object} question - Câu hỏi với options {A, B, C, D}
 * @returns {Object} - Câu hỏi với options đã xáo trộn
 */
function shuffleOptions(question) {
    const options = ['A', 'B', 'C', 'D'];
    const shuffledOptions = shuffleArray(options);
    
    const newQuestion = {
        ...question,
        options: {},
        correctAnswer: question.correctAnswer
    };
    
    // Tạo mapping mới cho options
    const mapping = {};
    options.forEach((oldKey, index) => {
        const newKey = shuffledOptions[index];
        mapping[oldKey] = newKey;
        newQuestion.options[newKey] = question.options[oldKey];
    });
    
    // Cập nhật đáp án đúng theo mapping mới
    newQuestion.correctAnswer = mapping[question.correctAnswer];
    
    return newQuestion;
}

/**
 * Lấy câu hỏi ngẫu nhiên không trùng lặp
 * @param {Array} questions - Danh sách câu hỏi
 * @param {Array} excludeIds - Danh sách ID câu hỏi cần loại trừ
 * @param {number} count - Số lượng câu hỏi cần lấy
 * @returns {Array} - Mảng câu hỏi ngẫu nhiên
 */
function getRandomQuestionsExclude(questions, excludeIds = [], count = 1) {
    // Lọc bỏ các câu hỏi đã exclude
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));
    
    if (availableQuestions.length === 0) {
        console.warn('No available questions after exclusion');
        return [];
    }
    
    return getRandomQuestions(availableQuestions, count);
}

/**
 * Tạo seed để có thể tái tạo lại kết quả random
 * @param {string} seed - Chuỗi seed
 * @returns {function} - Hàm random với seed
 */
function seededRandom(seed) {
    let value = seed.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    return function() {
        value = (value * 9301 + 49297) % 233280;
        return value / 233280;
    };
}

/**
 * Xáo trộn mảng với seed để có thể tái tạo
 * @param {Array} array - Mảng cần xáo trộn
 * @param {string} seed - Seed để tái tạo
 * @returns {Array} - Mảng đã xáo trộn
 */
function shuffleArrayWithSeed(array, seed) {
    const shuffled = [...array];
    const random = seededRandom(seed);
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
}

// Export functions (nếu sử dụng modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shuffleArray,
        getRandomQuestions,
        shuffleOptions,
        getRandomQuestionsExclude,
        seededRandom,
        shuffleArrayWithSeed
    };
}