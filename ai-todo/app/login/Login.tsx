'use client'
import { useState } from "react";
import axios from 'axios';
import { IoEye, IoEyeOff } from "react-icons/io5";

function Login(){

const [email,setEmail] =useState('');
const [password,setPassword] = useState('');
const [visible,setVisible] =useState(false);
const [a,seta] =useState(false)
 const [alert,setalert] = useState('')
const handleClick =()=>{
    setVisible(!visible);
}
async function handleSubmit(event:any){
    event.preventDefault();
    const data = {
        email,
        password
    }
    const response = await axios.post('http://localhost:8000/login',data)
    console.log(response);
    seta(true)
    console.log('successfull')
    
    const token = response.data.user;
    localStorage.setItem('token',token);
    const message =response.data.message;
    setalert(message)
}
return(<>
 {a && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px',
          backgroundColor: 'green',
          color: 'white',
          borderRadius: '5px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          animation: 'slideIn 0.5s ease-out'
        }}>
          {alert}
        </div>
      )}
<div className="flex items-center justify-center min-h-screen p-4 bg-black">
 <div className="w-full max-w-sm  rounded-lg shadow-lg p-6 md:p-8 bg-black">

<h2 className="text-3xl font-bold text-center text-white mb-6">
    Swagat Hai! 👋
</h2>

<form onSubmit={handleSubmit} className="bg-white/10  backdrop-blur-lg rounded-md p-8">
    <div className="mb-4">
        <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
            Email Address
        </label>
        <input type="email" id="email" className="shadow appearance-none border rounded-md w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your Email ID" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
    </div>

    <div className="mb-6">
        <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
            Password
        </label>
        <div className="relative">
        <input type={visible ? "text" : "password"} id="password" className="shadow appearance-none border rounded-md w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" placeholder="Password daalo" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
        <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={handleClick}>
            {visible ? <IoEye /> : <IoEyeOff />}
        </span>
        </div>
        <a href="#" className="inline-block align-baseline font-semibold text-sm text-white hover:text-blue-800">
            Password bhool gaye?
        </a>
    </div>

    <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full transition duration-200">
            Chalo Login Karein!
        </button>
    </div>
</form>
    <p className="text-center text-white text-sm mt-6">
        Naya user?
        <a href="/Signup" className="text-blue-500 hover:text-blue-800 font-semibold">
            Register here
        </a>
    </p>

</div>
</div>
</>)
}
export default Login;