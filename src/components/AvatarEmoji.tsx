import { getMeta } from "../api/meta"
import { useQuery } from "@tanstack/react-query"
export function AvatarEmoji({avatar}:{avatar:string} ) {
    const avatarsQuery = useQuery({ queryKey: ["meta"], queryFn: getMeta })
    const avatars=avatarsQuery.data?.avatars
    const emoji = avatars?.find((k) => k.key === avatar)?.emoji
    return <>
        <span>
            {emoji}
        </span>
    </>
}