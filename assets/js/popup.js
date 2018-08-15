const bg = browser.extension.getBackgroundPage();
const onAir = Object.keys(bg.currentEvent).length > 0;
bg.dontBlink = true;

timeago.register("fr_FR", (number, index) => {
    return [
        ["À l'instant", "dans un instant"],
        ["Depuis %s secondes", "dans %s secondes"],
        ["Depuis 1 minute", "dans 1 minute"],
        ["Depuis %s minutes", "dans %s minutes"],
        ["Depuis 1 heure", "dans 1 heure"],
        ["Depuis %s heures", "dans %s heures"],
        ["Depuis 1 jour", "dans 1 jour"],
        ["Depuis %s jours", "dans %s jours"],
        ["Depuis 1 semaine", "dans 1 semaine"],
        ["Depuis %s semaines", "dans %s semaines"],
        ["Depuis 1 mois", "dans 1 mois"],
        ["Depuis %s mois", "dans %s mois"],
        ["Depuis 1 an", "dans 1 an"],
        ["Depuis %s ans", "dans %s ans"]
    ][index];
});

let isOffline = document.getElementById("is-offline");
let isNotConnected = document.getElementById("is-not-connected");
let isOnline = document.getElementById("is-online");
let footer = document.getElementById("footer");

if (!bg.connected) {
    document.body.removeChild(isOnline);
    document.body.removeChild(isOffline);
    document.body.removeChild(footer);
} else {
    document.body.removeChild(isNotConnected);
    document.body.removeChild(onAir ? isOffline : isOnline);

    if (onAir) {
        let eventStart = timeago().format(new Date(bg.currentEvent.startedAt), "fr_FR");

        document.getElementById("title").appendChild(document.createTextNode(bg.config.displayName));
        document.getElementById("game").appendChild(document.createTextNode(bg.currentEvent.title));
        document.getElementById("since").appendChild(document.createTextNode(eventStart));
        document.getElementById("url").href = bg.currentEvent.url;
    }

    Object.keys(bg.config.socials).forEach((key) => {
        let link = bg.config.socials[key];

        if (link.length < 1) {
            let todelete = document.getElementById(key);
            todelete.parentNode.removeChild(todelete);
        } else {
            document.getElementById("a-" + key).href = link;
        }
    });

    let footerChilds = document.getElementById("footer").children;
    for (var i = 0; i < footerChilds.length; i++) {
        footerChilds[i].style.width = (width = 100.0 / footerChilds.length) + "%";
    }
}
