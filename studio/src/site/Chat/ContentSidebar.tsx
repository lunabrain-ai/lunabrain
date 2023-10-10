import React from "react";
import {Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle} from "@fluentui/react-components/unstable";
import {Button} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import {useProjectContext} from "@/providers/ProjectProvider";
import { Tree, TreeItem, TreeItemLayout } from "@fluentui/react-components";

export const TagTree = () => {
    return (
        <Tree aria-label="Default">
            <TreeItem itemType="branch">
                <TreeItemLayout>level 1, item 1</TreeItemLayout>
                <Tree>
                    <TreeItem itemType="leaf">
                        <TreeItemLayout>level 2, item 1</TreeItemLayout>
                    </TreeItem>
                    <TreeItem itemType="leaf">
                        <TreeItemLayout>level 2, item 2</TreeItemLayout>
                    </TreeItem>
                    <TreeItem itemType="leaf">
                        <TreeItemLayout>level 2, item 3</TreeItemLayout>
                    </TreeItem>
                </Tree>
            </TreeItem>
            <TreeItem itemType="branch">
                <TreeItemLayout>level 1, item 2</TreeItemLayout>
                <Tree>
                    <TreeItem itemType="branch">
                        <TreeItemLayout>level 2, item 1</TreeItemLayout>
                        <Tree>
                            <TreeItem itemType="leaf">
                                <TreeItemLayout>level 3, item 1</TreeItemLayout>
                            </TreeItem>
                        </Tree>
                    </TreeItem>
                </Tree>
            </TreeItem>
            <TreeItem itemType="leaf">
                <TreeItemLayout>level 1, item 3</TreeItemLayout>
            </TreeItem>
        </Tree>
    );
};

export const ContentSidebar = () => {
    const {sidebarIsOpen, setSidebarIsOpen} = useProjectContext();

    return (
        <Drawer
            type={"overlay"}
            separator
            open={sidebarIsOpen}
            onOpenChange={(_, { open }) => setSidebarIsOpen(open)}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={() => setSidebarIsOpen(false)}
                        />
                    }
                >
                    Tags
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <TagTree />
            </DrawerBody>
        </Drawer>
    );
}

