import React from 'react';
import {AuthForm} from "@/auth/AuthForm";

export const AuthLandingPage: React.FC = () => {
    return (
        <div>
            <h3>If you don't know, you don't know</h3>
            <AuthForm allowRegister={true} />
        </div>
    );
};
