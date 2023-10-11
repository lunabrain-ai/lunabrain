import React, { useState } from 'react';
import {Input, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import {Login} from "@/components/Auth/Login";

export interface AuthFormProps {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export const AuthForm: React.FC<{ allowRegister?: boolean }> = ({ allowRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [selectedValue, setSelectedValue] = React.useState<TabValue>('login');

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const authFormProps = {
        email,
        password,
        setEmail,
        setPassword,
    }

    return (
        <>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="login">Login</Tab>
                {allowRegister && <Tab value="register">Register</Tab>}
            </TabList>
            <div>
                {selectedValue === 'login' && <Login {...authFormProps} />}
                {allowRegister && selectedValue === 'register' && <Login {...authFormProps} />}
            </div>
        </>
    );
};