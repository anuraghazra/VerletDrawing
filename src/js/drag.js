// Drag Create
class drag {
  constructor(verlet, dots, cons) {
    this.verlet = verlet;
    this.downX = 0;
    this.downY = 0;
    this.upX = 0;
    this.upY = 0;
    this.dragX = 0;
    this.dragY = 0;
    /////////////
    this.tmp_dragX = 0;
    this.tmp_dragY = 0;
    this.draw = false;
    this.bool = false;
    this.createFunc = undefined;
    this.verlet.canvas.addEventListener('mousedown', this.getDownCoord);
    this.verlet.canvas.addEventListener('mouseup', this.getUpCoord);
  }

  initDrag(val) {
    this.createFunc = val;
  };
  getDownCoord(e) {
    this.downX = e.clientX;
    this.downY = e.clientY;
    this.verlet.canvas.addEventListener('mousemove', this.getMouseTmp);
  };
  getUpCoord(e) {
    if (this.bool) {
      this.upX = e.clientX;
      this.upY = e.clientY;
      this.dragX = this.upX - this.downX;
      this.dragY = this.upY - this.downY;
      let adjustX = this.downX - this.dragX - 20;
      let adjustY = this.downY - this.dragY - 20;
      this.createFunc(adjustX, adjustY, this.dragX, this.dragY, dots, cons);
    }
    this.verlet.canvas.removeEventListener('mousemove', this.getMouseTmp);
    this.draw = false;
  };

  getMouseTmp(e) {
    this.tmp_dragX = e.clientX;
    this.tmp_dragY = e.clientY;
    this.draw = true;
  };
  drawTmpBox(bool) {
    this.bool = bool;
    if (this.draw && this.bool) {
      let diffX = this.tmp_dragX - this.downX;
      let diffY = this.tmp_dragY - this.downY;
      this.verlet.ctx.strokeStyle = 'black';
      this.verlet.ctx.strokeRect(this.downX - 20, this.downY - 20, diffX, diffY);
    }
  };
}
