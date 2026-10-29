
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getChallenge, updateChallenge } from "../api/challenges"
import ChallengeForm from "../components/ChallengeForm"
import { getErrorMessage } from "../utils/errors"
import type { ChallengeUpdateInput } from "../types/challenge"

function EditChallengePage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { id } = useParams()
    const idParam = Number(id)
    const challengeQuery = useQuery(
        {
            queryKey: ["challenge", idParam],
            queryFn: () => getChallenge(idParam)
        }
    )
        const mutation = useMutation(
        {

            mutationFn: (data: ChallengeUpdateInput) => updateChallenge({ id: idParam, input: data }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["challenges"] })
                queryClient.invalidateQueries({ queryKey: ["challenge", idParam] })


                navigate(`/challenges/${idParam}`)
            }
        }
    )
    if (challengeQuery.isLoading)
        return <p className="animate-pulse py-16 text-center text-slate-soft">⚡ טוענים את האתגר...</p>
    if (!challengeQuery.data)
        return <p className="alert mx-auto mt-10 max-w-md text-center">משהו השתבש בטעינת המידע על האתגר.</p>

    const challenge = challengeQuery.data
    if (!challenge.permissions.canEdit) return <p className="paper-card mx-auto mt-10 max-w-md px-5 py-4 text-center text-slate-soft">🔒 אין לך הרשאה לערוך את האתגר הזה</p>


    return <div className="mx-auto max-w-5xl">
        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-muted">
            <Link to="/challenges" className="transition hover:text-slate">כל האתגרים</Link>
            <span>‹</span>
            <Link to={`/challenges/${challenge.id}`} className="transition hover:text-slate">{challenge.title}</Link>
            <span>‹</span>
            <span className="font-medium text-slate-soft">עריכה</span>
        </nav>
        <div className="spec">DYN-{challenge.id} · עדכון מפרט</div>
        <h1 className="mt-2 text-4xl leading-tight font-black tracking-[-0.5px] sm:text-[44px]">עריכת <span className="text-spark">אתגר</span></h1>
        <p className="mt-1.5 text-base font-light text-slate-soft">שנו או הוסיפו פרטים לאתגר.</p>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <section className="paper-card corner-marks p-6 sm:p-8">
            <ChallengeForm defaultValues={challenge}
                onSubmit={((data) => mutation.mutate(data))} isPending={mutation.isPending} editableFields={challenge.editableFields} submitLabel="שמירת שינויים"></ChallengeForm>
            {mutation.isError && <p className="alert mt-5">{getErrorMessage(mutation.error)}</p>}
            </section>
            <div className="grid gap-6">
            <aside className="rounded-xl border border-dashed border-slate-soft p-4 text-center">
                <span className="spec">הערה</span>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-soft">שדות שאי אפשר לשנות מוצגים בעמעום.</p>
            </aside>
            {/* blueprint note: Ohm's law */}
            <div className="sci-note hidden lg:block">
                <div dir="ltr" className="font-serif text-lg italic">R = V / I</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">חוק אוהם · התנגדות קטנה, זרם גדול</div>
            </div>
            </div>
        </div>
    </div>
}
export default EditChallengePage
