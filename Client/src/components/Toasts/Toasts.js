import {ToastContainer, toast} from 'react-toastify';

export const ShowToast = (type, msg) => {
    switch(type){

        case 'success' :
            toast.success(msg,{
                position:toast.POSITION.BOTTOM_LEFT
            })
            break;

        case 'error':
            toast.error(msg,{
                position:toast.POSITION.BOTTOM_RIGHT
            })

            break;

        default:
            return false;
    }
};