import * as React from 'react';
import { IconButton, IIconProps } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import {Button} from "@fluentui/react-components";
import {FolderOpen24Regular} from "@fluentui/react-icons";

interface FileSelectProps {
    onFileUpload: (file: File) => void;
}

const folderIcon: IIconProps = { iconName: 'FolderOpen' };

export const FileSelect: React.FC<FileSelectProps> = ({ onFileUpload }) => {
    const fileInputId = useId('fileInput');
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile) {
            onFileUpload(selectedFile);
        }
        // Reset the file input to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label htmlFor={fileInputId}>
                <Button
                    title="Upload File"
                    aria-label="Upload File"
                    icon={<FolderOpen24Regular/>}
                    style={{ fontSize: 24 }}
                    role="button"
                    onClick={e => {
                        fileInputRef.current?.click()
                    }}
                />
            </label>
            <input
                ref={fileInputRef}
                type="file"
                id={fileInputId}
                accept="*/*"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
        </div>
    );
};
