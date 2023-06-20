export type GLOption = {
  width: number;
  height: number;
  top: number;
  left: number;
  img: string | undefined;
};

export default class GlElements {
  targetElArray: HTMLElement[];
  optionList: GLOption[];
  constructor(targetElArray: HTMLElement[]) {
    this.targetElArray = targetElArray;
    this.optionList = [];
  }

  init() {
    this._initOptionList();
  }

  _initOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const rect = this.targetElArray[i].getBoundingClientRect();

      const option: GLOption = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        img: undefined,
      };
      if (window.innerWidth > 767) {
        option.img = this.targetElArray[i].dataset.pcimg;
      } else {
        option.img = this.targetElArray[i].dataset.spimg;
      }

      this.optionList[i] = option;
    }
  }

  setOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const rect = this.targetElArray[i].getBoundingClientRect();

      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;
    }
  }

  onResize() {
    this.setOptionList();
  }
}
