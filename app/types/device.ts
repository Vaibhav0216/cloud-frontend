export type DeviceStatus = 'online' | 'offline' | 'warning';
export type DeviceType = 'pump' | 'sensor' | 'valve';

export interface BaseDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  lastSeen: string;
  battery?: number;
  canControl: boolean;
  isOn?: boolean;
}

export interface PumpDevice extends BaseDevice {
  type: 'pump';
  readings: {
    pressure: number;
    flow: number;
    temperature?: never;
  };
}

export interface SensorDevice extends BaseDevice {
  type: 'sensor';
  readings?: {
    temperature: number;
    pressure?: never;
    flow?: never;
  };
}

export interface ValveDevice extends BaseDevice {
  type: 'valve';
  readings: {
    pressure: number;
    temperature?: never;
    flow?: never;
  };
}

export type Device = PumpDevice | SensorDevice | ValveDevice;
