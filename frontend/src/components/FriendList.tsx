import { useEffect } from "react";
import type { Friend } from "../types/friend";

type FriendListProps = {
    friends: Friend[],
    fetchFriends: () => Promise<void>
};


export default function FriendList({ friends, fetchFriends }: FriendListProps) {

    useEffect(() => { fetchFriends() }, []) // Empty dependency array makes the effect run when the component mounts
    
    // Render friends list into UI elements 
    const friendElements = friends.map((item: Friend, index: number) => {
        return(

            <li className="friend" id={JSON.stringify(index)} key={index}>
                <span className="name">{JSON.stringify(item.name)}</span>
                <button>Delete</button>
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