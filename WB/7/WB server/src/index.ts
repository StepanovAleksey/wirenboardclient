import { Driver } from './models/driverModel';
import './serialPortFacade';
import { serialBus } from './serialBus';
import { MqttWbClient } from './mqttClient';
import { IMqttWbClient } from './models/contracts';
import { SerialPortFacade } from './serialPortFacade';

const mqqtWbClient: IMqttWbClient = new MqttWbClient({
  port: 18883,
  protocol: 'ws',
  hostname: '127.0.0.1',
  //hostname: '192.168.1.106',
});
new SerialPortFacade(serialBus, {
  path: '/dev/ttyRS485-1',
  //path: 'COM3',
  baudRate: 2400,
  dataBits: 8,
  stopBits: 1,
});

[
  new Driver(1, 1, serialBus, mqqtWbClient),
  new Driver(1, 2, serialBus, mqqtWbClient),
  new Driver(1, 3, serialBus, mqqtWbClient),
  new Driver(1, 4, serialBus, mqqtWbClient),
  new Driver(1, 5, serialBus, mqqtWbClient),
  new Driver(1, 6, serialBus, mqqtWbClient),
  new Driver(1, 7, serialBus, mqqtWbClient),
  new Driver(1, 8, serialBus, mqqtWbClient),
  new Driver(1, 9, serialBus, mqqtWbClient),
  new Driver(1, 10, serialBus, mqqtWbClient),
  new Driver(1, 11, serialBus, mqqtWbClient),
  new Driver(1, 12, serialBus, mqqtWbClient),
  new Driver(1, 13, serialBus, mqqtWbClient),
  new Driver(1, 14, serialBus, mqqtWbClient),
];

console.log('севрер запустился');
