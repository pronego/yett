import {backupElements, TYPE_ATTRIBUTE, features} from './variables'
import { isOnBlacklist } from './checks'

// Setup a mutation observer to track DOM insertion
export const observer = new MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i++) {
        const { addedNodes } = mutations[i];
        for(let i = 0; i < addedNodes.length; i++) {
            const node = addedNodes[i]

            // For each added script or iframe tag; nodeType=1 represents an Element node like <p> or <div>.
            if(node.nodeType === 1 && (node.tagName === 'SCRIPT' || (features.iframe && node.tagName === 'IFRAME'))) {
                const src = node.src || node.getAttribute('yett-src')
                const type = node.type

                // If the src is inside the blacklist and is not inside the whitelist
                if(isOnBlacklist(src, type)) {

                    // We backup the node
                    backupElements.blacklisted.push([node, node.type])

                   // Blocks inline script execution in Safari & Chrome
                   node.type = TYPE_ATTRIBUTE

                    // Firefox has this additional event which prevents scripts from beeing executed
                    const beforeScriptExecuteListener = function (event) {
                        // Prevent only marked scripts from executing
                        if(node.getAttribute('type') === TYPE_ATTRIBUTE)
                            event.preventDefault()
                        node.removeEventListener('beforescriptexecute', beforeScriptExecuteListener)
                    }
                    node.addEventListener('beforescriptexecute', beforeScriptExecuteListener)

                    // In case of iframe feature, add placeholder block
                    if (features.iframe && node.tagName === 'IFRAME') {
                        let iframePlaceholder = document.createElement('div')
                        iframePlaceholder.setAttribute('data-src', src)
                        // Copy styles from iframe
                        iframePlaceholder.style.cssText = document.defaultView.getComputedStyle(node, '').cssText
                        // Set background color + special styles
                        iframePlaceholder.style.backgroundColor = '#dedede'
                        iframePlaceholder.style.display = 'flex'
                        iframePlaceholder.style.alignItems = 'center'
                        iframePlaceholder.style.justifyContent = 'center'
                        iframePlaceholder.style.width = node.getAttribute('width')+'px'
                        iframePlaceholder.style.height = node.getAttribute('height')+'px'
                        iframePlaceholder.classList.add('iframe-blocked')
                        // Add text + Button
                        iframePlaceholder.innerHTML = '<p style="text-align: center">'+features.iframe_blocked_text+'<br/><button onclick="yett.unblock(\''+src+'\')>'+features.iframe_blocked_btn_unblock+'</button></p>'
                        node.parentElement && node.parentElement.insertBefore(iframePlaceholder, node)
                    }

                    // Remove the node from the DOM
                    node.parentElement && node.parentElement.removeChild(node)
                }
            }
        }
    }
})

// Starts the monitoring
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})
