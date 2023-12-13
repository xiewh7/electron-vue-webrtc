const EventEmitter = require('events')
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')
const remote = window.require('@electron/remote')

const {desktopCapturer} = remote
const pc = new window.RTCPeerConnection({})
let dc = pc.createDataChannel('robotchannel', {reliable: false});
console.log('before-opened', dc)
dc.onopen = function() {
    console.log('opened')
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({type, data}))
    })
}
dc.onmessage = function(event) {
    console.log('message', event)
}
dc.onerror = (e) => {console.log(e)}

async function createOffer() {
    let offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    console.log('create-offer\n', JSON.stringify(pc.localDescription))
    return pc.localDescription
}

createOffer().then((offer) => {
    console.log('forward', 'offer', offer)
    ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})


ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer).catch(e => {
    console.log("-> 设置错误e", e);
    })
})

ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(JSON.parse(candidate))
})


async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
    console.log('create-answer', pc)
}

pc.onicecandidate = (e) => {
    if (e.candidate) {
        console.log('candidate', JSON.stringify(e.candidate))
        ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
        // 告知其他人
    }
}
let candidates = []

async function addIceCandidate(candidate) {
    if (!candidate) return
    candidates.push(candidate)
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
            await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
        candidates = []
    }
}


pc.onaddstream = (e) => {
    console.log('addstream', e)
    peer.emit('add-stream', e.stream)
}


module.exports = peer
