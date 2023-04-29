import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'

// seeetalert
import Swal from 'sweetalert2'

import { FormStyles } from '../../themes'
import { RECIPE_API_URL } from '../../axiosConfig'
import { Link } from 'react-router-dom'

import { UserContext } from '../../App'

export default function SignupScreen() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [fullName, setFullname] = useState('')

    const [message, setMessage] = useState('')
    const [nextPath, setNextPath] = useState('')

    const { updateUserData } = useContext(UserContext)

    const location = useLocation()
    const navigate = useNavigate()

    // find next path query (signup?next=/dashboard)
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

    const handleSignup = (event) => {
        setMessage('')
        axios.defaults.baseURL = RECIPE_API_URL
        event.preventDefault()
        axios.post('auth/create/', { username, email, name: fullName, password })
          .then(response => {
                let data = response.data.data
                let status = response.data.status
                console.log(status)
                if(status == 6000){
                    // console.log("Data",data.data)
                    localStorage.setItem("user_data", JSON.stringify(data))
                    updateUserData({ type: 'LOGIN', payload: data })
                    nextPath ? navigate(nextPath) : navigate('/')
                    // popup
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully signed'
                    })
                }else {
                    setMessage(response.data.message)
                }
          })
          .catch((error)=>{
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
            <h1 className="title_">Sign Up</h1>
            <form action="" onSubmit={handleSignup}>
                <div className="input_fields">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={fullName}
                        onChange={(event)=>setFullname(event.target.value)}
                    />
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(event)=>setUsername(event.target.value)}
                    />
                    <input 
                        type="email" 
                        placeholder="Work Email" 
                        value={email}
                        onChange={(event)=>setEmail(event.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(event)=>setPassword(event.target.value)}
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
                    <input type="submit" value="Sign Up" />
                    <span className="member">Already a member <Link to="/auth/login">Login Here</Link></span>
                </div>
            </form>
        </FormStyles.FormContainer>
    )
}
