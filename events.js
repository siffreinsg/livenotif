browser.runtime.onInstalled.addListener(details => {
    let title = `${config.id[0].toUpperCase() + config.id.substring(1)} - LiveNotif`;
    let message = "";

    switch (details.reason) {
        case "update":
            if (config.software === "firefox") {
                message = "Addon mis à jour !\nDécouvrez les nouveautés et fonctionnalités en cliquant sur la notification.";
                break;
            }
            message = "Addon à jour: découvrez les nouveautés en cliquant sur la notification.";
            break;
        case "install":
            if (config.software === "firefox") {
                message = "Addon installé avec succès !\nDécouvrez ses fonctionnalités et son fonctionnement en cliquant sur la notification.";
                break;
            }
            message = "Addon installé: découvrez les fonctionnalités en cliquant sur la notification.";
            break;
    }

    browser.storage.local.get("silentReload").then((res) => {
        if (res.silentReload !== "yes") {
            sendNotif("custom", "https://github.com/siffreinsg/livenotif/releases/latest", message, title);
        } else {
            browser.storage.local.set({ silentReload: "no" });
        }
    });
});
