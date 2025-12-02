/**
 * timer.js
 * Các hàm tiện ích để quản lý timer đếm ngược
 */

/**
 * Class Timer để quản lý đếm ngược
 */
class Timer {
    constructor(initialTime, onTick, onComplete) {
        this.initialTime = initialTime; // Thời gian ban đầu (giây)
        this.timeLeft = initialTime;
        this.onTick = onTick; // Callback mỗi giây
        this.onComplete = onComplete; // Callback khi hết giờ
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
    }

    /**
     * Bắt đầu timer
     */
    start() {
        if (this.isRunning) {
            console.warn('Timer is already running');
            return;
        }

        this.isRunning = true;
        this.isPaused = false;

        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;

                // Gọi callback onTick
                if (this.onTick) {
                    this.onTick(this.timeLeft);
                }

                // Kiểm tra hết giờ
                if (this.timeLeft <= 0) {
                    this.stop();
                    if (this.onComplete) {
                        this.onComplete();
                    }
                }
            }
        }, 1000);
    }

    /**
     * Dừng timer
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.isPaused = false;
    }

    /**
     * Tạm dừng timer
     */
    pause() {
        if (!this.isRunning) {
            console.warn('Timer is not running');
            return;
        }
        this.isPaused = true;
    }

    /**
     * Tiếp tục timer
     */
    resume() {
        if (!this.isRunning) {
            console.warn('Timer is not running');
            return;
        }
        this.isPaused = false;
    }

    /**
     * Reset timer về thời gian ban đầu
     */
    reset() {
        this.stop();
        this.timeLeft = this.initialTime;
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
    }

    /**
     * Đặt thời gian còn lại
     * @param {number} time - Thời gian (giây)
     */
    setTimeLeft(time) {
        this.timeLeft = time;
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
    }

    /**
     * Lấy thời gian còn lại
     * @returns {number} - Số giây còn lại
     */
    getTimeLeft() {
        return this.timeLeft;
    }

    /**
     * Kiểm tra timer có đang chạy không
     * @returns {boolean}
     */
    isActive() {
        return this.isRunning && !this.isPaused;
    }

    /**
     * Thêm thời gian
     * @param {number} seconds - Số giây cần thêm
     */
    addTime(seconds) {
        this.timeLeft += seconds;
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
    }

    /**
     * Trừ thời gian
     * @param {number} seconds - Số giây cần trừ
     */
    subtractTime(seconds) {
        this.timeLeft = Math.max(0, this.timeLeft - seconds);
        if (this.onTick) {
            this.onTick(this.timeLeft);
        }
        
        if (this.timeLeft === 0 && this.isRunning) {
            this.stop();
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }
}

/**
 * Format thời gian từ giây sang MM:SS
 * @param {number} seconds - Số giây
 * @returns {string} - Chuỗi MM:SS
 */
function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format thời gian từ giây sang HH:MM:SS
 * @param {number} seconds - Số giây
 * @returns {string} - Chuỗi HH:MM:SS
 */
function formatTimeLong(seconds) {
    if (seconds < 0) seconds = 0;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse chuỗi MM:SS thành số giây
 * @param {string} timeString - Chuỗi MM:SS
 * @returns {number} - Số giây
 */
function parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 2) {
        console.error('Invalid time format. Expected MM:SS');
        return 0;
    }
    
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    
    if (isNaN(minutes) || isNaN(seconds)) {
        console.error('Invalid time values');
        return 0;
    }
    
    return minutes * 60 + seconds;
}

/**
 * Tạo countdown timer đơn giản
 * @param {number} seconds - Số giây đếm ngược
 * @param {function} callback - Hàm callback mỗi giây
 * @param {function} onComplete - Hàm callback khi hoàn thành
 * @returns {object} - Object chứa các hàm điều khiển
 */
function createCountdown(seconds, callback, onComplete) {
    let timeLeft = seconds;
    let intervalId = null;
    let isRunning = false;

    return {
        start: function() {
            if (isRunning) return;
            
            isRunning = true;
            intervalId = setInterval(() => {
                timeLeft--;
                
                if (callback) {
                    callback(timeLeft);
                }
                
                if (timeLeft <= 0) {
                    this.stop();
                    if (onComplete) {
                        onComplete();
                    }
                }
            }, 1000);
        },
        
        stop: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            isRunning = false;
        },
        
        reset: function() {
            this.stop();
            timeLeft = seconds;
            if (callback) {
                callback(timeLeft);
            }
        },
        
        getTimeLeft: function() {
            return timeLeft;
        }
    };
}

/**
 * Kiểm tra xem thời gian có cần cảnh báo không
 * @param {number} timeLeft - Thời gian còn lại (giây)
 * @param {number} warningThreshold - Ngưỡng cảnh báo (giây)
 * @returns {boolean} - True nếu cần cảnh báo
 */
function shouldWarn(timeLeft, warningThreshold = 300) {
    return timeLeft <= warningThreshold && timeLeft > 0;
}

/**
 * Lấy màu sắc theo thời gian còn lại
 * @param {number} timeLeft - Thời gian còn lại (giây)
 * @param {number} totalTime - Tổng thời gian (giây)
 * @returns {string} - Mã màu hex
 */
function getTimeColor(timeLeft, totalTime) {
    const percentage = (timeLeft / totalTime) * 100;
    
    if (percentage > 50) {
        return '#10b981'; // Green
    } else if (percentage > 25) {
        return '#f59e0b'; // Orange
    } else {
        return '#ef4444'; // Red
    }
}

/**
 * Tính phần trăm thời gian còn lại
 * @param {number} timeLeft - Thời gian còn lại (giây)
 * @param {number} totalTime - Tổng thời gian (giây)
 * @returns {number} - Phần trăm (0-100)
 */
function getTimePercentage(timeLeft, totalTime) {
    if (totalTime <= 0) return 0;
    return Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));
}

/**
 * Format thời gian còn lại thành text mô tả
 * @param {number} seconds - Số giây
 * @returns {string} - Mô tả thời gian
 */
function getTimeDescription(seconds) {
    if (seconds <= 0) {
        return 'Hết giờ';
    } else if (seconds < 60) {
        return `Còn ${seconds} giây`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `Còn ${minutes} phút`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `Còn ${hours} giờ ${minutes} phút`;
    }
}

/**
 * Lưu trạng thái timer vào localStorage
 * @param {string} key - Key để lưu
 * @param {number} timeLeft - Thời gian còn lại
 * @param {number} timestamp - Timestamp hiện tại
 */
function saveTimerState(key, timeLeft, timestamp = Date.now()) {
    const state = {
        timeLeft: timeLeft,
        timestamp: timestamp
    };
    localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Lấy trạng thái timer từ localStorage
 * @param {string} key - Key đã lưu
 * @returns {object|null} - Object {timeLeft, timestamp} hoặc null
 */
function loadTimerState(key) {
    try {
        const state = localStorage.getItem(key);
        if (!state) return null;
        
        const parsed = JSON.parse(state);
        
        // Tính thời gian đã trôi qua
        const elapsed = Math.floor((Date.now() - parsed.timestamp) / 1000);
        const adjustedTimeLeft = Math.max(0, parsed.timeLeft - elapsed);
        
        return {
            timeLeft: adjustedTimeLeft,
            timestamp: parsed.timestamp
        };
    } catch (error) {
        console.error('Error loading timer state:', error);
        return null;
    }
}

/**
 * Xóa trạng thái timer
 * @param {string} key - Key cần xóa
 */
function clearTimerState(key) {
    localStorage.removeItem(key);
}

// Export functions (nếu sử dụng modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Timer,
        formatTime,
        formatTimeLong,
        parseTime,
        createCountdown,
        shouldWarn,
        getTimeColor,
        getTimePercentage,
        getTimeDescription,
        saveTimerState,
        loadTimerState,
        clearTimerState
    };
}