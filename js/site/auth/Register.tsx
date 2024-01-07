import React from "react";
import { useProjectContext } from "@/react/ProjectProvider";
import { userService } from "@/service";
import toast from "react-hot-toast";
import { AuthFormProps } from "@/auth/AuthForm";

export const Register: React.FC<AuthFormProps> = ({ email, password, setEmail, setPassword }) => {
    const { setUser } = useProjectContext();

    const handleRegister = async () => {
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

    return (
        <div className=" items-center px-5 py-12 lg:px-20">
            <div className="flex flex-col w-full max-w-md p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
                <input
                    className="input input-bordered"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="input input-bordered"
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleRegister}
                >
                    Register
                </button>
            </div>
        </div>
    );
};
