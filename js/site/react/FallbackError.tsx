import React, { useState, useRef, useEffect } from 'react';

export const FallbackError: React.FC<{ error: Error, resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
    const dialog = useRef<HTMLDialogElement>(null);

    const handleClose = () => {
        resetErrorBoundary();
    }

    return (
        <dialog ref={dialog} className="p-4 rounded-md shadow-lg bg-white">
            <div className="text-lg font-semibold">Unhandled Error</div>
            <div className="p-4">
                <h4 className="text-md font-medium">{error.message}</h4>
                <pre className="whitespace-pre-wrap text-sm">{error.stack}</pre>
            </div>
            <div className="flex justify-end mt-4">
                <button className="btn btn-secondary" onClick={handleClose}>Close</button>
            </div>
        </dialog>
    );
};
