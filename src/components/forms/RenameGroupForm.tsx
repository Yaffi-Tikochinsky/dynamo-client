import { getErrorMessage } from "../../utils/errors"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Group } from "../../types/group";
import { renameGroup } from "../../api/group";
import { useForm } from "react-hook-form";

export function RenameGroupForm({ group }: { group: Group }) {
    const queryClient = useQueryClient()
    const { handleSubmit, register, formState: { errors } } = useForm<{ name: string }>({ defaultValues: { name: group.name } })

    const renameGroupMutation = useMutation(
        {
            mutationFn: renameGroup,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["group"] })
                window.location.reload()

            }
        }
    )
    const onsubmit = (data: { name: string }) => {

        renameGroupMutation.mutate({ name: data.name })
    }
    return <>

        <form onSubmit={handleSubmit(onsubmit)} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <label className="flex flex-col gap-2 text-sm text-slate-soft"><span><i className="me-2 text-xs not-italic tracking-[1px] text-blaze">02</i>שינוי שם הקבוצה</span>
                <input type="text" className="field-line"{...register("name", {
                    required: "לא הזנת שם", minLength: { value: 2, "message": "לפחות 2 תוים" },
                    maxLength: { value: 40, message: "עד 40 תוים" }
                })} />

                {errors.name && <p className="text-sm text-[#B4321A]">{errors.name.message}</p>}
                {renameGroupMutation.isError && <p className="alert">{getErrorMessage(renameGroupMutation.error)}</p>}
            </label>
            <button type="submit" className="btn btn-ink" disabled={renameGroupMutation.isPending}>אישור </button>

        </form>
    </>
}
