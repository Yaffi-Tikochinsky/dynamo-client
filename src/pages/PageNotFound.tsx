import { Link } from "react-router-dom"

function PageNotFound()
{
    return <div className="grid min-h-screen place-items-center px-4 text-center">
    <div className="paper-card corner-marks px-10 py-12">
    <img src="/logo-copper.svg" alt="" className="mx-auto size-20" />
    <div className="spec mt-5">ERR-404 · גיליון חסר</div>
    <div className="text-spark mt-1 text-7xl font-black">404</div>
    <h1 className="mt-2 text-3xl font-black">
        הדף לא נמצא
    </h1>
    <p className="mt-2 font-light text-slate-soft">נראה שיצאתם מהמעגל. בואו נחזור לתנועה.</p>
    <Link to="/challenges" className="btn btn-spark mt-6 px-6 py-3">חזרה לאתגרים</Link>
    {/* blueprint note: an open circuit has infinite resistance */}
    <div className="sci-note mx-auto mt-8 w-fit">
        <div dir="ltr" className="font-serif text-lg italic">R → ∞</div>
        <div className="mt-0.5 text-[11px] tracking-[1.5px] text-slate-muted">מעגל פתוח · בלי מעגל סגור אין זרם</div>
    </div>
    </div>
    </div>
}
export default PageNotFound
