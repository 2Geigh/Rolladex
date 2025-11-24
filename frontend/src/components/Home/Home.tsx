import "./styles/dist/Home.min.css"
import Friends from "./Friends"
import Navbar from "../Navbar/Navbar"
import Meetups from "./Meetups"

const Home = () => {
    return (
        <>
            <Navbar/>

            <div className="content">
                <Friends/>
                <Meetups />
            </div>
        </>
    )
}

export default Home
