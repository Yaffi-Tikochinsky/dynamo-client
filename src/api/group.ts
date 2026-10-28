import { api } from "./client"
import type { Group, RenameGroupInput, JoinCodeInput, TransferManagerInput} from "../types/group"
export const getGroup = async () => {
    const res = await api.get<Group>("/group")
    return res.data
}
export const renameGroup = async (input: RenameGroupInput) => {
    const res = await api.patch<{id:number,name:string}>("/group",input)
    return res.data

}
export const changeJoinCode = async (input: JoinCodeInput) => {
    const res = await api.post<{joinCode:string}>("/group/join-code",input) 
    return res.data

}
export const transferManager = async (input: TransferManagerInput) => {
    const res = await api.post<{managerId:number}>("/group/transfer-manager",input) 
    return res.data

}