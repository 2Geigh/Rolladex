import type { FormEvent, FormEventHandler } from "react"
import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Signup.min.css"
import type { SignupData } from "../../util/login_signup_data"
import { useNavigate } from "react-router"

const SignUp = () => {

    const navigate = useNavigate()
    // const onSubmit: FormEventHandler = (/*e: React.FormEvent<Element>*/) => {
        // alert("Form submitted!")
    // }

    const handleSubmit:FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()


        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const data = Object.fromEntries(formData.entries());
        
        const signupData: SignupData = {
            username:  String(data.username),
            password: String(data.password)

        };

        const response = await fetch("http://localhost:3001/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData)
        })

        if (response.ok) {
            alert("Successfully created user")
            navigate("/login")
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
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username <input required name="username" type="text"></input>
                        </label>
                        
                        <label htmlFor="password">
                            Password <input required name="password" type="password"></input>
                        </label> 
                        
                        <input id="loginButton" type="submit" value="Sign Up"></input>
                    </form>
                </div>
            {/* </div> */}

            <Footer/>
        </>
    )
}

export default SignUp
