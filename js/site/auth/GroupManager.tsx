import {useProjectContext} from "@/react/ProjectProvider";
import React, {useState} from "react";
import {baseURL, userService} from "@/service";
import toast from "react-hot-toast";
import {UserGroupIcon} from "@heroicons/react/24/outline";

export const GroupDialog = () => {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };
    return (
        <>
            <button className="btn" onClick={openModal}>
                <UserGroupIcon  className="h-6 w-6" />
            </button>
            <dialog className="modal" ref={dialogRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Groups</h3>
                    <GroupManager />
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

const GroupMenu: React.FC<{id: string, setInvite: (invite: string) => void}> = ({ id, setInvite }) => {
    const {loadGroups} = useProjectContext();
    const deleteGroup = async () => {
        try {
            const res = await userService.deleteGroup({id})
            toast.success('Deleted group');
            loadGroups();
        } catch (e: any) {
            toast.error('Failed to delete group');
            console.error(e);
        }
    }
    const createInvite = async () => {
        try {
            const res = await userService.createGroupInvite({
                groupId: id,
            })
            toast.success('Created invite');
            setInvite(`${baseURL}/app/group/join/${res.secret}`);
        } catch (e: any) {
            toast.error('Failed to create invite');
            console.error(e);
        }
    }
    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn m-1">
                TODO
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><button className={"btn"} onClick={createInvite}>Invite</button></li>
                <li><button className={"btn"} onClick={deleteGroup}>Delete</button></li>
            </ul>
        </div>
    )
}

const GroupManager = () => {
    const {groups, loadGroups} = useProjectContext();
    const [name, setName] = useState<string>('');
    const [invite, setInvite] = useState<string|undefined>(undefined);
    const addGroup = async () => {
        try {
            const res = await userService.createGroup({name})
            toast.success('Created group');
            loadGroups();
        } catch (e: any) {
            toast.error('Failed to create group');
            console.error(e);
        }
    }
    return (
        <div>
            <div className="flex gap-4 mb-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered" />
                <button className="btn" onClick={addGroup}>Add Group</button>
            </div>
            {invite && <a href={invite} className="link">{invite}</a>}
            <div className="divider"></div>
            <div className="grid grid-cols-1 gap-4">
                {groups.map((g) => (
                    <div key={g.id} className="card card-bordered">
                        <div className="card-body">
                            <h2 className="card-title">{g.name}</h2>
                            <GroupMenu id={g.id} setInvite={setInvite} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

