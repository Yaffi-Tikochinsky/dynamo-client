import  { createContext, useEffect, type ReactNode } from "react"
import type { User } from "../types/user"
import type { AuthResponse } from "../types/user"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { TOKEN_KEY } from "../api/client"
import {getMe} from   "../api/auth"
import {useContext} from "react"
interface AuthContextValue {
    user: User | null
    isLoading: boolean
    saveLogin: (res: AuthResponse) => void
    logout: () => void
}
const AuthContext = createContext<AuthContextValue | null>(null)
function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(()=>
    localStorage.getItem(TOKEN_KEY)===null?false:true)
    const queryClient = useQueryClient()
    useEffect(()=>
    {
        const token=localStorage.getItem(TOKEN_KEY)
        if(!token)return
        getMe().then((user)=>setUser(user))
        .catch(()=>localStorage.removeItem(TOKEN_KEY))
        .finally(()=>setIsLoading(false))
        
    
    },[])   
    const saveLogin=(res:AuthResponse)=>
    {
            localStorage.setItem(TOKEN_KEY,res.token)
            setUser(res.user)
    }
    const logout=()=>
    {
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
        queryClient.clear()
    }
    

    return <>
    <AuthContext.Provider value={{user,isLoading,saveLogin,logout}}>{children}</AuthContext.Provider>
    </>
}
export function useAuth()                        
{
    const context = useContext(AuthContext)       
    if (!context)                                 
        throw new Error("“useAuth must be used inside AuthProvider”")
    return context                                
}
export default AuthProvider