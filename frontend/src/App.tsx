import AddFriends from './components/AddFriends'
import FriendList from './components/FriendList'
import type { Friend } from './types/friend'
import { useState } from 'react'

function App() {

  const [friends, setFriends] = useState<Array<Friend>>([])

  async function fetchFriends() {
    const api_url = "http://localhost:3001/friends"
    try {
        const response = await fetch(api_url, {
            method: "GET"
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Unmarshall data
        const friends = await response.json()
        setFriends(friends)

    } catch (error) {
        console.error(`Error: ${error}`)
    }

  }

  return (
    <>
      <h1>MyFriends</h1>

      <AddFriends
        friends={friends}
        setFriends={setFriends}
        fetchFriends={fetchFriends}
      />

      <FriendList
        friends={friends}
        fetchFriends={fetchFriends}
      />
    </>
  )
}

export default App
