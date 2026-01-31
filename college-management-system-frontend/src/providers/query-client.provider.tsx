import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IProps {
    children: React.ReactNode
}

const query_client = new QueryClient()

const ReactQueryClientProvider: React.FC<IProps> = ({ children }) => {
    return (
        <QueryClientProvider client = { query_client }>
            { children }
        </QueryClientProvider>
    )
}

export default ReactQueryClientProvider;
