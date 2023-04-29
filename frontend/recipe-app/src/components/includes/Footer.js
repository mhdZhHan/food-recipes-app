import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function Footer_() {
    return (
        <Footer>
            <h1 className="title"><Link to="/">Recipe App</Link></h1>
            <p className="code">
                <a href="https://github.com/mohammedshajahan7/food-recipes-app">complete source-code</a>
            </p>
        </Footer>
    )
}

const Footer = styled.footer`
    width: 100%;
    padding: 2rem;
    background: rgb(47, 42, 13);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    margin-top: 5%;
    text-align: center;
    h1 {
        margin-bottom: 2rem;
        a {
            color: #fff;
            font-size: 2rem;
        }
    }
    p {
        text-align: center;
        a {
            font-size: 1.5rem;
            display: block;
            color: dodgerblue;
        }
    }
`

export default Footer_