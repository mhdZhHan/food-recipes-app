import axios from "axios"

// API URL
import { RECIPE_API_URL } from '../../axiosConfig'

const user_data = JSON.parse(localStorage.getItem("user_data"))


const getRecipes = async (selectedCategory) => {
    axios.defaults.baseURL = RECIPE_API_URL

    let url = `recipes/`

    let headers_ = {}

    if(user_data){
        headers_ = {
            "Authorization": `Bearer ${user_data?.access}`,
        }
    }

    if(selectedCategory && selectedCategory !== 'all'){
        url += `?category=${selectedCategory}`
    }

    const response = await axios.get(url, {headers : headers_})
    const recipes = response?.data?.data
    return recipes || []
}


const getRecipe = async (slug)=>{
    axios.defaults.baseURL = RECIPE_API_URL
    const { data } = await axios.get(`recipes/${slug}`)

    return data?.data || []
}


const getCategories = async () => {
    axios.defaults.baseURL = RECIPE_API_URL
    const response = await axios.get(`recipes/categories/`)
    const categories = response?.data?.data
    return categories || []
}


const getAdminRecipes = async () => {
    axios.defaults.baseURL = RECIPE_API_URL

    const response = await axios.get(`admin/recipes/`, {
        headers: {
            "Authorization": `Bearer ${user_data?.access}`,
        }
    })
    const recipes = response?.data?.data
    return recipes || []
}


const getFavoriteRecipes = async () => {
    axios.defaults.baseURL = RECIPE_API_URL

    const response = await axios.get(`recipes/favorites/`, {
        headers: {
            "Authorization": `Bearer ${user_data?.access}`,
        }
    })
    const recipes = response?.data?.data
    return recipes || []
}


const getUserDetails = async () => {
    axios.defaults.baseURL = RECIPE_API_URL
    const response = await axios.get(`auth/user/`, {
        headers: {
            "Authorization": `Bearer ${user_data?.access}`,
        }
    })
    const userData = response?.data?.data
    return userData || []
}


export default {
    getRecipes,
    getRecipe,
    getCategories,
    getAdminRecipes,
    getFavoriteRecipes,
    getUserDetails,
}
