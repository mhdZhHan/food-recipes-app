import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// seeetalert
import Swal from 'sweetalert2'

import { GlobalStyle } from "./themes"

import Routes_ from './Routes/Routes'

const queryClient = new QueryClient()

export const UserContext = React.createContext()

function App() {
    const [userData, setUserData] = useState({})

    // sweetalert mixin
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })   

    const updateUserData = (action) => {
        switch(action.type){
            case "LOGOUT":
                setUserData(null)
                // localStorage.clear()
                localStorage.removeItem('user_data')
                console.log('user data removed')
                Toast.fire({
                    icon: 'success',
                    title: 'Logout successfully.'
                })
                break
            case "LOGIN":
                setUserData(action.payload)
                break
        }
    }

    useEffect(()=>{
        setUserData(JSON.parse(localStorage.getItem('user_data')))
    }, [])
    
    return (
        <QueryClientProvider client={queryClient}>
            <GlobalStyle />
            <UserContext.Provider value={{ userData, updateUserData }}>
                <Routes_ />
            </UserContext.Provider>
        </QueryClientProvider>
    )
}

export default App
