import { Button } from "../ui/button";
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { LuBrain } from "react-icons/lu";
import axios from "axios"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_SIGNUP_ENDPOINT

const SignupForm = () => {
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
          navigate("/signup")
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
                    setError('')
                    setUsername('')
                    setPassword('');
                    toast("User Created");
                    navigate("/signin")
                    // redirect
                }
            })
            .catch(function (error) {
                if (error.response.data.message) {
                    setError(error.response.data.message)
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
                    <Button className="absolute top-7 right-7 bg-black hover:bg-[#19181A]" onClick={() => navigate("/signin")}>Login</Button>
                    <div className="text-center">
                        <p className="text-xl font-semibold">Create An Account</p>
                        <p className="text-sm text-[#686870]">Enter your username below to create your account</p>
                        <Input onChange={(e) => setUsername(e.target.value)} className="mt-10 w-[400px] border-[#686870] focus:border-white" placeholder="name" />
                        <Input onChange={(e) => setPassword(e.target.value)} className="mt-2 w-[400px] border-[#686870] focus:border-white" placeholder="password" type="password" />
                        <Button disabled={isLoading} onClick={handleSubmit} className="mt-2 w-[400px] bg-white text-black hover:bg-slate-100">Sign Up</Button>
                    </div>
                    <div className="mt-4">
                    <p className="text-center text-[#ff4400]">{error}</p>
                    </div>
                </div>
                
            </div>
        </>

    );
};

export default SignupForm;
