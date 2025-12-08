/**
 * exam.js
 * Logic cho trang thi thử - 70 câu random, 60 phút
 */

// ==================== GLOBAL VARIABLES ====================
let allQuestions = [];           // Tất cả câu hỏi (340 câu)
let examQuestions = [];          // 70 câu random cho bài thi
let currentQuestionIndex = 0;    // Index câu hỏi hiện tại
let userAnswers = {};            // Câu trả lời {questionId: answer}
let timeLeft = 60 * 60;          // 60 phút
let timerInterval = null;        // Interval ID cho timer
let examStartTime = null;        // Thời gian bắt đầu thi

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
const btnSubmit = document.getElementById('btnSubmit');
const timerTextEl = document.getElementById('timerText');
const timerEl = document.getElementById('timer');
const answeredCountEl = document.getElementById('answeredCount');
const remainingCountEl = document.getElementById('remainingCount');
const resultModal = document.getElementById('resultModal');

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
        
        // Get 70 random questions
        examQuestions = getRandomQuestions(allQuestions, 70);
        console.log(`Selected ${examQuestions.length} questions for exam`);
        
        // Initialize exam
        initExam();
        
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Không thể tải câu hỏi. Vui lòng kiểm tra file questions.json có tồn tại trong thư mục js/data/');
    }
}

/**
 * Get random questions
 */
function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Initialize exam
 */
function initExam() {
    // Hide loading, show quiz content
    loadingEl.style.display = 'none';
    quizContentEl.style.display = 'block';
    
    // Set exam start time
    examStartTime = Date.now();
    
    // Render question grid
    renderQuestionGrid();
    
    // Display first question
    displayQuestion();
    
    // Start timer
    startTimer();
    
    // Update stats
    updateStats();
    
    console.log('Exam started successfully');
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

// ==================== TIMER ====================

/**
 * Start countdown timer
 */
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Warning when 5 minutes left
        if (timeLeft === 300) {
            timerEl.classList.add('warning');
            alert('⚠️ Còn 5 phút! Hãy kiểm tra lại câu trả lời của bạn.');
        }
        
        // Time's up
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Hết giờ! Bài thi sẽ được nộp tự động.');
            submitExam();
        }
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerTextEl.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Add warning class when time is low
    if (timeLeft <= 300 && timeLeft > 0) {
        timerEl.classList.add('warning');
    }
}

/**
 * Stop timer
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ==================== QUESTION GRID ====================

/**
 * Render question grid in sidebar
 */
function renderQuestionGrid() {
    questionGridEl.innerHTML = '';
    
    examQuestions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.textContent = index + 1;
        
        // Mark as answered
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        questionGridEl.appendChild(item);
    });
}

// ==================== UPDATE STATS ====================

/**
 * Update statistics (answered/remaining)
 */
function updateStats() {
    const answered = Object.keys(userAnswers).length;
    const remaining = examQuestions.length - answered;
    
    answeredCountEl.textContent = answered;
    remainingCountEl.textContent = remaining;
}

// ==================== DISPLAY QUESTION ====================

/**
 * Display current question
 */
function displayQuestion() {
    const question = examQuestions[currentQuestionIndex];
    
    if (!question) {
        console.error('Question not found at index:', currentQuestionIndex);
        return;
    }
    
    // Update question info
    questionNumberEl.textContent = `Câu ${currentQuestionIndex + 1}`;
    questionCountEl.textContent = `${currentQuestionIndex + 1}/${examQuestions.length}`;
    questionTextEl.textContent = question.question;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / examQuestions.length) * 100;
    progressBarEl.style.width = `${progress}%`;
    
    // Display answer options
    renderAnswerOptions(question);
    
    // Update navigation buttons
    updateNavigationButtons();
}

/**
 * Render answer options
 */
function renderAnswerOptions(question) {
    answersGridEl.innerHTML = '';
    
    const options = ['A', 'B', 'C', 'D'];
    const userAnswer = userAnswers[question.id];
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        
        // Create label
        const label = document.createElement('div');
        label.className = 'answer-label';
        label.textContent = option;
        
        // Create text
        const text = document.createElement('div');
        text.className = 'answer-text';
        text.textContent = question.options[option] || 'N/A';
        
        btn.appendChild(label);
        btn.appendChild(text);
        
        // Mark as selected if user already chose this
        if (userAnswer === option) {
            btn.classList.add('selected');
        }
        
        // Click handler
        btn.addEventListener('click', () => handleAnswerClick(option, question));
        
        answersGridEl.appendChild(btn);
    });
}

/**
 * Handle answer click
 */
function handleAnswerClick(selectedOption, question) {
    // Save user answer
    userAnswers[question.id] = selectedOption;
    
    // Re-render to show selection
    renderAnswerOptions(question);
    
    // Update question grid
    renderQuestionGrid();
    
    // Update stats
    updateStats();
}

// ==================== NAVIGATION ====================

/**
 * Update navigation buttons
 */
function updateNavigationButtons() {
    btnPrev.disabled = currentQuestionIndex === 0;
    btnNext.disabled = currentQuestionIndex === examQuestions.length - 1;
}

/**
 * Previous question
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
 * Next question
 */
function nextQuestion() {
    if (currentQuestionIndex < examQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
        renderQuestionGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==================== SUBMIT EXAM ====================

/**
 * Submit exam
 */
function submitExam() {
    // Stop timer
    stopTimer();
    
    // Calculate results
    const results = calculateResults();
    
    // Show results modal
    showResultsModal(results);
}

/**
 * Calculate exam results
 */
function calculateResults() {
    let correctCount = 0;
    const wrongAnswers = [];
    
    examQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[question.id];
        
        if (userAnswer === question.correctAnswer) {
            correctCount++;
        } else {
            wrongAnswers.push({
                number: index + 1,
                question: question.question,
                userAnswer: userAnswer || 'Chưa trả lời',
                correctAnswer: question.correctAnswer,
                options: question.options
            });
        }
    });
    
    const totalQuestions = examQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 50;
    
    return {
        correctCount,
        totalQuestions,
        percentage,
        passed,
        wrongAnswers,
        timeSpent: 60 * 60 - timeLeft
    };
}

/**
 * Show results modal
 */
function showResultsModal(results) {
    // Update score display
    document.getElementById('scorePercentage').textContent = results.percentage + '%';
    document.getElementById('scoreText').textContent = 
        `${results.correctCount}/${results.totalQuestions}`;
    
    // Update score circle and status
    const scoreCircle = document.getElementById('scoreCircle');
    const resultStatus = document.getElementById('resultStatus');
    
    if (results.passed) {
        scoreCircle.classList.remove('fail');
        scoreCircle.classList.add('pass');
        resultStatus.classList.remove('fail');
        resultStatus.classList.add('pass');
        resultStatus.textContent = '✅ Đạt';
    } else {
        scoreCircle.classList.remove('pass');
        scoreCircle.classList.add('fail');
        resultStatus.classList.remove('pass');
        resultStatus.classList.add('fail');
        resultStatus.textContent = '❌ Không đạt';
    }
    
    // Show wrong answers section
    const wrongAnswersSection = document.getElementById('wrongAnswersSection');
    if (results.wrongAnswers.length > 0) {
        wrongAnswersSection.style.display = 'block';
        document.getElementById('wrongCount').textContent = results.wrongAnswers.length;
        
        const wrongList = document.getElementById('wrongAnswersList');
        wrongList.innerHTML = '';
        
        results.wrongAnswers.forEach(item => {
            const div = document.createElement('div');
            div.className = 'wrong-answer-item';
            
            const userAnswerText = item.userAnswer !== 'Chưa trả lời' 
                ? `${item.userAnswer} - ${item.options[item.userAnswer]}`
                : item.userAnswer;
            
            div.innerHTML = `
                <div class="wrong-question">Câu ${item.number}: ${item.question}</div>
                <div class="wrong-info">
                    <span class="your-answer">Bạn chọn: ${userAnswerText}</span>
                    <span class="correct-answer-info">Đáp án đúng: ${item.correctAnswer} - ${item.options[item.correctAnswer]}</span>
                </div>
            `;
            wrongList.appendChild(div);
        });
    } else {
        wrongAnswersSection.style.display = 'none';
    }
    
    // Show modal
    resultModal.classList.add('show');
}

// ==================== EVENT LISTENERS ====================

/**
 * Previous button
 */
btnPrev.addEventListener('click', () => {
    previousQuestion();
});

/**
 * Next button
 */
btnNext.addEventListener('click', () => {
    nextQuestion();
});

/**
 * Submit button
 */
btnSubmit.addEventListener('click', () => {
    const answered = Object.keys(userAnswers).length;
    const unanswered = examQuestions.length - answered;
    
    if (unanswered > 0) {
        const confirmMsg = `Bạn còn ${unanswered} câu chưa làm. Bạn có chắc muốn nộp bài?`;
        if (!confirm(confirmMsg)) {
            return;
        }
    }
    
    submitExam();
});

/**
 * Retry button
 */
document.getElementById('btnRetry').addEventListener('click', () => {
    location.reload();
});

/**
 * Home button in modal
 */
document.getElementById('btnHomeModal').addEventListener('click', () => {
    window.location.href = 'index.html';
});

/**
 * Keyboard navigation
 */
document.addEventListener('keydown', (e) => {
    // Don't trigger if modal is open
    if (resultModal.classList.contains('show')) {
        return;
    }
    
    // Left arrow - previous
    if (e.key === 'ArrowLeft') {
        previousQuestion();
    }
    
    // Right arrow - next
    if (e.key === 'ArrowRight') {
        nextQuestion();
    }
    
    // Number keys 1-4 to select answer
    if (e.key >= '1' && e.key <= '4') {
        const question = examQuestions[currentQuestionIndex];
        if (question) {
            const options = ['A', 'B', 'C', 'D'];
            const selectedOption = options[parseInt(e.key) - 1];
            handleAnswerClick(selectedOption, question);
        }
    }
    
    // Enter to submit
    if (e.key === 'Enter' && e.ctrlKey) {
        btnSubmit.click();
    }
});

/**
 * Prevent accidental page close
 */
window.addEventListener('beforeunload', (e) => {
    if (timeLeft > 0 && !resultModal.classList.contains('show')) {
        e.preventDefault();
        e.returnValue = 'Bài thi của bạn chưa được nộp. Bạn có chắc muốn thoát?';
    }
});

/**
 * Prevent right-click (optional - uncomment if needed)
 */
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
//     return false;
// });

/**
 * Detect tab switching (optional - for monitoring)
 */
let tabSwitchCount = 0;
document.addEventListener('visibilitychange', () => {
    if (document.hidden && timeLeft > 0 && !resultModal.classList.contains('show')) {
        tabSwitchCount++;
        console.warn(`Tab switched ${tabSwitchCount} times during exam`);
        // Optional: alert user
        // alert('⚠️ Vui lòng không chuyển tab trong khi làm bài thi!');
    }
});

// ==================== START APPLICATION ====================

/**
 * Initialize when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Exam page loaded');
    loadQuestions();
});

// Also start if DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadQuestions);
} else {
    loadQuestions();

}

