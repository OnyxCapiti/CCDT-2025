/**
 * calculator.js
 * Các hàm tiện ích để tính điểm và phân tích kết quả
 */

/**
 * Tính điểm cho bài thi
 * @param {Object} userAnswers - Object {questionId: answer}
 * @param {Array} questions - Mảng câu hỏi
 * @returns {Object} - Kết quả chi tiết
 */
function calculateScore(userAnswers, questions) {
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const wrongAnswers = [];
    const correctAnswers = [];

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[question.id];
        
        if (!userAnswer) {
            // Câu bỏ qua
            skippedCount++;
            wrongAnswers.push({
                number: index + 1,
                questionId: question.id,
                question: question.question,
                userAnswer: null,
                correctAnswer: question.correctAnswer,
                options: question.options,
                skipped: true
            });
        } else if (userAnswer === question.correctAnswer) {
            // Câu đúng
            correctCount++;
            correctAnswers.push({
                number: index + 1,
                questionId: question.id,
                question: question.question,
                answer: userAnswer
            });
        } else {
            // Câu sai
            wrongCount++;
            wrongAnswers.push({
                number: index + 1,
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer,
                correctAnswer: question.correctAnswer,
                options: question.options,
                skipped: false
            });
        }
    });

    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= 50;

    return {
        correctCount,
        wrongCount,
        skippedCount,
        totalQuestions,
        percentage: Math.round(percentage * 100) / 100,
        passed,
        wrongAnswers,
        correctAnswers,
        grade: getGrade(percentage)
    };
}

/**
 * Lấy xếp loại dựa trên phần trăm
 * @param {number} percentage - Phần trăm điểm
 * @returns {string} - Xếp loại
 */
function getGrade(percentage) {
    if (percentage >= 90) return 'Xuất sắc';
    if (percentage >= 80) return 'Giỏi';
    if (percentage >= 70) return 'Khá';
    if (percentage >= 50) return 'Trung bình';
    return 'Yếu';
}

/**
 * Lấy màu sắc theo phần trăm
 * @param {number} percentage - Phần trăm điểm
 * @returns {string} - Mã màu
 */
function getScoreColor(percentage) {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 70) return '#3b82f6'; // Blue
    if (percentage >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
}

/**
 * Tính điểm trung bình từ danh sách kết quả
 * @param {Array} results - Mảng kết quả {percentage}
 * @returns {number} - Điểm trung bình
 */
function calculateAverage(results) {
    if (!results || results.length === 0) return 0;
    
    const sum = results.reduce((acc, result) => acc + result.percentage, 0);
    return Math.round((sum / results.length) * 100) / 100;
}

/**
 * Tìm điểm cao nhất
 * @param {Array} results - Mảng kết quả {percentage}
 * @returns {number} - Điểm cao nhất
 */
function findBestScore(results) {
    if (!results || results.length === 0) return 0;
    
    return Math.max(...results.map(r => r.percentage));
}

/**
 * Tìm điểm thấp nhất
 * @param {Array} results - Mảng kết quả {percentage}
 * @returns {number} - Điểm thấp nhất
 */
function findWorstScore(results) {
    if (!results || results.length === 0) return 0;
    
    return Math.min(...results.map(r => r.percentage));
}

/**
 * Phân tích câu trả lời sai
 * @param {Array} wrongAnswers - Mảng câu sai
 * @returns {Object} - Phân tích chi tiết
 */
function analyzeWrongAnswers(wrongAnswers) {
    const analysis = {
        total: wrongAnswers.length,
        byOption: {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        },
        skipped: 0,
        mostCommonMistake: null
    };

    wrongAnswers.forEach(item => {
        if (item.skipped) {
            analysis.skipped++;
        } else if (item.userAnswer) {
            analysis.byOption[item.userAnswer]++;
        }
    });

    // Tìm đáp án sai phổ biến nhất
    const maxCount = Math.max(...Object.values(analysis.byOption));
    if (maxCount > 0) {
        analysis.mostCommonMistake = Object.keys(analysis.byOption)
            .find(key => analysis.byOption[key] === maxCount);
    }

    return analysis;
}

/**
 * So sánh hai kết quả thi
 * @param {Object} result1 - Kết quả lần 1
 * @param {Object} result2 - Kết quả lần 2
 * @returns {Object} - So sánh chi tiết
 */
function compareResults(result1, result2) {
    return {
        scoreDifference: result2.percentage - result1.percentage,
        correctDifference: result2.correctCount - result1.correctCount,
        improved: result2.percentage > result1.percentage,
        improvementPercentage: ((result2.percentage - result1.percentage) / result1.percentage) * 100
    };
}

/**
 * Tính tỷ lệ hoàn thành
 * @param {Object} userAnswers - Câu trả lời
 * @param {number} totalQuestions - Tổng số câu
 * @returns {number} - Phần trăm hoàn thành
 */
function calculateCompletionRate(userAnswers, totalQuestions) {
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / totalQuestions) * 100);
}

/**
 * Dự đoán điểm cuối cùng dựa trên tiến độ hiện tại
 * @param {Object} userAnswers - Câu trả lời hiện tại
 * @param {Array} questions - Tất cả câu hỏi
 * @returns {Object} - Dự đoán điểm
 */
function predictScore(userAnswers, questions) {
    let currentCorrect = 0;
    let currentTotal = 0;

    questions.forEach(question => {
        if (userAnswers[question.id]) {
            currentTotal++;
            if (userAnswers[question.id] === question.correctAnswer) {
                currentCorrect++;
            }
        }
    });

    if (currentTotal === 0) {
        return {
            predicted: 0,
            confidence: 'Thấp',
            message: 'Chưa có dữ liệu để dự đoán'
        };
    }

    const currentRate = currentCorrect / currentTotal;
    const predictedScore = currentRate * 100;
    const confidence = currentTotal >= 10 ? 'Cao' : currentTotal >= 5 ? 'Trung bình' : 'Thấp';

    return {
        predicted: Math.round(predictedScore * 100) / 100,
        confidence,
        message: `Dựa trên ${currentTotal} câu đã làm`
    };
}

/**
 * Tạo báo cáo chi tiết
 * @param {Object} result - Kết quả thi
 * @returns {Object} - Báo cáo chi tiết
 */
function generateReport(result) {
    return {
        summary: {
            totalQuestions: result.totalQuestions,
            correctCount: result.correctCount,
            wrongCount: result.wrongCount,
            skippedCount: result.skippedCount,
            percentage: result.percentage,
            grade: result.grade,
            passed: result.passed
        },
        details: {
            correctRate: Math.round((result.correctCount / result.totalQuestions) * 100),
            wrongRate: Math.round((result.wrongCount / result.totalQuestions) * 100),
            skipRate: Math.round((result.skippedCount / result.totalQuestions) * 100)
        },
        analysis: analyzeWrongAnswers(result.wrongAnswers),
        recommendation: getRecommendation(result.percentage)
    };
}

/**
 * Đưa ra khuyến nghị dựa trên điểm
 * @param {number} percentage - Phần trăm điểm
 * @returns {string} - Khuyến nghị
 */
function getRecommendation(percentage) {
    if (percentage >= 90) {
        return 'Xuất sắc! Bạn đã nắm vững kiến thức.';
    } else if (percentage >= 80) {
        return 'Tốt lắm! Hãy tiếp tục ôn tập để đạt điểm cao hơn.';
    } else if (percentage >= 70) {
        return 'Khá tốt! Hãy xem lại các câu sai để cải thiện.';
    } else if (percentage >= 50) {
        return 'Đạt yêu cầu. Nên ôn tập thêm các phần còn yếu.';
    } else {
        return 'Cần cố gắng hơn. Hãy ôn tập kỹ lại toàn bộ kiến thức.';
    }
}

/**
 * Tính thời gian trung bình cho mỗi câu
 * @param {number} totalTime - Tổng thời gian (giây)
 * @param {number} questionCount - Số câu hỏi
 * @returns {number} - Thời gian trung bình (giây)
 */
function calculateAverageTimePerQuestion(totalTime, questionCount) {
    if (questionCount === 0) return 0;
    return Math.round(totalTime / questionCount);
}

/**
 * Format kết quả để hiển thị
 * @param {Object} result - Kết quả thi
 * @returns {string} - Chuỗi mô tả
 */
function formatResult(result) {
    return `${result.correctCount}/${result.totalQuestions} câu đúng (${result.percentage}%) - ${result.grade}`;
}

/**
 * Kiểm tra có cải thiện không
 * @param {Array} history - Lịch sử thi (mới nhất đầu tiên)
 * @returns {Object} - Phân tích xu hướng
 */
function analyzeTrend(history) {
    if (!history || history.length < 2) {
        return {
            trend: 'neutral',
            message: 'Chưa đủ dữ liệu để phân tích'
        };
    }

    const latest = history[0].percentage;
    const previous = history[1].percentage;
    const difference = latest - previous;

    if (difference > 5) {
        return {
            trend: 'improving',
            message: `Tiến bộ ${Math.round(difference)}% so với lần trước`,
            color: '#10b981'
        };
    } else if (difference < -5) {
        return {
            trend: 'declining',
            message: `Giảm ${Math.round(Math.abs(difference))}% so với lần trước`,
            color: '#ef4444'
        };
    } else {
        return {
            trend: 'stable',
            message: 'Điểm số ổn định',
            color: '#f59e0b'
        };
    }
}

// Export functions (nếu sử dụng modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateScore,
        getGrade,
        getScoreColor,
        calculateAverage,
        findBestScore,
        findWorstScore,
        analyzeWrongAnswers,
        compareResults,
        calculateCompletionRate,
        predictScore,
        generateReport,
        getRecommendation,
        calculateAverageTimePerQuestion,
        formatResult,
        analyzeTrend
    };
}