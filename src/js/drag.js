// Drag Create
const drag = function(verlet,dots,cons) {
    const self = this;
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

    this.initDrag = function(val) {
        self.createFunc = val;
    }
    this.getDownCoord = function (e) {
        self.downX = e.clientX;
        self.downY = e.clientY;
        self.verlet.canvas.addEventListener('mousemove',self.getMouseTmp);
    }
    this.getUpCoord = function(e) {
        if(self.bool) {
            self.upX = e.clientX;
            self.upY = e.clientY;
            self.dragX = self.upX - self.downX;
            self.dragY = self.upY - self.downY;
            
            let adjustX = self.downX-self.dragX-20;
            let adjustY = self.downY-self.dragY-20;
            
            self.createFunc(adjustX,adjustY,self.dragX,self.dragY,dots,cons);
        }
        self.verlet.canvas.removeEventListener('mousemove',self.getMouseTmp);
        self.draw = false;
    }      
    self.verlet.canvas.addEventListener('mousedown',this.getDownCoord);
    self.verlet.canvas.addEventListener('mouseup',this.getUpCoord);
    
    // ==================
    this.getMouseTmp = function(e) {
        self.tmp_dragX = e.clientX;
        self.tmp_dragY = e.clientY;
        self.draw = true;
    }
    this.drawTmpBox = function (bool) {
        self.bool = bool;
        if(self.draw && self.bool) {
            let diffX = self.tmp_dragX - self.downX;
            let diffY = self.tmp_dragY - self.downY;
            self.verlet.ctx.strokeStyle = 'black';
            self.verlet.ctx.strokeRect(self.downX-20,self.downY-20,diffX,diffY);
        }
    }
}