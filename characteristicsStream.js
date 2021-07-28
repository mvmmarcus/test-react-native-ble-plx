import selectedDeviceStream from './selectedDeviceStream';
import bleManager from './bleManager';
import xs from 'xstream';

export default selectedDeviceStream
  .mapPromised(async device => {
    console.log('vai conectar');
    bleManager.stopDeviceScan();
    return await device.connect();
  })
  .mapPromised(device => device.discoverAllServicesAndCharacteristics())
  .mapPromised(device => device.services())
  .map(services => {
    console.log('SERVICES: ', services);
    return xs.fromArray(services);
  })
  .flatten()
  .mapPromised(service => service.characteristics())
  .map(characteristics => {
    console.log('characteristics: ', characteristics);
    return xs.fromArray(characteristics);
  })
  .flatten();
