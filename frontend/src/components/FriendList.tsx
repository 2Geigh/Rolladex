import { useEffect } from "react";
import type { Friend } from "../types/friend";

import "../../public/static/styles/dist/FriendList.min.css"

type FriendListProps = {
    friends: Friend[],
    fetchFriends: () => Promise<void>
};


export default function FriendList({ friends, fetchFriends }: FriendListProps) {

    useEffect(() => { fetchFriends() }, []) // Empty dependency array makes the effect run when the component mounts
    
    // Render friends list into UI elements 
    const friendElements = friends.map((item: Friend, index: number) => {
        return(

            <li className="friendListItem" id={String(index)} key={index}>
                <span className="name">{String(item.name)}</span>
                <span className="friendLastInteraction">Last interaction: {String(item.last_interaction)}</span>
                <span className="friendLastMeetup">Last meetup: {String(item.last_meetup)}</span>
                <button>Delete friend</button>
            </li>

    )})

    return (
        <>
            <h2>Friends:</h2>
            <div className="friendList">
                <ul>{friendElements}</ul>
            </div>
        </>
    )
}