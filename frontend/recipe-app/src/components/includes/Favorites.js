import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { AiFillHeart } from 'react-icons/ai'

import { RECIPE_API_URL } from '../../axiosConfig'
import { dataFetching } from '../functions'

export default function Favorites_() {
    const { data: recipes, loading: recipeLoading, refetch: refetchRecipes } = useQuery(['favorite_recipes'], 
        dataFetching.getFavoriteRecipes
    )

    const user_data = JSON.parse(localStorage.getItem("user_data"))

    if(recipeLoading){
        return (
            <h1>Loading...</h1>
        )
    }

    const handlefavorite = async (slug) => {
        axios.defaults.baseURL = RECIPE_API_URL

        const config = {
            headers: {
                "Authorization": `Bearer ${user_data?.access}`,
            }
        }

        axios.post(`recipes/favorites/manage/${slug}/`, { }, config)
            .then((response)=>{
                console.log(response)
                refetchRecipes()
            })
            .catch(function (error) {
                console.log("Error: ",error)
            })
    }

    return (
        <Favorites>
            <div className="wrapper">
                <div className="head">
                    <h2>Your Favorite Dishes</h2>
                </div>
                <RecipesList>
                    <ul>
                        {
                            recipes?.map((recipe)=>(
                                <li key={recipe?.id}>
                                    <ImageContainer>
                                        <img src={recipe?.image} alt={recipe?.name} />
                                        <span className='icon' 
                                            onClick={()=> handlefavorite(recipe?.slug)}
                                        >
                                            <AiFillHeart 
                                                size={25} color='red'     
                                            />
                                        </span>
                                    </ImageContainer>
                                    <h3 className='name'>{recipe?.name}</h3>
                                </li>
                            ))
                        }
                    </ul>
                    {
                        recipes?.length === 0 && <h1 style={{
                            fontSize: '28px',
                            textAlign: 'center',
                            padding: '20px',
                        }}>No recipes found</h1>
                    }
                </RecipesList>
            </div>
        </Favorites>
    )
}

const Favorites = styled.section`
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
        border: 1px solid #000;
        margin-bottom: 15px;
        object-fit: cover;
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