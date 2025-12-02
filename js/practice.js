/**
 * practice.js
 * Logic cho trang ôn luyện - 340 câu hỏi
 */

// ==================== GLOBAL VARIABLES ====================
let allQuestions = [];           // Tất cả câu hỏi (340 câu)
let currentQuestionIndex = 0;    // Index câu hỏi hiện tại
let userAnswers = {};            // Câu trả lời của user {questionId: answer}

// ==================== DOM ELEMENTS ====================
const loadingEl = document.getElementById('loading');
const quizContentEl = document.getElementById('quiz-content');
const progressBarEl = document.getElementById('progressBar');
const questionNumberEl = document.getElementById('questionNumber');
const questionCountEl = document.getElementById('questionCount');
const questionTextEl = document.getElementById('questionText');
const answersGridEl = document.getElementById('answersGrid');
const questionGridEl = document.getElementById('questionGrid');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnReset = document.getElementById('btnReset');

// ==================== INITIALIZATION ====================

/**
 * Load câu hỏi từ JSON file
 */
async function loadQuestions() {
    try {
        const response = await fetch('js/data/questions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allQuestions = data.questions;
        
        // Validate data
        if (!allQuestions || allQuestions.length === 0) {
            throw new Error('No questions found in JSON file');
        }
        
        console.log(`Loaded ${allQuestions.length} questions`);
        
        // Load saved progress from localStorage
        loadProgress();
        
        // Initialize quiz
        initQuiz();
        
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Không thể tải câu hỏi. Vui lòng kiểm tra file questions.json có tồn tại trong thư mục js/data/');
    }
}

/**
 * Load tiến trình đã lưu từ localStorage
 */
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('quiz_practice_progress');
        if (savedProgress) {
            userAnswers = JSON.parse(savedProgress);
            console.log(`Loaded ${Object.keys(userAnswers).length} saved answers`);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
        userAnswers = {};
    }
}

/**
 * Lưu tiến trình vào localStorage
 */
function saveProgress() {
    try {
        localStorage.setItem('quiz_practice_progress', JSON.stringify(userAnswers));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

/**
 * Initialize quiz UI
 */
function initQuiz() {
    // Hide loading, show quiz content
    loadingEl.style.display = 'none';
    quizContentEl.style.display = 'block';
    
    // Render question grid sidebar
    renderQuestionGrid();
    
    // Display first question
    displayQuestion();
    
    console.log('Quiz initialized successfully');
}

/**
 * Show error message
 */
function showError(message) {
    loadingEl.innerHTML = `
        <div style="color: #ef4444; text-align: center;">
            <p style="font-size: 24px; margin-bottom: 10px;">❌</p>
            <p style="font-weight: 600; margin-bottom: 10px;">${message}</p>
            <p style="font-size: 14px; color: #6b7280;">
                Đảm bảo file <code>js/data/questions.json</code> tồn tại và có định dạng đúng.
            </p>
        </div>
    `;
}

// ==================== QUESTION GRID (SIDEBAR) ====================

/**
 * Render grid câu hỏi ở sidebar
 */
function renderQuestionGrid() {
    questionGridEl.innerHTML = '';
    
    allQuestions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = index + 1;
        
        // Mark as answered if user has answered
        if (userAnswers[question.id]) {
            item.classList.add('answered');
        }
        
        // Mark current question
        if (index === currentQuestionIndex) {
            item.classList.add('active');
        }
        
        // Click to jump to question
        item.addEventListener('click', () => {
            currentQuestionIndex = index;
            displayQuestion();
            renderQuestionGrid();
            
            // Scroll to top on mobile
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        questionGridEl.appendChild(item);
    });
}

// ==================== DISPLAY QUESTION ====================

/**
 * Display current question
 */
function displayQuestion() {
    const question = allQuestions[currentQuestionIndex];
    
    if (!question) {
        console.error('Question not found at index:', currentQuestionIndex);
        return;
    }
    
    // Update question info
    questionNumberEl.textContent = `Câu ${currentQuestionIndex + 1}`;
    questionCountEl.textContent = `${currentQuestionIndex + 1}/${allQuestions.length}`;
    questionTextEl.textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    progressBarEl.style.width = `${progress}%`;
    
    // Display answer options
    renderAnswerOptions(question);
    
    // Update navigation buttons
    updateNavigationButtons();
}

/**
 * Render answer options (A, B, C, D)
 */
function renderAnswerOptions(question) {
    answersGridEl.innerHTML = '';
    
    const options = ['A', 'B', 'C', 'D'];
    const userAnswer = userAnswers[question.id];
    const isAnswered = !!userAnswer;
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        
        // Create label (A, B, C, D)
        const label = document.createElement('div');
        label.className = 'answer-label';
        label.textContent = option;
        
        // Create text
        const text = document.createElement('div');
        text.className = 'answer-text';
        text.textContent = question.options[option] || 'N/A';
        
        btn.appendChild(label);
        btn.appendChild(text);
        
        // If already answered, show correct/wrong state
        if (isAnswered) {
            btn.disabled = true;
            
            // Correct answer - always show green
            if (option === question.correctAnswer) {
                btn.classList.add('correct');
            }
            
            // Wrong answer - show red if user selected this
            if (option === userAnswer && userAnswer !== question.correctAnswer) {
                btn.classList.add('wrong');
            }
        } else {
            // Not answered yet - allow click
            btn.addEventListener('click', () => handleAnswerClick(option, question));
        }
        
        answersGridEl.appendChild(btn);
    });
}

/**
 * Handle answer click
 */
function handleAnswerClick(selectedOption, question) {
    // Save user answer
    userAnswers[question.id] = selectedOption;
    
    // Save to localStorage
    saveProgress();
    
    // Re-render answer options to show correct/wrong
    renderAnswerOptions(question);
    
    // Update question grid
    renderQuestionGrid();
    
    // Optional: Auto move to next question after 1 second
    // Uncomment below if you want this behavior
    /*
    setTimeout(() => {
        if (currentQuestionIndex < allQuestions.length - 1) {
            nextQuestion();
        }
    }, 1000);
    */
}

// ==================== NAVIGATION ====================

/**
 * Update navigation buttons state
 */
function updateNavigationButtons() {
    // Disable "Previous" if at first question
    btnPrev.disabled = currentQuestionIndex === 0;
    
    // Disable "Next" if at last question
    btnNext.disabled = currentQuestionIndex === allQuestions.length - 1;
}

/**
 * Go to previous question
 */
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        renderQuestionGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Go to next question
 */
function nextQuestion() {
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        renderQuestionGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Jump to specific question
 */
function jumpToQuestion(index) {
    if (index >= 0 && index < allQuestions.length) {
        currentQuestionIndex = index;
        displayQuestion();
        renderQuestionGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==================== EVENT LISTENERS ====================

/**
 * Previous button click
 */
btnPrev.addEventListener('click', () => {
    previousQuestion();
});

/**
 * Next button click
 */
btnNext.addEventListener('click', () => {
    nextQuestion();
});

/**
 * Reset button click
 */
btnReset.addEventListener('click', () => {
    resetProgress();
});

/**
 * Keyboard navigation
 */
document.addEventListener('keydown', (e) => {
    // Left arrow - previous question
    if (e.key === 'ArrowLeft') {
        previousQuestion();
    }
    
    // Right arrow - next question
    if (e.key === 'ArrowRight') {
        nextQuestion();
    }
    
    // Number keys 1-4 to select answer A-D
    if (e.key >= '1' && e.key <= '4') {
        const question = allQuestions[currentQuestionIndex];
        if (question && !userAnswers[question.id]) {
            const options = ['A', 'B', 'C', 'D'];
            const selectedOption = options[parseInt(e.key) - 1];
            handleAnswerClick(selectedOption, question);
        }
    }
});

/**
 * Prevent accidental page close if user has progress
 */
window.addEventListener('beforeunload', (e) => {
    if (Object.keys(userAnswers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

/**
 * Show progress stats in console (for debugging)
 */
function showProgressStats() {
    const totalAnswered = Object.keys(userAnswers).length;
    const percentage = Math.round((totalAnswered / allQuestions.length) * 100);
    
    console.log('=== PRACTICE PROGRESS ===');
    console.log(`Answered: ${totalAnswered}/${allQuestions.length} (${percentage}%)`);
    console.log(`Current question: ${currentQuestionIndex + 1}`);
    console.log('========================');
}

/**
 * Reset progress - Xóa tất cả câu trả lời và bắt đầu lại
 */
function resetProgress() {
    if (confirm('Bạn có chắc muốn học lại từ đầu?\nTất cả câu trả lời đã làm sẽ bị xóa.')) {
        // Reset user answers
        userAnswers = {};
        
        // Remove from localStorage
        localStorage.removeItem('quiz_practice_progress');
        
        // Reset to first question
        currentQuestionIndex = 0;
        
        // Refresh display
        displayQuestion();
        renderQuestionGrid();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('Progress reset successfully - Starting fresh');
        
        // Show notification (optional)
        alert('Đã reset thành công! Bạn có thể bắt đầu học lại từ đầu.');
    }
}

// Make reset function available in console for debugging
window.resetProgress = resetProgress;
window.showProgressStats = showProgressStats;

// ==================== AUTO-SAVE ====================

/**
 * Auto-save progress every 30 seconds
 */
setInterval(() => {
    if (Object.keys(userAnswers).length > 0) {
        saveProgress();
        console.log('Auto-saved progress');
    }
}, 30000);

// ==================== START APPLICATION ====================

/**
 * Initialize when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Practice page loaded');
    loadQuestions();
});

// Also start if DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuestions);
} else {
    loadQuestions();
}