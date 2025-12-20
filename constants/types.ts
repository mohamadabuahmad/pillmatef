export type Dose = {
  id: string;
  medName: string;
  dose: string;
  time: string; // "HH:MM"
  enabled: boolean;
};

export type Device = {
  deviceId: string;
  ownerUid: string;
  lastSeen?: any;
};
