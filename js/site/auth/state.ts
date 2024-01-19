import {atom, useAtom} from "jotai/index";
import {User} from "@/rpc/user/user_pb";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {useEffect} from "react";

const userAtom = atom<User|undefined>(undefined);
userAtom.debugLabel = 'userAtom';

export const useAuth = () => {
    const [user, setUser] = useAtom(userAtom);

    const logout = async () => {
        try {
            // TODO breadchris save content to group
            const resp = await userService.logout({});
            setUser(undefined);
            console.log(resp);
            toast.success('Logged out');
        } catch (e) {
            toast.error('Failed to logout');
            console.error('failed to logout', e)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            // TODO breadchris save content to group
            const resp = await userService.login({email, password});
            setUser(resp);
            toast.success('Logged in');
        } catch (e) {
            toast.error('Failed to login');
            console.error('failed to login', e)
        }
    }

    const register = async (email: string, password: string) => {
        try {
            const res = await userService.register({
                email,
                password,
            });
            setUser(res);
            toast.success('Successfully registered!');
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to register: ' + e.message);
        }
    };

    const tryLogin = async () => {
        try {
            const res = await userService.login({});
            // TODO breadchris should login throw if not logged in?
            if (res.email !== '') {
                setUser(res);
            }
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to login: ' + e.message);
        }
    }
    return {user, register, tryLogin, login, logout};
}
