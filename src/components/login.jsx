import { useState } from 'react'
import toast from 'react-hot-toast'


export default function Login() {

    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        if (!email || !password) {
            toast.error('fill the form first!', {
                style: {
                    borderRadius: '15px',
                    background: '#EE4266', //error - EE4266 , success - 344955
                    color: '#fff',
                },
            })
            return
        }
    }

    return (
        <div className='bg-gray-900 shadow-xl rounded-lg rounded-b-none p-10 flex flex-col gap-3 justify-center
         place-items-center poppins select-none'>

            <p className="text-lg font-mono mt-5 cursor-pointer"
                onClick={() => setLogin(!login)}>
                {login ? " - l o g i n - " : ' - s i g n u p - '}
            </p>

            <p className="text-xs opacity-40 font-mono">
                {`c l i c k - a t -
             ${login ? "l o g i n" : 's i g n u p'}
             - f o r -
             ${login ? "s i g n u p :)" : 'l o g i n :)'}
              `}
            </p>

            <input type="email" placeholder="email" className="p-2 pl-3 rounded-lg w-full"
                onChange={(e) => setEmail(e.target.value)} />

            <input type="password" placeholder="password" className="p-2 pl-3 rounded-lg w-full"
                onChange={(e) => setPassword(e.target.value)} />

            <button className="w-full bg-gray-500 hover:bg-slate-800 smooth"
                onClick={handleSubmit}>
                {login ? "login" : 'signup'}
            </button>
        </div>
    )
}
