const database = require('../database');
const dailyIndexer = require('./daily-indexer');
const problemsReq = require('./problems-req');

class CoreService {
    /**
     * Submit a solution and log it for the user
     */
    static async submitSolution(discordId, username, solutionStr) {
        const daily = problemsReq.getDailyProblem();
        return await database.logSubmission(
            discordId,
            username,
            daily.title || 'Unknown Problem',
            solutionStr,
            10
        );
    }

    /**
     * Get the top 10 users for the leaderboard
     */
    static async getLeaderboard() {
        return await database.getLeaderboard(10);
    }

    /**
     * Get a specific user's profile
     */
    static async getUserProfile(discordId) {
        return await database.getUserProfile(discordId);
    }

    /**
     * Get the daily problem information
     */
    static getDailyProblem() {
        return problemsReq.getDailyProblem();
    }

    /**
     * Get the bonus problem information
     */
    static getBonusProblem() {
        return dailyIndexer.getBonusProblem();
    }
}

module.exports = CoreService;
