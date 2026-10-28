import { useForm } from "react-hook-form";
import type { ChallengeInput } from "../types/challenge";
import { useAuth } from "../context/AuthContext";
import { SCALE_LABELS, VISIBILITY_LABELS } from "../utils/labels";

const labelClass = "flex flex-col gap-2 text-base font-medium text-fg-soft"
const fieldClass = "rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base font-normal text-white placeholder:text-fg-muted outline-none [color-scheme:dark] transition focus:border-gold focus:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45 [&_option]:bg-[#5A1240]"
const errorClass = "text-sm font-normal text-pink"
interface ChallengeFormProps {
    defaultValues?: Partial<ChallengeInput>
    editableFields?: string[]
    onSubmit: (data: ChallengeInput) => void
    isPending: boolean
    submitLabel: string
}
export default function ChallengeForm({ defaultValues, editableFields, onSubmit, isPending, submitLabel }: ChallengeFormProps) {
    const { watch, handleSubmit, register, formState: { errors } }
        = useForm<ChallengeInput>({ defaultValues, shouldUnregister: true })
    const { user } = useAuth()
    const visibility = watch("visibility") ?? defaultValues?.visibility
        const isLocked = (field: string) => editableFields !== undefined && !editableFields.includes(field)
    return <>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>שם האתגר
                <input placeholder="למשל: 20 דפים ביום" className={fieldClass} disabled={isLocked("title")}{...register("title", {
                    required: "הזן שם לאתגר",
                    minLength: { value: 2, message: "לפחות 2 תוים" }
                    , maxLength: { value: 60, message: "עד 60 תוים" }
                })} />
                {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            </label>
            <label className={`${labelClass} sm:col-span-2`}>תיאור האתגר
                <textarea rows={3} placeholder="מה עושים כל יום? איך מדווחים?" className={`${fieldClass} resize-y`} disabled={isLocked("description")}{...register("description", { maxLength: { value: 500, message: "עד 500 תוים" } })}>
                </textarea>
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
            </label>
            <label className={labelClass}>סולם דירוג
                <select className={fieldClass} disabled={isLocked("scale")}{...register("scale", { required: "זהו שדה חובה" })}>
                    <option value="YES_NO">{SCALE_LABELS["YES_NO"]}</option>
                    <option value="RATING">{SCALE_LABELS["RATING"]}</option>
                </select>
                {errors.scale && <p className={errorClass}>{errors.scale.message}</p>}
            </label>
            <label className={labelClass}>אישי/קבוצתי
                <select className={fieldClass} disabled={isLocked("visibility")} {...register("visibility", { required: "זהו שדה חובה" })}>
                    <option value="PRIVATE">{VISIBILITY_LABELS["PRIVATE"]}</option>
                    {user?.role === "MANAGER" && <option value="PUBLIC">{VISIBILITY_LABELS["PUBLIC"]}</option>
                    } </select>
                {errors.visibility && <p className={errorClass}>{errors.visibility.message}</p>}
            </label>
            <label className={labelClass}>תאריך התחלה
                <input type="date" className={fieldClass} disabled={isLocked("startDate")} {...register("startDate", { required: "זהו שדה חובה" })} />
                {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
            </label>
            <label className={labelClass}>תאריך סיום
                <input type="date" className={fieldClass} disabled={isLocked("endDate")} {...register("endDate", {
                    required: "שדה חובה",
                    validate: (value, all) => value >= all.startDate || "תאריך הסיום לא יכול להיות לפני ההתחלה",
                })} />
                {errors.endDate && <p className={errorClass}>{errors.endDate.message}</p>}
            </label>
            {visibility === "PUBLIC" && (<><label className={labelClass}>פרס
                <input type="text" placeholder="למשל: ארוחת בוקר במסעדה" className={fieldClass} disabled={isLocked("prize")} {...register("prize", { maxLength: { value: 100, message: "עד 100 תוים" } })} />
                {errors.prize && <p className={errorClass}>{errors.prize.message}</p>}
            </label>
                <label className={labelClass}>כמה ימים אחרי ההתחלה אפשר להצטרף
                    <input className={fieldClass} disabled={isLocked("joinWindowDays")} type="number"{...register("joinWindowDays",
                        { required: "זהו שדה חובה", min: { value: 0, message: "לא יכול להיות שלילי" }, valueAsNumber: true })} />
                    {errors.joinWindowDays && <p className={errorClass}>{errors.joinWindowDays.message}</p>}
                </label>    </>
            )
            }
            <div className="flex justify-end border-t border-white/15 pt-6 sm:col-span-2">
                <button type="submit" disabled={isPending} className="bg-energy rounded-full px-10 py-3 text-lg font-medium text-ink transition hover:brightness-110 active:scale-95 disabled:opacity-60">{isPending ? "שומרים..." : submitLabel}</button>
            </div>
        </form >

    </>
}