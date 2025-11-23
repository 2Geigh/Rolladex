import type { FormEventHandler } from "react"
import "./dist/Login.min.css"

const Login = () => {

    // const onSubmit: FormEventHandler = (/*e: React.FormEvent<Element>*/) => {
        // alert("Form submitted!")
    // }

    return (
        <>
            <form id="loginForm" method="POST" action="/login">
                <label htmlFor="username">
                    Username <input required name="username" type="text"></input>
                </label>
                
                <label htmlFor="password">
                    Password <input required name="password" type="password"></input>
                </label> 
                
                <input id="loginButton" type="submit" value="Login"></input>
            </form>
        </>
    )
}

export default Login
