import { type ReactNode } from 'react';
import AuthProvider from '../context/auth.context';
import ReactQueryClientProvider from './query-client.provider';

const Providers: React.FC<{ children:ReactNode }> = ({ children }) => {
    return (
        <ReactQueryClientProvider>
            <AuthProvider>
                { children }
            </AuthProvider>
        </ReactQueryClientProvider>
    )
}

export default Providers;
