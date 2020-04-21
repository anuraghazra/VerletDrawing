"use strict";
const drag = (function () {

  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;
  let drag_x = 0;
  let drag_y = 0;
  let tmp_drag_x = 0;
  let tmp_drag_y = 0;

  let down_x = 0;
  let down_y = 0;
  let up_x = 0;
  let up_y = 0;

  let isdraw = false;

  let coordArr = [];
  function init(elm, callback) {
    down_x = 0;
    down_y = 0;
    up_x = 0;
    up_y = 0;

    function getMove(e) {
      tmp_drag_x = e.offsetX;
      tmp_drag_y = e.offsetY;
      isdraw = true;
    }

    elm.addEventListener('mousedown', function (e) {
      down_x = e.offsetX;
      down_y = e.offsetY;
      elm.addEventListener('mousemove', getMove);
    });

    elm.addEventListener('mouseup', function (e) {
      up_x = e.offsetX;
      up_y = e.offsetY;

      drag_x = up_x - down_x;
      drag_y = up_y - down_y;

      x = down_x - drag_x;
      y = down_y - drag_y;
      width = drag_x;
      height = drag_y;
      callback(x, y, width, height);
      elm.removeEventListener('mousemove', getMove);
      isdraw = false;
    });
  };

  function draw(callback, primeDraw) {
    if (isdraw && primeDraw) {
      let diffX = tmp_drag_x - down_x;
      let diffY = tmp_drag_y - down_y;
      callback(down_x, down_y, diffX, diffY);
      diffX = 0;
      diffY = 0;
    }
  }

  return {
    init: init,
    draw: draw
  }
})();