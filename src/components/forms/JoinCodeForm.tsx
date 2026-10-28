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
        <button onClick={() => navigator.clipboard.writeText(group.joinCode ?? "")}>העתק ללוח</button>
        <button onClick={() => joinCodeMutation.mutate({ mode: "random" })}>קוד אקראי חדש</button>

        <form onSubmit={handleSubmit(onsubmit)}>
            <label><input type="text"{...register("code", {
                required: "לא הזנת קוד", minLength: { value: 6, "message": "לפחות 6 תוים" },
                maxLength: { value: 12, message: "עד 12 תוים" },
                pattern:{value: /^[A-Za-z0-9]+$/,message:"רק אותיות באנגלית וספרות"}
            })} />
                {errors.code && <p>{errors.code.message}</p>}
                {joinCodeMutation.isError && <p>{getErrorMessage(joinCodeMutation.error)}</p>}
            </label>
            <button type="submit" disabled={joinCodeMutation.isPending}>אישור </button>
        </form>
    </>
}