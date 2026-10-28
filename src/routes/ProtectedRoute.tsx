import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute()
{
    const {user,isLoading}=useAuth()
    if(isLoading)
    return<>
    טוען....
    </>
    if(!user)
        return <Navigate to="/login" replace/>
    return <Outlet></Outlet>
}
export default ProtectedRoute