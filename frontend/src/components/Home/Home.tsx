import "./styles/dist/Home.min.css"
import Navbar from "../Navbar/Navbar"
import FriendsSection from "./FriendsSection"
import { MeetupsSection } from "./MeetupsSection"
import Footer from "../Footer/Footer"

const Home = () => {
    return (
        <>
            <Navbar/>

            <div className="content">
                <FriendsSection/>
                <MeetupsSection />
            </div>

            <Footer/>
        </>
    )
}

export default Home
