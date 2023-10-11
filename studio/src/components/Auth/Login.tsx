import React from "react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {PrimaryButton, Stack} from "@fluentui/react";
import {Input} from "@fluentui/react-components";
import {AuthFormProps} from "@/components/Auth/AuthForm";

export const Login: React.FC<AuthFormProps> = ({email, password, setEmail, setPassword}) => {
    const {setUser} = useProjectContext();
    const handleLogin = async () => {
        try {
            const res = await userService.login({
                email,
                password,
            })
            if (!res.email) {
                console.warn('no user logged in')
                toast.error('Failed to login: no user logged in')
                return
            }
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

