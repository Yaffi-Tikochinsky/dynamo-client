import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../context/AuthContext"
import { getGroup } from "../api/group"
import { getErrorMessage } from "../utils/errors"
import { AvatarEmoji } from "../components/AvatarEmoji"
import { ManagerPanel } from "../components/ManagerPanel"
function GroupPage() {

    const { user } = useAuth()
    const groupQuery = useQuery({ queryKey: ["group"], queryFn: getGroup })

    if (groupQuery.isLoading)
        return <p>טוען נתונים...</p>
    if (groupQuery.isError)
        return <p>{getErrorMessage(groupQuery.error)}
        </p>
    if (!groupQuery.data)
        return <p>לא נמצאו נתונים</p>
    const group = groupQuery.data
    return <>
        <h1>{group.name}</h1>

        <ul>
            {group.members.map((m) => (<li key={m.id}>
                <AvatarEmoji avatar={m.avatar}></AvatarEmoji>
                <p>{m.displayName}</p>
                {m.isManager && <span>מנהל</span>}
                <p>{m.challengesCount} אתגרים</p>
                

            </li>)
            )}

        </ul>
        {user?.role === "MANAGER" && <ManagerPanel group={group} />}
    </>
}
export default GroupPage