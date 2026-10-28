import type { Scale, Visibility, ChallengeStatus } from "./challenge"

export type ErrorCode =
    | "VALIDATION_ERROR"
    | "RULE_VIOLATION"
    | "MISSING_NOT_CONFIRMED"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "RESULTS_LOCKED"
    | "NOT_FOUND"
    | "CONFLICT"
    | "TOO_MANY_REQUESTS"
    | "INTERNAL_ERROR"

export interface FieldError
{
    field: string
    message: string
}
export interface ApiError
{
    error: {
        code: ErrorCode
        message: string
        details?: FieldError[] | {
            remainingDates?: string[]
            reason?: "NOT_PARTICIPANT" | "MISSING_REPORTS"
            missingCount?: number
        }
    }
}

export interface Meta
{
    avatars: { key: string, emoji: string }[]
    scales: { key: Scale, label: string, max: number }[]
    visibilities: Visibility[]
    statuses: ChallengeStatus[]
    limits: Record<string, number>
}

export interface Quote
{
    date: string
    text: string
}
