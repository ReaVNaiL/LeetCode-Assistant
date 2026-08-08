const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'bot-database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            discord_id TEXT PRIMARY KEY,
            username TEXT,
            total_points INTEGER DEFAULT 0,
            current_streak INTEGER DEFAULT 0,
            highest_streak INTEGER DEFAULT 0,
            last_submit_date TEXT
        )`);

        // Submissions Table
        db.run(`CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            discord_id TEXT,
            problem_name TEXT,
            code_snippet TEXT,
            timestamp TEXT,
            points_awarded INTEGER,
            FOREIGN KEY (discord_id) REFERENCES users (discord_id)
        )`);
    });
}

/**
 * Log a user's submission.
 * @param {String} discordId 
 * @param {String} username 
 * @param {String} problemName 
 * @param {String} codeSnippet 
 * @param {Number} points 
 * @returns {Promise<Object>} An object with streak details and points.
 */
function logSubmission(discordId, username, problemName, codeSnippet, points) {
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().split('T')[0];

        db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], (err, user) => {
            if (err) return reject(err);

            let newStreak = 1;
            let highestStreak = 1;
            let totalPoints = points;
            let isAlreadySubmittedToday = false;

            if (user) {
                if (user.last_submit_date === today) {
                    isAlreadySubmittedToday = true;
                } else {
                    const lastDate = new Date(user.last_submit_date);
                    const todayDate = new Date(today);
                    const diffTime = Math.abs(todayDate - lastDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        newStreak = user.current_streak + 1;
                    } else {
                        newStreak = 1; // streak broken
                    }
                }
                highestStreak = Math.max(user.highest_streak, newStreak);
                totalPoints = user.total_points + (isAlreadySubmittedToday ? 0 : points);
            }

            if (!isAlreadySubmittedToday) {
                db.serialize(() => {
                    db.run(`INSERT OR REPLACE INTO users (discord_id, username, total_points, current_streak, highest_streak, last_submit_date)
                            VALUES (?, ?, ?, ?, ?, ?)`,
                        [discordId, username, totalPoints, newStreak, highestStreak, today]
                    );

                    db.run(`INSERT INTO submissions (discord_id, problem_name, code_snippet, timestamp, points_awarded)
                            VALUES (?, ?, ?, ?, ?)`,
                        [discordId, problemName, codeSnippet, new Date().toISOString(), points]
                    );
                });
                resolve({ points, newStreak, totalPoints, isDuplicate: false });
            } else {
                resolve({ points: 0, newStreak: user.current_streak, totalPoints: user.total_points, isDuplicate: true });
            }
        });
    });
}

function getLeaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
        db.all('SELECT username, total_points, current_streak FROM users ORDER BY total_points DESC LIMIT ?', [limit], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function getUserProfile(discordId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE discord_id = ?', [discordId], (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve(null);
            
            db.get('SELECT COUNT(*) as problems_solved FROM submissions WHERE discord_id = ?', [discordId], (err, countRow) => {
                if (err) return reject(err);
                row.problems_solved = countRow.problems_solved;
                resolve(row);
            });
        });
    });
}

function resetMissedStreaks() {
    return new Promise((resolve, reject) => {
        const today = new Date();
        today.setDate(today.getDate() - 1); // Yesterday
        const yesterdayStr = today.toISOString().split('T')[0];

        db.run('UPDATE users SET current_streak = 0 WHERE last_submit_date < ?', [yesterdayStr], function(err) {
            if (err) return reject(err);
            resolve(this.changes);
        });
    });
}

module.exports = {
    logSubmission,
    getLeaderboard,
    getUserProfile,
    resetMissedStreaks
};
