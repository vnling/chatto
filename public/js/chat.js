const socket = io()

// creating ids to track html elements by
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button") //will we need these later hopefully not
const $messages = document.querySelector("#messages")
const $sidebar = document.querySelector("#sidebar")

// getting html of message template
const messageTemplate = document.querySelector("#message-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//parsing query string we got from index
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    // New message element, grabs most recent message
    const $newMessage = $messages.lastElementChild
    // Height of the new message
    const newMessageHeight = 76
    // Visible height
    const visibleHeight = $messages.offsetHeight
    // Height of messages container
    const containerHeight = $messages.scrollHeight
    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    // console.log(message)
    // renders message to webpage, sends text and timestamp to html 
    const html = Mustache.render(messageTemplate, {
        text: message.text, 
        sentAt: moment(message.sentAt).format('h:mm a'),   
        username: message.username,
    })
    // messages get printed inside the div but right 'before' the 'end'
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users,
    })
    $sidebar.innerHTML =  html
})

// listens for form submission (i.e. message send)
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // create message const
    const message = e.target.elements.message.value
    //clears form after submission
    $messageForm.reset()
    // event acknowledgment setup for server, provides the message and callback function
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})