import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { Navigate } from "react-router-dom"
import type { LoginInput } from "../types/user"
import { login } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/errors"

const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-fg-soft"
const inputClass = "rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder:text-fg-muted outline-none transition focus:border-fuchsia focus:bg-white/10"
const errorClass = "-mt-2 text-sm text-pink"

function LoginPage() {
    const { user, isLoading, saveLogin } = useAuth()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>()
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: login,
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
    const onSubmit = (data: LoginInput) => {
        mutation.mutate(data)
    }


    return <div className="grid min-h-screen place-items-center px-4 py-10">
        <div className="w-full max-w-md">
            <div className="mb-8 flex flex-col items-center text-center">
                <img src="/logo.svg" alt="" className="size-24 drop-shadow-[0_0_16px_rgba(255,176,32,0.6)]" />
                <div className="mt-3 text-5xl font-extrabold tracking-wide">דינמו</div>
                <div className="mt-2 text-fg-soft">מעגל. עשייה. אנרגיה.</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate
                className="border-energy flex flex-col gap-4 rounded-3xl border border-transparent bg-white/5 p-7 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(255,176,32,0.45)]">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold">שמחים שחזרת <span className="text-energy">⚡</span></h1>
                    <p className="mt-1 text-sm text-fg-muted">התחברו כדי להמשיך את המעגל</p>
                </div>

                <label className={labelClass}>מייל
                    <input type="email" placeholder="name@example.com" autoComplete="email" className={inputClass}
                        {...register("email", { required: "יש להזין מייל" })} />
                </label>
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}

                <label className={labelClass}>סיסמה
                    <input type="password" placeholder="••••••••" autoComplete="current-password" className={inputClass}
                        {...register("password", { required: "יש להזין סיסמה" })} />
                </label>
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                {mutation.isError && <p className="rounded-2xl border border-fuchsia/40 bg-fuchsia/10 px-4 py-2.5 text-sm text-pink">{getErrorMessage(mutation.error)}</p>}
                <button type="submit" disabled={mutation.isPending}
                    className="bg-energy mt-2 rounded-full py-3 font-medium text-ink transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                    {mutation.isPending ? "מתחברים..." : "כניסה"}
                </button>
                <Link to="/register" className="text-center text-sm text-fg-soft transition hover:text-pink">אין לך חשבון? <span className="font-medium text-pink">להרשמה</span></Link>

            </form>
        </div>
    </div>
}
export default LoginPage
