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
        {permissions.canJoin && <button className="btn btn-spark" disabled={joinMutation.isPending} onClick={() => joinMutation.mutate(challenge.id)}>⚡ הצטרפות לאתגר</button>}
        {joinMutation.isError && <p className="alert w-full">{getErrorMessage(joinMutation.error)}</p>}
        {permissions.canLeave && <button className="btn btn-danger" disabled={leaveMutation.isPending} onClick={() => leaveMutation.mutate(challenge.id)}>עזיבת האתגר</button>}
        {leaveMutation.isError && <p className="alert w-full">{getErrorMessage(leaveMutation.error)}</p>}
        {permissions.canDelete && <button className="btn btn-danger" disabled={deleteMutation.isPending} onClick={() => { if (confirm(("למחוק את האתגר? לא תוכל לבטל את המחיקה."))) deleteMutation.mutate(challenge.id) }}>מחיקת האתגר</button>}
        {deleteMutation.isError && <p className="alert w-full">{getErrorMessage(deleteMutation.error)}</p>}
        {permissions.canEdit && <Link className="btn btn-line" to={`/challenges/${challenge.id}/edit`}>✎ עריכת אתגר</Link>}
        {permissions.canRenew && <Link className="btn btn-line" to={`/challenges/new?renew=${challenge.id}`}>↻ חידוש אתגר</Link>}

    </>
}
