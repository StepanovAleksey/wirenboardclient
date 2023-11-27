import { Driver } from './models/driverModel';
import './serial';
import { serialBus } from './serialBus';
import { MqttWbClient } from './mqttClient';
import { IMqttWbClient } from './models/contracts';

const mqqtWbClient: IMqttWbClient = new MqttWbClient();

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
