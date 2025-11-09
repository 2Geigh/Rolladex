export default function AddFriends() {
    return (
        <form>
            <h2>Add a friend</h2>
            <label htmlFor="name">Name</label>: <input type="text" name="name"></input>
            <label htmlFor="last_interaction">Last interaction</label>: <input type="date"></input>
            <label htmlFor="last_meetup">Last meetup</label>: <input type="date"></input>
            <input type="submit" value="Add"></input>
        </form>
    )
}