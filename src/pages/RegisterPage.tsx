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

const labelClass = "flex flex-col gap-1.5 text-xs text-slate-soft xl:gap-2.5 xl:text-base"
const inputClass = "rounded-t-lg border-b border-slate bg-white/60 px-3 py-2.5 text-[15px] text-slate placeholder:text-slate-muted outline-none transition focus:border-blaze focus:bg-white/80 xl:rounded-t-xl xl:px-5 xl:py-4 xl:text-[length:calc(19*var(--u))]"
const errorClass = "text-sm text-[#B4321A] xl:text-base"
const modeClass = "flex flex-1 cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm whitespace-nowrap text-slate-soft transition select-none hover:text-slate has-[:checked]:bg-slate has-[:checked]:font-bold has-[:checked]:text-paper xl:py-3 xl:text-base"


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
        return <p className="grid min-h-screen place-items-center text-slate-soft">טוען...</p>
    if (user)
        return <><Navigate to="/challenges" replace></Navigate></>
    const onSubmit = (data: RegisterWithMode) => {
        const { mode, joinCode, groupName, ...rest } = data
        mutation.mutate(mode === "create" ?
            { ...rest, groupName } : { ...rest, joinCode }
        )
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

        {/* paper background: grid, glow, slow waves and the rotor cut off in the corner (same as the login page) */}
        <div className="bg-paper-screen" aria-hidden="true">
            <div className="paper-glow"></div>
            <div className="paper-wave"></div>
            <div className="paper-wave [animation-delay:-6.67s]"></div>
            <div className="paper-wave [animation-delay:-13.33s]"></div>
            <img src="/login-rotor.svg" alt="" className="absolute -top-[260px] -left-[260px] size-[760px] max-w-none xl:-top-163.25 xl:-left-163.25 xl:size-426.5" />

            {/* blueprint note: Faraday's law, the principle a dynamo works by */}
            <div className="absolute bottom-7 left-8 hidden border-l-2 border-blaze pl-3 text-left lg:block">
                <div dir="ltr" className="font-serif text-xl text-slate italic">ε = −dΦ/dt</div>
                <div className="mt-1 text-[11px] tracking-[1.5px] text-slate-muted">חוק פאראדיי · תנועה מתמדת יוצרת אנרגיה</div>
                <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">DYN-00 · מחולל קבוצתי</div>
            </div>
        </div>

        <div className="relative z-10 grid min-h-screen place-items-center px-4 py-10 lg:grid-cols-[520px_auto] lg:justify-center lg:gap-16 lg:pl-10 xl:flex xl:items-center xl:justify-start xl:p-0 xl:pr-[calc(var(--form-gap)-var(--u)*48)] xl:[--reg-form-w:max(calc(var(--u)*1012),calc(100vw-var(--form-gap)-var(--u)*1105))]">
            {/* on xl the form is two columns, as tall as the login form (1000 on the 1920x1280 canvas).
                On a wide screen it grows to the left until it is 3 squares from the rotor's tick ring:
                1105 = rotor center 200 + tick ring radius 761 + 3 squares 144 (--reg-form-w).
                The form then moves one square right (48) of the login gap; its size and the slogan stay put */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate
                className="corner-marks xl:login-fit xl:[--k:1.15] grid w-full max-w-[520px] content-center gap-5 rounded-2xl border border-rule bg-paper px-8 pt-8 pb-7 sm:px-9 xl:min-h-[calc(1000*var(--u)/var(--k))] xl:w-(--reg-form-w) xl:max-w-none xl:grid-cols-2 xl:gap-x-10 xl:gap-y-5.5 xl:rounded-3xl xl:px-16 xl:py-10">
                <div className="xl:col-span-2">
                    <div className="flex items-center gap-3">
                        <img src="/logo-copper.svg" alt="" className="size-11 xl:size-16" />
                        <div>
                            <div className="text-[28px] leading-none font-black xl:text-[length:calc(40*var(--u))]">דינמו</div>
                            <div className="mt-1.5 text-[11px] tracking-[1.5px] text-slate-muted xl:mt-2 xl:text-sm">מעגל · עשייה · אנרגיה</div>
                        </div>
                    </div>
                    <h1 className="mt-6 text-[34px] leading-tight font-black xl:mt-5 xl:text-[length:calc(52*var(--u))]">הצטרפות <span className="text-spark">למעגל</span></h1>
                    <p className="mt-2 text-[15px] font-light text-slate-soft xl:mt-3 xl:text-xl">כמה פרטים, ואתם בפנים</p>
                </div>

                <div className="flex flex-col gap-2">
                    <label className={labelClass}><span className="flex gap-2"><span className="text-blaze">01</span>מייל</span>
                        <input type="email" placeholder="name@example.com" autoComplete="email" className={inputClass}
                            {...register("email", { required: "יש להזין מייל" })} />
                    </label>
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className={labelClass}><span className="flex gap-2"><span className="text-blaze">02</span>סיסמה</span>
                        <input type="password" placeholder="לפחות 8 תווים, אות באנגלית וספרה" autoComplete="new-password" className={inputClass}
                            {...register("password", { required: "יש להזין סיסמה", minLength:{value:8,message:"לפחות 8 תוים"} ,maxLength:{value:64,message:"עד 64 תוים"}
                             ,   pattern:{value:/^(?=.*[A-Za-z])(?=.*\d)/,message:"לפחות אות אחת באנגלית וספרה אחת"}
                            })} />
                    </label>
                    {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-2 xl:self-end">
                    <label className={labelClass}><span className="flex gap-2"><span className="text-blaze">03</span>שם תצוגה</span>
                        <input type="text" placeholder="איך יקראו לכם בקבוצה" className={inputClass}
                            {...register("displayName", { required: "יש להזין שם תצוגה" , minLength:{value:2,message:"לפחות 2 תוים"},maxLength:{value:30,message:"עד 30 תוים"}})} />
                    </label>
                    {errors.displayName && <p className={errorClass}>{errors.displayName.message}</p>}
                </div>

                <div className="flex flex-col gap-2 xl:gap-2.5">
                    <span className="flex gap-2 text-xs text-slate-soft xl:text-base"><span className="text-blaze">04</span>קבוצה</span>
                    <div className="flex gap-1 rounded-xl border border-rule bg-white/40 p-1">
                    <label className={modeClass}>
                        <input type="radio" className="sr-only" value={"join"} {...register("mode")} />לקבוצה קיימת
                    </label>
                    <label className={modeClass}>
                        <input type="radio" className="sr-only" value={"create"} {...register("mode")} />קבוצה חדשה
                    </label>
                    </div>
                    {mode === "join" ? <>
                        <label className={labelClass}><span className="sr-only">קוד הצטרפות לקבוצה</span>
                            <input type="text" placeholder="הקוד שקיבלתם ממנהל הקבוצה" className={`${inputClass} tracking-widest uppercase placeholder:tracking-normal placeholder:normal-case`}
                                {...register("joinCode", { required: "יש להזין קוד הצטרפות" })} />
                        </label>
                        {errors.joinCode && <p className={errorClass}>{errors.joinCode.message}</p>}
                    </>
                        :
                        <>
                            <label className={labelClass}><span className="sr-only">שם הקבוצה</span>
                                <input type="text" placeholder="שם הקבוצה, למשל: משפחת לוי" className={inputClass}
                                    {...register("groupName", { required: "יש לבחור שם לקבוצה" ,minLength:{value:2,message:"לפחות 2 תוים"},maxLength:{value:40,message:"עד 40 תוים"}})} />
                            </label>
                            {errors.groupName && <p className={errorClass}>{errors.groupName.message}</p>}
                            <p className="text-xs text-slate-muted xl:text-sm">אתם תהיו מנהלי הקבוצה, ותקבלו קוד הצטרפות לשתף עם חברים.</p>
                        </>}
                </div>

                <fieldset className="flex flex-col gap-2 xl:col-span-2">
                    <legend className="mb-2 flex gap-2 text-xs text-slate-soft xl:mb-2.5 xl:text-base"><span className="text-blaze">05</span>סמל</legend>
                    {metaQuery.isLoading && <p className="text-sm text-slate-muted">טוענים סמלים...</p>}
                    <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 xl:grid-cols-[repeat(15,calc(42*var(--u)))] xl:justify-between">
                    {avatars?.map((a) =>
                    (
                        <label key={a.key} title={a.key}
                            className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-rule bg-white/50 text-xl transition hover:scale-110 hover:border-slate-muted has-[:checked]:scale-110 has-[:checked]:border-blaze has-[:checked]:bg-blaze/10 has-[:checked]:shadow-[0_6px_16px_-6px_rgb(255_90_31/0.6)] xl:text-[length:calc(26*var(--u))]">{a.emoji}
                            <input type="radio" className="sr-only"
                                value={a.key}
                                {...register("avatar", { required: "יש לבחור סמל" })} />
                        </label>
                    ))}
                    </div>
                    {errors.avatar && <p className={errorClass}>{errors.avatar.message}</p>}
                </fieldset>

                {mutation.isError && <p className="rounded-lg border border-blaze/40 bg-blaze/10 px-4 py-2.5 text-sm text-[#9A2A12] xl:col-span-2 xl:px-5 xl:py-3 xl:text-lg">{getErrorMessage(mutation.error)}</p>}
                <button type="submit" disabled={mutation.isPending}
                    className="bg-spark mt-1 rounded-xl py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-10px_rgb(255_90_31/0.75)] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-60 xl:col-span-2 xl:rounded-2xl xl:py-5 xl:text-xl">
                    {mutation.isPending ? "נרשמים..." : "אישור והרשמה ⚡"}
                </button>
                <Link to="/login" className="text-sm text-slate-muted transition hover:text-slate xl:col-span-2 xl:text-lg">יש לך כבר חשבון? <span className="font-bold text-blaze">להתחברות</span></Link>
            </form>

            {/* the slogan (desktop only); on xl it sits two squares left of the form, level with its bottom, and crosses the rotor */}
            <div className="hidden leading-[0.95] lg:grid xl:absolute xl:right-[calc(var(--form-gap)+var(--reg-form-w)+var(--u)*96)] xl:bottom-[calc((100vh-var(--u)*1000)/2)]" aria-hidden="true">
                <span className="text-[96px] font-black tracking-[-1px] xl:text-[length:calc(150*var(--u))]">מעגל.</span>
                <span className="text-outline text-[96px] font-black tracking-[-1px] xl:text-[length:calc(150*var(--u))]">עשייה.</span>
                <span className="text-spark text-[96px] font-black tracking-[-1px] xl:text-[length:calc(150*var(--u))]">אנרגיה.</span>
                <small className="mt-6 text-[15px] leading-relaxed font-light text-slate-soft xl:mt-7 xl:text-[length:calc(21*var(--u))]">קבוצה אחת · דיווח אחד ביום · אנרגיה שמצטברת</small>
            </div>
        </div>
    </div>
}
export default RegisterPage
