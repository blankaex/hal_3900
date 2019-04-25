const bot = require('../bot');
const hal = new bot()

function sendHalResponse(msg) {
    return hal.query(msg.text)
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
    } else if (msg.type == 'training') {
        await hal.train(msg.course, msg.choice.queryId, msg.choice.index)
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
