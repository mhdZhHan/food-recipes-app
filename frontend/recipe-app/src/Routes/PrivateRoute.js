import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function PrivateRout({ children }) {
    const user_data = JSON.parse(localStorage.getItem("user_data"))
    const location = useLocation()
    return user_data?.access ? children : <Navigate to={{pathname: "/auth/login", search: `?next=${location.pathname}`}} />;
}

export default PrivateRout