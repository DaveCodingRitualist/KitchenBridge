import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (companyName, loginCode) => {
    setIsLoading(true)
    setError(null)
    if (loginCode.length !== 6) {
      setError('Login code must be 6 digits')
      return
    }
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ companyName, loginCode })
    })
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))
      // update the auth context
      dispatch({type: 'LOGIN', payload: json})
      // update loading state
      setIsLoading(false)
    }
  }
  return { login, isLoading, error }
}