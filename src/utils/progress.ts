const DAY_MS = 24 * 60 * 60 * 1000

function dayNumber(date: string): number
{
    const [year, month, day] = date.split("-").map(Number)
    return Date.UTC(year, month - 1, day) / DAY_MS
}

function todayNumber(): number
{
    const now = new Date()
    return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS
}

export function getChallengeProgress(startDate: string, endDate: string)
{
    const start = dayNumber(startDate)
    const total = dayNumber(endDate) - start + 1
    const day = Math.min(Math.max(todayNumber() - start + 1, 0), total)
    const percent = Math.round((day / total) * 100)
    const daysToStart = Math.max(start - todayNumber(), 0)
    return { day, total, percent, daysToStart }
}
