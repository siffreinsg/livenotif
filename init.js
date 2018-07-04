var socketUrl = "ws://localhost";

var currentStream = {};

var config = {
    software: "chrome",
    sound: 0,
    announceStreams: true,
    announceVideos: true,
    playSound: true,
    volume: 0.5,
    id: "rocketbeanstv"
};

var sounds = [
    { name: "Par défaut (Ding)", player: new Audio("assets/sounds/ding.mp3") },
    { name: "Yamete", player: new Audio("assets/sounds/yamete.ogg") },
    { name: "Chèvre", player: new Audio("assets/sounds/chevre.mp3") },
    { name: "Cri viril", player: new Audio("assets/sounds/cri_bri.wav") }
]

browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "selectedSound", "volume"]).then((res) => {
    config.announceStreams = res.notifStreams !== "no";
    config.announceVideos = res.notifVideos !== "no";
    config.playSound = res.playSound !== "no";
    config.selectedSound = parseInt("" + res.selectedSound) || 0;
    config.volume = parseInt("" + res.volume) || 0.5;
});
