import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/heading';
import { SubHeading } from '../components/SubHeading';
import { InputBox } from '../components/InputBox';
import { Button } from '../components/Button';
import { BottomWarning } from '../components/BottomWarning';
import { BACKEND_URL } from '../config';


function Signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  async function signup() {
    try {
      const firstName = firstNameRef.current?.value;
      const lastName = lastNameRef.current?.value;
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        firstName,
        lastName,
        email,
        password
      });

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      alert("You have signed up successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed!");
    }
  }

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label="Sign up" />
          <SubHeading label="Enter your information to create an account" />
          <InputBox placeholder="John" label="First Name" ref={firstNameRef} />
          <InputBox placeholder="Doe" label="Last Name" ref={lastNameRef} />
          <InputBox placeholder="johndoe@gmail.com" label="Email" ref={emailRef} />
          <InputBox placeholder="********" label="Password" type="password" ref={passwordRef} />
          <div className="pt-4">
            <Button onClick={signup} label="Sign up" />
          </div>
          <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
