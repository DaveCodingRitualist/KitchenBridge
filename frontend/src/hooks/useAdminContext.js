import { AdminContext } from '../context/AdminContext.jsx'

import { useContext } from 'react'

export const useAdminContext = () => {
    const context = useContext(AdminContext)

    if (!context) {
        throw Error('useOrdersContext must be used inside an Orders ContextProvider')
    }

    return context
}