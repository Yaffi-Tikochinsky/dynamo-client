import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { createChallenge } from "../api/challenges"
import ChallengeForm from "../components/ChallengeForm"
import { getErrorMessage } from "../utils/errors"

function NewChallengePage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const mutation= useMutation(
        {

            mutationFn:createChallenge,
            onSuccess:(created)=>
            {
                queryClient.invalidateQueries({queryKey:["challenges"]}


               )
               navigate(`/challenges/${created.id}`)
            }
        }
    )
    return <div className="mx-auto max-w-3xl">
        <nav className="mb-4 flex items-center gap-2 text-base text-fg-muted">
            <Link to="/challenges" className="transition hover:text-white">כל האתגרים</Link>
            <span>‹</span>
            <span className="text-fg-soft">אתגר חדש</span>
        </nav>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">אתגר <span className="text-energy">חדש</span></h1>
        <p className="mt-2 text-lg text-fg-soft">הוסיפו את האתגר שלכם. אחרי שיתחיל, אפשר לשנות רק את השם, התיאור, הפרס ותאריך הסיום.</p>
        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-8">
            <span className="bg-energy absolute inset-x-0 top-0 h-1"></span>
        <ChallengeForm  defaultValues={{scale:"YES_NO",visibility:"PRIVATE"}}
        onSubmit={((data)=>mutation.mutate(data))} isPending={mutation.isPending} submitLabel="יצירת אתגר"></ChallengeForm>
   
        {mutation.isError && <p className="mt-5 rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-5 py-3 text-base text-pink">{getErrorMessage(mutation.error)}</p>}
        </section>
    </div>
}
export default NewChallengePage