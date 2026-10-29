import type { Group } from "../types/group";
import { JoinCodeForm } from "./forms/JoinCodeForm";
import {RenameGroupForm} from "./forms/RenameGroupForm"
import { TransferManagerForm } from "./forms/TransferManagerForm";
export function ManagerPanel({ group }: { group: Group }) {


    return <>
        <section className="paper-card p-6 sm:p-7">
        <h2 className="flex items-baseline gap-2.5 text-xl font-black">ניהול הקבוצה <small className="spec text-[10px] font-medium">MANAGER</small></h2>
        <p className="mt-1 mb-5 text-sm font-light text-slate-soft">רק המנהל רואה את החלק הזה</p>
        <div>
            <h4 className="spec">קוד ההצטרפות לקבוצה</h4>
            {/* the join code as a serial plate */}
            <p className="mt-2 rounded-lg border border-slate bg-bone px-4 py-2.5 text-2xl font-black tracking-[6px] tabular-nums" dir="ltr">{group.joinCode}</p>
            <JoinCodeForm group={group}></JoinCodeForm>
        </div>
        <div className="mt-6 grid gap-5 border-t border-[#CFC8BC] pt-5">
        <RenameGroupForm group={group}></RenameGroupForm>
        <TransferManagerForm group={group}></TransferManagerForm>
        </div>
        </section>
    </>
}
