import React from 'react';

interface IFrameSandboxProps {
    url: string;
}

export const IFrameSandbox: React.FC<IFrameSandboxProps> = ({ url }) => {
    return (
        <iframe
            src={url}
            style={{ width: '100%', height: '500px' }} // Adjust as needed
            sandbox="allow-scripts allow-same-origin"  // You can adjust sandbox attributes as needed
            title="Sandboxed Iframe"
        />
    );
}
