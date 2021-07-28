import {btoa, atob} from 'abab';

export function encodeFromUint8Array(arr) {
  console.log('enconde str: ', arr);
  return btoa(String.fromCharCode(...Array.from(arr)));
}
export function decodeToUint8Array(str) {
  console.log('str: ', str);

  return Uint8Array.from(
    atob(str)
      .split('')
      .map(s => s.charCodeAt(0)),
  );
}
