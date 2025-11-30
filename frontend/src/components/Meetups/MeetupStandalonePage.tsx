import { MeetupItem } from "../Home/MeetupsSection"
import Navbar from "../Navbar/Navbar"
import meetups from "../../util/meetups_sample_data"
import friends from "../../util/friends_sample_data"
import { useParams } from "react-router"
import PageNotFound from "../PageNotFound/PageNotFound"
import "./styles/dist/MeetupStandalonePage.min.css"
import Footer from "../Footer/Footer"

const MeetupStandalonePage = () => {

    const params = useParams()
    const meetupId = Number(params.meetupId)
    const meetup = meetups.find((meetup) => (meetup.id === meetupId))

    if (!meetup) {
        return(
            <PageNotFound/>
        )
    }

    return (
        <>
            <Navbar/>
            <div className="content">
                <MeetupItem meetup={meetup} friends={friends} />
            </div>
            <Footer/>
        </>
    )
}

export default MeetupStandalonePage
