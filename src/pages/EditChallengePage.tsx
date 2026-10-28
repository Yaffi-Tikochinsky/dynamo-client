
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
        return <p className="animate-pulse py-16 text-center text-lg text-fg-soft">⚡ טוענים את האתגר...</p>
    if (!challengeQuery.data)
        return <p className="mx-auto mt-10 max-w-md rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-5 py-3 text-center text-pink">משהו השתבש בטעינת המידע על האתגר.</p>

    const challenge = challengeQuery.data
    if (!challenge.permissions.canEdit) return <p className="mx-auto mt-10 max-w-md rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center text-lg text-fg-soft">🔒 אין לך הרשאה לערוך את האתגר הזה</p>


    return <div className="mx-auto max-w-3xl">
        <nav className="mb-4 flex items-center gap-2 text-base text-fg-muted">
            <Link to="/challenges" className="transition hover:text-white">כל האתגרים</Link>
            <span>‹</span>
            <Link to={`/challenges/${challenge.id}`} className="transition hover:text-white">{challenge.title}</Link>
            <span>‹</span>
            <span className="text-fg-soft">עריכה</span>
        </nav>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">עריכת <span className="text-energy">אתגר</span></h1>
        <p className="mt-2 text-lg text-fg-soft">שנו או הוסיפו פרטים לאתגר. שדות שאי אפשר לשנות מוצגים בעמעום.</p>
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-8">
            <span className="bg-energy absolute inset-x-0 top-0 h-1"></span>
        <ChallengeForm defaultValues={challenge}
            onSubmit={((data) => mutation.mutate(data))} isPending={mutation.isPending} editableFields={challenge.editableFields} submitLabel="שמירת שינויים"></ChallengeForm>
        {mutation.isError && <p className="mt-5 rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-5 py-3 text-base text-pink">{getErrorMessage(mutation.error)}</p>}
        </section>
    </div>
}
export default EditChallengePage
