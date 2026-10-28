import type { ChallengeStatus, Scale } from "./challenge"
import type { PublicUser } from "./user"

export interface PendingReports
{
    scale: Scale
    status: ChallengeStatus
    missingDates: string[]
    today: { date: string, reported: boolean, canReport: boolean }
}
export interface ReportInput
{
    date: string
    value: number
}
export interface SubmitReportsInput
{
    reports: ReportInput[]
    fillMissingWithZero: boolean
}
export interface SubmitReportsResult
{
    created: number
    skipped: string[]
    missingDates: string[]
    todayReported: boolean
}
export interface LeaderboardRow
{
    rank: number | null
    user: PublicUser
    percentage: number | null
    daysCounted: number
    currentStreak: number
    isMe: boolean
}
export interface Leaderboard
{
    dataUntil: string | null
    status: ChallengeStatus
    prize: string | null
    rows: LeaderboardRow[]
    winners: PublicUser[] | null
}
export interface ProgressSeries extends PublicUser
{
    key: string
}
export interface ProgressPoint
{
    date: string
    [key: string]: string | number | null
}
export interface Progress
{
    dataUntil: string | null
    series: ProgressSeries[]
    points: ProgressPoint[]
}
