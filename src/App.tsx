import {createBrowserRouter, RouterProvider} from "react-router";
import Home from "./pages/Home";
import {useInitializeDataForMyApp} from "./services/PetService.tsx";
import PetDetails from "./pages/PetDetails";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
   { path: "/pet/:id", element: <PetDetails /> },
]);

export default function App() {
    useInitializeDataForMyApp();

    return <RouterProvider router={router} />;
}
