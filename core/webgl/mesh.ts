import * as THREE from "three";
import vertexShader from "./shaders/vertexshader.vert";
import fragmentShader from "./shaders/fragmentshader.frag";
import Stage from "./stage";
import {GLOption} from "./element";
import {XY, GeometryParam} from "./types";

type MeshOptions = {
  isPc: boolean;
};

interface PlaneMesh extends THREE.Mesh {
  material: THREE.RawShaderMaterial;
}

export default class Mesh {
  stage: Stage;
  config: MeshOptions;
  elements: GLOption;
  meshSize: XY;
  textureSize: XY;
  geometryParam: GeometryParam;
  texture: THREE.Texture;
  windowWidth: number;
  windowHeight: number;
  windowWidthHalf: number;
  windowHeightHalf: number;
  meshWidthHalf: number;
  meshHeightHalf: number;

  mesh!: PlaneMesh;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.RawShaderMaterial;
  constructor(stage: Stage, elementOption: GLOption, config: MeshOptions) {
    this.stage = stage;

    this.config = config;

    this.elements = elementOption;
    this.meshSize = {
      x: this.elements.width,
      y: this.elements.height,
    };

    this.geometryParam = {
      width: 1,
      height: 1,
      widthSegments: 32.0,
      heightSegments: 32.0,
    };

    if (!this.elements.img) throw Error("no image");

    this.texture = new THREE.TextureLoader().load(this.elements.img);

    if (this.config.isPc) {
      this.textureSize = {x: 220, y: 300};
    } else {
      this.textureSize = {x: 176, y: 264};
    }

    this.windowWidth = 0;
    this.windowHeight = 0;

    this.windowWidthHalf = 0;
    this.windowHeightHalf = 0;

    this.meshWidthHalf = 0;
    this.meshHeightHalf = 0;
  }

  init() {
    this._setWindowSize();
    this._setMesh();
    this._setMeshScale();
    this._setMeshPosition();
  }

  _setWindowSize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.windowWidthHalf = this.windowWidth * 0.5;
    this.windowHeightHalf = this.windowHeight * 0.5;
  }

  _setMesh() {
    this.geometry = new THREE.PlaneGeometry(
      this.geometryParam.width,
      this.geometryParam.height,
      this.geometryParam.widthSegments,
      this.geometryParam.heightSegments
    );
    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        u_texture: {
          type: "t",
          value: this.texture,
        },
        u_meshsize: {
          type: "v2",
          value: this.meshSize,
        },
        u_texturesize: {
          type: "v2",
          value: this.textureSize,
        },
        u_resolution: {
          type: "v2",
          value: {x: window.innerWidth, y: window.innerHeight},
        },
        u_strength: {
          type: "v2",
          value: {x: 0, y: 0},
        },
        u_alpha: {
          type: "f",
          value: 0,
        },
      } as Record<string, THREE.IUniform>,
      transparent: true,
    });
    this.mesh = new THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>(this.geometry, this.material);

    this.stage.scene.add(this.mesh);
  }

  _setMeshScale() {
    this.mesh.scale.x = this.elements.width;
    this.mesh.scale.y = this.elements.height;

    (this.mesh.material as THREE.RawShaderMaterial).uniforms.u_meshsize.value.x = this.mesh.scale.x;
    this.mesh.material.uniforms.u_meshsize.value.y = this.mesh.scale.y;

    this.meshWidthHalf = this.mesh.scale.x * 0.5;
    this.meshHeightHalf = this.mesh.scale.y * 0.5;
  }

  _setMeshPosition() {
    this.mesh.position.y = this.windowHeightHalf - this.meshHeightHalf - this.elements.top;
    this.mesh.position.x = -this.windowWidthHalf + this.meshWidthHalf + this.elements.left;
  }

  _setStrength(x: number, y: number) {
    this.mesh.material.uniforms.u_strength.value.x = x;
    this.mesh.material.uniforms.u_strength.value.y = y;
  }

  _setRotate(rotate: number) {
    this.mesh.rotation.z = rotate;
  }

  _destroy() {
    this.stage.scene.remove(this.mesh);
    this.texture.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }

  onResize() {
    this._setWindowSize();
  }

  _render() {
    if (this.mesh) {
      this._setMeshScale();
      this._setMeshPosition();
    }
  }

  onRaf() {
    this._render();
  }
}
