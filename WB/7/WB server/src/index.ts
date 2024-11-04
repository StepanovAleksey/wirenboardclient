import { Driver } from './models/Driver.model';
import './serialPortFacade';
import { serialBus } from './serialBus';
import { MqttWbClient } from './mqttClient';
import { IMqttWbClient } from './models/contracts';
import { SerialPortFacade } from './serialPortFacade';
import { ByteLengthParser, DelimiterParser } from 'serialport';
import { EDeviceDelimiterSerial } from './models/model';

const mqqtWbClient: IMqttWbClient = new MqttWbClient({
  port: 18883,
  protocol: 'ws',
  hostname: '127.0.0.1',
  //hostname: '192.168.1.106',
  //hostname: '10.147.17.184', // 6ка
});

new SerialPortFacade(
  serialBus,
  {
    path: '/dev/ttyRS485-1',
    //path: 'COM4',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
  },
  new DelimiterParser({ delimiter: Buffer.from([0xff]) }),
  EDeviceDelimiterSerial.delimiterParser,
);

new SerialPortFacade(
  serialBus,
  {
    path: '/dev/ttyRS485-2',
    //path: 'COM4',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
  },
  new ByteLengthParser({ length: 10 }),
  EDeviceDelimiterSerial.byteLengthParser,
);

[
  new Driver(1, 1, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 2, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 3, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 4, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 5, serialBus, mqqtWbClient, EDeviceDelimiterSerial.byteLengthParser),
  new Driver(1, 6, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 7, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 8, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 9, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 10, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 11, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 12, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 13, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
  new Driver(1, 14, serialBus, mqqtWbClient, EDeviceDelimiterSerial.delimiterParser),
];

console.log('севрер запустился');
