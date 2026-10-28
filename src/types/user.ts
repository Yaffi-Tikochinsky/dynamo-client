export type Role = "MEMBER" | "MANAGER"

export interface PublicUser
{
    id: number
    displayName: string
    avatar: string
    color: string
}
export interface User extends PublicUser
{
    email: string
    role: Role
    group: { id: number, name: string }
}
export interface AuthResponse
{
    token: string
    user: User
}
export interface LoginInput
{
    email: string
    password: string
}
export interface RegisterInput
{
    email: string
    password: string
    displayName: string
    avatar: string
    joinCode?: string
    groupName?: string
}
