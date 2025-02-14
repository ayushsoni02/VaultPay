import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { BottomWarning } from '../components/BottomWarning';
import Heading from '../components/heading';

export const Signin = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    async function signin() {
        try {
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;
            
            console.log("email and password",email,password);
            
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, { email, password });
    
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            alert("You have signed in successfully!");
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Sign-in failed!");
        }
    }

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label="Enter your credentials to access your account" />
                    <InputBox placeholder="johndoe@gmail.com" label="Email" ref={emailRef} />
                    <InputBox placeholder="********" label="Password" type="password" ref={passwordRef} />
                    <div className="pt-4">
                        <Button onClick={signin} label="Sign in" />
                    </div>
                    <BottomWarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
                </div>
            </div>
        </div>
    );
};
