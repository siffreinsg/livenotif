const { tmp, params } = browser.extension.getBackgroundPage().getUsefulVars();

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

if (tmp.onAir) {
	let title = document.createTextNode(params.name + " est en live!");
	let game = tmp.currentStream.title;
	let time = timeago().format(new Date(tmp.currentStream.publishedAt), "fr_FR");
	let url = tmp.currentStream.url;

	document.getElementById("title").appendChild(title);
	document.getElementById("game").appendChild(document.createTextNode(game));
	document.getElementById("since").appendChild(document.createTextNode(time));
	document.getElementById("url").href = url;
}

let todelete = document.getElementById(tmp.onAir ? "is-offline" : "is-online");
todelete.parentNode.removeChild(todelete);

const socials = params.socials;
Object.keys(socials).forEach((key) => {
	let link = socials[key];

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
