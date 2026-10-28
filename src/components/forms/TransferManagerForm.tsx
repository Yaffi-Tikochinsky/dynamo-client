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

        <form onSubmit={handleSubmit(onsubmit)}>
            <label>העברת ניהול
                <select {...register("userId", {
                    required: "לא בחרת חבר"
                })}>
                    {
                        group.members.map((m) =>
                            !m.isManager && <option key={m.id} value={m.id}>{m.displayName}</option>)
                    }
                </select>
                {errors.userId && <p>{errors.userId.message}</p>}
                {TransferMutation.isError&&<p>{getErrorMessage(TransferMutation.error)}</p>}
            </label>
            <button type="submit" disabled={TransferMutation.isPending}>אישור </button>
        </form>
    </>
}