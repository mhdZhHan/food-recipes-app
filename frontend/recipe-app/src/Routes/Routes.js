import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// screens
import { Home, LoginScreen, SignupScreen, 
    FourNotFour, FavoritesScreen, Dashboard_, CreateRecipe_, UpdateRecipe_  } from '../components/screens'

// includes
import { Header_, Footer_ } from '../components/includes'

import PrivateRoute from './PrivateRoute'

function Routes_() {
    return (
        <Router>
            <Header_ />
            <Routes>
                <Route path='/'  element={<Home />} />
                <Route path='/favorites'  element={<PrivateRoute><FavoritesScreen /></PrivateRoute>} />
                <Route path='/dashboard'  element={<PrivateRoute><Dashboard_ /></PrivateRoute>} />
                <Route path='/dashboard/recipe/create'  element={<PrivateRoute><CreateRecipe_ /></PrivateRoute>} />
                <Route path='/dashboard/recipe/edit/:slug'  element={<PrivateRoute><UpdateRecipe_ /></PrivateRoute>} />
                <Route path='/auth/login'  element={<LoginScreen />} />
                <Route path='/auth/signup'  element={<SignupScreen />} />
                <Route path="*" element={<FourNotFour />} />
            </Routes>
            <Footer_ />
        </Router>
    )
}

export default Routes_