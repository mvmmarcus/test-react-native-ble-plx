import buttonStream from './buttonStream';
import {encodeFromUint8Array} from './base64';
import {roll} from './spheroCommands';

export default buttonStream
  .map(str => {
    switch (str) {
      case 'LEFT':
        return [0, 1];
      case 'UP':
        return [0, 0];
      case 'RIGHT':
        return [0, 1];
      case 'DOWN':
        return [0, 1];
      case 'STOP':
        return [0, 0];
    }
  })
  .map(([speed]) => roll(speed))
  .map(encodeFromUint8Array);
