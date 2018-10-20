function initLivePreviews(hexa,map) {
  /*
  * **** LIVE PREVIEW FOR HEXAGON****
  * 
  */
  const isLiveEnabled = uiu.id('hexagon-live');
  const isTrue = isLiveEnabled.parentElement.parentElement;
  const isLiveParentParent = isTrue.parentElement.parentElement;

  uiu.eventDelegate({
    on : 'input',
    parent : isTrue,
    find : 'input',
    findDeeper : false
  },function() {
    liveHexagon();
  });
  liveHexagon();
  function liveHexagon() {
    let livePreview = new Verlet();
    livePreview.init(200,200,'#hexagon-live',1,1,1);
    let hexaLivePoints = [],
      hexaLiveCons = [];
    livePreview.Poly.hexagon({
      x : 100,
      y : 100,
      radius : 90,
      sides : parseInt(hexa.SIDES.value),
      slice1 :  parseInt(hexa.SLICE1.value),
      slice2 :  parseInt(hexa.SLICE2.value),
      center  : hexa.CENTER.checked, 
    },hexaLivePoints,hexaLiveCons);

    function live() {
      livePreview.clear();

      livePreview.renderDots(hexaLivePoints,5,'white');
      livePreview.renderLines(hexaLiveCons,0.5,'deepskyblue');
      livePreview.superUpdate(hexaLivePoints,hexaLiveCons,10);

      if(isTrue.style.opacity == '1') {
        requestAnimationFrame(live);
      } else {
        return;
      }
    }
    live();
  }

  /*
  * **** LIVE PREVIEW FOR MAP ****
  * 
  */
  const isMapLiveEnabled = uiu.id('map-live');
  const isMapTrue = isMapLiveEnabled.parentElement.parentElement;
  isMapTrue.parentElement.onkeyup = function() {
    liveData();
  };
  isMapTrue.parentElement.parentElement.onclick = function() {
    liveData();
  };
  function liveData() {
    let livePreview = new Verlet();
    livePreview.init(235,200,'#map-live',0,0);
    let MapPoints = [],
      MapCons = [];
    let raw = map.DATA.value;
    let splitRaw = map.DATA.value.split(",");
    let parsedRaw = '';
    for(let i = 0; i < splitRaw.length; i++) {
      parsedRaw += "\"" + splitRaw[i] + "\",";
    }
    let toBeParsed = "[" + parsedRaw.replace(/\,$/,'').replace(/\n/img,'') + "]";
    
    let val = JSON.parse(toBeParsed);
    livePreview.Poly.map({
      x : 55,
      y : 50,
      sizeX : 15,
      sizeY : 10,
      data : val
    },MapPoints,MapCons);

    function liveMap() {
      livePreview.clear();
      livePreview.renderDots(MapPoints,5,'white');
      livePreview.renderLines(MapCons,0.5,'deepskyblue');
      livePreview.superUpdate(MapPoints,MapCons,10);

      if(isMapTrue.style.opacity == '1') {
        requestAnimationFrame(liveMap);
      } else {
        return;
      }
    }
    liveMap();
  }
} //InitLivePreviews