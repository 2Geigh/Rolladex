import { MeetupsSection } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"

const Meetups = () => {
    return (
        <>
            <Navbar/>
            <div className="content">
                <MeetupsSection/>
            </div>
        </>
    )
}

export default Meetups
