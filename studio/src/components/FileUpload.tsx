import React, { ChangeEvent, useState } from 'react';

export const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        setFileName(file ? file.name : null);
    };

    const handleFileUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Now, you can use `formData` to upload the file via HTTP (using fetch or axios for instance)
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {fileName && <div>Selected File: {fileName}</div>}
            <button onClick={handleFileUpload} disabled={!selectedFile}>Upload</button>
        </div>
    );
};