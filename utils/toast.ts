import { toast, TypeOptions } from 'react-toastify'

const notify = (message: string, type: TypeOptions) =>
  toast(message, { type, position: 'top-center', autoClose: 3000 })

export default notify
