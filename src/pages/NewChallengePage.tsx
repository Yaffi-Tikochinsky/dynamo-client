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
    return <div className="mx-auto max-w-5xl">
        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-muted">
            <Link to="/challenges" className="transition hover:text-slate">כל האתגרים</Link>
            <span>‹</span>
            <span className="font-medium text-slate-soft">אתגר חדש</span>
        </nav>
        <div className="spec">DYN · גיליון מפרט חדש</div>
        <h1 className="mt-2 text-4xl leading-tight font-black tracking-[-0.5px] sm:text-[44px]">אתגר <span className="text-spark">חדש</span></h1>
        <p className="mt-1.5 text-base font-light text-slate-soft">מגדירים פעם אחת, והמעגל מתחיל להסתובב בתאריך ההתחלה.</p>

        {/* a spec sheet: the form, and a stamped note beside it */}
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <section className="paper-card corner-marks p-6 sm:p-8">
            <ChallengeForm  defaultValues={{scale:"YES_NO",visibility:"PRIVATE"}}
            onSubmit={((data)=>mutation.mutate(data))} isPending={mutation.isPending} submitLabel="יצירת אתגר"></ChallengeForm>

            {mutation.isError && <p className="alert mt-5">{getErrorMessage(mutation.error)}</p>}
            </section>
            <div className="grid gap-6">
            <aside className="rounded-xl border border-dashed border-slate-soft p-4 text-center">
                <span className="spec">הערה</span>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-soft">אחרי שהאתגר מתחיל, אפשר לשנות רק את השם, התיאור, הפרס ותאריך הסיום.</p>
            </aside>
            {/* blueprint note: a capacitor fills up step by step, like a challenge */}
            <div className="sci-note hidden lg:block">
                <div dir="ltr" className="font-serif text-lg italic">τ = R · C</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">קבוע זמן · כל קבל נטען בהדרגה</div>
            </div>
            </div>
        </div>
    </div>
}
export default NewChallengePage
