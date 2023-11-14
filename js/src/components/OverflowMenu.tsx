import {
    Button,
    makeStyles,
    Menu,
    MenuItem, MenuList, MenuPopover, MenuTrigger,
    tokens,
    useIsOverflowItemVisible,
    useOverflowMenu
} from "@fluentui/react-components";
import React from "react";
import {
    MoreHorizontalRegular,
    MoreHorizontalFilled,
    bundleIcon,
} from "@fluentui/react-icons";
import { Group } from "@/rpc/user/user_pb";
const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

type OverflowMenuItemProps = {
    tab: Group;
    onClick: React.MouseEventHandler;
};

/**
 * A menu item for an overflow menu that only displays when the tab is not visible
 */
const OverflowMenuItem = (props: OverflowMenuItemProps) => {
    const { tab, onClick } = props;
    const isVisible = useIsOverflowItemVisible(tab.id);

    if (isVisible) {
        return null;
    }

    return (
        <MenuItem key={tab.id} onClick={onClick}>
            <div>{tab.name}</div>
        </MenuItem>
    );
};

//----- OverflowMenu -----//

const useOverflowMenuStyles = makeStyles({
    menu: {
        backgroundColor: tokens.colorNeutralBackground1,
    },
    menuButton: {
        alignSelf: "center",
    },
});

type OverflowMenuProps = {
    tabs: Group[];
    onTabSelect?: (tabId: string) => void;
};


export const OverflowMenu = (props: OverflowMenuProps) => {
    const { tabs, onTabSelect } = props;
    const { ref, isOverflowing, overflowCount } =
        useOverflowMenu<HTMLButtonElement>();

    const styles = useOverflowMenuStyles();

    const onItemClick = (tabId: string) => {
        onTabSelect?.(tabId);
    };

    if (!isOverflowing) {
        return null;
    }

    return (
        <Menu hasIcons>
            <MenuTrigger disableButtonEnhancement>
                <Button
                    appearance="transparent"
                    className={styles.menuButton}
                    ref={ref}
                    icon={<MoreHorizontal />}
                    aria-label={`${overflowCount} more tabs`}
                    role="tab"
                />
            </MenuTrigger>
            <MenuPopover>
                <MenuList className={styles.menu}>
                    {tabs.map((tab) => (
                        <OverflowMenuItem
                            key={tab.id}
                            tab={tab}
                            onClick={() => onItemClick(tab.id)}
                        />
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};