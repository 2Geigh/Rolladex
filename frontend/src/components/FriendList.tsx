export default function FriendList() {

    // Get list of friends
    const friends = ["Huey", "Louis", "Bluey"];
    
    // Render friends list into UI elements
    const friendElements = friends.map((item, index) => (
        <li className="friend" id={JSON.stringify(index)} key={index}>
            <span className="name">{item}</span>
            <button>Delete</button>
        </li>
    ))

    return (
        <>
            <h2>Friends:</h2>
            <div className="friendList">
                <ul>{friendElements}</ul>
            </div>
        </>
    )
}