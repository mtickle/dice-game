// src/utils/lifetimeStatsUtils.js

const defaultStats = {
    totalGames: 0,
    totalScore: 0,
    highestScore: 0,
    totalYahtzees: 0,
};

export function loadLifetimeStats() {
    try {
        const saved = localStorage.getItem('yahtzeeLifetimeStats');
        const parsed = saved ? JSON.parse(saved) : null;
        return parsed ? normalizeStats(parsed) : { ...defaultStats };
    } catch {
        return { ...defaultStats };
    }
}

export function saveLifetimeStats(stats) {
    try {
        localStorage.setItem('yahtzeeLifetimeStats', JSON.stringify(stats));
    } catch { }
}

export function updateLifetimeStats(gameTotal, yahtzeeCount = 0) {
    const stats = loadLifetimeStats();

    const updated = {
        totalGames: stats.totalGames + 1,
        totalScore: stats.totalScore + gameTotal,
        highestScore: Math.max(stats.highestScore, gameTotal),
        totalYahtzees: stats.totalYahtzees + yahtzeeCount,
    };

    saveLifetimeStats(updated);
    return updated;
}

export function clearLifetimeStats() {
    localStorage.removeItem('yahtzeeLifetimeStats');
}

function normalizeStats(stats) {
    return {
        totalGames: stats.totalGames ?? 0,
        totalScore: stats.totalScore ?? 0,
        highestScore: stats.highestScore ?? 0,
        totalYahtzees: stats.totalYahtzees ?? 0,
    };
}
