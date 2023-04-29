import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// sweet alert
import Swal from 'sweetalert2'

import { AiOutlineHeart,AiFillHeart } from 'react-icons/ai'

import { RECIPE_API_URL } from '../../axiosConfig'

import { dataFetching } from '../functions'

export default function Recipes_() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const { data: recipes, loading: recipeLoading, refetch: refetchRecipes } = useQuery(['recipes', selectedCategory], ()=> 
        dataFetching.getRecipes(selectedCategory)
    )

    const { data: categories, loading: categoryLoading } = useQuery(['categories'], dataFetching.getCategories)

    const user_data = JSON.parse(localStorage.getItem("user_data"))

    const handlefavorite = async (slug) => {
        axios.defaults.baseURL = RECIPE_API_URL

        const config = {
            headers: {
                "Authorization": `Bearer ${user_data?.access}`,
            }
        }

        axios.post(`recipes/favorites/manage/${slug}/`, {}, config)
            .then((response)=>{
                console.log(response)
                refetchRecipes()
            })
            .catch(function (error) {
                console.log("Error Status: ",error.response.status)
                console.log("Error Message: ",error.response.statusText)
                if(error.response.status === 401){
                    Swal.fire({
                        title: error.response.statusText,
                        text: 'Do you want to continue please login.',
                        icon: 'error',
                        confirmButtonText: 'Login'
                    })
                }
            })
    }

    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
    }

    if(recipeLoading) {
        return (
            <Recipes>
                <RecipesList>
                    <h1>Loding....</h1>
                </RecipesList>
            </Recipes>
        )
    }

    if(categoryLoading){
        <Recipes>
            <Categories>
                <h1>Loading....</h1>
            </Categories>
        </Recipes>
    }

    return (
        <Recipes>
            <div className="wrapper">
                <div className="head">
                    <h2>Chose your dishes</h2>
                    <p>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                        Esse aut ea consequuntur asperiores atque autem!
                    </p>
                </div>
                <Categories>
                    <ul>
                        <li onClick={()=> handleCategoryClick('all')}>All</li>
                        {
                            categories?.map((category) => (
                                <li 
                                    key={category?.id}
                                    onClick={() => handleCategoryClick(category?.name)}
                                >{category?.name}</li>
                            ))
                        }
                    </ul>
                </Categories>
                <RecipesList>
                    <ul>
                        {
                            recipes?.map((recipe)=>(
                                <li key={recipe?.id}>
                                    <ImageContainer>
                                        <img src={recipe?.image} alt={recipe?.name} />
                                        <span className='icon' 
                                            onClick={()=> handlefavorite(recipe?.slug, recipe?.is_favorite)}
                                        >
                                            {
                                                recipe?.is_favorite == true ? (
                                                    <AiFillHeart 
                                                        size={25} color='red'     
                                                    />
                                                ) :(
                                                    <AiOutlineHeart 
                                                        size={25} color='red' 
                                                    />
                                                )
                                            }
                                        </span>
                                    </ImageContainer>
                                    <h3 className='name'>{recipe?.name}</h3>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        !selectedCategory && <h1 style={{
                            fontSize: '28px',
                            textAlign: 'center',
                            padding: '20px',
                        }}>Select a category</h1>
                    }
                    {
                        recipes?.length === 0 && <h1 style={{
                            fontSize: '28px',
                            textAlign: 'center',
                            padding: '20px',
                        }}>Recipes not Found Select another category</h1>
                    }
                </RecipesList>
            </div>
        </Recipes>
    )
}

const Recipes = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5%;
    .head {
        h2 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 40px;
        }
        p {
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
        }
    }
`
const Categories = styled.div`
    display: flex;
    justify-content: center;
    margin: 40px 0;
    ul {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 20;
        li {
            margin-right: 20px;
            padding: 8px 16px;
            background-color: #ffdd57;
            font-size: 18px;
            font-weight: 500;
            color: #000;
            border-radius: 8px;
            cursor: pointer;
        }
    }
`
const RecipesList = styled.div`
    ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
            gap: 1.5rem;
            align-items: stretch;
            justify-content: center;
            margin: 0 auto;
        li {
            cursor: pointer;
            h3 {
                font-size: 18px;
                margin-bottom: 15px;
            }
            p {
                font-size: 14px;

            }
        }
    }
`
const ImageContainer = styled.div`
    position: relative;
    img {
        width: 100%;
        height: 150px;
        display: inline-block;
        border-radius: 4px;
        margin-bottom: 15px;
        object-fit: cover;
        border: 1px solid #000;
    }
    span.icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .8rem;
        border-radius: 0%.8rem;
        background-color: #fff;
        position: absolute;
        top: 1rem;
        right: 1rem;
        svg {
            font-weight: 700;
        }
    }
`