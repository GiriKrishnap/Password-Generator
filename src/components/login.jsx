import { auth } from '../firebase/config';
import { useState } from 'react'
import { toastError, toastSuccess } from '../assets/toast';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {

    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!email || !password) {

            toastError('fill the form first!');
            return
        }
        if (!login) {

            //signIn
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('user after login - ', user);
                    toastSuccess('Signup Successful');

                })
                .catch((error) => {
                    toastError(error.message);
                    console.log(`
                    error in signup,
                    error message - ${error.message},
                    error code - ${error.code}
                    `)
                })
        } else {
            await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('user after login - ', user);
                    toastSuccess('login successful');
                })
                .catch((error) => {
                    toastError('User not found')
                    console.log(`
                    error in login,
                    error message - ${error.message},
                    error code - ${error.code}
                    `)
                })
        }

    }

    return (
        <div className='bg-gray-900 shadow-xl rounded-lg rounded-b-none p-10 flex flex-col gap-3 justify-center
         place-items-center poppins select-none'>

            <p className="text-lg font-mono mt-5 cursor-pointer"
                onClick={() => setLogin(!login)}>
                {login ? " - l o g i n - " : ' - s i g n u p - '}
            </p>

            <p className="text-xs opacity-40 font-mono md:block hidden">
                {`c l i c k - a t -
             ${login ? "l o g i n" : 's i g n u p'}
             - f o r -
             ${login ? "s i g n u p :)" : 'l o g i n :)'}
              `}
            </p>

            <p className='block md:hidden text-xs opacity-40 font-mono'>
                click on above text
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
