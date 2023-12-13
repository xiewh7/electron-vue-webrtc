import WebSocket from 'ws'
const EventEmitter = require('events');
const signal = new EventEmitter();

const SERVER_IP = 'ws://localhost'
const PORT = '8010'
const ws = new WebSocket(SERVER_IP + ':' + PORT);

ws.on('open', function open() {
    console.log('connect success')
})

ws.on('message', function incoming(message) {
    const data = JSON.parse(message)
    signal.emit(data.event, data.data)
})


function send(event, data) {
    console.log('sended', JSON.stringify({event, data}))
    ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, answerEvent) {
    return new Promise((resolve, reject) => {
        send(event, data)
        signal.once(answerEvent, resolve)
        setTimeout(() => {
            reject(new Error('timeout'))
        }, 5000)
    })
}
signal.send = send
signal.invoke = invoke

export default signal
