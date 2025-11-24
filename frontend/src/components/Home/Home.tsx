import "./styles/dist/Home.min.css"
import Friends from "./Friends"
import Navbar from "./Navbar"
import Meetups from "./Meetups"

const Home = () => {
    return (
        <>
            <Navbar/>
            <Friends/>
            <Meetups />
        </>
    )
}

export default Home
