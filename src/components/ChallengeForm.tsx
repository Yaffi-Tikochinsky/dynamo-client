import { useForm } from "react-hook-form";
import type { ChallengeInput } from "../types/challenge";
import { useAuth } from "../context/AuthContext";
import { SCALE_LABELS, VISIBILITY_LABELS } from "../utils/labels";

// same fields as the login page: a numbered label above an underlined field
const labelClass = "flex flex-col gap-2 text-sm text-slate-soft [&>i]:not-italic"
const numClass = "me-2 text-xs not-italic tracking-[1px] text-blaze"
const fieldClass = "field-line cursor-text [&_option]:bg-paper"
const errorClass = "text-sm text-[#B4321A]"
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}><span><i className={numClass}>01</i>שם האתגר</span>
                <input placeholder="למשל: 20 דפים ביום" className={fieldClass} disabled={isLocked("title")}{...register("title", {
                    required: "הזן שם לאתגר",
                    minLength: { value: 2, message: "לפחות 2 תוים" }
                    , maxLength: { value: 60, message: "עד 60 תוים" }
                })} />
                {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            </label>
            <label className={`${labelClass} sm:col-span-2`}><span><i className={numClass}>02</i>תיאור האתגר</span>
                <textarea rows={3} placeholder="מה עושים כל יום? איך מדווחים?" className={`${fieldClass} resize-y`} disabled={isLocked("description")}{...register("description", { maxLength: { value: 500, message: "עד 500 תוים" } })}>
                </textarea>
                {errors.description && <p className={errorClass}>{errors.description.message}</p>}
            </label>
            <label className={labelClass}><span><i className={numClass}>03</i>סולם דירוג</span>
                <select className={`${fieldClass} cursor-pointer`} disabled={isLocked("scale")}{...register("scale", { required: "זהו שדה חובה" })}>
                    <option value="YES_NO">{SCALE_LABELS["YES_NO"]}</option>
                    <option value="RATING">{SCALE_LABELS["RATING"]}</option>
                </select>
                {errors.scale && <p className={errorClass}>{errors.scale.message}</p>}
            </label>
            <label className={labelClass}><span><i className={numClass}>04</i>אישי/קבוצתי</span>
                <select className={`${fieldClass} cursor-pointer`} disabled={isLocked("visibility")} {...register("visibility", { required: "זהו שדה חובה" })}>
                    <option value="PRIVATE">{VISIBILITY_LABELS["PRIVATE"]}</option>
                    {user?.role === "MANAGER" && <option value="PUBLIC">{VISIBILITY_LABELS["PUBLIC"]}</option>
                    } </select>
                {errors.visibility && <p className={errorClass}>{errors.visibility.message}</p>}
            </label>
            <label className={labelClass}><span><i className={numClass}>05</i>תאריך התחלה</span>
                <input type="date" className={fieldClass} disabled={isLocked("startDate")} {...register("startDate", { required: "זהו שדה חובה" })} />
                {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
            </label>
            <label className={labelClass}><span><i className={numClass}>06</i>תאריך סיום</span>
                <input type="date" className={fieldClass} disabled={isLocked("endDate")} {...register("endDate", {
                    required: "שדה חובה",
                    validate: (value, all) => value >= all.startDate || "תאריך הסיום לא יכול להיות לפני ההתחלה",
                })} />
                {errors.endDate && <p className={errorClass}>{errors.endDate.message}</p>}
            </label>
            {visibility === "PUBLIC" && (<><label className={labelClass}><span><i className={numClass}>07</i>פרס</span>
                <input type="text" placeholder="למשל: ארוחת בוקר במסעדה" className={fieldClass} disabled={isLocked("prize")} {...register("prize", { maxLength: { value: 100, message: "עד 100 תוים" } })} />
                {errors.prize && <p className={errorClass}>{errors.prize.message}</p>}
            </label>
                <label className={labelClass}><span><i className={numClass}>08</i>כמה ימים אחרי ההתחלה אפשר להצטרף</span>
                    <input className={fieldClass} disabled={isLocked("joinWindowDays")} type="number"{...register("joinWindowDays",
                        { required: "זהו שדה חובה", min: { value: 0, message: "לא יכול להיות שלילי" }, valueAsNumber: true })} />
                    {errors.joinWindowDays && <p className={errorClass}>{errors.joinWindowDays.message}</p>}
                </label>    </>
            )
            }
            <div className="mt-2 flex justify-end border-t border-[#CFC8BC] pt-5 sm:col-span-2">
                <button type="submit" disabled={isPending} className="btn btn-spark px-8 py-3 text-base">{isPending ? "שומרים..." : submitLabel}</button>
            </div>
        </form >

    </>
}
