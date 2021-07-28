import characteristicsStream from './characteristicsStream';
import xsFromCallback from 'xstream-from-callback';
import {decodeToUint8Array} from './base64';
import delay from 'xstream/extra/delay';

export default characteristicsStream
  .filter(({uuid}) => uuid === '00002a18-0000-1000-8000-00805f9b34fb')
  .compose(delay(100))
  .map(characteristic =>
    xsFromCallback(characteristic.monitor.bind(characteristic))(),
  )
  .flattenConcurrently()
  .map(characteristic => characteristic.value)
  .map(decodeToUint8Array)
  .map(binary => {
    if (binary.length < 5) {
      return {};
    }

    console.log('recebeu a notificação');

    const dataView = new DataView(binary.buffer);
    const dataLength = dataView.getUint8(4);
    const data = binary.slice(5, 5 + dataLength);
    console.log({dataView, dataLength, data});

    return {
      async: dataView.getUint8(1) !== 0xff,
      idCode: dataView.getUint8(2),
      dataLength,
      data,
    };
  })
  .filter(
    ({async, dataLength, idCode}) => async && dataLength > 0 && idCode === 7,
  )
  .filter(({idCode}) => idCode === 7);
