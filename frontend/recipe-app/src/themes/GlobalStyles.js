import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    ::root {
        --main_color: #ffdd57;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        border: none;
        outline: none;
    }

    a {
        color: #222;
        text-decoration: none;
        &:hover {
            opacity: .8;
        }
    }

    body {
        height: 100%;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    ul, ol {
        list-style: none;
    }

    .wrapper {
        max-width: 1200px;
        margin: 0 auto;
        width: 95%;
    }

    html {
        font-size: 62.5%;
        overflow-x: hidden;
        height: 100%;
        @media all and (max-width: 991px){
            font-size: 55%;
        }
        @media all and (max-width: 480px){
            font-size: 50%;
        }
    }
`

export default GlobalStyle