import { Box, Modal, Tooltip } from '@mui/material'
import { PrettoSlider } from '../assets/slider'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { passwordStrength } from 'check-password-strength'
import { lowerCaseList, upperCaseList, numbersList, symbolsList, preference } from '../assets/passwordUtils';
import LoginComponent from '../components/login';
import { style } from '../assets/modelStyle'


function Home() {

    const [Password, setPassword] = useState('');
    const [length, setLength] = useState(8);
    const [complexity, setComplexity] = useState('');
    const [upperCase, setUpperCase] = useState(false);
    const [lowerCase, setLowerCase] = useState(false);
    const [numbers, setNumbers] = useState(false);
    const [symbols, setSymbols] = useState(false);

    const [loginDiv, setLoginDiv] = useState(false);

    const handleCopy = () => {
        if (Password) {
            navigator.clipboard.writeText(Password);

            toast.success('copied to clipboard', {
                style: {
                    borderRadius: '15px',
                    background: '#344955', //error - EE4266 , success - 344955
                    color: '#fff',
                }
            })
        } else {
            toast.error('generate password first!', {
                style: {
                    borderRadius: '15px',
                    background: '#EE4266', //error - EE4266 , success - 344955
                    color: '#fff',
                }
            })
        }
    }

    const handleGenerate = () => {

        if (!upperCase && !lowerCase && !numbers && !symbols) {
            toast.error('please select your preference!', {
                style: {
                    borderRadius: '15px',
                    background: '#EE4266', //error - EE4266 , success - 344955
                    color: '#fff',
                }
            })
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
        setComplexity(passwordStrength(tempPassword, preference).value, preference);

    }

    return (

        <div className="flex flex-col justify-center place-items-center poppins bg-black md:bg-transparent
         select-none h-screen md:overflow-auto overflow-hidden">


            {/*   - L O G I N  M O D E L  - */}
            <Modal
                open={loginDiv}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 700 }}>
                    <div id="child-modal-description">
                        <LoginComponent />
                    </div>
                    <button onClick={() => setLoginDiv(false)}
                        className='w-full hover:bg-slate-700 rounded-t-none'>C l o s e</button>
                </Box>
            </Modal>
            {/*   - L O G I N  M O D E L  E N D ED - */}


            <div className="bg-gray-950 rounded-lg shadow-black shadow-xl md:p-16 md:pb-10 smooth ">

                <div className='flex justify-between'>

                    <p className="md:text-3xl text-xl cyber-font text-gray-300 hover:tracking-widest smooth">
                        Password_ <br />
                        _generator
                    </p>

                    <div className='flex gap-3'>

                        <Tooltip title="Account" placement='top'>
                            <i className="fa-solid fa-circle-user fa-2xl mt-2 cursor-pointer text-gray-400
                         hover:text-white smooth" onClick={() => setLoginDiv(true)}></i>
                        </Tooltip>

                        <Tooltip title="logout" placement='top'>
                            <i className="fa-solid fa-right-from-bracket fa-2xl mt-2 cursor-pointer text-gray-400
                         hover:text-white smooth"></i>
                        </Tooltip>

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
                            <button className="hover:bg-white grow hover:text-black hover:mt-3 smooth">
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
                     rounded-xl hover:text-white cursor-pointer hover:text-lg smooth font-mono`}
                        onClick={() => setLowerCase(!lowerCase)}>
                        Include lowerCase (a ~ z)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${upperCase ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer hover:text-lg smooth p-2.5 font-mono`}
                        onClick={() => setUpperCase(!upperCase)}>
                        Include UpperCase (A ~ Z)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${numbers ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer hover:text-lg smooth p-2.5 font-mono`}
                        onClick={() => setNumbers(!numbers)}>
                        Include Numbers(0 ~ 1)
                    </p>
                    <p className='md:inline hidden p-2'>|</p>

                    <p className={`${symbols ? 'text-white bg-gray-800' : 'text-gray-500 bg-gray-950 p-2 '}
                     rounded-xl hover:text-white cursor-pointer hover:text-lg smooth p-2.5 font-mono`}
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