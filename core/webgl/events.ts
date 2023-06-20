import {PerspectiveCamera, Raycaster, Vector2} from "three";

export class Events {
  raycaster: THREE.Raycaster;
  camera: THREE.PerspectiveCamera;
  constructor(camera: THREE.PerspectiveCamera) {
    this.raycaster = new Raycaster();
    this.camera = camera;
  }
  onMouseDown(x: number, y: number) {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera);
  }
}
