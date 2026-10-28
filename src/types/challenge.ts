import type { PublicUser } from "./user"

export type Scale = "RATING" | "YES_NO"
export type Visibility = "PRIVATE" | "PUBLIC"
export type ChallengeStatus = "ENDED" | "ACTIVE" | "UPCOMING"

export interface MyStatus
{
    reportedToday: boolean
    missingCount: number
}
export interface ChallengeSummary
{
    id: number
    title: string
    scale: Scale
    visibility: Visibility
    status: ChallengeStatus
    startDate: string
    endDate: string
    prize: string | null
    joinWindowDays: number | null
    joinDeadline: string | null
    participantsCount: number
    isJoined: boolean
    canJoin: boolean
    myStatus: MyStatus | null
    previousChallengeId: number | null
}
export interface Participant extends PublicUser
{
    firstDay: string
}
export interface ChallengePermissions
{
    canEdit: boolean
    canDelete: boolean
    canJoin: boolean
    canLeave: boolean
    canRenew: boolean
    canViewResults: boolean
    lockedReason: "NOT_PARTICIPANT" | "MISSING_REPORTS" | null
}
export interface ChallengeDetails extends ChallengeSummary
{
    description: string | null
    creator: { id: number, displayName: string }
    previousChallenge: { id: number, title: string } | null
    participants: Participant[]
    permissions: ChallengePermissions
    editableFields: (keyof ChallengeUpdateInput)[]
    suggestedRenewalDates: { startDate: string, endDate: string } | null
}
export interface ChallengeInput
{
    title: string
    description?: string | null
    scale: Scale
    visibility: Visibility
    startDate: string
    endDate: string
    prize?: string | null
    joinWindowDays?: number | null
    previousChallengeId?: number | null
}
export type ChallengeUpdateInput = Partial<Omit<ChallengeInput, "previousChallengeId">>

export interface ChallengeFilters
{
    search?: string
    status?: ChallengeStatus
    scale?: Scale
    visibility?: Visibility
    joined?: boolean
    sort?: "endDate" | "startDate" | "participants" | "title"
    order?: "asc" | "desc"
}

