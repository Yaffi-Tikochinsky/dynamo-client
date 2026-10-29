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
        return <p className="animate-pulse py-16 text-center text-slate-soft">⚡ טוענים את האתגר...</p>
    if (challengeQuery.isError) return <p className="alert mx-auto mt-10 max-w-md text-center">{getErrorMessage(challengeQuery.error)}</p>
    if (!challengeQuery.data) return null

    const data = challengeQuery.data
    const progress = getChallengeProgress(data.startDate, data.endDate)
    return <>

        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-muted">
            <Link to="/challenges" className="transition hover:text-slate">כל האתגרים</Link>
            <span>‹</span>
            <span className="font-medium text-slate-soft">{data.title}</span>
        </nav>

        <div id="details" className="paper-card corner-marks p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div>
                    <div className="spec">DYN-{data.id}{data.creator&&<span> · נוצר על ידי {data.creator.displayName}</span>}</div>
                    <h1 className="mt-1.5 text-4xl leading-tight font-black tracking-[-0.5px] sm:text-[44px]">
                        {data.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                        <span data-status={data.status} className="inline-flex items-center gap-1.5 text-slate-soft before:size-[7px] before:rounded-full before:bg-blaze before:animate-[led-pulse_1.6s_ease-in-out_infinite] before:content-[''] data-[status=ENDED]:before:animate-none data-[status=ENDED]:before:bg-slate-muted data-[status=UPCOMING]:before:border data-[status=UPCOMING]:before:border-slate-soft data-[status=UPCOMING]:before:bg-transparent data-[status=UPCOMING]:before:animate-none">{STATUS_LABELS[data.status]}
                        </span>
                        <span className="tag">
                            {VISIBILITY_LABELS[data.visibility]}
                        </span>
                        <span className="text-slate-soft">
                            {data.startDate&&<span>{toHebrewDate(data.startDate)}</span>}
                            {data.endDate&&<span> – {toHebrewDate(data.endDate)}</span>}
                        </span>
                        {data.prize && <span className="tag border-blaze text-blaze">🏆 {data.prize}</span>}
                    </div>
                    {data.description && <p className="mt-4 max-w-3xl text-base leading-relaxed font-light text-slate-soft">{data.description}</p>}
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-soft">{data.participants.length} משתתפים</span>
                        {data.participants.length === 0 && <span className="text-sm text-slate-soft">· אולי תהיו הראשונים?</span>}
                        {<ul className="flex flex-row-reverse">{data.participants.map((p) =>
                        (
                            <li key={p.id} title={p.displayName} className="-ms-2 grid size-9 place-items-center rounded-full border border-slate bg-paper text-lg first:ms-0">
                                <AvatarEmoji avatar={p.avatar}></AvatarEmoji></li>
                        ))}
                        </ul>}
                    </div>
                    <div id="buttons" className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <ChallengeAction challenge={data}></ChallengeAction>
                    </div>
                </div>
            </div>

            {/* the challenge's length as a dimension line: start, today, end */}
            <div className="mt-8">
                <div className="h-1.5 bg-[#CFC8BC]">
                    <div className="bg-spark h-1.5" style={{ width: `${progress.percent}%` }}></div>
                </div>
                <div className="mt-2 flex items-end justify-between gap-4">
                <div className="text-sm text-slate-soft">יום <b className="text-blaze">{progress.day}</b> מתוך {progress.total} · {progress.percent}%</div>
                {/* blueprint note: power is voltage times current */}
                <div className="sci-note hidden sm:block">
                <div dir="ltr" className="font-serif text-lg italic">P = V · I</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">הספק · מאמץ כפול התמדה</div>
            </div>
                </div>
            </div>
        </div>

        <div className="group/results mt-6 grid grid-flow-dense gap-6 lg:grid-cols-2">
            {data.myStatus && <section id="report" className="paper-card p-6 sm:p-7">
                <h2 className="flex items-baseline gap-2.5 text-xl font-black">הדיווח שלך <small className="spec text-[10px] font-medium">REPORT</small></h2>
                <p className="mt-1 mb-5 text-sm font-light text-slate-soft">מלאו את הימים שחסרים ואת היום, ושלחו בבת אחת.</p>
                <ReportForm challenge={data} />
            </section>}

            <ChallengeResult challenge={data}></ChallengeResult>
        </div>

    </>
}
export default ChallengePage
