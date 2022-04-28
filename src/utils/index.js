export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email) {
  return REGEX_EMAIL.test(email);
}

export function uuid() {
  return `${Date.now()}_${Math.random() * 100000}`;
}

export function delay(fn, ms) {
  setTimeout((...args) => fn(...args), ms || 300);
}
