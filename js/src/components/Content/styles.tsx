import {makeStyles, shorthands, tokens} from "@fluentui/react-components";

export const useStyles = makeStyles({
    main: {
        ...shorthands.gap("36px"),
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
    },

    card: {
        maxWidth: "100%",
        height: "fit-content",
    },

    section: {
        width: "fit-content",
    },

    title: {
        ...shorthands.margin(0, 0, "12px"),
    },

    horizontalCardImage: {
        width: "64px",
        height: "64px",
    },

    headerImage: {
        ...shorthands.borderRadius("4px"),
        maxWidth: "80px",
        maxHeight: "80px",
    },

    caption: {
        color: tokens.colorNeutralForeground3,
    },

    text: {
        ...shorthands.margin(0),
    },

    stackItem: {
        width: '100%',
    }
});
