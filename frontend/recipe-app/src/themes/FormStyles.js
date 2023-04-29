import styled from "styled-components"

const FormContainer = styled.div`
    margin: 5% auto 0;
    width: 38rem;
    padding: 2rem 1rem;
    background-color: #fff;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);

    @media all and (max-width: 334px){
        width: 95%;
    }
    
    h1.title_ {
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }

    form {
        div.input_fields {
            input {
                width: 92%;
                outline: none;
                border: .1rem solid #fff;
                padding: 1.2rem 2rem;
                margin-bottom: 1.5rem;
                border-radius: 2rem;
                background: #eee;
                &:focus {
                    border: .1rem solid rgb(192, 192, 192);
                }
            }
        }
        div.error {
            margin-top: 0.8rem;
            margin-bottom: 1.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            p {
                font-size: 1.6rem;
                color: red;
            }
        }
        div.submit_btn {
            input {
                font-size: 1.8rem;
                padding: 1rem 0;
                border-radius: 2rem;
                outline: none;
                border: none;
                width: 90%;
                background: rgb(17, 107, 143);
                color: #fff;
                font-weight: 600;
                cursor: pointer;
                &:hover {
                    background-color: rgba(17, 107, 143, 0.877);
                }
            }
            span.member {
                display: block;
                margin-top: 1.5rem;
                font-size: 1.3rem;
                color: #636363;
                a {
                    font-size: 1.3rem;
                    color: rgb(17, 107, 143);
                    text-decoration: none;
                }
            }
        }
    }
`

export default {
    FormContainer,
}