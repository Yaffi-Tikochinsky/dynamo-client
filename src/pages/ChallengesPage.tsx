import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getChallenges } from "../api/challenges"
import { getErrorMessage } from "../utils/errors"
import type { ChallengeFilters, ChallengeStatus, Scale, Visibility } from "../types/challenge"
import { ChallengeCard } from "../components/ChallengeCard"

const filterCellClass = "flex items-center gap-2 border-l border-rule px-3.5 py-2.5 text-sm whitespace-nowrap text-slate-soft last:border-l-0"
const selectClass = "cursor-pointer bg-transparent font-medium text-slate outline-none [&_option]:bg-paper"

function ChallengesPage() {
    const [filters, setfilters] = useState<ChallengeFilters>({})
    const challengeQuery = useQuery(
        {
            queryKey: ["challenges", filters],
            queryFn: () => getChallenges(filters)
        }
    )
    return <>
        <div className="mb-7 flex items-end justify-between gap-6">
            <div>
            <div className="spec">DYN · לוח בקרה</div>
            <h1 className="mt-2 text-4xl leading-tight font-black tracking-[-0.5px] sm:text-[44px]">
                המעגל שלכם <span className="text-spark">בתנועה</span>
            </h1>
            <p className="mt-1.5 text-base font-light text-slate-soft">כל האתגרים של הקבוצה במקום אחד. בחרו אתגר, הצטרפו ודווחו כל יום.</p>
            </div>
            {/* blueprint note: current is charge that flows over time, like daily reports */}
            <div className="sci-note hidden shrink-0 md:block">
                <div dir="ltr" className="font-serif text-lg italic">I = Q / t</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">זרם · מטען שעובר במעגל, יום אחרי יום</div>
            </div>
        </div>

        {/* filters: one ruled strip, like a row in a technical drawing */}
        <div id="filters" className="mb-7 flex flex-wrap items-stretch border-y border-slate bg-paper/70">
            <label className={`${filterCellClass} min-w-56 flex-1`}>
                <span className="text-slate-muted">⌕</span>
                <input type="search" placeholder="חיפוש אתגר לפי שם" onChange={(e) => setfilters({
                    ...filters, search: (e.target.value)
                })} className="w-full bg-transparent text-sm text-slate placeholder:text-slate-muted outline-none" />
            </label>


            <label className={filterCellClass}>סטטוס
                <select className={selectClass} value={filters?.status ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, status: (e.target.value || undefined) as ChallengeStatus || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="ACTIVE">פעיל</option>
                    <option value="UPCOMING">עתידי</option>
                    <option value="ENDED">הסתיים</option>
                </select>
            </label>
            <label className={`${filterCellClass} cursor-pointer font-medium transition select-none ${filters.joined ? "bg-slate text-paper" : "hover:text-slate"}`}>רק האתגרים שלי

                <input type="checkbox" className="sr-only" checked={filters.joined === true} onChange={(e) => {
                    setfilters({ ...filters, joined: e.target.checked || undefined })
                }
                } />
            </label>
            <label className={filterCellClass}>סולם דירוג
                <select className={selectClass} value={filters?.scale ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, scale: (e.target.value || undefined) as Scale || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="RATING">1-10</option>
                    <option value="YES_NO">כן/לא</option>
                </select>
            </label>
            <label className={filterCellClass}>אישי/קבוצתי
                <select className={selectClass} value={filters?.visibility ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, visibility: (e.target.value || undefined) as Visibility || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="PRIVATE">אישי</option>
                    <option value="PUBLIC">קבוצתי</option>
                </select></label>
            <div className="flex flex-wrap items-stretch">
                <label className={filterCellClass}>מיין לפי
                    <select className={selectClass} value={filters?.sort ?? ""}
                        onChange={(e) => setfilters({
                            ...filters, sort: (e.target.value||undefined) as ChallengeFilters["sort"]
                        })}>
                        <option value="">תאריך סיום</option>
                        <option value="startDate">תאריך התחלה</option>
                        <option value="title">שם</option>
                        <option value="participants">משתתפים</option>
                    </select>
                </label>

                <label className={filterCellClass}>סדר
                    <select className={selectClass} value={filters?.order ?? ""}
                        onChange={(e) => setfilters({
                            ...filters, order: (e.target.value||undefined) as ChallengeFilters["order"]
                        })}>
                        <option value="">סדר עולה</option>
                        <option value="desc">סדר יורד</option>
                    </select>
                </label>
            </div>
        </div>

        <div className="mb-6 text-center">
            {challengeQuery.isLoading && <p className="animate-pulse text-slate-soft">⚡ טוענים את האתגרים...</p>}
            {challengeQuery.isError && <p className="alert inline-block">{getErrorMessage(challengeQuery.error)}</p>}
            {challengeQuery.data?.length === 0 && <div className="paper-card mx-auto max-w-md p-8">
                <p className="text-lg font-bold">לא נמצאו אתגרים</p>
                <p className="mt-1 text-sm text-slate-muted">נסו לשנות את החיפוש או את הסינון, או צרו אתגר חדש.</p>
            </div>}
        </div>
        <div id="cards" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {challengeQuery.data?.map((c) => <ChallengeCard key={c.id} challenge={c} ></ChallengeCard>)}
        </div>
    </>
}
export default ChallengesPage
