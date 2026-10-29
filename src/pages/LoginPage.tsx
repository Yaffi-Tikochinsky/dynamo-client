import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { Navigate } from "react-router-dom"
import type { LoginInput } from "../types/user"
import { login } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import { getErrorMessage } from "../utils/errors"

const labelClass = "flex flex-col gap-1.5 text-xs text-slate-soft xl:gap-2.5 xl:text-base"
const inputClass = "rounded-t-lg border-b border-slate bg-white/60 px-3 py-2.5 text-[15px] text-slate placeholder:text-slate-muted outline-none transition focus:border-blaze focus:bg-white/80 xl:rounded-t-xl xl:px-5 xl:py-4 xl:text-[length:calc(19*var(--u))]"
const errorClass = "-mt-3 text-sm text-[#B4321A] xl:text-lg"

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
        return <p className="grid min-h-screen place-items-center text-slate-soft">טוען...</p>
    if (user)
        return <><Navigate to="/challenges" replace></Navigate></>
    const onSubmit = (data: LoginInput) => {
        mutation.mutate(data)
    }


    return <div className="relative min-h-screen font-heebo text-slate xl:login-fit">
        {/* outline filter for "עשייה": grows the letter shape by 1.25px and cuts the letter out, leaving only its outer edge */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
            <filter id="dynamo-outline" x="-5%" y="-5%" width="110%" height="110%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="1.25" result="grown" />
                <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
                <feFlood floodColor="#23303A" />
                <feComposite in2="ring" operator="in" />
            </filter>
        </svg>

        {/* paper background: grid, glow, slow waves and the rotor cut off in the corner */}
        <div className="bg-paper-screen" aria-hidden="true">
            <div className="paper-glow"></div>
            <div className="paper-wave"></div>
            <div className="paper-wave [animation-delay:-6.67s]"></div>
            <div className="paper-wave [animation-delay:-13.33s]"></div>
            <img src="/login-rotor.svg" alt="" className="absolute -top-[260px] -left-[260px] size-[760px] max-w-none xl:-top-163.25 xl:-left-163.25 xl:size-426.5 saturate-[.8]" />

            {/* blueprint note: Faraday's law, the principle a dynamo works by */}
            <div className="absolute bottom-7 left-8 hidden border-l-2 border-blaze pl-3 text-left lg:block">
                <div dir="ltr" className="font-serif text-xl text-slate italic">ε = −dΦ/dt</div>
                <div className="mt-1 text-[11px] tracking-[1.5px] text-slate-muted">חוק פאראדיי · תנועה מתמדת יוצרת אנרגיה</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">DYN-00 · מחולל קבוצתי</div>
            </div>
        </div>

        <div className="relative z-10 grid min-h-screen place-items-center px-4 py-10 lg:grid-cols-[420px_auto] lg:justify-center lg:gap-20 lg:pl-20 xl:flex xl:items-center xl:justify-start xl:p-0 xl:pr-(--form-gap)">
            <form onSubmit={handleSubmit(onSubmit)} noValidate
                className="corner-marks xl:login-fit xl:[--k:1.25] flex w-full max-w-[420px] flex-col gap-5 rounded-2xl border border-rule bg-paper px-8 pt-8 pb-7 sm:px-9 xl:min-h-200 xl:w-168 xl:max-w-none xl:justify-center xl:gap-8 xl:rounded-3xl xl:px-16 xl:py-12">
                <div className="flex items-center gap-3">
                    <img src="/logo-copper.svg" alt="" className="size-11 xl:size-16" />
                    <div>
                        <div className="text-[28px] leading-none font-black xl:text-[length:calc(40*var(--u))]">דינמו</div>
                        <div className="mt-1.5 text-[11px] tracking-[1.5px] text-slate-muted xl:mt-2 xl:text-sm">מעגל · עשייה · אנרגיה</div>
                    </div>
                </div>

                <div className="mt-3 mb-1">
                    <h1 className="text-[34px] leading-tight font-black xl:text-[length:calc(52*var(--u))]">שמחים <span className="text-spark">שחזרת</span></h1>
                    <p className="mt-2 text-[15px] font-light text-slate-soft xl:mt-3 xl:text-xl">התחברו כדי להמשיך את המעגל</p>
                </div>

                <label className={labelClass}><span className="flex gap-2"><span className="text-blaze">01</span>מייל</span>
                    <input type="email" placeholder="name@example.com" autoComplete="email" className={inputClass}
                        {...register("email", { required: "יש להזין מייל" })} />
                </label>
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}

                <label className={labelClass}><span className="flex gap-2"><span className="text-blaze">02</span>סיסמה</span>
                    <input type="password" placeholder="••••••••" autoComplete="current-password" className={inputClass}
                        {...register("password", { required: "יש להזין סיסמה" })} />
                </label>
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                {mutation.isError && <p className="rounded-lg border border-blaze/40 bg-blaze/10 px-4 py-2.5 text-sm text-[#9A2A12] xl:px-5 xl:py-3 xl:text-lg">{getErrorMessage(mutation.error)}</p>}
                <button type="submit" disabled={mutation.isPending}
                    className="bg-spark rounded-xl py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-10px_rgb(255_90_31/0.5)] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60 xl:rounded-2xl xl:py-5 xl:text-xl">
                    {mutation.isPending ? "מתחברים..." : "כניסה למעגל ⚡"}
                </button>
                <Link to="/register" className="text-sm text-slate-muted transition hover:text-slate xl:text-lg">אין לך חשבון? <span className="font-bold text-blaze">להרשמה</span></Link>
            </form>

            {/* the slogan as the hero (desktop only); on xl it sits two squares left of the form and crosses the rotor */}
            <div className="hidden leading-[0.95] lg:grid xl:absolute xl:top-1/2 xl:right-[calc(var(--form-gap)+var(--u)*936)] xl:-translate-y-1/2" aria-hidden="true">
                <span className="text-[112px] font-black tracking-[-1px] xl:text-[length:calc(190*var(--u))]">מעגל.</span>
                <span className="text-outline text-[112px] font-black tracking-[-1px] xl:text-[length:calc(190*var(--u))]">עשייה.</span>
                <span className="text-spark text-[112px] font-black tracking-[-1px] xl:text-[length:calc(190*var(--u))]">אנרגיה.</span>
                <small className="mt-6 text-[15px] leading-relaxed font-light text-slate-soft xl:mt-8 xl:text-[length:calc(25*var(--u))]">קבוצה אחת · דיווח אחד ביום · אנרגיה שמצטברת</small>
            </div>
        </div>
    </div>
}
export default LoginPage
