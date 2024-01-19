import React, { useState } from 'react';
import {useAuth} from "@/auth/state";

export const AuthForm: React.FC<{ next?: string, allowRegister?: boolean }> = ({ next, allowRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();

    // TODO breadchris make tab component that wraps https://daisyui.com/components/tab/#radio-tab-bordered--tab-content
    const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('login');

    return (
        <>
            <div className="mt-4">
                <div className="items-center px-5 py-12 lg:px-20">
                    <div className="flex flex-col w-full max-w-md p-10 mx-auto">
                        <a className={"btn"} href={`/auth/google${next ? '?next='+next : ''}`}>login with google</a>
                        <div className={"divider"}>or</div>
                        <div className="tabs tabs-lifted">
                            <a className={`tab ${selectedTab === 'login' ? 'tab-active' : ''}`}
                               onClick={() => setSelectedTab('login')}>
                                login
                            </a>
                            {allowRegister && (
                                <a className={`tab ${selectedTab === 'register' ? 'tab-active' : ''}`}
                                   onClick={() => setSelectedTab('register')}>
                                    register
                                </a>
                            )}
                        </div>
                        <div className={"space-y-2 w-full mx-auto my-6"}>
                            <input
                                className="input input-bordered w-full"
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className="input input-bordered w-full"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (selectedTab === 'login') {
                                    void login(email, password);
                                } else {
                                    void register(email, password);
                                }
                            }}
                        >
                            {selectedTab === 'login' ? 'login' : 'register'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
