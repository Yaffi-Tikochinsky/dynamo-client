import { getErrorMessage } from "../../utils/errors"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Group } from "../../types/group";
import { changeJoinCode } from "../../api/group";
import { useForm } from "react-hook-form";

export function JoinCodeForm({ group }: { group: Group }) {
    const queryClient = useQueryClient()
    const { handleSubmit, register, formState: { errors } } = useForm<{ code: string }>()

    const joinCodeMutation = useMutation(
        {
            mutationFn: changeJoinCode,
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["group"] })

        }
    )
    const onsubmit = (data: { code: string }) => {
        joinCodeMutation.mutate({ mode: "custom", code: data.code })

    }
    return <>
        <div className="mt-2.5 flex flex-wrap gap-2">
        <button className="btn btn-line py-1.5 text-sm" onClick={() => navigator.clipboard.writeText(group.joinCode ?? "")}>העתק ללוח</button>
        <button className="btn btn-line py-1.5 text-sm" onClick={() => joinCodeMutation.mutate({ mode: "random" })}>קוד אקראי חדש</button>
        </div>

        <form onSubmit={handleSubmit(onsubmit)} className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <label className="flex flex-col gap-2 text-sm text-slate-soft"><span><i className="me-2 text-xs not-italic tracking-[1px] text-blaze">01</i>קוד משלכם</span><input type="text" className="field-line uppercase" placeholder="6–12 אותיות באנגלית וספרות"{...register("code", {
                required: "לא הזנת קוד", minLength: { value: 6, "message": "לפחות 6 תוים" },
                maxLength: { value: 12, message: "עד 12 תוים" },
                pattern:{value: /^[A-Za-z0-9]+$/,message:"רק אותיות באנגלית וספרות"}
            })} />
                {errors.code && <p className="text-sm text-[#B4321A]">{errors.code.message}</p>}
                {joinCodeMutation.isError && <p className="alert">{getErrorMessage(joinCodeMutation.error)}</p>}
            </label>
            <button type="submit" className="btn btn-ink" disabled={joinCodeMutation.isPending}>אישור </button>
        </form>
    </>
}
