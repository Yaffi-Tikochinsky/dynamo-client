import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getPendingReports, submitReports } from "../api/challenges"
import type { ChallengeDetails } from "../types/challenge"
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toHebrewDate } from "../utils/hebrewDate";
import { getErrorMessage } from "../utils/errors";

// yes / no as one ink-bordered switch; the chosen half turns ink
const yesNoClass = "flex-1 cursor-pointer px-5 py-1.5 text-center text-sm font-medium text-slate-soft transition select-none first:border-l first:border-slate hover:text-slate has-[:checked]:bg-slate has-[:checked]:font-bold has-[:checked]:text-paper"

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
    if (reportQuery.isLoading) return <p className="animate-pulse text-sm text-slate-soft">טוענים את הימים לדיווח...</p>
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
        return <p className="pill pill-ok px-4 py-3 text-base">✓ דיווחת בכל הימים. כל הכבוד, המעגל ממשיך להסתובב!</p>
    return <>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
            {dates.map((m) =>
            (
                <div key={m} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CFC8BC] py-3"><span className={`text-[15px] font-bold ${m === pending.today.date ? "text-blaze" : ""}`}>{m === pending.today.date ? "היום · " : ""}{toHebrewDate(m)}</span>
                    {challenge.scale === "RATING" ? <select className="field-line w-auto min-w-24 cursor-pointer py-1.5 [&_option]:bg-paper" {...register(`values.${m}`)}>
                        <option value="" key={0} >-</option>
                        {nums.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select> :
                        <div className="flex min-w-48 overflow-hidden rounded-lg border border-slate">
                            <label className={yesNoClass}><input type="radio" className="sr-only" {...register(`values.${m}`)} value="1" />✓ עשיתי </label>
                            <label className={yesNoClass}><input type="radio" className="sr-only" value="0" {...register(`values.${m}`)} />✗ לא</label>
                        </div>
                    }</div>))}
            <button type="submit" disabled={mutation.isPending} className="btn btn-spark mt-5 self-end px-6">{mutation.isPending ? "שולחים..." : "שליחת הדיווח ⚡"}</button>
            {mutation.isError && <p className="alert mt-4">{getErrorMessage(mutation.error)}</p>}

        </form>
    </>

}
