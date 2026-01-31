import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { getCurrentUser } from '../api/auth.api';
import { type IUser } from '../types/auth.types';

interface IContext {
    user: null | IUser,
    setUser: Dispatch<SetStateAction<null>>,
    isLoading: boolean,
    logout: () => void
}

const initial_value = {
    user: null,
    setUser: () => {},
    isLoading: true,
    logout: () => {}
}

export const AuthContext = createContext<IContext>(initial_value)

// Provider
const AuthProvider: React.FC<{ children:React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchUser(){
        try {
            const currentUser = await getCurrentUser()
            console.log(" data from auth => ",  currentUser.data)
            setUser(currentUser.data)
        } catch (error) {
            console.log(error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }
    fetchUser()
    }, [])

    const logout = (cb=()=>{}) => {
        localStorage.removeItem('user')
        setUser(null)
        cb()
    }

    return (
        <AuthContext.Provider value={{user, setUser, isLoading, logout}}>
            { children }
        </AuthContext.Provider>
    )
}

// Custom Hook
export const useAuth = () => {
    if (!AuthContext) {
        console.log('useAuth hook must used inside auth provider')
    }
    return useContext(AuthContext)
}

export default AuthProvider;
