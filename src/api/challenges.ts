import { api } from "./client"
import type {
    ChallengeDetails,
    ChallengeFilters,
    ChallengeInput,
    ChallengeSummary,
    ChallengeUpdateInput,
} from "../types/challenge"
import type {
    Leaderboard,
    PendingReports,
    Progress,
    SubmitReportsInput,
    SubmitReportsResult,
} from "../types/results"

export const getChallenges = async (filters: ChallengeFilters = {}) => {
    const res = await api.get<ChallengeSummary[]>("/challenges", { params: filters })
    return res.data
}

export const getChallenge = async (id: number) => {
    const res = await api.get<ChallengeDetails>(`/challenges/${id}`)
    return res.data
}

export const createChallenge = async (input: ChallengeInput) => {
    const res = await api.post<ChallengeDetails>("/challenges", input)
    return res.data
}

export const updateChallenge = async ({ id, input }: { id: number, input: ChallengeUpdateInput }) => {
    const res = await api.patch<ChallengeDetails>(`/challenges/${id}`, input)
    return res.data
}

export const deleteChallenge = async (id: number) => {
    await api.delete(`/challenges/${id}`)
}

export const joinChallenge = async (id: number) => {
    const res = await api.post<{ challengeId: number, firstDay: string }>(`/challenges/${id}/join`)
    return res.data
}

export const leaveChallenge = async (id: number) => {
    await api.delete(`/challenges/${id}/join`)
}

export const getPendingReports = async (id: number) => {
    const res = await api.get<PendingReports>(`/challenges/${id}/pending`)
    return res.data
}

export const submitReports = async ({ id, input }: { id: number, input: SubmitReportsInput }) => {
    const res = await api.post<SubmitReportsResult>(`/challenges/${id}/reports`, input)
    return res.data
}

export const getLeaderboard = async (id: number) => {
    const res = await api.get<Leaderboard>(`/challenges/${id}/leaderboard`)
    return res.data
}

export const getProgress = async (id: number) => {
    const res = await api.get<Progress>(`/challenges/${id}/progress`)
    return res.data
}
