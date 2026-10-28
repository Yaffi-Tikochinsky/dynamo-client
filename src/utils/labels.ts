import type { ChallengeFilters, ChallengePermissions, ChallengeStatus, Scale, Visibility } from "../types/challenge"
import type { Role } from "../types/user"

export const STATUS_LABELS: Record<ChallengeStatus, string> = {
    UPCOMING: "עתידי",
    ACTIVE: "פעיל",
    ENDED: "הסתיים",
}

export const SCALE_LABELS: Record<Scale, string> = {
    YES_NO: "כן / לא",
    RATING: "דירוג 1–10",
}

export const VISIBILITY_LABELS: Record<Visibility, string> = {
    PRIVATE: "אישי",
    PUBLIC: "קבוצתי",
}

export const ROLE_LABELS: Record<Role, string> = {
    MANAGER: "מנהל",
    MEMBER: "חבר",
}

export const SORT_LABELS: Record<NonNullable<ChallengeFilters["sort"]>, string> = {
    endDate: "תאריך סיום",
    startDate: "תאריך התחלה",
    participants: "מספר משתתפים",
    title: "שם",
}

export const ORDER_LABELS: Record<NonNullable<ChallengeFilters["order"]>, string> = {
    asc: "סדר עולה",
    desc: "סדר יורד",
}

export const LOCKED_REASON_LABELS: Record<NonNullable<ChallengePermissions["lockedReason"]>, string> = {
    NOT_PARTICIPANT: "רק משתתפים באתגר רואים את התוצאות לפני סיומו",
    MISSING_REPORTS: "יש להשלים את הדיווחים החסרים כדי לראות את התוצאות",
}
