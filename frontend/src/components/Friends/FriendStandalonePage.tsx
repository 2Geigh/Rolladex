import { useParams } from "react-router"
import Navbar from "../Navbar/Navbar"
import friends from "../../util/friends_sample_data"
import type { Friend } from "../../types/friend"
import "./styles/dist/FriendStandalonePage.min.css"
import PageNotFound from "../PageNotFound/PageNotFound"

type FriendCardProps = {
    id: number | string;
    name: string;
    profile_image_path: string;
}
const FriendCard: React.FC<FriendCardProps> = ( { id, name, profile_image_path } ) => {
    return (
                <div className="friendCard" id={String(id)}>

                    <h1 className="name" >{name}</h1>
                    
                    <img src={profile_image_path} alt={name} className="pfp" />
                    
                    <button className="deleteFriend" >Delete friend</button>

                </div>
    )
}

const FriendStandalonePage = () => {

    const params = useParams()
    const friendId: number = Number(params.friendId)
    const friend = friends.find(friend => friend.id === friendId)

    if (!friend) {
        return (
        <>
            <PageNotFound/>
        </>
        )
    }

    const name = String(friend.name)
    const profile_image_path = String(friend.profile_image_path)

    return (
        <>
            <Navbar/>

            <div className="content">
                <FriendCard id={friendId} name={name} profile_image_path={profile_image_path}/>
            </div>
        </>
    )
}

export default FriendStandalonePage
