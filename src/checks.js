import { patterns, TYPE_ATTRIBUTE } from './variables'

export const isOnBlacklist = (src, type) => (
    src && (!type || type !== TYPE_ATTRIBUTE) &&
    isBlacklistedSource(src, false)
)

export const isOnBlacklistKey = (src, type) => (
    src && (!type || type !== TYPE_ATTRIBUTE) &&
    isBlacklistedSource(src, true)
)

export const isBlacklistedSource = function(src, return_key) {
  const srcStart = (src === undefined || src == null ? "" : src.toString().split("?")[0]);
  let i = null;
  if (srcStart &&
  (
    // No blacklist exists or one matches
    (!patterns.blacklist || patterns.blacklist.some((pattern, index) => {
        if (pattern.test(srcStart)) {
            i = index; // Remember index in blacklist
            return true;
        } else {
            return false;
        }
    }))

    // No whitelist or all do not match
    && (!patterns.whitelist || patterns.whitelist.every(pattern => !pattern.test(srcStart)))
  )) {
      return (return_key ? i : true);
  }
  else
      return false;
}

export const willBeUnblocked = function(script) {
    const src = script.getAttribute('src')
    return (
        patterns.blacklist && patterns.blacklist.every(entry => !entry.test(src)) ||
        patterns.whitelist && patterns.whitelist.some(entry => entry.test(src))
    )
}
