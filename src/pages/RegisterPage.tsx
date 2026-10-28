import { getMeta } from "../api/meta"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { Navigate } from "react-router-dom"
import type { RegisterInput } from "../types/user"
import { register as registerUser } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/errors"

interface RegisterWithMode extends RegisterInput {
    mode: "join" | "create"
}

const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-fg-soft"
const inputClass = "rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-fg-muted outline-none transition focus:border-fuchsia focus:bg-white/10"
const errorClass = "-mt-2 text-sm text-pink"
const modeClass = "flex flex-1 cursor-pointer items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-fg-soft transition select-none has-[:checked]:bg-white/20 has-[:checked]:text-white has-[:checked]:shadow-[0_0_16px_rgba(255,176,32,0.35)]"


function RegisterPage() {
    const { user, isLoading, saveLogin } = useAuth()

    const metaQuery = useQuery({ queryKey: ["meta"], queryFn: getMeta })
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterWithMode>({ defaultValues: { mode: "join" }, shouldUnregister: true })
    const navigate = useNavigate()
    const mode = watch("mode")
    const avatars = metaQuery.data?.avatars
    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            saveLogin(data)
            navigate("/challenges")
        }
    }
    )
    if (isLoading)
        return <p className="grid min-h-screen place-items-center text-fg-soft">טוען...</p>
    if (user)
        return <><Navigate to="/challenges" replace></Navigate></>
    const onSubmit = (data: RegisterWithMode) => {
        const { mode, joinCode, groupName, ...rest } = data
        mutation.mutate(mode === "create" ?
            { ...rest, groupName } : { ...rest, joinCode }
        )
    }


    return <div className="grid min-h-screen place-items-center px-4 py-10">
        <div className="w-full max-w-xl">
            <div className="mb-8 flex flex-col items-center text-center">
                <img src="/logo.svg" alt="" className="size-20 drop-shadow-[0_0_16px_rgba(255,176,32,0.6)]" />
                <div className="mt-3 text-4xl font-extrabold tracking-wide">דינמו</div>
                <div className="mt-2 text-fg-soft">מעגל. עשייה. אנרגיה.</div>
            </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate
            className="border-energy flex flex-col gap-4 rounded-3xl border border-transparent bg-white/5 p-7 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(255,176,32,0.45)]">
            <div className="mb-2">
                <h1 className="text-2xl font-bold">הצטרפות <span className="text-energy">למעגל</span></h1>
                <p className="mt-1 text-sm text-fg-muted">כמה פרטים, ואתם בפנים</p>
            </div>

            <label className={labelClass}>מייל
                <input type="email" placeholder="name@example.com" autoComplete="email" className={inputClass}
                    {...register("email", { required: "יש להזין מייל" })} />
            </label>
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}

            <label className={labelClass}>סיסמה
                <input type="password" placeholder="לפחות 8 תווים, אות באנגלית וספרה" autoComplete="new-password" className={inputClass}
                    {...register("password", { required: "יש להזין סיסמה", minLength:{value:8,message:"לפחות 8 תוים"} ,maxLength:{value:64,message:"עד 64 תוים"}
                     ,   pattern:{value:/^(?=.*[A-Za-z])(?=.*\d)/,message:"לפחות אות אחת באנגלית וספרה אחת"}
                    })} />
            </label>
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}

            <label className={labelClass}>שם תצוגה
                <input type="text" placeholder="איך יקראו לכם בקבוצה" className={inputClass}
                    {...register("displayName", { required: "יש להזין שם תצוגה" , minLength:{value:2,message:"לפחות 2 תוים"},maxLength:{value:30,message:"עד 30 תוים"}})} />
            </label>
            {errors.displayName && <p className={errorClass}>{errors.displayName.message}</p>}
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium text-fg-soft">סמל</legend>
                {metaQuery.isLoading && <p className="text-sm text-fg-muted">טוענים סמלים...</p>}
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
                {avatars?.map((a) =>
                (
                    <label key={a.key} title={a.key}
                        className="grid aspect-square cursor-pointer place-items-center rounded-2xl border border-white/12 bg-white/5 text-2xl transition hover:scale-110 hover:border-white/30 has-[:checked]:scale-110 has-[:checked]:border-fuchsia has-[:checked]:bg-fuchsia/15 has-[:checked]:shadow-[0_0_16px_rgba(255,176,32,0.55)]">{a.emoji}
                        <input type="radio" className="sr-only"
                            value={a.key}
                            {...register("avatar", { required: "יש לבחור סמל" })} />
                    </label>
                ))}
                </div>
            </fieldset>
            {errors.avatar && <p className="text-sm text-pink">{errors.avatar.message}</p>}


            <div className="mt-2 flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
            <label className={modeClass}>
                <input type="radio" className="sr-only" value={"join"} {...register("mode")} />הצטרפות לקבוצה קיימת
            </label>
            <label className={modeClass}>
                <input type="radio" className="sr-only" value={"create"} {...register("mode")} />יצירת קבוצה חדשה
            </label>
            </div>
            {mode === "join" ? <>
                <label className={labelClass}>קוד הצטרפות לקבוצה
                    <input type="text" placeholder="הקוד שקיבלתם ממנהל הקבוצה" className={`${inputClass} tracking-widest uppercase`}
                        {...register("joinCode", { required: "יש להזין קוד הצטרפות" })} />
                </label>
                {errors.joinCode && <p className={errorClass}>{errors.joinCode.message}</p>}
            </>
                :
                <>
                    <label className={labelClass}>שם הקבוצה
                        <input type="text" placeholder="למשל: משפחת לוי" className={inputClass}
                            {...register("groupName", { required: "יש לבחור שם לקבוצה" ,minLength:{value:2,message:"לפחות 2 תוים"},maxLength:{value:40,message:"עד 40 תוים"}})} />
                    </label>
                    {errors.groupName && <p className={errorClass}>{errors.groupName.message}</p>}
                    <p className="-mt-2 text-xs text-fg-muted">אתם תהיו מנהלי הקבוצה, ותקבלו קוד הצטרפות לשתף עם חברים.</p>

                </>}



            {mutation.isError && <p className="rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-4 py-2.5 text-sm text-pink">{getErrorMessage(mutation.error)}</p>}
            <button type="submit" disabled={mutation.isPending}
                className="bg-energy mt-2 rounded-full py-3 font-medium text-ink transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                {mutation.isPending ? "נרשמים..." : "אישור והרשמה"}
            </button>
            <Link to="/login" className="text-center text-sm text-fg-soft transition hover:text-pink">יש לך כבר חשבון? <span className="font-medium text-pink">להתחברות</span></Link>

        </form >
        </div>
    </div>
}
export default RegisterPage
