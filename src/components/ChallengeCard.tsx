import { toHebrewDate } from "../utils/hebrewDate";
import { getChallengeProgress } from "../utils/progress";
import type { ChallengeSummary } from "../types/challenge";
import { Link } from "react-router-dom";

const STATUS_BADGE = {
    ACTIVE: "border-fuchsia/70 bg-fuchsia/15 text-pink",
    UPCOMING: "border-flash/60 bg-flash/10 text-flash",
    ENDED: "border-white/20 bg-white/5 text-fg-muted",
}

const RING_RADIUS = 34
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary })
{
    const statusText=challenge.status==="ACTIVE"?"פעיל":
                    challenge.status==="ENDED"?"הסתיים":
                    "עתידי"
    const progress = getChallengeProgress(challenge.startDate, challenge.endDate)
    return<>
    <Link to={`/challenges/${challenge.id}`}
        className={`group flex flex-col gap-4 rounded-3xl border bg-white/5 p-5 backdrop-blur-md transition duration-200 hover:-translate-y-1
            ${challenge.isJoined
                ? "border-energy border-transparent shadow-[0_0_26px_-6px_rgba(255,176,32,0.55)] hover:shadow-[0_0_36px_-4px_rgba(255,176,32,0.8)]"
                : "border-energy-hover border-white/15 hover:border-transparent hover:shadow-[0_0_32px_-6px_rgba(255,90,95,0.75)]"}
            ${challenge.status === "ENDED" ? "opacity-70" : ""}`}>

    <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold leading-snug text-white">
            {challenge.title}
        </h2>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[challenge.status]}`}>
            <span className={`size-1.5 rounded-full bg-current ${challenge.status === "ACTIVE" ? "animate-pulse" : ""}`}></span>
            {statusText}
        </span>
    </div>

    <div className="flex flex-wrap gap-1.5 text-xs text-fg-soft">
        <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5">{challenge.scale==="RATING"?"דירוג:1-10":"דירוג:V/X"}</span>
        <span className="rounded-full border border-white/12 bg-white/5 px-2.5 py-0.5">{challenge.visibility==="PRIVATE"?"אתגר פרטי":"אתגר קבוצתי"}</span>
        {challenge.canJoin&&<span className="rounded-full border border-flash/50 bg-flash/10 px-2.5 py-0.5 text-flash">⚡ ניתן להצטרף לאתגר</span>}
    </div>

    <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 text-sm">
            <span className="text-fg-soft">📅 {toHebrewDate(challenge.startDate)} - {toHebrewDate(challenge.endDate)}</span>
            <span className="text-fg-muted">👥 {challenge.participantsCount} משתתפים</span>
            {challenge.prize&&<span className="font-medium text-gold">🏆 הפרס: {challenge.prize}</span>}
        </div>

        <div className="relative grid size-20 shrink-0 place-items-center">
            <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
                <defs>
                    <linearGradient id={`ring-${challenge.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#FFE07A" />
                        <stop offset=".45" stopColor="#FFB020" />
                        <stop offset="1" stopColor="#FF5A5F" />
                    </linearGradient>
                </defs>
                <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="7" />
                <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke={`url(#ring-${challenge.id})`} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${(progress.percent / 100) * RING_LENGTH} ${RING_LENGTH}`} />
            </svg>
            <div className="text-center leading-none">
                <div className="text-base font-extrabold text-white">{progress.percent}%</div>
                <div className="mt-1 text-[10px] text-fg-muted">
                    {challenge.status === "UPCOMING" ? `בעוד ${progress.daysToStart} ימים` : `יום ${progress.day}/${progress.total}`}
                </div>
            </div>
        </div>
    </div>

    {challenge.myStatus!==null&&(
    <div className="mt-auto flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className={`rounded-full px-3 py-1.5 ${challenge.myStatus.reportedToday ? "bg-mint/15 text-mint" : "bg-amber/15 text-amber"}`}>
            {challenge.myStatus.reportedToday===true?
            "✓ דיווחת היום ":"⏳ עוד לא דיווחת היום"}
        </span>
        {challenge.myStatus.missingCount>0&&
        <span className="rounded-full bg-fuchsia/15 px-3 py-1.5 text-pink">{`חסרים ${challenge.myStatus.missingCount} דיווחים`}</span>}
    </div>)}
    </Link>
    </>
}
