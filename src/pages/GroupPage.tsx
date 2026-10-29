import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getGroup } from "../api/group"
import { getErrorMessage } from "../utils/errors"
import { AvatarEmoji } from "../components/AvatarEmoji"
import { ManagerPanel } from "../components/ManagerPanel"
function GroupPage() {

    const { user } = useAuth()
    const groupQuery = useQuery({ queryKey: ["group"], queryFn: getGroup })

    if (groupQuery.isLoading)
        return <p className="animate-pulse py-16 text-center text-slate-soft">טוען נתונים...</p>
    if (groupQuery.isError)
        return <p className="alert mx-auto mt-10 max-w-md text-center">{getErrorMessage(groupQuery.error)}
        </p>
    if (!groupQuery.data)
        return <p className="py-16 text-center text-slate-muted">לא נמצאו נתונים</p>
    const group = groupQuery.data
    return <>
        <div className="flex items-end justify-between gap-6">
            <div>
        <div className="spec">GRP · מעגל סגור</div>
        <h1 className="mt-2 text-4xl leading-tight font-black tracking-[-0.5px] sm:text-[44px]">{group.name}</h1>
        <p className="mt-1.5 text-base font-light text-slate-soft">כל מי שבמעגל, וכמה אתגרים כל אחד מריץ עכשיו.</p>
            </div>
            {/* blueprint note: Kirchhoff's current law */}
            <div className="sci-note hidden shrink-0 md:block">
                <div dir="ltr" className="font-serif text-lg italic">Σ I = 0</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">חוק קירכהוף · מה שנכנס לצומת, יוצא ממנו</div>
            </div>
        </div>

        <div className="mt-7 grid items-start gap-6 xl:grid-cols-2">
            <section className="paper-card corner-marks p-6 sm:p-7">
                <h2 className="flex items-baseline gap-2.5 text-xl font-black">חברי הקבוצה <small className="spec text-[10px] font-medium">MEMBERS</small></h2>
                <ul className="mt-4 border-t border-slate">
                    {group.members.map((m) => (<li key={m.id} className="flex items-center gap-3 border-b border-[#CFC8BC] py-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-slate bg-paper text-xl"><AvatarEmoji avatar={m.avatar}></AvatarEmoji></span>
                        <p className="flex-1 font-medium">{m.displayName}</p>
                        {m.isManager && <span className="border border-copper px-1.5 text-[11px] font-medium tracking-[1px] text-copper">מנהל</span>}
                        <p className="w-20 text-left text-sm text-slate-soft tabular-nums">{m.challengesCount} אתגרים</p>


                    </li>)
                    )}

                </ul>
            </section>
            {user?.role === "MANAGER" && <ManagerPanel group={group} />}
        </div>
    </>
}
export default GroupPage
