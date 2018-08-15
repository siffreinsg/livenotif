var manifest = browser.runtime.getManifest();
var currentEvent = {};
var dontBlink = false;
var connected = false;
var config = null;
var socket = null;

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
