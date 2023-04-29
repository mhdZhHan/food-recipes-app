import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { BsBookmarkStar } from 'react-icons/bs'

import { UserContext } from '../../App'

import { Images } from '../../constants'

function Header_() {
    const {userData, updateUserData} = useContext(UserContext)

    const handlLogout = () => {
        updateUserData({ type: 'LOGOUT' })
    }

    return (
        <Header>
            <h1 className="title"><Link to="/">Recipe App</Link></h1>
            <nav className='right'>
                <ul>
                    {
                        userData ? (
                            <li><button onClick={handlLogout}>
                                <span>Logout</span>
                            </button></li>
                        ): (
                            <li><button>
                                <Link to='/auth/login'>Login</Link>
                            </button></li>
                        )
                    }
                    <li><Link to='/favorites'>
                        <BsBookmarkStar size={30} color='#363636' />
                    </Link></li>
                    <li><Link to='/dashboard'>
                        <img src={Images.USER_AVATAR} alt='user_profile' />
                    </Link></li>
                </ul>
            </nav>
        </Header>
    )
}

const Header = styled.header`
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #23d160;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    h1 {
        a {
            color: #fff;
            font-size: 3rem;
        }
    }
    ul {
        display: flex;
        align-items: center;
        li {
            margin-right: 2.2rem;
            &:last-child {
                margin-right: 0;
            }
            a {
                display: inline-block;
                cursor: pointer;
                text-decoration: none;
                font-size: 1.9rem;
                font-weight: 500;
                text-decoration: underline;
                img {
                    display: inline-block;
                    width: 4rem;
                    height: 4rem;
                    border-radius: 50%;
                }
            }
            button {
                display: inline-block;
                padding: .7rem 1rem;
                background-color: #ffdd57;
                border-radius: 0.4rem;
                cursor: pointer;
                border-width: 1px;
                text-align: center;
                white-space: nowrap;
                a, span {
                    display: inline-block;
                    color: #363636;
                    text-decoration: none;
                    font-size: 1.7rem;
                    line-height: 1.5;
                    &:hover {
                        color: rgba(0,0,0,.7);
                    }
                }
            }
        }
    }
`

export default Header_