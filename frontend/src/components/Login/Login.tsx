import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Login.min.css"
import { useNavigate } from "react-router"
import type { LoginData } from "../../util/login_signup_data"
import type { FormEventHandler } from "react"
import type { FormEvent } from "react"

const Login = () => {

    // const onSubmit: FormEventHandler = (/*e: React.FormEvent<Element>*/) => {
        // alert("Form submitted!")
    // }

    const navigate = useNavigate();

    const handleSubmit:FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
    
    
            const formData = new FormData(event.currentTarget as HTMLFormElement)
            const data = Object.fromEntries(formData.entries());

            const loginData: LoginData = {
                username:  String(data.username),
                password: String(data.password)
    
            };
    
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData)
            })
    
            if (response.ok) {
                navigate("/home")
            } else {
                const errorText = await response.text();
                alert(errorText)
            }
    
        }

    return (
        <>
            <NavbarWithoutLinks/>
            
            {/* <div className="content"> */}
                <div className="container">
                    <form id="loginForm" onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username <input required name="username" type="text"></input>
                        </label>
                        
                        <label htmlFor="password">
                            Password <input required name="password" type="password"></input>
                        </label> 
                        
                        <input id="loginButton" type="submit" value="Login"></input>
                    </form>
                </div>
            {/* </div> */}

            <Footer/>
        </>
    )
}

export default Login
