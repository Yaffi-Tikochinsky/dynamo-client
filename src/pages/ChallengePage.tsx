import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getChallenge } from "../api/challenges"
import { getErrorMessage } from "../utils/errors"
import { STATUS_LABELS, VISIBILITY_LABELS } from "../utils/labels"
import { toHebrewDate } from "../utils/hebrewDate"
import { ChallengeAction } from "../components/ChallengeActions"
import { ReportForm } from "../components/ReportForm"
import { AvatarEmoji } from "../components/AvatarEmoji"
import { ChallengeResult } from "../components/ChallengeResults"
import { getChallengeProgress } from "../utils/progress"
function ChallengePage() {
    const { id } = useParams()
    const challengeId = Number(id)
    const challengeQuery = useQuery({ queryKey: ["challenge", challengeId], queryFn: () => getChallenge(challengeId) })
    
    if (challengeQuery.isLoading)
        return <p className="animate-pulse py-16 text-center text-fg-soft">⚡ טוענים את האתגר...</p>
    if (challengeQuery.isError) return <p className="mx-auto mt-10 max-w-md rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-5 py-3 text-center text-pink">{getErrorMessage(challengeQuery.error)}</p>
    if (!challengeQuery.data) return null

    const data = challengeQuery.data
    const progress = getChallengeProgress(data.startDate, data.endDate)
    return <>

        <nav className="mb-4 flex items-center gap-2 text-base text-fg-muted">
            <Link to="/challenges" className="transition hover:text-white">כל האתגרים</Link>
            <span>‹</span>
            <span className="text-fg-soft">{data.title}</span>
        </nav>

        <div id="details" className="bg-header rounded-3xl p-6 shadow-[0_18px_40px_-18px_rgba(30,4,25,0.7)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div>
                    <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                        {data.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-base">
                        <span className="rounded-full bg-gold px-3 py-1 font-medium text-ink">{STATUS_LABELS[data.status]}
                        </span>
                        <span className="rounded-full border border-white/35 px-3 py-1">
                            {VISIBILITY_LABELS[data.visibility]}
                        </span>
                        <span className="text-fg-soft">
                            {data.startDate&&<span>{toHebrewDate(data.startDate)}</span>}
                            {data.endDate&&<span> – {toHebrewDate(data.endDate)}</span>}
                            {data.creator&&<span> · נוצר על ידי {data.creator.displayName}</span>}
                            {data.prize && <span className="font-medium text-gold"> · 🏆 {data.prize}</span>}
                        </span>
                    </div>
                    {data.description && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-fg-soft">{data.description}</p>}
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                    <div className="flex items-center gap-3">
                        <span className="text-base text-fg-soft">{data.participants.length} משתתפים</span>
                        {data.participants.length === 0 && <span className="text-base text-fg-soft">· אולי תהיו הראשונים?</span>}
                        {<ul className="flex flex-row-reverse">{data.participants.map((p) =>
                        (
                            <li key={p.id} title={p.displayName} className="-ms-2 grid size-11 place-items-center rounded-full border-2 border-white/60 bg-[#6E1442] text-xl first:ms-0">
                                <AvatarEmoji avatar={p.avatar}></AvatarEmoji></li>
                        ))}
                        </ul>}
                    </div>
                    <div id="buttons" className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <ChallengeAction challenge={data}></ChallengeAction>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="h-2 rounded-full bg-white/20">
                    <div className="bg-energy h-2 rounded-full" style={{ width: `${progress.percent}%` }}></div>
                </div>
                <div className="mt-2 text-base text-fg-soft">יום {progress.day} מתוך {progress.total} · {progress.percent}%</div>
            </div>
        </div>

        <div className="group/results mt-12 grid grid-flow-dense gap-x-12 gap-y-14 lg:grid-cols-2">
            {data.myStatus && <section id="report" className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-8">
                <span className="bg-energy absolute inset-x-0 top-0 h-1"></span>
                <h2 className="text-2xl font-bold">הדיווח שלך</h2>
                <p className="mb-6 mt-1 text-base text-fg-muted">מלאו את הימים שחסרים ואת היום, ושלחו בבת אחת.</p>
                <ReportForm challenge={data} />
            </section>}

            <ChallengeResult challenge={data}></ChallengeResult>
        </div>

    </>
}
export default ChallengePage