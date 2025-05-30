import { AdminContext } from '../context/AdminContext.js'

import { useContext } from 'react'

export const useAdminContext = () => {
    const context = useContext(AdminContext)

    if (!context) {
        throw Error('useOrdersContext must be used inside an Orders ContextProvider')
    }

    return context
}