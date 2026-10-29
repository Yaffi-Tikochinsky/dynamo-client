import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../api/challenges";
import { getErrorMessage } from "../utils/errors";
import { LOCKED_REASON_LABELS } from "../utils/labels";
import type { ChallengeDetails } from "../types/challenge";
import { toHebrewDate } from "../utils/hebrewDate";
import { AvatarEmoji } from "./AvatarEmoji";
import { ResponsiveContainer,Line, Legend,LineChart, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"
import { getProgress } from "../api/challenges";

// chart colors on paper: ink text, light rules, a paper tooltip
const AXIS_TICK = { fill: "#4B5862", fontSize: 13 }
const AXIS_LINE = { stroke: "#23303A" }
const GRID_STROKE = "rgb(35 48 58 / 0.1)"
const TOOLTIP_STYLE = { background: "#F4F0E8", border: "1px solid #B9B1A4", borderRadius: 10, color: "#23303A", fontSize: 14 }

export function ChallengeResult({ challenge }: { challenge: ChallengeDetails }) {
    const { permissions } = challenge
    const leaderBoardQuery = useQuery(
        {
            queryKey: ["challenge", challenge.id, "leaderBoard"],
            queryFn: () => getLeaderboard(challenge.id),
            enabled: permissions.canViewResults
        }

    )
    const progress = useQuery({
        queryKey: ["challenge", challenge.id, "progress"],
        queryFn: () => getProgress(challenge.id),
        enabled: challenge.permissions.canViewResults,
    })
    if (!permissions.canViewResults)
        return <p className="paper-card lg:col-span-2 lg:group-has-[#report]/results:col-span-1 self-start px-6 py-5 text-base text-slate-soft">🔒 {permissions.lockedReason && LOCKED_REASON_LABELS[permissions.lockedReason]}</p>
    if (leaderBoardQuery.isLoading)
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 animate-pulse text-sm text-slate-soft">טוענים את התוצאות...</p>
    if (leaderBoardQuery.isError)
        return <p className="alert lg:col-span-2 lg:group-has-[#report]/results:col-span-1 self-start">{getErrorMessage(leaderBoardQuery.error)}</p>
    if (!leaderBoardQuery.data)
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 text-sm text-slate-muted">לא נמצאו נתונים</p>
    const board = leaderBoardQuery.data
    const barData = board.rows.map((row) => ({
        name: row.user.displayName,
        percentage: row.percentage ?? 0,
        color: row.user.color,
        isMe: row.isMe,
    }))

    return <>
        {
            board.status === "ENDED" && board.winners && board.winners.length > 0 &&
            <div className="paper-card corner-marks p-8 text-center lg:col-span-2">
                <div className="spec">WINNERS</div>
                <h2 className="mt-1 text-3xl font-black">🏆 <span className="text-spark">הזוכים</span></h2>
                <div className="mt-5 flex flex-wrap justify-center gap-6">
                {
                    board.winners.map((w) =>
                    (<div key={w.id} className="flex flex-col items-center gap-2">
                        <div className="grid size-16 place-items-center rounded-full border-2 border-blaze bg-paper text-3xl shadow-[0_0_0_5px_rgb(255_90_31/0.12)]"><AvatarEmoji avatar={w.avatar} ></AvatarEmoji></div>
                        <div className="text-lg font-bold">{w.displayName}</div>
                    </div>
                    ))
                }
                </div>
                {board.prize && <div className="tag mt-5 inline-block border-blaze px-4 py-1.5 text-sm text-blaze">הפרס: {board.prize}</div>}</div>
        }
        <section className="paper-card lg:col-span-2 lg:group-has-[#report]/results:col-span-1 overflow-x-auto p-6 sm:p-7">
            <h2 className="flex items-baseline gap-2.5 text-xl font-black">דירוג <small className="spec text-[10px] font-medium">RANKING</small></h2>
            {board.dataUntil && <p className="mt-1 text-sm font-light text-slate-soft">נכון ל{toHebrewDate(board.dataUntil)}</p>}
            <table className="mt-4 w-full border-collapse text-right text-[15px]">
                <thead className="text-[11px] tracking-[1.5px] text-slate-muted">
                    <tr className="border-b border-slate">
                        <th className="px-2.5 pb-2 font-medium">מקום</th>
                        <th className="px-2.5 pb-2 font-medium">משתתף</th>
                        <th className="px-2.5 pb-2 font-medium">הצלחה</th>
                        <th className="px-2.5 pb-2 font-medium"> ימים</th>
                        <th className="px-2.5 pb-2 font-medium">רצף</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        board.rows.map((row) => (<tr key={row.user.id} className={`border-b border-[#CFC8BC] tabular-nums [&>td]:px-2.5 [&>td]:py-3 ${row.isMe ? "bg-blaze/[0.06] font-bold" : ""}`}>
                            <td className="w-14 text-center font-black text-blaze">{row.rank ?? "-"}</td>
                            <td className="whitespace-nowrap"><span className="me-2 text-xl"><AvatarEmoji avatar={row.user.avatar}></AvatarEmoji></span>{row.user.displayName}</td>
                            <td className="font-bold">{row.percentage !== null ? `${row.percentage}%` : "-"}</td>
                            <td className="text-slate-soft">{row.daysCounted}</td>
                            <td className="text-slate-soft">🔥 {row.currentStreak}</td>
                        </tr>

                        ))}</tbody>
            </table>
        </section>
        <section className="paper-card p-6 sm:p-7 lg:col-span-1">
        <h2 className="mb-5 flex items-baseline gap-2.5 text-xl font-black">הצלחה לכל משתתף <small className="spec text-[10px] font-medium">SUCCESS</small></h2>
        <div dir="ltr">

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={GRID_STROKE} />
                    <XAxis dataKey="name" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                    <YAxis domain={[0, 100]} unit="%" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#C46A2E", fontWeight: 700 }} itemStyle={{ color: "#23303A" }} cursor={{ fill: "rgb(35 48 58 / 0.05)" }} formatter={(v) => [`${v}%`, "הצלחה"]} />
                    <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={48} stroke="#23303A" strokeWidth={0.8}>
                        {barData.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        </section>
        <section className="paper-card p-6 sm:p-7 lg:col-span-1">
        <h2 className="mb-5 flex items-baseline gap-2.5 text-xl font-black">ההתקדמות לאורך האתגר <small className="spec text-[10px] font-medium">CUMULATIVE</small></h2>
        <div dir="ltr">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progress.data?.points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid stroke={GRID_STROKE} />
                    <XAxis dataKey="date" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} tickFormatter={(d: string) => `${d.slice(8)}/${d.slice(5, 7)}`} />
                    <YAxis domain={[0, 100]} unit="%" tick={AXIS_TICK} axisLine={AXIS_LINE} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#C46A2E", fontWeight: 700 }} itemStyle={{ color: "#23303A" }} cursor={{ stroke: "#C46A2E", strokeDasharray: "4 4" }} labelFormatter={(d) => toHebrewDate(String(d))} />
                    <Legend wrapperStyle={{ color: "#4B5862", paddingTop: 12, fontSize: 14 }} />
                    {progress.data?.series.map((s) => (
                        <Line key={s.key} dataKey={s.key} name={s.displayName} stroke={s.color} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} type="monotone" />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
        </section>


    </>
}
