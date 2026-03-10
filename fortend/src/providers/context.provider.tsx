import AuthProvider from '../context/auth.context';

const ContextProvider: React.FC<{ children:React.ReactNode }>  = ({ children }) => {
    return (
        <AuthProvider>
            { children }
        </AuthProvider>
    )
}

export default ContextProvider;
