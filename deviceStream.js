import adapterStateStream from './adapterStateStream';
import xsFromCallback from 'xstream-from-callback';
import bleManager from './bleManager';

export default adapterStateStream
  .filter(state => state === 'PoweredOn')
  .map(_ =>
    xsFromCallback(bleManager.startDeviceScan.bind(bleManager))(['1808'], null),
  )
  .flattenConcurrently()
  .fold((p, v) => ({...p, [v.id]: v}), {});
