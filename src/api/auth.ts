import { api } from "./client"
import type { AuthResponse, User } from "../types/user"
import type { LoginInput } from "../types/user"
import type { RegisterInput } from "../types/user"


export const login = async (input: LoginInput) => {
    const res = await api.post<AuthResponse>("/auth/login", input)
    return res.data
}
export const register = async (input: RegisterInput) => {
    const res = await api.post<AuthResponse>("/auth/register", input)
    return res.data
}
export const getMe = async () => {
    const res = await api.get<User>("/auth/me")
    return res.data
}