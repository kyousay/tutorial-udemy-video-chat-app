const socket = io('/');
const myPeer = new Peer();
const videoWrap = document.getElementById('video-wrap');
const myVideo = document.createElement('video');
myVideo.muted = true;

const peers = {};

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoWrap.append(video);
}

const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
        video.remove();
    });
    peers[userId] = call;
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
        const userId = call.peer;
        peers[userId] = call;
    });
    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    });
});

socket.on("user-disconnected", (userId) => {
    console.log("userId=", userId);
    if(peers[userId]) peers[userId].close();
});

myPeer.on('open', userId => {
    socket.emit('join-room', ROOM_ID, userId);
});

