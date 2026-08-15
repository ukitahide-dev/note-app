import { Navigate, Outlet } from "react-router-dom";





export default function ProtectedRoute() {


    const accessToken = localStorage.getItem("access");

    
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }


    // この場所に、今アクセスしている子Routeのページを表示する。
    return <Outlet />;


}
