import { Link } from "react-router-dom"

function PageNotFound()
{
    return <div className="grid min-h-screen place-items-center px-4 text-center">
    <div>
    <img src="/logo.svg" alt="" className="mx-auto size-24 opacity-90" />
    <div className="mt-4 text-7xl font-extrabold text-energy">404</div>
    <h1 className="mt-2 text-3xl font-bold">
        הדף לא נמצא
    </h1>
    <p className="mt-2 text-fg-muted">נראה שיצאתם מהמעגל. בואו נחזור לתנועה.</p>
    <Link to="/challenges" className="bg-energy mt-6 inline-block rounded-full px-6 py-3 font-medium text-ink transition hover:brightness-110">חזרה לאתגרים</Link>
    </div>
    </div>
}
export default PageNotFound
