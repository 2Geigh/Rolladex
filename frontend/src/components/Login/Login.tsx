import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Login.min.css"

const Login = () => {

    // const onSubmit: FormEventHandler = (/*e: React.FormEvent<Element>*/) => {
        // alert("Form submitted!")
    // }

    return (
        <>
            <NavbarWithoutLinks/>
            <div className="container">
                <form id="loginForm" method="POST" action="/login">
                    <label htmlFor="username">
                        Username <input required name="username" type="text"></input>
                    </label>
                    
                    <label htmlFor="password">
                        Password <input required name="password" type="password"></input>
                    </label> 
                    
                    <input id="loginButton" type="submit" value="Login"></input>
                </form>
            </div>
            <Footer/>
        </>
    )
}

export default Login
