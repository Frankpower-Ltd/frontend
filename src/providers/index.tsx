import { queryClient } from "@/services/api/reactQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const AppProvider = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div id="portal"></div>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default AppProvider