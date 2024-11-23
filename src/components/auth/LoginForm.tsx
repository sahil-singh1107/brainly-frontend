import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { LuBrain } from "react-icons/lu";
import axios from "axios"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const url = import.meta.env.VITE_SIGNIN_ENDPOINT

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');

    useEffect(() => {
        let item = localStorage.getItem("token")
        if (item) {
            navigate("/")
        }
        else {
          navigate("/signin")
        }
      }, [])

    function handleSubmit() {
        setIsLoading(true);
        axios.post(url, {
            username,
            password
        })
            .then(function (response) {
                if (response) {
                    // @ts-ignore
                    localStorage.setItem("token", response.data)
                    setError('')
                    setUsername('')
                    setPassword('');
                    toast("Log In Successful");
                    navigate("/")
                }
            })
            .catch(function (error) {
                if (error.response.data.message) {
                    if (error.response.data.message === "String must contain at least 3 character(s)") {
                        setError("Username must contain at least 3 character(s)")
                    }
                    else if (error.response.data.message === "String must contain at least 8 character(s)") {
                        setError("Password must contain at least 8 character(s)")
                    }
                    else setError(error.response.data.message)
                }
            });
        setIsLoading(false)
    }
    return (
        <>
            <Toaster className="text-green-600" />
            <div className="bg-black flex text-white">
                <div className="bg-[#19181A] h-screen w-1/2 relative">
                    <div className="absolute flex items-center space-x-2 top-7 left-7">
                        <LuBrain className="text-white" />
                        <p className="text-white">Second Brain</p>
                    </div>
                </div>
                <div className="relative h-screen w-1/2 flex flex-col justify-center items-center">
                    <Button className="absolute top-7 right-7 bg-black hover:bg-[#19181A]" onClick={() => navigate("/signup")}>Signup</Button>
                    <div className="text-center">
                        <p className="text-xl font-semibold">Login To Existing Account</p>
                        <p className="text-sm text-[#686870]">Enter your username below to login to your account</p>
                        <Input onChange={(e) => setUsername(e.target.value)} className="mt-10 w-[400px] border-[#686870] focus:border-white hover:border-blue-500 hover:shadow-[0_0_10px_2px_rgba(59,130,246,1)] transition-all duration-300 ease-in-out p-4" placeholder="username" />
                        <Input onChange={(e) => setPassword(e.target.value)} className="mt-2 w-[400px] border-[#686870] focus:border-white hover:border-blue-500 hover:shadow-[0_0_10px_2px_rgba(59,130,246,1)] transition-all duration-300 ease-in-out p-4" placeholder="password" type="password" />
                        <Button disabled={isLoading || (!username && !password)} onClick={handleSubmit} className="mt-2 w-[400px] bg-white text-black hover:bg-slate-100">Log In</Button>
                    </div>
                    <div className="mt-4">
                    <p className="text-center text-[#ff4400]">{error}</p>
                    </div>
                </div>
                
            </div>
        </>

    );
};

export default LoginForm;
