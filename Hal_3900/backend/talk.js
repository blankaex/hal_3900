const bot = require('./bot');
const hal = new bot()

function sendHalResponse(msg) {
    hal.query(msg.text)
        .then(r=>JSON.stringify({
            type: 'message',
            error: false,
            data: r
        }))
}

async function respond(ws, msg) {
    msg = JSON.parse(msg)
    if (msg.type === 'message') {
        ws.send(await sendHalResponse(msg))
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        error: true,
        msg: 'Unknown Message Type'
      }))
    }
}

module.exports = function talkSocket(ws) {
    ws.on('message', msg => respond(ws, msg))
}