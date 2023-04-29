import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

function FourNotFour() {
    return (
        <FourNotFourContainer>
            <h1>404</h1>
            <h2>Back to <Link to="/">Home</Link></h2>
        </FourNotFourContainer>
    )
}

const FourNotFourContainer = styled.div`
    width: 97%;
    height: 50%;
    margin: 100px auto;
    padding: 30px;
    background-color: #fff;
    h1 {
        font-size: 50px;
        color: #000;
        text-align: center;
        margin-bottom: 20px;
        font-weight: 700;
    }
    h2 {
        font-size: 45px;
        text-align: center;
        a {
            font-size: 45px;
            color: rgb(255, 199, 13);
            text-decoration: underline;
        }
    }
`

export default FourNotFour