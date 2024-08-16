const socket = io('http://localhost:80', {transports:['websocket']});
// Get DOM elements in respective JS variables 
const form = document.getElementById('send-container');
const messageInp = document.getElementById('messageInp');
const messageConatiner = document.querySelector(".container");
// Audio that will play on receiving messages 
var audio = new Audio('ting.mp3');
// Funtion which will append event into to the conatiner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageConatiner.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// Ask a new user for his/her name & the server know
const name = prompt("Enter Your name to join : ");
socket.emit('new-user-joined', name); 
// If a new user joins, receive his/her name from the server 
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right');
})
// If server sends a message, receive it 
socket.on('receive', data => {
    append(`${data.name} : ${data.message}`,'left')
})

// If the user leaves the chat, append the info to the container
socket.on('leave', name => {
    append(`${name}: left the chat`, 'right');
})
// If the form gets submitted, send server the message 
form.addEventListener('submit', (e) => {
    // when you will click the submit button then the server will restart so to prevent that reloading we did that -->
    e.preventDefault(); 
    const message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    // After send the message we have to clear the message box
    messageInp.value = '';
})