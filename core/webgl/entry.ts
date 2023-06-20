import gsap from "gsap";

import Mesh from "./mesh";
import GlElements from "./element";
import Stage from "./stage";

import {Media, OpenningOffset, PositionXY, XY, Key} from "./types";

export class Entry<T extends HTMLElement, C extends HTMLElement, I extends HTMLElement[]> {
  deviceRatioLerp: number;
  deviceRatioMove: number;
  isOpenningEnd: boolean;
  isDown: boolean;
  wrapperRect: DOMRect;
  medias: Media[];
  opOffset: OpenningOffset;
  x: PositionXY;
  y: PositionXY;
  key: Key;
  save: XY;
  wheel: XY;
  extra: XY;
  scrollCurrent: XY;
  width: number;
  stage!: Stage;
  glElements!: GlElements;
  meshArray!: Mesh[];
  raf: GSAPCallback | null;

  canvas: C;
  wrapper: T;
  constructor({wrapper, canvas, items}: {wrapper: T; canvas: C; items: I}) {
    this.deviceRatioLerp = 1.0;
    this.deviceRatioMove = 1.0;
    this.wrapper = wrapper;
    this.canvas = canvas;
    this.wrapperRect = this.wrapper.getBoundingClientRect();
    this.raf = null;

    this.medias = [];

    for (let i = 0; i < items.length; i++) {
      const media: Media = {
        elm: items[i],
        extra: {x: 0, y: 0},
      };
      this.medias.push(media);
    }
    this.isOpenningEnd = false;
    this.opOffset = {value: this.wrapperRect.height * 1.2, end: this.wrapperRect.height};
    this.isDown = false;
    this.x = {
      start: 0,
      end: 0,
      distance: 0,
      allDistance: 0,
      target: 0,
      current: 0,
      lerp: 0.075 / this.deviceRatioLerp,
      direction: "",
    };
    this.y = {
      start: 0,
      end: 0,
      distance: 0,
      allDistance: 0,
      target: -this.opOffset.value,
      current: 0,
      lerp: 0.075 / this.deviceRatioLerp,
      direction: "",
    };
    this.scrollCurrent = {x: 0, y: 0};
    this.save = {x: 0, y: 0};
    this.wheel = {x: 0, y: this.opOffset.end};
    this.key = {x: 0, y: 0, strength: 0};
    this.extra = {x: 0, y: 0};
    this.width = window.innerWidth;

    this.setWrapPosition();
    this.createMesh();

    this.raf = gsap.ticker.add(this.updatePosition.bind(this));
    this.onOpening();
  }

  createMesh() {
    // const canvas = document.querySelector<HTMLCanvasElement>("#ArchiveCanvas");
    // if (!canvas) return "do smth";
    this.stage = new Stage(this.canvas);
    this.stage.init();
    this.meshArray = [];
    const items = this.medias.map((media) => media.elm);
    this.glElements = new GlElements(items);
    this.glElements.init();
    this.glElements.optionList.forEach((item, i) => {
      this.meshArray[i] = new Mesh(this.stage, item, {isPc: true});
      this.meshArray[i].init();
    });
  }

  setWrapPosition() {
    this.wrapperRect = this.wrapper.getBoundingClientRect();
    const x = window.innerWidth / 2.0 - this.wrapperRect.width / 2.0;
    const y = window.innerHeight / 2.0 - this.wrapperRect.height / 2.0;
    gsap.set(this.wrapper, {
      x: x,
      y: y,
    });
  }

  updatePosition() {
    this.x.current = gsap.utils.interpolate(this.x.current, this.x.target, this.x.lerp);
    this.y.current = gsap.utils.interpolate(this.y.current, this.y.target, this.y.lerp);
    if (this.save.x < this.x.current) {
      this.x.direction = "right";
    } else if (this.save.x > this.x.current) {
      this.x.direction = "left";
    }
    if (this.save.y < this.y.current) {
      this.y.direction = "bottom";
    } else if (this.save.y > this.y.current) {
      this.y.direction = "top";
    }
    this.save.x = this.x.current;
    this.save.y = this.y.current;
    for (let i = 0; i < this.medias.length; i++) {
      if (this.isOpenningEnd) {
        const rect = this.medias[i].elm.getBoundingClientRect();
        if (this.x.direction === "right" && rect.left < -rect.width) {
          this.medias[i].extra.x += this.wrapperRect.width;
        } else if (this.x.direction === "left" && window.innerWidth < rect.left) {
          this.medias[i].extra.x -= this.wrapperRect.width;
        }
        if (this.y.direction === "top" && window.innerHeight < rect.top) {
          this.medias[i].extra.y -= this.wrapperRect.height;
        } else if (this.y.direction === "bottom" && rect.top < -rect.height) {
          this.medias[i].extra.y += this.wrapperRect.height;
        }
      }
      this.medias[i].elm.style.transform = `translate(${-this.x.current + this.medias[i].extra.x}px, ${
        -this.y.current + this.medias[i].extra.y + this.opOffset.value
      }px)`;
    }
    // webgl
    this.stage.onRaf();
    this.glElements.onResize();
    for (let i = 0; i < this.medias.length; i++) {
      const strengthX = ((this.x.current - this.x.target) / window.innerWidth) * 1.8;
      const strengthY = ((this.y.current - this.y.target) / window.innerWidth) * 1.8;
      const rotateValue = strengthX / 4.0;
      this.meshArray[i]._setStrength(strengthX, strengthY);
      this.meshArray[i]._setRotate(rotateValue);
      this.meshArray[i].onRaf();
    }
  }

  //fix later
  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.x.start = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    this.y.start = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    this.scrollCurrent.x = this.save.x;
    this.scrollCurrent.y = this.save.y;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    this.wrapper.style.pointerEvents = "none";
    const x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    this.x.end = x;
    this.y.end = y;
    this.x.distance = (this.x.start - this.x.end) * this.deviceRatioMove;
    this.y.distance = (this.y.start - this.y.end) * this.deviceRatioMove;
    this.x.target = this.x.distance + this.scrollCurrent.x;
    this.y.target = this.y.distance + this.scrollCurrent.y;
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    this.isDown = false;

    this.wrapper.style.pointerEvents = "auto";
    const x = e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX;
    const y = e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY;
    this.x.end = x;
    this.y.end = y;
    this.x.distance = (this.x.start - this.x.end) * this.deviceRatioMove;
    this.y.distance = (this.y.start - this.y.end) * this.deviceRatioMove;
    this.x.allDistance += this.x.distance;
    this.y.allDistance += this.y.distance;
    this.x.target = this.x.distance + this.scrollCurrent.x;
    this.y.target = this.y.distance + this.scrollCurrent.y;
  }

  onMouseWheel(e: WheelEvent) {
    this.wheel.x += e.deltaX;
    this.wheel.y += e.deltaY;
    this.x.target = this.wheel.x + this.key.x + this.x.allDistance;
    this.y.target = this.wheel.y + this.key.y + this.y.allDistance;
  }

  onOpening() {
    gsap.to(this.opOffset, {
      duration: 1 + 0.8,
      value: -this.opOffset.end,
      onUpdate: () => {
        this.y.target = -this.opOffset.value;
        if (this.y.target > 0) this.isOpenningEnd = true;
      },
      onComplete: () => {
        window.addEventListener("resize", this.setWrapPosition.bind(this));
        window.addEventListener("mousedown", this.onTouchDown.bind(this));
        window.addEventListener("mousemove", this.onTouchMove.bind(this));
        window.addEventListener("mouseup", this.onTouchUp.bind(this));
        window.addEventListener("touchstart", this.onTouchDown.bind(this), {passive: false});
        window.addEventListener("touchmove", this.onTouchMove.bind(this), {passive: false});
        window.addEventListener("touchend", this.onTouchUp.bind(this), {passive: false});
        window.addEventListener("wheel", this.onMouseWheel.bind(this), {passive: false});
      },
    });
  }
}
