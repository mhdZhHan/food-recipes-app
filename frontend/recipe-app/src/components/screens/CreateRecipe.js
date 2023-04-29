import React, { useState } from 'react'
import axios from 'axios'

import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

import { useQuery } from '@tanstack/react-query'

import { dataFetching } from './../functions'

import { RECIPE_API_URL } from '../../axiosConfig'

function CreateRecipe_() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)

    const { data : categories, refetch: refetchCategories } = useQuery(['categories_for_create'], dataFetching.getCategories)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [newCategory, setNewCategory] = useState('')

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value)
    }

    const handleImageChange = (event) => {
        setImage(event.target.files[0])
    }

    const navigate = useNavigate()
    const user_data = JSON.parse(localStorage.getItem("user_data"))

    const handleCreateCategory = (event) => {
        axios.defaults.baseURL = RECIPE_API_URL
        event.preventDefault()

        const config = {
            headers: {
                "Authorization": `Bearer ${user_data?.access}`,
                "content-type": 'multipart/form-data',
            }
        }

        axios.post('recipes/categories/new/', { name: newCategory }, config)
            .then((response)=>{
                console.log(response.data.data)
                refetchCategories()
                setSelectedCategory(response.data.data.id)
            })
            .catch(function (error) {
                console.log("Error: ",error)
            })
        setNewCategory('')
    }

    const handleSubmit = (event) => {
        axios.defaults.baseURL = RECIPE_API_URL

        const config = {
            headers: {
                "Authorization": `Bearer ${user_data?.access}`,
                "content-type": 'multipart/form-data',
            }
        }

        axios.post('recipes/create/new/', {name, image, description, category_id: selectedCategory} , config)
            .then((response)=>{
                console.log(response)
                navigate('/dashboard')
            })
            .catch(function (error) {
                console.log("Error: ",error)
            })
    }

    return (
        <CreateRecipe>
            <div className="wrapper">
                <div className="head">
                    <h1 className="titel">Create Recipe</h1>
                    <button onClick={handleSubmit}>Save Recipe</button>
                </div>
                <form action="">
                    <div className="input_box">
                        <label htmlFor="id_recipe_name">Recipe Name</label>
                        <input 
                            id='id_recipe_name'
                            type="text" 
                            placeholder='Recipe title'
                            name='name'
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="input_box">
                        <label htmlFor="id_recipe_description">Recipe Description</label>
                        <textarea 
                            cols="30" rows="10"
                            id='id_recipe_description'
                            type="text" 
                            placeholder='Recipe description' 
                            name='description'
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        ></textarea>
                    </div>
                    <div className="input_box">
                        <label htmlFor="id_recipe_image">Recipe Image</label>
                        <div className='flex'>
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg"
                                id="id_recipe_image" 
                                name='image'
                                src={image}
                                onChange={handleImageChange} 
                            />
                            {image && <img src={image} alt={name} />}
                        </div>
                    </div>
                    <div className="select_box">
                        <label htmlFor="id_recipe_category">Select Category</label>
                        <select 
                            id="id_recipe_category" 
                            name='category'
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select a category</option>
                            {categories?.map(category => (
                                <option 
                                    key={category?.id} 
                                    value={category?.id}
                                >{category?.name}</option>
                            ))}
                            
                            <option value="new">Create a new category</option>
                        </select>

                        {selectedCategory === 'new' && (
                            <div className='new_category'>
                                <label htmlFor="new_category">New category</label>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        id="new_category" 
                                        placeholder='New category name'
                                        value={newCategory} 
                                        onChange={(event) => setNewCategory(event.target.value)} 
                                    />
                                    <button
                                        onClick={handleCreateCategory}
                                    >Add Category</button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </CreateRecipe>
    )
}

const CreateRecipe = styled.div`
    margin-top: 5%;
    div.head {
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        h1 {
            font-size: 2.3rem;
        }
        button {
            display: block;
            padding: .8rem 1rem;
            border-radius: .4rem;
            background-color: rgb(255, 199, 13);
            color: #fff;
            font-size: 1.7rem;
            font-weight: 700;
            cursor: pointer;
        }
    }
    form {
        div.input_box {
            margin-bottom: 2rem;
            label {
                display: block;
                font-size: 1.9rem;
                margin-bottom: 2rem;
                font-weight: 500;
            }
            input, textarea {
                width: 92%;
                outline: none;
                padding: 1.7rem 2rem;
                margin-bottom: 1.5rem;
                border-radius: .8rem;
                background-color: #fff;
                border: 2px solid #eee;
                font-size: 1.8rem;
            }
            input[type='file']{
                background: #fff;
            }
            div.flex {
                display: flex;
                width: 92%;
                input {
                    flex: 1;
                    width: auto;
                }
                img {
                    padding: 1.7rem 2rem;
                    border-radius: 0%.8rem;
                    border: 2px solid #eee;
                    flex: 1;
                    width: 50px;
                    display: inline-block;
                    margin-bottom: 1.5rem;
                }
            }
        }
        div.select_box {
            margin-bottom: 2rem;
            label {
                display: block;
                font-size: 1.9rem;
                margin-bottom: 2rem;
                font-weight: 500;
            }
            select {
                padding: 1.7rem 2rem;
                margin-bottom: 1.5rem;
                border-radius: .8rem;
                background-color: #fff;
                border: 2px solid #eee;
                color: #333;
                font-size: 1.8rem;
            }
            input {
                width: 92%;
                outline: none;
                padding: 1.7rem 2rem;
                margin-bottom: 1.5rem;
                border-radius: .8rem;
                background-color: #fff;
                border: 2px solid #eee;
                font-size: 1.8rem;
            }
            div.flex {
                display: flex;
                align-items: center;
                width: 92%;
                input {
                    margin-right: 2rem;
                    width: auto;
                }
                button {
                    display: block;
                    padding: 1.7rem 2rem;
                    border-radius: .4rem;
                    border: 2px solid #23d160;
                    background-color: #23d160;
                    color: #fff;
                    font-size: 1.7rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    cursor: pointer;
                }
            }
        }
    }
`

export default CreateRecipe_