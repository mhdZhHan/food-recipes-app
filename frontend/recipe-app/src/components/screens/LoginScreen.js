import React, { useContext, useState, useEffect } from 'react'

import axios from 'axios'

// seeetalert
import Swal from 'sweetalert2'

import { useNavigate, useLocation, Link } from 'react-router-dom'

import queryString from 'query-string'

import { FormStyles } from '../../themes'

import { RECIPE_API_URL } from '../../axiosConfig'

import { UserContext } from '../../App'


export default function LoginScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [message, setMessage] = useState('')
    const [nextPath, setNextPath] = useState('')

    const { updateUserData } = useContext(UserContext)

    const navigate = useNavigate() // for just navigate

    const location = useLocation() // for the url based inforomations
    

    // find next path query
    useEffect(()=>{
        const { search } = location
        const values = queryString.parse(search)
        const { next } = values
        setNextPath(next)
    }, [])

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
    

    const loginHandle = (event) => {
        setMessage('')
        axios.defaults.baseURL = RECIPE_API_URL
        event.preventDefault()
        axios.post('auth/token/', { username, password })
            .then(response => {
                let data = response.data
                localStorage.setItem("user_data", JSON.stringify(data))
                updateUserData({ type: 'LOGIN', payload: data })
                nextPath ? navigate(nextPath) : navigate('/')
                // swal popup
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                })
            })
            .catch((error)=>{
                // console.log(error.response)
                if (error.response.status === 401){
                    setMessage(error.response.data.detail)
                    // popup
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data.detail,
                        confirmButtonText: 'Close'
                    })
                }
            })
    }

    return (
        <FormStyles.FormContainer>
            <h1 className="title_">Login</h1>
            <form action="" onSubmit={loginHandle}>
                <div className="input_fields">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                {
                    message && (
                        <div className="error">
                            <p className='error_message'>{message}</p>
                        </div>
                    )
                }
                <div className="submit_btn">
                    <input type="submit" value="Login" />
                    <span className="member">Not a member <Link to="/auth/signup">Register now</Link></span>
                </div>
            </form>
        </FormStyles.FormContainer>
    )
}

