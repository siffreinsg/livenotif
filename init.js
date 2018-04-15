var software, scope

/**
 * Make the difference between firefox or chrome and define the main scope to interact with browser's API
 */
if (typeof browser === 'object') {
    software = 'firefox'
    scope = browser
} else if (typeof chrome === 'object') {
    software = 'chrome'
    scope = chrome
}

/**
 * Object with needed properties
 * Reset at each new instance 
 */
const tmp = {
    onAir: false,
    redirectUrl: ''
}
