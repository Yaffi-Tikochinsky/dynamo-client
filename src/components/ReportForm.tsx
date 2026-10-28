import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPendingReports, submitReports } from "../api/challenges"
import type { ChallengeDetails } from "../types/challenge"
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toHebrewDate } from "../utils/hebrewDate";
import { getErrorMessage } from "../utils/errors";
export function ReportForm({ challenge }: { challenge: ChallengeDetails }) {
    const id = challenge.id
    const queryClient = useQueryClient()
    const { register, handleSubmit, reset } = useForm<{ values: Record<string, string> }>()
    const reportQuery = useQuery({
        queryKey: ["challenge", id, "pending"],
        queryFn: () => getPendingReports(id)
    })
    const mutation = useMutation({
        mutationFn: submitReports,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenge", id] })
            queryClient.invalidateQueries({ queryKey: ["challenges"] })
            reset()
        }
    })


    const nums = Array.from({ length: 10 }, (_, i) => i + 1)
    if (reportQuery.isLoading) return <p className="animate-pulse text-base text-fg-soft">טוענים את הימים לדיווח...</p>
    if (!reportQuery.data) return null
    const pending = reportQuery.data
    const onSubmit = (reportData: { values: Record<string, string> }) => {
        const reports = (Object.entries(reportData.values ?? {})).filter(([, value]) => value).map(([date, value]) => ({ date, value: Number(value) }))
        const count = pending.missingDates.filter((d) => !reportData.values?.[d]).length

        if (count > 0 && !confirm(`לא דיווחת על ${count} ימים. אם תאשר, הציון האוטומטי בהם יהיה 0. להמשיך?`))
            return
        mutation.mutate({
            id: id,
            input: {
                reports: reports,
                fillMissingWithZero: count > 0
            }
        })

    }
    const dates = [...pending.missingDates, ...(pending.today.canReport ? [pending.today.date] : [])]
    if (dates.length === 0)
        return <p className="rounded-2xl border border-gold/40 bg-gold/15 px-5 py-4 text-lg font-medium text-gold">✓ דיווחת בכל הימים. כל הכבוד, המעגל ממשיך להסתובב!</p>
    return <>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
            {dates.map((m) =>
            (
                <div key={m} className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-4 first:border-t-0"><span className={`text-lg font-medium ${m === pending.today.date ? "text-gold" : ""}`}>{m === pending.today.date ? "היום · " : ""}{toHebrewDate(m)}</span>
                    {challenge.scale === "RATING" ? <select className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-base text-white outline-none focus:border-gold [&_option]:bg-[#5A1240]" {...register(`values.${m}`)}>
                        <option value="" key={0} >-</option>
                        {nums.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select> :
                        <div className="flex gap-2">
                            <label className="cursor-pointer rounded-full border border-white/30 px-5 py-2 text-base font-medium text-fg-soft transition select-none hover:bg-white/10 has-[:checked]:border-white/60 has-[:checked]:bg-white/25 has-[:checked]:text-white"><input type="radio" className="sr-only" {...register(`values.${m}`)} value="1" />✓ עשיתי </label>
                            <label className="cursor-pointer rounded-full border border-white/30 px-5 py-2 text-base font-medium text-fg-soft transition select-none hover:bg-white/10 has-[:checked]:border-white/60 has-[:checked]:bg-white/25 has-[:checked]:text-white"><input type="radio" className="sr-only" value="0" {...register(`values.${m}`)} />✗ לא</label>
                        </div>
                    }</div>))}
            <button type="submit" disabled={mutation.isPending} className="bg-energy mt-6 self-start rounded-full px-8 py-3 text-lg font-medium text-ink transition hover:brightness-110 active:scale-95 disabled:opacity-60">{mutation.isPending ? "שולחים..." : "שליחת הדיווח"}</button>
            {mutation.isError && <p className="mt-4 rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-4 py-3 text-base text-pink">{getErrorMessage(mutation.error)}</p>}

        </form>
    </>

}