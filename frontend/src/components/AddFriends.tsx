import type { FormEventHandler } from "react";
import type { FormEvent } from "react";

export default function AddFriends() {

    type Friend = {
        name: string | FormDataEntryValue;
        last_interaction?: string | FormDataEntryValue | null;
        last_meetup?: string | FormDataEntryValue | null;
    }

    const handleSubmit: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        
        const name = formData.get("name")
        const last_interaction = formData.get("last_interaction")
        const last_meetup = formData.get("last_meetup")

        const friendData: Friend = {
            name: name!,
            last_interaction: last_interaction,
            last_meetup: last_meetup
        };

        console.log(friendData)

    }

    return (
        <form method="POST" onSubmit={handleSubmit}>
            <h2>Add a friend</h2>

            <label htmlFor="name">Name</label>:
            <input
                type="text"
                name="name"
                placeholder="John Doe"
                required>
            </input>

            <label htmlFor="last_interaction">Last interaction</label>:
            <input
                type="date"
                name="last_interaction">
            </input>

            <label htmlFor="last_meetup">Last meetup</label>: 
            <input
                type="date"
                name="last_meetup">
            </input>

            <input
                type="submit"
                value="Add">
            </input>
        </form>
    )
}