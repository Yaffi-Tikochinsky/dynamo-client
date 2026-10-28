import { Outlet, NavLink } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getMeta, getTodayQuote } from "../api/meta"
import { toHebrewDate } from "../utils/hebrewDate"

const ENERGY_V = "bg-[linear-gradient(to_bottom,#FFB020,#FF5A5F,#8E1B45)]"
const ENERGY_H = "bg-[linear-gradient(to_left,#FFE07A,#FFB020,#FF5A5F)]"
const HAIRLINE = "h-px bg-[linear-gradient(to_left,transparent,rgba(255,90,95,0.55),transparent)]"

const sideLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 rounded-2xl px-5 py-3 text-lg transition ${isActive
        ? "bg-wine/[0.07] font-bold text-wine before:absolute before:inset-y-2.5 before:right-1.5 before:w-1 before:rounded-full before:bg-[linear-gradient(to_bottom,#FFB020,#FF5A5F,#8E1B45)] before:content-['']"
        : "font-medium text-wine-soft hover:bg-wine/[0.04] hover:text-wine"}`

const bottomLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 rounded-2xl py-2 text-xs transition ${isActive
        ? "bg-wine/[0.08] font-bold text-wine"
        : "font-medium text-wine-soft"}`

function Layout() {
    const { user, logout } = useAuth()
    const quoteQuery = useQuery({ queryKey: ["quote"], queryFn: getTodayQuote, staleTime: 1000 * 60 * 60 })
    const metaQuery = useQuery({ queryKey: ["meta"], queryFn: getMeta })
    const myEmoji = metaQuery.data?.avatars.find((a) => a.key === user?.avatar)
    return <div className="min-h-screen lg:ps-72">

        {/* side bar (desktop) */}
        <aside className="fixed inset-y-0 right-0 z-40 hidden w-72 flex-col overflow-hidden bg-white text-wine lg:flex">
            <span className={`absolute inset-y-0 left-0 w-1 ${ENERGY_V}`}></span>

            <div className="flex flex-col items-center px-6 pt-8 text-center">
                <img src="/logo-dark.svg" alt="" className="size-20" />
                <div className="mt-2 text-4xl font-extrabold tracking-wide">דינמו</div>
                <div className="mt-1 text-sm text-wine-soft">מעגל. עשייה. אנרגיה.</div>
            </div>

            <div className={`mx-7 mt-6 ${HAIRLINE}`}></div>

            <nav className="mt-4 flex flex-col gap-1 px-4">
                <NavLink to={"/challenges"} end className={sideLinkClass}><span>⚡</span>אתגרים</NavLink>
                <NavLink to={"/challenges/new"} className={sideLinkClass}><span>＋</span>יצירת אתגר</NavLink>
                <NavLink to={"/group"} className={sideLinkClass}><span>👥</span>הקבוצה שלי</NavLink>
            </nav>

            <div className={`mx-7 mt-4 ${HAIRLINE}`}></div>

            <div className="px-8 pt-5 text-base">
                <div className="font-bold text-[#C2384A]">{toHebrewDate(new Date())}</div>
                {quoteQuery.data && <p className="mt-1.5 leading-relaxed text-wine-soft">״{quoteQuery?.data.text}״</p>}
            </div>

            <div className="mt-auto px-4 pb-6">
                <div className="rounded-3xl border border-wine/10 bg-wine/[0.04] p-4">
                    <div className="flex items-center gap-3">
                        <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#FF6B5A] bg-white text-2xl">
                            {myEmoji?.emoji}
                        </span>
                        <div className="min-w-0 leading-tight">
                            <div className="flex items-center gap-2 text-base font-bold">
                                <span className="truncate">{user?.displayName}</span>
                                {user?.role === "MANAGER" && <span className="rounded-full bg-[#FFB020] px-2 py-0.5 text-xs font-medium text-ink">מנהל</span>}
                            </div>
                            <div className="truncate text-sm text-wine-soft">{user?.group.name}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="mt-3 w-full rounded-full border border-wine/15 py-2 text-base font-medium text-wine-soft transition hover:border-[#C2384A]/50 hover:bg-[#C2384A]/10 hover:text-[#9A1838] active:scale-95">
                        ⎋ התנתקות
                    </button>
                </div>
            </div>

            <span className={`pointer-events-none absolute bottom-10 left-6 h-0.5 w-28 -rotate-[16deg] rounded-full opacity-60 ${ENERGY_H}`}></span>
            <span className={`pointer-events-none absolute bottom-6 left-12 h-px w-36 -rotate-[16deg] rounded-full opacity-40 ${ENERGY_H}`}></span>
        </aside>

        {/* top bar (mobile) */}
        <header className="sticky top-0 z-40 bg-white text-wine lg:hidden">
            <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <img src="/logo-dark.svg" alt="" className="size-10" />
                    <span className="text-2xl font-extrabold tracking-wide">דינמו</span>
                </div>
                <span className="grid size-10 place-items-center rounded-full border-2 border-[#FF6B5A] bg-white text-xl">
                    {myEmoji?.emoji}
                </span>
            </div>
            <span className={`block h-0.5 ${ENERGY_H}`}></span>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-12">
            <div className="mb-5 flex flex-wrap items-center gap-x-2 text-sm lg:hidden">
                <span className="font-bold text-gold">{toHebrewDate(new Date())}</span>
                {quoteQuery.data && <span className="text-fg-soft">· ״{quoteQuery?.data.text}״</span>}
            </div>
            <Outlet />
        </main>

        {/* bottom bar (mobile) */}
        <nav className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden">
            <span className={`block h-0.5 ${ENERGY_H}`}></span>
            <div className="grid grid-cols-4 gap-1 px-2 pt-1.5 pb-2.5">
                <NavLink to={"/challenges"} end className={bottomLinkClass}><span className="text-xl">⚡</span>אתגרים</NavLink>
                <NavLink to={"/challenges/new"} className={bottomLinkClass}><span className="text-xl">＋</span>יצירה</NavLink>
                <NavLink to={"/group"} className={bottomLinkClass}><span className="text-xl">👥</span>הקבוצה</NavLink>
                <button onClick={logout} className="flex flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-medium text-wine-soft"><span className="text-xl">⎋</span>יציאה</button>
            </div>
        </nav>
    </div>
}
export default Layout
