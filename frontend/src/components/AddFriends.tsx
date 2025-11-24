// import { useState, type FormEventHandler } from "react";
// import type { FormEvent } from "react";
// import type { Friend } from "../types/Friend";
// import "../../public/static/styles/dist/AddFriends.min.css"

// type FormInputs = {
//     name: string | FormDataEntryValue,
//     last_interaction: string | FormDataEntryValue | null,
//     last_meetup: string | FormDataEntryValue | null,
// }

// export default function AddFriends() {

//     const [formInputs, setFormInputs] = useState<FormInputs>({name: "", last_interaction: "", last_meetup: ""})

//     const handleChange: FormEventHandler = (e: FormEvent<HTMLFormElement>) => {

//         const formData = new FormData(e.currentTarget);

//         const newFormInputs:FormInputs = {
//             name: formData.get("name")!,
//             last_interaction: formData.get("last_interaction"),
//             last_meetup: formData.get("last_meetup"),
//         }  
//         setFormInputs(newFormInputs)

//     }

//     const handleSubmit: FormEventHandler = async (e: FormEvent<HTMLFormElement>) => {

//         e.preventDefault();

//         // Parse form data
//         const formData = new FormData(e.currentTarget);
//         const friend: Friend = {
//             name: formData.get("name")!,
//             last_interaction: formData.get("last_interaction"),
//             last_meetup: formData.get("last_meetup")
//         };

//         // POST
//         const response = await fetch("http://localhost:3001/friends", {
//             method: "POST",
//             body: JSON.stringify(friend)
//         })
//         console.log(`${response.status}: ${response.statusText}`)

//         // Force a re-render
//         // setFriends([])
//         setFormInputs({name:"", last_interaction:"", last_meetup:""})

//     }

//     return (
//         <form method="POST" onSubmit={handleSubmit} onChange={handleChange} id="AddFriendsForm">
//             <h2>Add a friend</h2>

//             <div className="inputAndLabel">
//                 <label htmlFor="name">Name</label>
//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="John Doe"
//                     value={formInputs.name}
//                     required>
//                 </input>
//             </div>
            
//             <div className="inputAndLabel">
//                 <label htmlFor="last_interaction">Last interaction</label>
//                 <input
//                     type="date"
//                     name="last_interaction"
//                     value={formInputs.last_interaction}
//                     >
//                 </input>
//             </div>

//             <div className="inputAndLabel">
//                 <label htmlFor="last_meetup">Last meetup</label>
//                 <input
//                     type="date"
//                     name="last_meetup"
//                     value={formInputs.last_meetup}
//                     >
//                 </input>
//             </div>

//             <input
//                 type="submit"
//                 value="Add"
//                 id="AddFriendsSubmit">
//             </input>
//         </form>
//     )
// }