export type CameraParam = {
  fov: number;
  near: number;
  far: number;
  x: number;
  y: number;
  z: number;
  lookAt: THREE.Vector3;
};

export type GeometryParam = {
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;
};

export type RenderParam = {
  width: number;
  height: number;
};

export type XY = {
  x: number;
  y: number;
};

export type PositionXY = {
  start: number;
  end: number;
  distance: number;
  allDistance: number;
  target: number;
  current: number;
  lerp: number;
  direction: string;
};

export type Media = {
  elm: HTMLElement;
  extra: XY;
};

export type OpenningOffset = {
  value: number;
  end: number;
};

export type Key = {
  strength: number;
} & XY;
