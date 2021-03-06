const socketsUrl = ["wss://api.siffreinsigy.me/livenotif/websocket"];

var config = {
    software: "chrome",
    sound: 0,
    announceStreams: true,
    announceVideos: true,
    playSound: true,
    blinkingIcon: true,
    devMode: false,
    volume: 0.5,
    id: "superbrioche",
};

var sounds = [
    { name: "Par défaut (Ding)", player: new Audio("assets/sounds/ding.ogg") },
    { name: "Yamete", player: new Audio("assets/sounds/yamete.ogg") },
    { name: "Chèvre", player: new Audio("assets/sounds/chevre.mp3") },
    { name: "Cri viril", player: new Audio("assets/sounds/cri_bri.wav") }
]

var currentStream = {};
var dontBlink = false;

browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "blinkingIcon", "selectedSound", "volume", "devMode"]).then((res) => {
    config.announceStreams = res.notifStreams !== "no";
    config.announceVideos = res.notifVideos !== "no";
    config.playSound = res.playSound !== "no";
    config.blinkingIcon = res.blinkingIcon !== "no";
    config.selectedSound = parseInt("" + res.selectedSound) || 0;
    config.volume = parseInt("" + res.volume) || 0.5;
    config.devMode = res.devMode === "yes";
});

timeago.register("fr_FR", (_, i) => [
    ["depuis quelques secondes", "dans quelques secondes"],
    ["depuis %s secondes", "dans %s secondes"],
    ["depuis 1 minute", "dans 1 minute"],
    ["depuis %s minutes", "dans %s minutes"],
    ["depuis 1 heure", "dans 1 heure"],
    ["depuis %s heures", "dans %s heures"],
    ["depuis 1 jour", "dans 1 jour"],
    ["depuis %s jours", "dans %s jours"],
    ["depuis 1 semaine", "dans 1 semaine"],
    ["depuis %s semaines", "dans %s semaines"],
    ["depuis 1 mois", "dans 1 mois"],
    ["depuis %s mois", "dans %s mois"],
    ["depuis 1 an", "dans 1 an"],
    ["depuis %s ans", "dans %s ans"]
][i]);
