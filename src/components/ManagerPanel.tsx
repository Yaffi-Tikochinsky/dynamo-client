import type { Group } from "../types/group";
import { JoinCodeForm } from "./forms/JoinCodeForm";
import {RenameGroupForm} from "./forms/RenameGroupForm"
import { TransferManagerForm } from "./forms/TransferManagerForm";
export function ManagerPanel({ group }: { group: Group }) {


    return <>
        <div>
            <h4>קוד ההצטרפות לקבוצה:</h4>
            <p>{group.joinCode}</p>
            <JoinCodeForm group={group}></JoinCodeForm>
        </div>
        <RenameGroupForm group={group}></RenameGroupForm>
        <TransferManagerForm group={group}></TransferManagerForm>
    </>
}