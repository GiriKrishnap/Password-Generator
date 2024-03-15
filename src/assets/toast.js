import toast from "react-hot-toast";

//success toast 
export const toastSuccess = (message) => {
    toast.success(message, {
        style: {
            borderRadius: '15px',
            background: '#344955',
            color: '#fff',
        }
    })
}

//error/fail toast
export const toastError = (message) => {
    toast.error(message, {
        style: {
            borderRadius: '15px',
            background: '#EE4266',
            color: '#fff',
        }
    })
}

//error - EE4266 , success - 344955