/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import useStream from './useStream';
import adapterStateStream from './adapterStateStream';
import deviceStream from './deviceStream';
import selectedDeviceStream from './selectedDeviceStream';
import buttonStream from './buttonStream';
import collisionStream from './collisionStream';
import characteristicsStream from './characteristicsStream';
import xs from 'xstream';
import {configureCollisions} from './spheroCommands';
import {encodeFromUint8Array} from './base64';
import commandStream from './commandStream';
import {Buffer as buffer} from 'buffer';

import bleManager from './bleManager';

const App = () => {
  const adapterState = useStream(adapterStateStream, '');
  const devices = useStream(deviceStream, {});
  const collisions = useStream(collisionStream, false);

  const sendStream = characteristicsStream.filter(
    ({uuid}) => uuid === '00002a52-0000-1000-8000-00805f9b34fb',
  );

  useEffect(() => {
    console.log(buffer.from('0x0101').toString('base64'));
  }, []);

  // xs.combine(sendStream).addListener({
  //   next: async ([send]) => {
  //     const command = configureCollisions({
  //       meth: 0x01,
  //       xt: 0x01,
  //       xs: 0x01,
  //       yt: 0x01,
  //       ys: 0x01,
  //       dead: 0x01,
  //     });
  //     await send
  //       .writeWithResponse(encodeFromUint8Array(command))
  //       .catch(console.error);
  //   },
  // });

  // xs.combine(sendStream, commandStream).addListener({
  //   next: ([send, command]) =>
  //     send.writeWithResponse(command).catch(console.error),
  // });

  // collisionStream.addListener({next: console.log, error: console.error});

  const handleWrite = async (
    deviceId,
    serviceUUID,
    characteristicUUID,
    valueBse64,
  ) => {
    const response = await bleManager.writeCharacteristicWithResponseForDevice(
      deviceId,
      serviceUUID,
      characteristicUUID,
      valueBse64,
    );
    console.log('response: ', response);
  };

  return (
    <View>
      <Text>Adapter State: {adapterState}</Text>

      <FlatList
        data={Object.values(devices).slice(0, 3)}
        renderItem={({item}) => (
          <Button
            title={item.name || item.id}
            onPress={() => selectedDeviceStream.shamefullySendNext(item)}
          />
        )}
        keyExtractor={device => device.id}
      />

      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('UP')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>↑</Text>
      </TouchableWithoutFeedback>
      <View style={styles.row}>
        <TouchableWithoutFeedback
          onPressIn={() => buttonStream.shamefullySendNext('LEFT')}
          onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
          <Text style={styles.buttonHalf}>←</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPressIn={() => buttonStream.shamefullySendNext('RIGHT')}
          onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
          <Text style={styles.buttonHalf}>→</Text>
        </TouchableWithoutFeedback>
      </View>
      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('DOWN')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>↓</Text>
      </TouchableWithoutFeedback>
      <Button
        onPress={() =>
          handleWrite(
            '78:04:73:C7:55:7D',
            '00001808-0000-1000-8000-00805f9b34fb',
            '00002a52-0000-1000-8000-00805f9b34fb',
            '0x010w==',
          )
        }
        title={'WRite'}
      />

      {collisions && <Text style={styles.collision}>💥</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  collision: {
    fontSize: 100,
    textAlign: 'center',
  },
  button: {
    fontSize: 70,
    width: '100%',
    textAlign: 'center',
  },
  buttonHalf: {
    fontSize: 70,
    width: '50%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default App;
