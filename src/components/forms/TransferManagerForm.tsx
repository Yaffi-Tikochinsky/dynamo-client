import { getErrorMessage } from "../../utils/errors"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Group, TransferManagerInput } from "../../types/group";
import { transferManager } from "../../api/group";
import { useForm } from "react-hook-form";

export function TransferManagerForm({ group }: { group: Group }) {
    const queryClient = useQueryClient()
    const { handleSubmit, register, formState: { errors } } = useForm<TransferManagerInput>()
    const TransferMutation = useMutation(
        {
            mutationFn: transferManager,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["group"] })
                window.location.reload()
            }

        }
    )
    const onsubmit = (data: TransferManagerInput) => {
        if (confirm("להעביר את הניהול? לא תוכל לבטל את הפעולה"))
            TransferMutation.mutate({ userId: Number(data.userId) })
    }

    return <>

        <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <label className="flex flex-col gap-2 text-sm text-slate-soft"><span><i className="me-2 text-xs not-italic tracking-[1px] text-blaze">03</i>העברת ניהול</span>
                <select className="field-line cursor-pointer [&_option]:bg-paper" {...register("userId", {
                    required: "לא בחרת חבר"
                })}>
                    {
                        group.members.map((m) =>
                            !m.isManager && <option key={m.id} value={m.id}>{m.displayName}</option>)
                    }
                </select>
                {errors.userId && <p className="text-sm text-[#B4321A]">{errors.userId.message}</p>}
                {TransferMutation.isError&&<p className="alert">{getErrorMessage(TransferMutation.error)}</p>}
            </label>
            <button type="submit" className="btn btn-ink" disabled={TransferMutation.isPending}>אישור </button>
        </form>
    </>
}
