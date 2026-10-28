import type { ChallengeDetails } from "../types/challenge"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { joinChallenge, leaveChallenge, deleteChallenge } from "../api/challenges"
import { getErrorMessage } from "../utils/errors"
import { Link, useNavigate } from "react-router-dom"

export function ChallengeAction({ challenge }: { challenge: ChallengeDetails }) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { permissions } = challenge
    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["challenge", challenge.id] })
        queryClient.invalidateQueries({ queryKey: ["challenges"] })
    }

    const joinMutation = useMutation({
        mutationFn: joinChallenge,
        onSuccess: () => {
            refresh()
        }
    }
    )

    const leaveMutation = useMutation({
        mutationFn: leaveChallenge,
        onSuccess: () => {
            refresh()
        }
    }
    )

    const deleteMutation = useMutation({
        mutationFn: deleteChallenge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenges"] })
            navigate("/challenges")
        }
    })


    return <>
        {permissions.canJoin && <button className="bg-energy rounded-full px-5 py-2.5 font-medium text-ink transition hover:brightness-110 active:scale-95 disabled:opacity-60" disabled={joinMutation.isPending} onClick={() => joinMutation.mutate(challenge.id)}>⚡ הצטרפות לאתגר</button>}
        {joinMutation.isError && <p className="w-full rounded-2xl bg-white/15 px-4 py-2 text-base text-blush">{getErrorMessage(joinMutation.error)}</p>}
        {permissions.canLeave && <button className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-60" disabled={leaveMutation.isPending} onClick={() => leaveMutation.mutate(challenge.id)}>עזיבת האתגר</button>}
        {leaveMutation.isError && <p className="w-full rounded-2xl bg-white/15 px-4 py-2 text-base text-blush">{getErrorMessage(leaveMutation.error)}</p>}
        {permissions.canDelete && <button className="rounded-full border border-pink/60 px-5 py-2.5 font-medium text-pink transition hover:bg-white/10 active:scale-95 disabled:opacity-60" disabled={deleteMutation.isPending} onClick={() => { if (confirm(("למחוק את האתגר? לא תוכל לבטל את המחיקה."))) deleteMutation.mutate(challenge.id) }}>מחיקת האתגר</button>}
        {deleteMutation.isError && <p className="w-full rounded-2xl bg-white/15 px-4 py-2 text-base text-blush">{getErrorMessage(deleteMutation.error)}</p>}
        {permissions.canEdit && <Link className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-60" to={`/challenges/${challenge.id}/edit`}>✎ עריכת אתגר</Link>}
        {permissions.canRenew && <Link className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 font-medium text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-60" to={`/challenges/new?renew=${challenge.id}`}>↻ חידוש אתגר</Link>}

    </>
}