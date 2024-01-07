import React, { useState } from 'react';
import { Login } from "@/auth/Login";
import { Register } from "@/auth/Register";

export interface AuthFormProps {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export const AuthForm: React.FC<{ allowRegister?: boolean }> = ({ allowRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('login');

    const authFormProps = {
        email,
        password,
        setEmail,
        setPassword,
    };

    return (
        <>
            <ul className="tabs tabs-boxed">
                <li className={selectedTab === 'login' ? 'tab-active' : ''}>
                    <a onClick={() => setSelectedTab('login')}>Login</a>
                </li>
                {allowRegister && (
                    <li className={selectedTab === 'register' ? 'tab-active' : ''}>
                        <a onClick={() => setSelectedTab('register')}>Register</a>
                    </li>
                )}
            </ul>
            <div className="mt-4">
                {selectedTab === 'login' && <Login {...authFormProps} />}
                {allowRegister && selectedTab === 'register' && <Register {...authFormProps} />}
            </div>
        </>
    );
};
