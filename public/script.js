const socket = io('/');
const myPeer = new Peer();
const videoWrap = document.getElementById('video-wrap');
const myVideo = document.createElement('video');
myVideo.muted = true;

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoWrap.append(video);
}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);
});

myPeer.on('open', userId => {
    socket.emit('join-room', ROOM_ID, userId);
});


socket.on('user-connected', userId => {
    console.log('userId=', userId);
})