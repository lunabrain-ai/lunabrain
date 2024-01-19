import React from 'react';

export interface URLEditorProps {
    url: string;
    onChange: (url: string) => void;
}

export const URLEditor: React.FC<URLEditorProps> = (props) => {
    return (
        <div className="form-group">
            <label htmlFor="url">URL</label>
            <input type="text" className="form-control" id="url" placeholder="URL" value={props.url} onChange={(e) => props.onChange(e.target.value)} />
        </div>
    );
}