browser.runtime.onInstalled.addListener(details => {
    let name = config.id[0].toUpperCase() + config.id.substring(1);
    let title = `${name} - LiveNotif`;
    let message = "";

    switch (details.reason) {
        case "update":
            if (config.software === "firefox") {
                message = "Addon mis à jour ! Profitez-en bien :)\n\nDécouvrez les nouveautés et fonctionnalités en cliquant sur la notification.";
                break;
            }
            message = "Addon à jour: découvrez les nouveautés en cliquant sur la notification.";
            break;
        case "install":
            if (config.software === "firefox") {
                message = `Installation de l'addon terminée avec succès!\nVous recevrez désormais des notifications lors que ${name} sera en stream ou sort une vidéo.`;
                break;
            }
            message = "Addon installé: découvrez les fonctionnalités en cliquant sur la notification.";
            break;
    }

    browser.storage.local.get("silentReload").then((res) => {
        if (res.silentReload !== "yes") {
            sendNotif({ event: "custom", url: "https://github.com/siffreinsg/livenotif/releases/latest", title, eventDesc: message });
        } else {
            browser.storage.local.set({ silentReload: "no" });
        }
    });
});
