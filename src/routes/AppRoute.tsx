import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ChallengesPage from "../pages/ChallengesPage"
import NewChallengePage from "../pages/NewChallengePage"
import ChallengePage from "../pages/ChallengePage"
import EditChallengePage from "../pages/EditChallengePage"
import GroupPage from "../pages/GroupPage"
import PageNotFound from "../pages/PageNotFound"
import Layout from "./Layout"

export function AppRoutes() {



    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/challenges" replace />} />
                    <Route path="/challenges" element={<ChallengesPage />} />
                    <Route path="/challenges/new" element={<NewChallengePage />} />
                    <Route path="/challenges/:id" element={<ChallengePage />} />                   
                     <Route path="/challenges/:id/edit" element={<EditChallengePage />} />
                    <Route path="/group" element={<GroupPage />} />
                </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )

}
