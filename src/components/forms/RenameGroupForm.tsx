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
    
        <form onSubmit={handleSubmit(onsubmit)}>
            <label>שינוי שם הקבוצה
                <input type="text"{...register("name", {
                    required: "לא הזנת שם", minLength: { value: 2, "message": "לפחות 2 תוים" },
                    maxLength: { value: 40, message: "עד 40 תוים" }
                })} />

                {errors.name && <p>{errors.name.message}</p>}
                {renameGroupMutation.isError && <p>{getErrorMessage(renameGroupMutation.error)}</p>}
            </label>
            <button type="submit" disabled={renameGroupMutation.isPending}>אישור </button>

        </form>
    </>
}