import {useProjectContext} from "@/providers/ProjectProvider";
import React, {useState} from "react";
import {baseURL, userService} from "@/service";
import toast from "react-hot-toast";
import {Stack} from "@fluentui/react";
import {
    Button, Caption1, Card, CardHeader,
    Dialog, DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger, Divider,
    Input, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger, Switch
} from "@fluentui/react-components";
import {MoreHorizontal20Regular, PeopleCommunity24Regular} from "@fluentui/react-icons";

export const UserSettingsDialog: React.FC<{ open: boolean, setOpen: (open: boolean) => void}> = ({ open, setOpen }) => {
    return (
        <Dialog open={open} onOpenChange={(event, data) => {
            setOpen(data.open);
        }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Groups</DialogTitle>
                    <DialogContent>
                        <SettingsManager />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}

const SettingsManager = () => {
    const {userSettings, setUserSettings} = useProjectContext();
    return (
        <Stack tokens={{childrenGap: 10}}>
            <Stack.Item>
                <Switch onChange={(event, data) => {
                    setUserSettings({
                        ...userSettings,
                        showPreviews: data.checked,
                    })
                }} checked={userSettings.showPreviews} label="Show Previews" />
                <Switch onChange={(event, data) => {
                    setUserSettings({
                        ...userSettings,
                        showQRCodes: data.checked,
                    })
                }} checked={userSettings.showQRCodes} label="Show QR Codes" />
            </Stack.Item>
        </Stack>
    );
}

