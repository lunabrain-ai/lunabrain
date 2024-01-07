import React, { useRef } from "react";
import { useProjectContext } from "@/react/ProjectProvider";

export const UserSettingsDialog: React.FC<{ open: boolean; setOpen: (open: boolean) => void }> = ({open, setOpen}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const closeDialog = () => {
        if (dialogRef.current) dialogRef.current.close();
        setOpen(false);
    };

    return (
        <dialog
            ref={dialogRef}
            className="p-5 rounded-md shadow-lg bg-white"
            open={open}
            onClose={() => setOpen(false)}
        >
            <h2 className="text-lg font-bold">Groups</h2>
            <div className="p-4">
                <SettingsManager />
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={closeDialog}
                    className="btn btn-secondary"
                >
                    Close
                </button>
            </div>
        </dialog>
    );
};

const SettingsManager = () => {
    const { userSettings, setUserSettings } = useProjectContext();

    return (
        <div className="space-y-4">
            <div>
                <label className="label">
                    <span className="label-text">Show Previews</span>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={userSettings.showPreviews}
                        onChange={(e) => {
                            setUserSettings({
                                ...userSettings,
                                showPreviews: e.target.checked,
                            });
                        }}
                    />
                </label>
            </div>
            <div>
                <label className="label">
                    <span className="label-text">Show QR Codes</span>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={userSettings.showQRCodes}
                        onChange={(e) => {
                            setUserSettings({
                                ...userSettings,
                                showQRCodes: e.target.checked,
                            });
                        }}
                    />
                </label>
            </div>
            <div>
                <label className="label">
                    <span className="label-text">Show Related Content</span>
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={userSettings.showRelatedContent}
                        onChange={(e) => {
                            setUserSettings({
                                ...userSettings,
                                showRelatedContent: e.target.checked,
                            });
                        }}
                    />
                </label>
            </div>
        </div>
    );
};
