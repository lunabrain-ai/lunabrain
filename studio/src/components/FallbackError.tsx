import {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger
} from "@fluentui/react-components";

export const FallbackError: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({error, resetErrorBoundary}) => {
    const [open, setOpen] = useState(true);
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Unhandled Error</DialogTitle>
                    <DialogContent>
                        <h4>{error.message.toString()}</h4>
                        <pre>{error.stack}</pre>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={() => resetErrorBoundary()}>Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
