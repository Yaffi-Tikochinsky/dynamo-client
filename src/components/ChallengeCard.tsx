import { toHebrewDate } from "../utils/hebrewDate";
import { getChallengeProgress } from "../utils/progress";
import type { ChallengeSummary } from "../types/challenge";
import { Link } from "react-router-dom";

// status as a small lamp: copper and glowing when active, empty ring when upcoming, grey when ended
const STATUS_BADGE = {
    ACTIVE: "before:bg-blaze before:animate-[led-pulse_1.6s_ease-in-out_infinite]",
    UPCOMING: "before:border before:border-slate-soft",
    ENDED: "before:bg-slate-muted",
}

// one row of the spec list: label, dotted leader, value
const leaderClass = "flex items-baseline gap-1.5 after:order-2 after:flex-1 after:border-b after:border-dotted after:border-rule after:content-[''] [&>*:last-child]:order-3 [&>*:last-child]:font-medium [&>*:last-child]:text-slate"

const RING_RADIUS = 34
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary })
{
    const statusText=challenge.status==="ACTIVE"?"פעיל":
                    challenge.status==="ENDED"?"הסתיים":
                    "עתידי"
    const progress = getChallengeProgress(challenge.startDate, challenge.endDate)
    return<>
    {/* copper corner marks = a challenge you joined */}
    <Link to={`/challenges/${challenge.id}`}
        className={`paper-card group flex flex-col gap-4 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-soft
            ${challenge.isJoined ? "corner-marks" : ""}
            ${challenge.status === "ENDED" ? "opacity-60" : ""}`}>

    <div className="flex items-start justify-between gap-3">
        <div>
            <div className="spec text-[10px]">DYN-{challenge.id} ·{challenge.visibility==="PRIVATE"?"אישי":"קבוצתי"}</div>
            <h2 className="mt-1 text-[19px] leading-snug font-bold">
                {challenge.title}
            </h2>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-soft before:size-[7px] before:rounded-full before:content-[''] ${STATUS_BADGE[challenge.status]}`}>
            {statusText}
        </span>
    </div>

    <div className="flex items-center gap-4">
        <div className="grid flex-1 gap-1.5 text-[13px] text-slate-soft">
            <div className={leaderClass}><span>תקופה</span><span>{toHebrewDate(challenge.startDate)} – {toHebrewDate(challenge.endDate)}</span></div>
            <div className={leaderClass}><span>משתתפים</span><span>{challenge.participantsCount}</span></div>
            <div className={leaderClass}><span>דירוג</span><span>{challenge.scale==="RATING"?"1–10":"V / X"}</span></div>
            {challenge.prize&&<div className={leaderClass}><span>פרס</span><span>🏆 {challenge.prize}</span></div>}
        </div>

        <div className="relative grid size-20 shrink-0 place-items-center">
            <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
                <defs>
                    <linearGradient id={`ring-${challenge.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#C46A2E" />
                        <stop offset=".55" stopColor="#FF5A1F" />
                        <stop offset="1" stopColor="#FFB43A" />
                    </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="39" fill="none" stroke="#23303A" strokeWidth="0.8" />
                <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke="#B9B1A4" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke={`url(#ring-${challenge.id})`} strokeWidth="6"
                    strokeDasharray={`${(progress.percent / 100) * RING_LENGTH} ${RING_LENGTH}`} />
            </svg>
            <div className="text-center leading-none">
                <div className="text-base font-black">{progress.percent}%</div>
                <div className="mt-1 text-[10px] text-slate-muted">
                    {challenge.status === "UPCOMING" ? `בעוד ${progress.daysToStart} ימים` : `יום ${progress.day}/${progress.total}`}
                </div>
            </div>
        </div>
    </div>

    {challenge.canJoin&&<span className="tag self-start border-blaze text-blaze">⚡ אפשר להצטרף</span>}

    {challenge.myStatus!==null&&(
    <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-dashed border-rule pt-3">
        <span className={`pill ${challenge.myStatus.reportedToday ? "pill-ok" : "pill-warn"}`}>
            {challenge.myStatus.reportedToday===true?
            "✓ דיווחת היום ":"◷ עוד לא דיווחת היום"}
        </span>
        {challenge.myStatus.missingCount>0&&
        <span className="pill pill-miss">{`חסרים ${challenge.myStatus.missingCount} דיווחים`}</span>}
    </div>)}
    </Link>
    </>
}
