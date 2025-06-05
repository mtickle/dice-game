export function computeStats(gameLog) {
    if (!Array.isArray(gameLog) || gameLog.length === 0) return null;

    const stats = {
        totalTurns: gameLog.length,
        totalScore: 0,
        averageScore: 0,
        categoryCounts: {},
        firstRollBonuses: 0,
        averageScoreByCategory: {},
    };

    for (const entry of gameLog) {
        stats.totalScore += entry.score;

        if (entry.bonus) {
            stats.firstRollBonuses += 1;
        }

        // Count category use
        if (!stats.categoryCounts[entry.category]) {
            stats.categoryCounts[entry.category] = 0;
        }
        stats.categoryCounts[entry.category]++;

        // Accumulate scores for averaging
        if (!stats.averageScoreByCategory[entry.category]) {
            stats.averageScoreByCategory[entry.category] = {
                total: 0,
                count: 0,
            };
        }
        stats.averageScoreByCategory[entry.category].total += entry.score;
        stats.averageScoreByCategory[entry.category].count += 1;
    }

    stats.averageScore = (stats.totalScore / stats.totalTurns).toFixed(1);

    for (const [cat, { total, count }] of Object.entries(stats.averageScoreByCategory)) {
        stats.averageScoreByCategory[cat] = (total / count).toFixed(1);
    }

    return stats;
}
