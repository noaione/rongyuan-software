import { toast } from 'react-toastify'

export const toToast = (type: 'error' | 'info', msg: string) => {
  //console.log(msg)
  type === 'error'
    ? toast.error(msg, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    })
    : toast.info(msg, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    })
}
