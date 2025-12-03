import Footer from "../Footer/Footer"
import NavbarWithoutLinks from "../Navbar/NavbarWithoutLinks"
import "./dist/Signup.min.css"

const SignUp = () => {

    // const onSubmit: FormEventHandler = (/*e: React.FormEvent<Element>*/) => {
        // alert("Form submitted!")
    // }

    return (
        <>
            <NavbarWithoutLinks/>
            
            {/* <div className="content"> */}
                <div className="container">
                    <form id="signupForm" method="POST" action="/signup">
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
