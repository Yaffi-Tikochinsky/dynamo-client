import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../api/challenges";
import { getErrorMessage } from "../utils/errors";
import { LOCKED_REASON_LABELS } from "../utils/labels";
import type { ChallengeDetails } from "../types/challenge";
import { toHebrewDate } from "../utils/hebrewDate";
import { AvatarEmoji } from "./AvatarEmoji";
import { ResponsiveContainer,Line, Legend,LineChart, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts"
import { getProgress } from "../api/challenges";

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
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 self-start rounded-2xl border border-white/15 px-6 py-5 text-lg text-fg-soft">🔒 {permissions.lockedReason && LOCKED_REASON_LABELS[permissions.lockedReason]}</p>
    if (leaderBoardQuery.isLoading)
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 animate-pulse text-base text-fg-soft">טוענים את התוצאות...</p>
    if (leaderBoardQuery.isError)
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 self-start rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-5 py-3 text-base text-pink">{getErrorMessage(leaderBoardQuery.error)}</p>
    if (!leaderBoardQuery.data)
        return <p className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 text-base text-fg-muted">לא נמצאו נתונים</p>
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
            <div className="rounded-3xl border border-gold/25 bg-gold/10 p-8 text-center lg:col-span-2">
                <h2 className="text-3xl font-extrabold text-gold">🏆 הזוכים</h2>
                <div className="mt-4 flex flex-wrap justify-center gap-6">
                {
                    board.winners.map((w) =>
                    (<div key={w.id} className="flex flex-col items-center gap-2">
                        <div className="grid size-16 place-items-center rounded-full border-2 border-gold bg-white/10 text-3xl shadow-[0_0_24px_rgba(255,224,138,0.5)]"><AvatarEmoji avatar={w.avatar} ></AvatarEmoji></div>
                        <div className="text-lg font-bold">{w.displayName}</div>
                    </div>
                    ))
                }
                </div>
                {board.prize && <div className="mt-5 inline-block rounded-full bg-white/15 px-5 py-2 text-base font-medium">הפרס: {board.prize}</div>}</div>
        }
        <section className="lg:col-span-2 lg:group-has-[#report]/results:col-span-1 overflow-x-auto">
            <h2 className="text-2xl font-bold">דירוג</h2>
            {board.dataUntil && <p className="mt-1 text-base text-fg-muted">נכון ל{toHebrewDate(board.dataUntil)}</p>}
            <table className="mt-5 w-full border-collapse text-right text-lg">
                <thead className="text-sm text-fg-muted">
                    <tr >
                        <th className="px-3 pb-3 font-medium">מקום</th>
                        <th className="px-3 pb-3 font-medium">משתתף</th>
                        <th className="px-3 pb-3 font-medium">הצלחה</th>
                        <th className="px-3 pb-3 font-medium"> ימים</th>
                        <th className="px-3 pb-3 font-medium">רצף</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        board.rows.map((row) => (<tr key={row.user.id} className={`border-t border-white/15 [&>td]:px-3 [&>td]:py-4 ${row.isMe ? "bg-white/10 font-bold" : ""}`}>
                            <td className="w-14 text-center text-xl font-extrabold text-gold">{row.rank ?? "-"}</td>
                            <td className="whitespace-nowrap"><span className="me-2 text-2xl"><AvatarEmoji avatar={row.user.avatar}></AvatarEmoji></span>{row.user.displayName}</td>
                            <td className="font-bold">{row.percentage !== null ? `${row.percentage}%` : "-"}</td>
                            <td className="text-fg-soft">{row.daysCounted}</td>
                            <td className="text-fg-soft">🔥 {row.currentStreak}</td>
                        </tr>

                        ))}</tbody>
            </table>
        </section>
        <section className="border-t border-white/20 pt-10 lg:col-span-1">
        <h2 className="mb-6 text-2xl font-bold">הצלחה לכל משתתף</h2>
        <div dir="ltr">

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: "#FFE6EC", fontSize: 14 }} axisLine={{ stroke: "rgba(255,255,255,0.25)" }} tickLine={false} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#FFE6EC", fontSize: 14 }} axisLine={{ stroke: "rgba(255,255,255,0.25)" }} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#5A1240", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 14, color: "#fff", fontSize: 15 }} labelStyle={{ color: "#FFE7B0" }} itemStyle={{ color: "#fff" }} cursor={{ fill: "rgba(255,255,255,0.08)" }} formatter={(v) => [`${v}%`, "הצלחה"]} />
                    <Bar dataKey="percentage" radius={[10, 10, 0, 0]} maxBarSize={56}>
                        {barData.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        </section>
        <section className="border-t border-white/20 pt-10 lg:col-span-1">
        <h2 className="mb-6 text-2xl font-bold">ההתקדמות לאורך האתגר</h2>
        <div dir="ltr">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progress.data?.points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" tick={{ fill: "#FFE6EC", fontSize: 14 }} axisLine={{ stroke: "rgba(255,255,255,0.25)" }} tickLine={false} tickFormatter={(d: string) => `${d.slice(8)}/${d.slice(5, 7)}`} />
                    <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#FFE6EC", fontSize: 14 }} axisLine={{ stroke: "rgba(255,255,255,0.25)" }} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#5A1240", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 14, color: "#fff", fontSize: 15 }} labelStyle={{ color: "#FFE7B0" }} itemStyle={{ color: "#fff" }} cursor={{ fill: "rgba(255,255,255,0.08)" }} labelFormatter={(d) => toHebrewDate(String(d))} />
                    <Legend wrapperStyle={{ color: "#FFE6EC", paddingTop: 12, fontSize: 15 }} />
                    {progress.data?.series.map((s) => (
                        <Line key={s.key} dataKey={s.key} name={s.displayName} stroke={s.color} strokeWidth={3} dot={false} activeDot={{ r: 5 }} type="monotone" />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
        </section>


    </>
}