import React from "react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {PrimaryButton, Stack} from "@fluentui/react";
import {Input} from "@fluentui/react-components";
import {AuthFormProps} from "@/components/Auth/AuthForm";

export const Register: React.FC<AuthFormProps> = ({email, password, setEmail, setPassword}) => {
    const {setUser} = useProjectContext();
    const handleRegister = async () => {
        try {
            const res = await userService.register({
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
