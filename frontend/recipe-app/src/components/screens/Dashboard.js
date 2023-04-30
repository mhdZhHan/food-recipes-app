import React, { Fragment, useContext } from 'react'
import styled from 'styled-components'

import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { RECIPE_API_URL } from '../../axiosConfig'

import { MdDelete} from 'react-icons/md'
import { BsPencilSquare } from 'react-icons/bs'

import { dataFetching } from '../functions'
import { Images } from '../../constants'

import { UserContext } from '../../App'

function Dashboard_() {
    // auth token
    const user_data = JSON.parse(localStorage.getItem("user_data"))

    // user recipes data
    const { data: recipes, loading: recipeLoading, refetch: refrshRecipes } = useQuery(['admin_recipes'], 
        dataFetching.getAdminRecipes
    )

    // user data
    const { data: userDetails, loading: userloading } = useQuery(['user_details'], 
        dataFetching.getUserDetails
    )

    const navigate = useNavigate()

    // LOGOUT
    const { updateUserData } = useContext(UserContext)

    const handlLogout = () => {
        updateUserData({ type: 'LOGOUT' })
        navigate('/')
    }
    // LOGOUT END

    if(recipeLoading || userloading){
        return (
            <h1>loading...</h1>
        )
    }

    // delete recipe
    const handleDelete = (slug) => {
        axios.defaults.baseURL = RECIPE_API_URL

        const config = {
            headers: {
                "Authorization": `Bearer ${user_data?.access}`,
            }
        }

        axios.post(`recipes/delete/${slug}/`, { is_deleted: true }, config)
            .then((response)=>{
                console.log(response)
                refrshRecipes()
            })
            .catch(function (error) {
                console.log("Error: ",error)
            })
    }

    return (
        <Dashboard>
            <div className="wrapper">
                <Container>
                    <LeftContainer>
                        <div className='title'>
                            <h1 className="title_">User info</h1>
                        </div>
                        <div className="user">
                            <div className="img_container">
                                <img src={Images.USER_AVATAR} alt="user" />
                            </div>
                            {
                                userDetails?.map((user)=>(
                                    <Fragment key={user?.id}>
                                        <h3 className="name">Name: {user?.first_name}</h3>
                                        <h3 className="username">Username: {user?.username}</h3>
                                        <h3 className="email">Email: {user?.email}</h3>
                                    </Fragment>
                                ))
                            }
                        </div>
                        <div className="logout_button">
                            <button onClick={handlLogout}>Logout</button>
                        </div>
                    </LeftContainer>

                    <RightContainer>
                        <Top>
                            <h1 className="title">Your Recipes</h1>
                            <button><Link to='/dashboard/recipe/create'>Create Recipe</Link></button>
                        </Top>

                        <RecipesList>
                            <ul className='recipes'>
                                {
                                    recipes?.map((recipe)=>(
                                        <li className='recipe' key={recipe?.id}>
                                            <div className='img_container'>
                                                <img src={recipe?.image} alt={recipe?.name} />
                                            </div>
                                            <div className='details'>
                                                <div className="head">
                                                    <h3 className='name'>{recipe?.name}</h3>
                                                    <ul className='meta'>
                                                        <li className="edite">
                                                            <Link to={`/dashboard/recipe/edit/${recipe?.slug}`}>
                                                                <BsPencilSquare 
                                                                    color='rgb(255, 199, 13)' 
                                                                    size={25}
                                                                />
                                                            </Link>
                                                        </li>
                                                        <li className="delete">
                                                            <MdDelete 
                                                                color='rgb(236, 12, 76)' 
                                                                size={25} 
                                                                onClick={()=>handleDelete(recipe?.slug)}
                                                            />
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="body">
                                                    <p>{recipe?.description}</p>
                                                    <div className='meta'>
                                                        <span className='category_label'>Category: </span>
                                                        <span className='category_name'>{recipe?.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </RecipesList>
                    </RightContainer>
                </Container>
            </div>
        </Dashboard>
    )
}

const Dashboard = styled.div`
    margin-top: 5%;
`

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`
const LeftContainer = styled.div`
    padding: 2rem;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    margin-right: 2rem;
    height: 40rem;
    margin-top: 1rem;
    flex: 1;
    div.title {
        margin-bottom: 2rem;
        h1 {
            text-align: center;
        }
    }
    div.user {
        margin-bottom: 2rem;
        div.img_container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 2rem;
            img {
                display: inline-block;
                width: 15rem;
                height: 13rem;
                border-radius: 50%;
                object-fit: cover;
            }
        }
        h3 {
            margin-bottom: .8rem;
            font-size: 1.7rem;
        }
    }
    div.logout_button {
        display: flex;
        align-items: center;
        justify-content: center;
        button {
            display: inline-block;
            padding: .7rem 1rem;
            background-color: #ffdd57;
            border-radius: 0.4rem;
            cursor: pointer;
            color: #363636;
            font-size: 1.7rem;
            line-height: 1.5;
            &:hover {
                color: rgba(0,0,0,.7);
            }
        }
    }
`
const RightContainer = styled.div`
    flex: 3;
`

const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    h1 {
        font-size: 2.5rem;
    }
    button {
        display: block;
        padding: .8rem 1rem;
        border-radius: .4rem;
        background-color: rgb(255, 199, 13);
        a {
            display: block;
            color: #fff;
            font-size: 1.7rem;
            font-weight: 500;
        }
    }
`
const RecipesList = styled.div`
    ul.recipes {
            margin: 0 auto;
            width: 100%;
        li.recipe {
            cursor: pointer;
            width: 100%;
            padding: 2rem;
            display: flex;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
            margin-bottom: 2.5rem;
            div.img_container {
                width: 200px;
                margin-right: 2rem;
                img {
                    width: 100%;
                    height: 150px;
                    display: inline-block;
                    border-radius: 4px;
                    border: 1px solid #000;
                    object-fit: cover;
                }
            }
            div.details {
                margin-bottom: 1.5rem;
                flex: 1;
                div.head{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    h3 {
                        font-size: 1.8rem;
                    }
                    ul.meta {
                        align-self: stretch;
                        display: flex;
                        align-items: center;
                        li {
                            margin-right: 2rem;
                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }
                }
                div.body {
                    p {
                        font-size: 1.7rem;
                        max-width: 50rem;
                        line-height: 1.9;
                        margin-bottom: 1.5rem;
                    }
                    div.meta {
                        display: flex;
                        align-items: center;
                        span {
                            display: block;
                            font-size: 1.5rem;
                            line-height: 1.9;
                            &.category_label {
                                font-weight: 600;
                                margin-right: .5rem;
                            }
                        }
                    }
                }
            }
        }
    }
`
export default Dashboard_