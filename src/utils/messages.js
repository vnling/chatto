//generates a message object with text and timestamp values
const generateMessage = (username, text) => {
    return {  
        username,  
        text, 
        sentAt: new Date().getTime(),
    }
}

module.exports = {
    generateMessage
}