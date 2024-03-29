import { Box, Modal, Tooltip } from '@mui/material'
import { PrettoSlider } from '../assets/slider'
import { useEffect, useState } from 'react'
import { passwordStrength } from 'check-password-strength'
import { lowerCaseList, upperCaseList, numbersList, symbolsList, preference } from '../assets/passwordUtils';
import LoginComponent from '../components/login';
import { style } from '../assets/modelStyle'
import { toastError, toastSuccess } from '../assets/toast'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';


function Home() {

    const [Password, setPassword] = useState('');
    const [length, setLength] = useState(8);
    const [complexity, setComplexity] = useState('');
    const [upperCase, setUpperCase] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [symbols, setSymbols] = useState(false);

    const [loginState, setLoginState] = useState(false)
    const [loginModal, setLoginDiv] = useState(false);
    const [storeModal, setStoreModal] = useState(false);
    const [email, setEmail] = useState('');
    const [passwordsList, setPasswordsList] = useState([]);


    const handleCopy = (passwordToCopy) => {

        if (passwordToCopy.length > 0) {
            navigator.clipboard.writeText(passwordToCopy);
            toastSuccess('copied to clipboard');
        } else if (Password.length > 0) {
            navigator.clipboard.writeText(Password);
            toastSuccess('copied to clipboard');
        } else {
            toastError('generate password first!');
        }
    }

    const handleGenerate = () => {

        if (!upperCase && !lowerCase && !numbers && !symbols) {
            toastError('please select your preference!');
            setComplexity('')
            setPassword('')
            return
        }

        let characterList = '';

        characterList += lowerCase ? lowerCaseList : '';
        characterList += upperCase ? upperCaseList : '';
        characterList += numbers ? numbersList : '';
        characterList += symbols ? symbolsList : '';

        let tempPassword = '';
        let characterListLength = characterList.length;

        for (let i = 0; i < length; i++) {
            const characterIndex = Math.round(Math.random() * characterListLength);
            tempPassword += characterList.charAt(characterIndex);
        }
        setPassword(tempPassword);
        setComplexity(passwordStrength(tempPassword, preference).value);

    }


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email)
                getPasswordsList(user.email)
                console.log('user email - ', user.email);
                setLoginDiv(false);
                setLoginState(true)

            } else {
                setEmail('');
                setLoginState(false);
                console.log("user is logged out");
            }
        });

    }, [])

    const handleLogout = () => {

        if (loginState) {
            signOut(auth).then(() => {
                toastSuccess('logout successful');
            }).catch((error) => {
                toastError('error in logout')
                console.log(`
                error in logout,
                error message - ${error.message},
                error code - ${error.code}
                `);
            })
        }
    }

    const handleStorePassword = async () => {
        try {
            if (!loginState) {
                toastError('Please login for this feature');
            } else if (!Password) {
                toastError('Generate password first');
            } else {

                const docRef = doc(db, "passwords", email);
                const docSnap = await getDoc(docRef);

                if (!docSnap.data()) {

                    await setDoc(doc(db, "passwords", email), {
                        email,
                        passwords: [Password]
                    });

                } else {

                    await updateDoc(docRef, {
                        passwords: arrayUnion(Password),
                    });
                }
                getPasswordsList(email);
                toastSuccess('Password stored successfully');
            }

        } catch (error) {
            toastError('error while storing Password')
            console.log(`
                error in logout,
                error message - ${error.message},
                error code - ${error.code}
                `);
        }
    }

    const getPasswordsList = async (email) => {
        const docRef = doc(db, "passwords", email);
        const docSnap = await getDoc(docRef);
        console.log('passwords list is here - ', docSnap.data().passwords);
        setPasswordsList(docSnap.data().passwords)
    }

    const handleRemovePassword = async (passwordToRemove) => {
        try {
            const docRef = doc(db, "passwords", email);
            await updateDoc(docRef, {
                passwords: arrayRemove(passwordToRemove),
            });
            getPasswordsList(email);
            toastSuccess("Password removed successfully");
            console.log("Password removed successfully");

        } catch (error) {
            toastError('error while removing password')
            console.log(`
                error in logout,
                error message - ${error.message},
                error code - ${error.code}
                `);
        }
    }

    return (

        <div className="flex flex-col justify-center place-items-center poppins bg-black md:bg-transparent
         select-none h-screen md:overflow-auto overflow-hidden">


            {/*   - L O G I N  M O D A L  - */}
            <Modal
                open={loginModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }} className='md:w-1/2 w-full'>
                    <div id="child-modal-description">
                        <LoginComponent />
                    </div>
                    <button onClick={() => setLoginDiv(false)}
                        className='w-full hover:bg-slate-700 rounded-t-none'>C l o s e</button>
                </Box>
            </Modal>
            {/*   - L O G I N  M O D A L  E N D E D - */}

            {/* - S T O R E  M O D A L -  */}
            <Modal
                open={storeModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }} className='md:w-2/3 w-full'>
                    <p className='font-mono md:text-2xl m-2 text-center select-none'> - P a s s w o r d - S t o r e - </p>
                    <div id="child-modal-description" className='max-h-96 bg-gray-900 rounded-xl rounded-b-none 
                    overflow-y-scroll p-7 flex flex-col gap-2 shadow-xl'>

                        {
                            !passwordsList.length ?
                                <p className='text-center text-xl font-mono'>I t s - E m p ty</p>
                                : ''
                        }

                        {
                            passwordsList.map((item, index) => (
                                <div key={index}>
                                    <div className='flex flex-col md:flex-row
                                               justify-center place-items-center bg-gray-950 md:p-2 rounded-2xl
                                                gap-2 md:pl-6 md:pr-6 p-7' >
                                        <div className='flex grow justify-center place-items-center gap-3'>
                                            <p className='font-mono tracking-widest'>{index + 1}</p>
                                            <p className='md:inline pr-2 pl-2'>|</p>
                                            <p className='poppins tracking-widest grow text-center break-all'>{item}</p>
                                            <p className='md:inline hidden pr-2 pl-2'>|</p>
                                        </div>

                                        <div className='flex gap-3 justify-center place-items-center'>
                                            <button className="hover:bg-white grow hover:text-black hover:mt-3 smooth w-28"
                                                onClick={() => handleCopy(item)}>
                                                <i className="fa-solid fa-copy"></i>
                                            </button>
                                            <button className="hover:bg-white grow hover:text-red-900 hover:mt-3
                                                  bg-red-950 smooth w-28"
                                                onClick={() => handleRemovePassword(item)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    <button onClick={() => setStoreModal(false)}
                        className='w-full hover:bg-slate-700 rounded-t-none'>C l o s e</button>
                </Box>
            </Modal>
            {/* - S T O R E  M O D A L  E N D E D -  */}


            <div className="md:bg-gray-950 rounded-lg shadow-black shadow-xl md:p-16 md:pb-10 smooth ">

                <div className='flex justify-between'>

                    <p className="md:text-3xl text-xl cyber-font text-gray-300 hover:tracking-widest smooth">
                        Password_ <br />
                        _generator
                    </p>

                    <div className='flex gap-3'>
                        {/* STORE ICON */}
                        {
                            loginState ?
                                <Tooltip title="store" placement='top'>
                                    <i className="fa-solid fa-database fa-xl mt-2 mr-2 cursor-pointer text-gray-400
                         hover:text-white smooth" onClick={() => setStoreModal(true)}></i>
                                </Tooltip> : ''
                        }
                        {/* LOGOUT AND LOGIN ICON */}
                        {
                            loginState ?
                                <Tooltip title="logout" placement='top'>
                                    <i className="fa-solid fa-right-from-bracket fa-2xl mt-2 cursor-pointer text-gray-400
                         hover:text-white smooth" onClick={handleLogout}></i>
                                </Tooltip>
                                :
                                <Tooltip title="Account" placement='top'>
                                    <i className="fa-solid fa-circle-user fa-2xl mt-2 cursor-pointer text-gray-400
                                    hover:text-white smooth" onClick={() => setLoginDiv(true)}></i>
                                </Tooltip>
                        }

                    </div>

                </div>

                <div className="mt-9 flex md:flex-row flex-col gap-2 mb-5">

                    <input type="text" className="w-full p-2 pl-5 rounded-md font-mono tracking-widest font-extrabold 
                        text-xl"
                        value={Password}
                        placeholder='PA33W0RD I5 HE2E'
                        disabled />


                    <div className='flex gap-2'>

                        <Tooltip title="copy to clipboard" placement='top'>
                            <button className="hover:bg-white grow hover:text-black hover:mt-3 smooth"
                                onClick={handleCopy}>
                                <i className="fa-solid fa-copy"></i>
                            </button>
                        </Tooltip>

                        <Tooltip title="Save" placement='top'>
                            <button className="hover:bg-white grow hover:text-black hover:mt-3 smooth"
                                onClick={handleStorePassword}>
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                            </button>
                        </Tooltip>

                    </div>

                </div>

                <p className={`opacity-40 tracking-widest font-mono text-center smooth rounded-md mb-1
                ${complexity === 'Too weak' ? 'bg-red-800' : ''}
                ${complexity === 'Weak' ? 'bg-red-600' : ''}
                ${complexity === 'Medium' ? 'bg-orange-600' : ''}
                ${complexity === 'Strong' ? 'bg-green-600' : ''}
                `
                }>{complexity}</p>


                <div>
                    <PrettoSlider
                        valueLabelDisplay="auto"
                        aria-label="pretto slider"
                        defaultValue={8}
                        max={50}
                        min={4}
                        onChange={(e) => setLength(e.target.value)}
                    />
                </div>

                <div className='select-none flex flex-col md:flex-row gap-2 md:gap-0 justify-center mt-2'>

                    <p className={`${lowerCase ? 'text-white bg-gray-800 p-2.5' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer md:hover:text-lg smooth font-mono`}
                        onClick={() => setLowerCase(!lowerCase)}>
                        Include lowerCase (a ~ z)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${upperCase ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer md:hover:text-lg smooth p-2.5 font-mono`}
                        onClick={() => setUpperCase(!upperCase)}>
                        Include UpperCase (A ~ Z)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${numbers ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer md:hover:text-lg smooth p-2.5 font-mono`}
                        onClick={() => setNumbers(!numbers)}>
                        Include Numbers(0 ~ 1)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${symbols ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer md:hover:text-lg smooth p-2.5 font-mono`}
                        onClick={() => setSymbols(!symbols)}>
                        Include Symbols (! ~ &)
                    </p>

                </div>

                <button className='w-full mt-7 hover:bg-white hover:text-black font-extrabold lora-font
                 tracking-wider text-xl smooth'
                    onClick={handleGenerate}>
                    generate
                </button>

                <p className='text-xs text-center mt-5 font-mono tracking-widest opacity-30'>
                    - M A D E - B Y - G I R I -
                </p>

            </div>
        </div >
    )
}

export default Home