export const pushOrUpdateArray = (arr, obj) => {
  const index = arr.findIndex((e) => e.id === obj.id);
  if (index === -1) {
    arr.push(obj);
  } else {
    arr[index] = obj;
  }
}

// Relative time - https://github.com/yairEO/relative-time
// in miliseconds
const UNITS = {
  year  : 24 * 60 * 60 * 1000 * 365,
  month : 24 * 60 * 60 * 1000 * 365/12,
  day   : 24 * 60 * 60 * 1000 * 2,
  hour  : 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export const timeAgo = (date, { cutoff = UNITS.year, nullIfCutoff = false } = {}) => {
  const d1 = new Date(date);
  const d2 = new Date();
  const elapsed = d1 - d2;

  if (Math.abs(elapsed) > cutoff) {
    if (nullIfCutoff) return null;
    return d1.toLocaleDateString();
  }
  // "Math.abs" accounts for both "past" & "future" scenarios
  for (let u in UNITS)
    if (Math.abs(elapsed) > UNITS[u] || u == 'second') 
      return rtf.format(Math.round(elapsed/UNITS[u]), u)
}

export const extractError = (error) => {
  const { code } = error.result?.error || {};
  const { reason, domain, message } = error.result?.error?.errors?.[0] || {};
  return {
    code,
    domain,
    reason,
    message,
  };
}

export const isSafari = () => navigator.userAgent.indexOf('Chrome') > -1 ? false : navigator.userAgent.indexOf('Safari') > -1;
