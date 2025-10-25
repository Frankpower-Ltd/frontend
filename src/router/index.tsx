import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([

    { path: "*", element: <NotFound /> }
]);

export default router;
