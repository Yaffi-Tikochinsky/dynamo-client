import type { PublicUser } from "./user"

export interface Member extends PublicUser
{
    isManager: boolean
    challengesCount: number
}
export interface Group
{
    id: number
    name: string
    joinCode?: string
    members: Member[]
}
export type JoinCodeInput =  { mode: "custom", code: string }|{ mode: "random" } 

export interface RenameGroupInput
{
    name: string
}
export interface TransferManagerInput
{
    userId: number
}
