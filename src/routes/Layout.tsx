import { Outlet, NavLink } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getMeta, getTodayQuote } from "../api/meta"
import { toHebrewDate } from "../utils/hebrewDate"

const sideLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-baseline gap-3 border-r-2 px-3 py-2.5 text-[17px] transition ${isActive
        ? "border-blaze bg-[linear-gradient(to_left,rgb(255_90_31/0.09),transparent)] font-bold text-slate [&>i]:text-blaze"
        : "border-transparent text-slate-soft hover:text-slate"}`

const bottomLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 pt-2 pb-3 text-xs transition ${isActive
        ? "font-bold text-slate shadow-[inset_0_2px_0_var(--color-blaze)]"
        : "text-slate-soft"}`

function Layout() {
    const { user, logout } = useAuth()
    const quoteQuery = useQuery({ queryKey: ["quote"], queryFn: getTodayQuote, staleTime: 1000 * 60 * 60 })
    const metaQuery = useQuery({ queryKey: ["meta"], queryFn: getMeta })
    const myEmoji = metaQuery.data?.avatars.find((a) => a.key === user?.avatar)
    return <div className="min-h-screen lg:ps-64">

        {/* warm background: two breathing orange patches and slow rings from the energy source */}
        <div className="app-bg" aria-hidden="true">
            <div className="warm-glow warm-glow-1"></div>
            <div className="warm-glow warm-glow-2"></div>
            <div className="warm-wave"></div>
            <div className="warm-wave [animation-delay:-6.67s]"></div>
            <div className="warm-wave [animation-delay:-13.33s]"></div>
        </div>

        {/* side bar (desktop): a sheet of paper, warming toward the bottom, with a ruler between the parts */}
        <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col border-l border-rule bg-[linear-gradient(180deg,var(--color-paper)_70%,#F6E6D7)] px-6 pt-7 pb-6 lg:flex">
            <div className="flex items-center gap-3">
                <img src="/logo-copper.svg" alt="" className="size-11" />
                <div>
                    <div className="text-[26px] leading-none font-black">דינמו</div>
                    <div className="spec mt-1.5 text-[10px]">מעגל · עשייה · אנרגיה</div>
                </div>
            </div>

            <div className="rule-line my-6"></div>

            <nav className="flex flex-col gap-0.5">
                <NavLink to={"/challenges"} end className={sideLinkClass}><i className="w-5 text-[11px] tracking-[1px] text-slate-muted not-italic">01</i>אתגרים</NavLink>
                <NavLink to={"/challenges/new"} className={sideLinkClass}><i className="w-5 text-[11px] tracking-[1px] text-slate-muted not-italic">02</i>יצירת אתגר</NavLink>
                <NavLink to={"/group"} className={sideLinkClass}><i className="w-5 text-[11px] tracking-[1px] text-slate-muted not-italic">03</i>הקבוצה שלי</NavLink>
            </nav>

            <div className="rule-line my-6"></div>

            <div>
                <span className="spec text-[10px]">תאריך</span>
                <div className="mt-0.5 text-[15px] font-bold">{toHebrewDate(new Date())}</div>
                {quoteQuery.data && <p className="mt-2 text-sm leading-relaxed font-light text-slate-soft">״{quoteQuery?.data.text}״</p>}
            </div>

            {/* blueprint note: the dynamo turns motion into current */}
            <div className="sci-note mt-auto mb-4">
                <div dir="ltr" className="font-serif text-base italic">ε = B · ℓ · v</div>
                <div className="mt-0.5 text-[10px] tracking-[1.5px] text-slate-muted">מוליך בתנועה · יוצר מתח</div>
            </div>

            <div className="rounded-xl border border-rule bg-[linear-gradient(160deg,var(--color-bone),#F2E2D3)] p-3">
                <div className="flex items-center gap-2.5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-slate bg-paper text-xl">
                        {myEmoji?.emoji}
                    </span>
                    <div className="min-w-0 leading-tight">
                        <div className="flex items-center gap-1.5 text-sm font-bold">
                            <span className="truncate">{user?.displayName}</span>
                            {user?.role === "MANAGER" && <span className="border border-copper px-1.5 text-[10px] font-medium tracking-[1px] text-copper">מנהל</span>}
                        </div>
                        <div className="truncate text-xs text-slate-muted">{user?.group.name}</div>
                    </div>
                </div>
                <button onClick={logout} className="btn btn-line mt-3 w-full py-2 text-sm">
                    ⎋ התנתקות
                </button>
            </div>
        </aside>

        {/* top bar (mobile) */}
        <header className="sticky top-0 z-40 border-b border-slate bg-paper lg:hidden">
            <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <img src="/logo-copper.svg" alt="" className="size-8" />
                    <span className="text-xl font-black">דינמו</span>
                </div>
                <span className="grid size-9 place-items-center rounded-full border border-slate bg-paper text-lg">
                    {myEmoji?.emoji}
                </span>
            </div>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-12">
            <div className="mb-5 flex flex-wrap items-center gap-x-2 text-sm lg:hidden">
                <span className="font-bold">{toHebrewDate(new Date())}</span>
                {quoteQuery.data && <span className="font-light text-slate-soft">· ״{quoteQuery?.data.text}״</span>}
            </div>
            <Outlet />
        </main>

        {/* bottom bar (mobile) */}
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate bg-paper lg:hidden">
            <NavLink to={"/challenges"} end className={bottomLinkClass}><span className="text-lg">⚡</span>אתגרים</NavLink>
            <NavLink to={"/challenges/new"} className={bottomLinkClass}><span className="text-lg">＋</span>יצירה</NavLink>
            <NavLink to={"/group"} className={bottomLinkClass}><span className="text-lg">◎</span>הקבוצה</NavLink>
            <button onClick={logout} className="flex flex-col items-center gap-0.5 pt-2 pb-3 text-xs text-slate-soft"><span className="text-lg">⎋</span>יציאה</button>
        </nav>
    </div>
}
export default Layout
