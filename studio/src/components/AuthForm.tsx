import React, { useState } from 'react';
import {Pivot, PivotItem, TextField, PrimaryButton, Stack, Label} from '@fluentui/react';
import {Input, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import {projectService} from "@/lib/api";
import toast from "react-hot-toast";
import {useProjectContext} from "@/providers/ProjectProvider";

interface AuthFormProps {
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

const Login: React.FC<AuthFormProps> = ({email, password, setEmail, setPassword}) => {
    const {setUser} = useProjectContext();
    const handleLogin = async () => {
        try {
            const res = await projectService.login({
                email,
                password,
            })
            setUser(res)
            toast.success('Successful login!')
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to login: ' + e.message)
        }
    };
    return (
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { margin: '0 auto' } }}>
            <Input placeholder="email" value={email} onChange={(e, val) => setEmail(val.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e, val) => setPassword(val.value)} />
            <PrimaryButton text="Login" onClick={handleLogin} />
        </Stack>
    );
}

const Register: React.FC<AuthFormProps> = ({email, password, setEmail, setPassword}) => {
    const {setUser} = useProjectContext();
    const handleRegister = async () => {
        try {
            const res = await projectService.register({
                email,
                password,
            })
            setUser(res)
            toast.success('Successfully registered!')
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to register: ' + e.message)
        }
    };
    return (
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { margin: '0 auto' } }}>
            <Input placeholder="email" value={email} onChange={(e, val) => setEmail(val.value)} />
            <Input placeholder="password" type="password" value={password} onChange={(e, val) => setPassword(val.value)} />
            <PrimaryButton text="Register" onClick={handleRegister} />
        </Stack>
    );
}

export const AuthForm: React.FC = () => {
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
                <Tab value="register">Register</Tab>
            </TabList>
            <div>
                {selectedValue === 'login' && <Login {...authFormProps} />}
                {selectedValue === 'register' && <Register {...authFormProps} />}
            </div>
        </>
    );
};