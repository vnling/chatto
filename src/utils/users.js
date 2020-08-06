//replace with API/db functionality later on

const users = [] //db

//create
const addUser = ({id, username, room}) => { 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //if either username or room are empty strings, return error
    if (!username || !room) {
        return {
            error: 'A username and room are required.'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate user
    if (existingUser) {
        return {
            error: 'Username is already taken'
        }
    }

    //create user if all checks passed
    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => { //delete
    // find index of user we're ttrying to delete
    const index = users.findIndex((user) => {
        return user.id === id
    })

    // if this user exists, delete from array
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

    // otherwise user does not exist, return error
    // return { //stupid fucken course
    //     error: 'This user does not exist.'
    // }
}

// gets a single user given an ID 
const getUser = (id) => { //read
    const userToGet = users.find((user) => {
        return user.id === id
    })

    // if there is no such user return error
    if (!userToGet) {
        return {
            error: 'That user does not exist'
        }
    }

    //else user exists, return the user
    return userToGet
}

const getUsersInRoom = (room) => { //read
    //filter out users who are in that room
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser, 
    removeUser, 
    getUser, 
    getUsersInRoom,
}