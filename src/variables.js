export const TYPE_ATTRIBUTE = 'javascript/blocked'
export const HIDDEN_SRC_ATTRIBUTE = 'yett-src'

export const patterns = {
    blacklist: window.YETT_BLACKLIST,
    whitelist: window.YETT_WHITELIST,
    blacklistlabels: window.YETT_BLACKLIST_LABELS || [] // labels for the blacklist elements, same order as in blacklist
}

export const features = {
    iframe: window.YETT_IFRAME,
    iframe_blocked_text: window.YETT_IFRAME_BLOCKED_TEXT || 'The following content was blocked due to your settings:',
    iframe_blocked_btn_unblock: window.YETT_IFRAME_BLOCKED_BTN || 'Unblock',
}

// Backup list containing the original blacklisted elements
export const backupElements = {
    blacklisted: []
}
