import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getChallenges } from "../api/challenges"
import { getErrorMessage } from "../utils/errors"
import type { ChallengeFilters, ChallengeStatus, Scale, Visibility } from "../types/challenge"
import { ChallengeCard } from "../components/ChallengeCard"


function ChallengesPage() {
    const [filters, setfilters] = useState<ChallengeFilters>({})
    const challengeQuery = useQuery(
        {
            queryKey: ["challenges", filters],
            queryFn: () => getChallenges(filters)
        }
    )
    return <>
        <div className="mb-8">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                המעגל שלכם <span className="text-energy">בתנועה</span>
            </h1>
            <p className="mt-2 text-fg-soft">כל האתגרים של הקבוצה במקום אחד. בחרו אתגר, הצטרפו ודווחו כל יום.</p>
        </div>

        <div id="filters" className="mb-8 flex flex-wrap items-center gap-3 rounded-3xl border border-white/15 bg-[linear-gradient(115deg,rgba(255,176,32,0.32)_0%,rgba(255,90,95,0.32)_45%,rgba(90,18,64,0.5)_100%)] p-3 backdrop-blur-md">
            <label className="relative min-w-56 flex-1">
                <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center text-fg-muted">🔍</span>
                <input type="search" placeholder="חיפוש אתגר לפי שם" onChange={(e) => setfilters({
                    ...filters, search: (e.target.value)
                })} className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pe-4 ps-11 text-sm text-white placeholder:text-fg-muted outline-none transition focus:border-fuchsia focus:bg-white/10" />
            </label>


            <label className="flex items-center gap-2 text-sm text-fg-muted">סטטוס
                <select className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 focus:border-fuchsia [&_option]:bg-[#5A1240] [&_option]:text-white" value={filters?.status ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, status: (e.target.value || undefined) as ChallengeStatus || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="ACTIVE">פעיל</option>
                    <option value="UPCOMING">עתידי</option>
                    <option value="ENDED">הסתיים</option>
                </select>
            </label>
            <label className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition select-none ${filters.joined ? "border-transparent bg-energy text-ink shadow-[0_0_18px_rgba(255,176,32,0.45)]" : "border-white/15 bg-white/5 text-fg-soft hover:border-white/30"}`}>רק האתגרים שלי

                <input type="checkbox" className="sr-only" checked={filters.joined === true} onChange={(e) => {
                    setfilters({ ...filters, joined: e.target.checked || undefined })
                }
                } />
            </label>
            <label className="flex items-center gap-2 text-sm text-fg-muted">סולם דירוג
                <select className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 focus:border-fuchsia [&_option]:bg-[#5A1240] [&_option]:text-white" value={filters?.scale ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, scale: (e.target.value || undefined) as Scale || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="RATING">1-10</option>
                    <option value="YES_NO">כן/לא</option>
                </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-fg-muted">אישי/קבוצתי
                <select className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 focus:border-fuchsia [&_option]:bg-[#5A1240] [&_option]:text-white" value={filters?.visibility ?? ""}
                    onChange={(e) => setfilters({
                        ...filters, visibility: (e.target.value || undefined) as Visibility || undefined
                    })}>
                    <option value="">הכל</option>
                    <option value="PRIVATE">אישי</option>
                    <option value="PUBLIC">קבוצתי</option>
                </select></label>
            <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-fg-muted">מיין לפי
                    <select className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 focus:border-fuchsia [&_option]:bg-[#5A1240] [&_option]:text-white" value={filters?.sort ?? ""}
                        onChange={(e) => setfilters({
                            ...filters, sort: (e.target.value||undefined) as ChallengeFilters["sort"]
                        })}>
                        <option value="">תאריך סיום</option>
                        <option value="startDate">תאריך התחלה</option>
                        <option value="title">שם</option>
                        <option value="participants">משתתפים</option>
                    </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-fg-muted">סדר
                    <select className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/30 focus:border-fuchsia [&_option]:bg-[#5A1240] [&_option]:text-white" value={filters?.order ?? ""}
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
            {challengeQuery.isLoading && <p className="animate-pulse text-fg-soft">⚡ טוענים את האתגרים...</p>}
            {challengeQuery.isError && <p className="inline-block rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-4 py-2 text-pink">{getErrorMessage(challengeQuery.error)}</p>}
            {challengeQuery.data?.length === 0 && <div className="glass mx-auto max-w-md rounded-3xl p-8">
                <p className="text-lg font-bold">לא נמצאו אתגרים</p>
                <p className="mt-1 text-sm text-fg-muted">נסו לשנות את החיפוש או את הסינון, או צרו אתגר חדש.</p>
            </div>}
        </div>
        <div id="cards" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {challengeQuery.data?.map((c) => <ChallengeCard key={c.id} challenge={c} ></ChallengeCard>)}
        </div>
    </>
}
export default ChallengesPage