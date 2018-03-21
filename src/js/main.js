/**
 * Verlet Drawing
 * @author Anurag_Hazra
 * @name VerletDrawing
 * @function verletDrawing
 *
 * // Dependencies (order is important):
 * 1) verlet.js
 * 2) uiUtils.js
 * 3) dragdraw.js
 * 4) fs.js
 * 5) exportsystem.js
 * 6) livePreviews.js
 * 7) userInterface.js
 */
"use strict";
window.onload = function() {
	console.clear();
	console.time('Startup');
	verletDrawing();
	console.timeEnd('Startup');
};
function verletDrawing() {
	const verlet = Verlet();
	verlet.init(1000,500,'#c',0.0,0.99,1);

	const canvas = verlet.canvas,
		  ctx = canvas.getContext('2d'),
		  container = document.getElementsByClassName('container')[0];

	function resizeCanvas() {
		let containerHeight = container.getBoundingClientRect().height,
			containerWidth = container.getBoundingClientRect().width;
		canvas.height = containerHeight - 50;
		canvas.width = containerWidth;
		verlet.osCanvas.width = canvas.width;
		verlet.osCanvas.height = canvas.height;
	}

	resizeCanvas();
	window.onresize = () => {
		resizeCanvas();
	}

	//All arrays
	let points 					= [],
			constrains 			= [],
			forms 					= [],
			trig 						= [],
			tmpCir 					= [],
			formsArray 			= [],
			handleArray 		= [],
			tmpHandleArray 	= [];

	/**
	 * ========= Redo And Undo System =========
	 */

	let undoArray = [];
	function initUndoRedo() {
		uiu.onkey('CTRL+Z',doUndo);
		uiu.onkey('CTRL+Y',doRedo);
	};

	//UndoRedo setps and settings
	const MAX_UNDO_REDO_STEPS = 200;
	const UNDO_REDO_JUMP = 1;
	let zCount = 0;
	let yCount = 0;
	let jump = 0;
	function updateUndoRedo() {
		jump++;
		let newPoints = [];
		let newCons = [];
		let newForms = [];

		if(jump === UNDO_REDO_JUMP) {
			//dots
			for (let p = 0; p < points.length; p++) {
				let po = points[p];
				newPoints.push([po.x,po.y,po.oldx,po.oldy,po.pinned,po.color]);
			}
			//cons
			for (let c = 0; c < constrains.length; c++) {
				constrains[c].id.push(constrains[c].hidden);
				newCons.push(constrains[c].id);
			}
			//forms
			if(forms.length !== 0) {
				for (let f = 0; f < forms.length; f++) {
					let ff = forms[f].id;
					let col = [forms[f].color];
					let kk = ff.concat(col);
					newForms.push(kk)
				}
				undoArray.push([newPoints,newCons,newForms]);
			} else {
				undoArray.push([newPoints,newCons]);
			}

			if(undoArray.length > MAX_UNDO_REDO_STEPS) {
				undoArray.shift();
				zCount = undoArray.length;
				yCount = 0;
			}
			zCount = undoArray.length;
			yCount = 0;
			jump = 0;
		}
		newPoints = [];
		newCons = [];
		newForms = [];
	}

	function doUndo() {
		zCount--;
		if(zCount < 0) {
			zCount = 0;
		}
		points = [];
		constrains = [];
		forms = [];
		try {
			verlet.create(undoArray[zCount][0],points);
			verlet.clamp(undoArray[zCount][1],constrains,points);
			if(forms.length !== 0) {
				for (let i = 0; i < undoArray[zCount][2].length; i++) {
					const element = undoArray[zCount][2][i];
					console.log('redo',element)
					verlet.shape(element, forms, points);
				}
			}
		} catch (ex) {
			console.log('Undo Error :' + ex);
		}
		verlet.Interact.move(points,'white');
	}
	function doRedo() {
		yCount = zCount++;
		if(yCount > undoArray.length) {
			zCount = undoArray.length - 2;
		}
		points = [];
		constrains = [];
		forms = [];
		try {
			verlet.create(undoArray[yCount][0],points);
			verlet.clamp(undoArray[yCount][1],constrains,points);
			if(forms.length !== 0) {
				for (let i = 0; i < undoArray[yCount][2].length; i++) {
					const element = undoArray[yCount][2][i];
					console.log('redo color',element)
					verlet.shape(element, forms, points);
				}
			}
		} catch (ex) {
			console.log('Redo Error :' + ex);
			zCount = undoArray.length-1;
		}
		verlet.Interact.move(points,'white');
	}
	initUndoRedo();


	/* ======== UI Variables ======== */
	const PhysicsAccuracy = _('Iterrations'),
				stiffness 			= _('stiffness'),
				bounce 					= _('bounce'),
				friction 				= _('friction'),
				dotOpt 					= _('dots'),
				LineOpt 				= _('lines'),
				LineHiddenOpt 	= _('hiddenlines'),
				IndexOpt 				= _('pointIndex'),
				shapeOpt 				= _('shapes'),
				gridOpt 				= _('gridguid'),
				gridGap 				= _('gridgap'),
				grav 						= _('gravity'),
				exportbtn 			= _('export'),
				loadModelpoint 	= _('loadmodelpoint'),
				dragDrop_load 	= _('overlaydrag'),
				shapecolor 			= _('shapecolor');

	/*Create Variables*/
	const box = {
		X 			: _('boxX'),
		Y 			: _('boxY'),
		W 			: _('boxW'),
		H 			: _('boxH'),
		create 	: _('createBox'),
		draw 		: _('drawBox'),
		select 	: _('selectcreate')
	}
	const rope = {
		X 			: _('ropeX'),
		Y 			: _('ropeY'),
		GAP 		: _('ropeGap'),
		SEGS 		: _('ropeSegs'),
		draw 		: _('drawRope'),
		create 	: _('createrope')
	}
	const cloth = {
		X 			: _('clothX'),
		Y 			: _('clothY'),
		GAP 		: _('clothGap'),
		SEGS 		: _('clothSegs'),
		RATIO 	: _('clothPinRatio'),
		create 	: _('createcloth')
	}
	const hexa = {
		X 			: _('hexaX'),
		Y 			: _('hexaY'),
		RADIUS 	: _('hexaRadius'),
		SIDES 	: _('hexaSides'),
		SLICE1 	: _('hexaSlice1'),
		SLICE2 	: _('hexaSlice2'),
		CENTER  : _('hexaCenter'),
		create 	: _('createhexa'),
		draw 		: _('drawhexa')
	}
	const map = {
		X 			: _('mapX'),
		Y 			: _('mapY'),
		SIZEX 	: _('mapSizeX'),
		SIZEY 	: _('mapSizeY'),
		DATA 		: _('mapData'),
		create 	: _('createmap')
	}
	const beam = {
		X 			: _('beamX'),
		Y 			: _('beamY'),
		W 			: _('beamW'),
		H 			: _('beamH'),
		SEGS 		: _('beamSegs'),
		create 	: _('createbeam')
	}


	/* ======== UI Events ======== */
	box.create.onclick = () => {
		(box.select.value === 'box') ? createBox() : createTri();
	};
	rope.create.onclick = () => {
		createRope();
	};
	cloth.create.onclick = () => {
		createCloth();
	}
	hexa.create.onclick = () => {
		createHexagon();
	};
	map.create.onclick = () => {
		createMap();
	};
	beam.create.onclick = () => {
		createBeam();
	};
	/*Load And Export*/
	exportbtn.onclick = () => {
		const filename = document.getElementById("filename");
		exportModel(points,constrains,forms,filename.value);
	};

	//disabled load button if no file is selected
	uiu.on('change','#loadPoints',function() {
		if(uiu.query('#loadPoints').value) {
			loadModelpoint.removeAttribute('disabled');
		} else {
			loadModelpoint.setAttribute('disabled',true);
		}
	});
	loadModelpoint.onclick = () => {
		forms = [];
		loadFile('#loadPoints',points,constrains,forms,verlet);
	};

	//create methods
	function createBox() {
			verlet.Poly.box({
				x : parseInt(box.X.value),
				y : parseInt(box.Y.value),
				width : parseInt(box.W.value),
				height : parseInt(box.H.value)
			},points,constrains);
		updateUndoRedo();
	}
	function drawBox(posx,posy,w,h) {
		if(box.draw.checked === true) {
			if (box.select.value !== 'box') {
				verlet.Poly.triangle({
					x : posx,
					y : posy,
					width : w,
					height : h
				},points,constrains);
			} else {
				verlet.Poly.box({
					x : posx,
					y : posy,
					width : w,
					height : h
				},points,constrains);
			}
			updateUndoRedo();
		}
	}
	function createTri() {
		verlet.Poly.triangle({
			x : parseInt(box.X.value),
			y : parseInt(box.Y.value),
			width : parseInt(box.W.value),
			height : parseInt(box.H.value)
		},points,constrains);
		updateUndoRedo();
	}
	function createRope() {
		verlet.Poly.rope({
			x : parseInt(rope.X.value),
			y : parseInt(rope.Y.value),
			gap : parseInt(rope.GAP.value),
			segs :  parseInt(rope.SEGS.value),
		},points,constrains);
		updateUndoRedo();
	}
	function drawRope(posx,posy,w,h) {
		if(rope.draw.checked === true) {
			verlet.Poly.rope({
				x : (posx+w),
				y : (posy+h),
				gap : h,
				segs : w/12,
			},points,constrains);
			updateUndoRedo();
		}
	}
	function createCloth() {
		verlet.Poly.cloth({
			x : parseInt(cloth.X.value),
			y : parseInt(cloth.Y.value),
			gap : parseInt(cloth.GAP.value),
			segs :  parseInt(cloth.SEGS.value),
			pinRatio : parseInt(cloth.RATIO.value),
			tearable : false
		},points,constrains);
		updateUndoRedo();
	}
	function createHexagon() {
		verlet.Poly.hexagon({
			x : parseInt(hexa.X.value),
			y : parseInt(hexa.Y.value),
			radius : parseInt(hexa.RADIUS.value),
			sides : parseInt(hexa.SIDES.value),
			slice1 :  parseInt(hexa.SLICE1.value),
			slice2 :  parseInt(hexa.SLICE2.value),
			center : hexa.CENTER.checked
		},points,constrains);
		updateUndoRedo();
	}
	function drawHexagon(x,y,w,h) {
		if(hexa.draw.checked === true) {
			verlet.Poly.hexagon({
				x : x+w,
				y : y+h,
				radius : (h)/2,
				sides : parseInt(hexa.SIDES.value),
				slice1 : parseInt(hexa.SLICE1.value),
				slice2 : parseInt(hexa.SLICE2.value),
				vx : x,
				vy : y,
				center : hexa.CENTER.checked
			},points,constrains);
			updateUndoRedo();
		}
	}
	function createBeam() {
		verlet.Poly.beam({
			x : parseInt(beam.X.value),
			y : parseInt(beam.Y.value),
			width : parseInt(beam.W.value),
			height : parseInt(beam.H.value),
			segs : parseInt(beam.SEGS.value),
		},points,constrains);
		updateUndoRedo();
	}
	function createMap() {
		let raw = map.DATA.value;
		let splitRaw = map.DATA.value.split(",");
		let parsedRaw = '';
		for(let i = 0; i < splitRaw.length; i++) {
			parsedRaw += "\"" + splitRaw[i] + "\",";
		}
		let toBeParsed = "[" + parsedRaw.replace(/,$/,'').replace(/\n/img,'') + "]";

		let val = JSON.parse(toBeParsed);
		verlet.Poly.map({
			x : parseInt(map.X.value),
			y : parseInt(map.Y.value),
			sizeX : parseInt(map.SIZEX.value),
			sizeY : parseInt(map.SIZEY.value),
			data : val
		},points,constrains);
		updateUndoRedo();
	}


	/* ========= Miscellaneous ========= */
	uiu.preventRightClick();

	function _(id) {
		return document.getElementById(id);
	}

	const mouse = {x : 0, y : 0}
	canvas.addEventListener('mousemove',function(e) {
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	});

	function colDetect(x,y,circle) {
		let dx = x - circle.x;
		let dy = y - circle.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	// DRAW GRID
	function drawGrid() {
		if(gridOpt.checked === true) {
			let gap = parseInt(gridGap.value);
			let gridX = 0;
			let gridY = 0;
			ctx.beginPath();
			ctx.strokeStyle = 'limegreen';
			for(let i = 0; i < canvas.width; i++) {
				gridX += gap;
				ctx.moveTo(gridX,canvas.width);
				ctx.lineTo(gridX,0);
			}
			for(let i = 0; i < canvas.height; i++) {
				gridY += gap;
				ctx.moveTo(canvas.width,gridY);
				ctx.lineTo(0,gridY);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}

	//FPS
	let lastframe;
	let fps;
	let getFps;
	let frameTime;
	function getFrameRate() {
		if(!lastframe) {
			lastframe = performance.now();
			fps = 0;
			return;
		}
		let delta = (performance.now() - lastframe) / 1000;
		frameTime = (performance.now() - lastframe);
		lastframe = performance.now();
		fps = 1/delta;
		return Math.round(fps);
	}

	//Get Range Slider Values And Display It
	function getVal(el) {
		uiu.setOn('input',el,function() {
			this.nextElementSibling.innerText = this.value;
		});
	}
	getVal(grav);
	getVal(bounce);
	getVal(stiffness);
	getVal(friction);
	getVal(PhysicsAccuracy);
	getVal(gridGap);

	//dragload file
	uiu.setOn('dragenter',canvas,function(e) {
		uiu.setStyle(dragDrop_load,{
			display : 'block'
		})
	});
	uiu.setOn('dragleave',dragDrop_load,function(e) {
		e.preventDefault();
		uiu.setStyle(dragDrop_load,{
			display : 'none'
		});
	});

	uiu.setOn('drop',dragDrop_load,function(e) {
			window.setTimeout(function() {
				forms = [];
				loadFile('#overlaydrag',points,constrains,forms,verlet);
				uiu.setStyle(dragDrop_load,{
					display : 'none'
				});
				console.log('loaded');
			},100)
	});

	//save with CTRL+S
	function toggleModal(e){
		uiu.modal({
			on : function() {
				return e
			},
			parent : '.container',
			toggle : '#ctrlSaveModal',
			in : ['top','0%','35%'],
		},function() {
			console.log('ok');
			uiu.toggleStyle(document.body,'pointer-events','all','none');
		})
	}
	toggleModal(false)
	function ctrlSave(e) {
		e.preventDefault();
			toggleModal(true);

			let name = uiu.query('#ctrlSaveModal > input');
			uiu.onkey('enter',function() {
				console.log(forms)
				exportModel(points,constrains,forms,name.value);
				toggleModal(false)
			},name)
	}
	uiu.onkey('ctrl+s',ctrlSave);

	//Core Logic
	function initCore() {
		/* Key Handling */
		document.body.addEventListener('keydown', keyhandling);
		document.body.addEventListener('keyup', removekeyhandling);

		function keyhandling(e) {
			switch (e.which) {
				case 16://Shift
					canvas.addEventListener('mousedown', getPoint);
					canvas.style.cursor = 'pointer';
					break;
				case 67://C
					canvas.addEventListener('mousedown', definePoints);
					canvas.style.cursor = 'crosshair';
					break;
				case 35://End
					//Delete The Point
					points.splice(verlet.handleIndex, 1);
					for (let i = 0; i < forms.length; i++) {
						if (forms[i].id.indexOf(verlet.handleIndex) !== -1) {
							forms[i].id.splice(0, 1);
						}
						forms[i].paths.splice(0, 1);
					}
					updateUndoRedo();
					break;
				case 81://Q
					if (handleArray.length > 0) {
						let hidden = false;
						if (states['line-hidden'] == true) {
							hidden = true;
						}
						if (states['auto-join'] === false) {
							for (let k = 0; k < handleArray.length; k++) {
								handleArray[k][2] = hidden;
								verlet.clamp([handleArray[k]], constrains, points);
							}
						} else { //Auto Join By Index
							//Increment And Joint i++
							let tmpAuto = [];
							while (handleArray.length > 1) {
								handleArray.shift();
							}
							let start = handleArray[0][0], end = handleArray[0][1];
							let min = Math.min(start, end), max = Math.max(start, end) + 1;
							for (let i = min; i < max; i++) {
								tmpAuto.push([
									i, (i + 1) % max,
									hidden
								]);
							}
							tmpAuto.pop();
							verlet.clamp(tmpAuto, constrains, points);
							tmpAuto.splice(0, tmpAuto.length);
						}
						tmpHandleArray = [];
						handleArray = [];
						first = 0;
						for (let i = 0; i < points.length; i++) {
							if (points[i].color !== 'crimson') {
								points[i].color = null;
							}
						}
					}
					break;
				case 70://F
					canvas.addEventListener('mousedown', addToForms);
					uiu.showTooltip(mouse, '#colorIndicator',{x : 19, y : 30},function(){
						this.style.backgroundColor = shapecolor.value;
					});
					canvas.style.cursor = 'alias';
					break;
			}
		}

		// Delete and update undoredo explicitly to improve performence
		// and also added uiu.throttle
		uiu.onkey('DELETE',uiu.throttle(function() {
			for (let i = 0; i < constrains.length; i++) {
				while (constrains[i].id.indexOf(verlet.handleIndex) !== -1) {
					constrains.splice(i, 1);
					// break;
				}
			}
			updateUndoRedo();
		},100))

		function removekeyhandling(e) {
			switch (e.which) {
				case 16://Shift
					canvas.removeEventListener('mousedown', getPoint);
					canvas.style.cursor = 'default';
					tmpHandleArray = [];
					handleArray = [];
					first = 0;
					for (let i = 0; i < points.length; i++) {
						if (points[i].color !== 'crimson') {
							points[i].color = null;
						}
					}
					break;
				case 67://C
					canvas.removeEventListener('mousedown', definePoints);
					createPoint();
					canvas.style.cursor = 'default';
					break;
				case 70://F
					if (formsArray.length > 2) {
						createForms();
					}
					canvas.removeEventListener('mousedown', addToForms);
					uiu.hideTooltip('#colorIndicator');
					canvas.style.cursor = 'default';
					for (let i = 0; i < points.length; i++) {
						points[i].color = null;
					}
					// updateUndoRedo();
			}
		}

		/*
		 * ======= Core Functionalities =======
		 */

		/* Create Points */
		function definePoints(e) {
			let pinned;
			let color;
			pinned = (states['pin-point']) ? true : false;
			color = (states['pin-point']) ? 'crimson' : null;
			let mx = e.offsetX;
			let my = e.offsetY;
			if (e.which === 1) {
				trig.push([mx, my, mx, my, pinned, color]);
				tmpCir.push({ x: mx, y: my });
			}
		}
		function createPoint(e) {
			tmpCir = [];
			verlet.create(trig, points);
			trig = [];
			updateUndoRedo();
		}
		/*Get Offsets For Creating Constrains*/
		let first = 0;
		function getPoint(me) {
			for (let i = 0; i < points.length; i++) {
				if (colDetect(me.offsetX, me.offsetY, points[i]) < 10) {
					first++;
					tmpHandleArray.push(i);
					if (first !== 1) {
						tmpHandleArray.push(i);
					}
					if (points[i].color !== 'crimson') {
						points[i].color = 'greenyellow';
					}
				}
			}
			let modTwo = 0;
			handleArray = [];
			for (let j = 0; j < tmpHandleArray.length; j++) {
				modTwo++;
				modTwo = modTwo % 2;
				if (modTwo !== 0) {
					handleArray.push([tmpHandleArray[j], tmpHandleArray[(j + 1) % tmpHandleArray.length]]);
				}
			}
			handleArray.pop();
			updateUndoRedo();
		}
		/* Get Points For Making Shapes */
		function addToForms(me) {
			for (let i = 0; i < points.length; i++) {
				if (colDetect(me.offsetX, me.offsetY, points[i]) < 10) {
					formsArray.push(i);
					points[i].color = shapecolor.value;
				}
			}
		}
		/*Create Shapes*/
		function createForms() {
			formsArray.push((shapecolor.value).toString())
			verlet.shape(formsArray, forms, points);
			formsArray = [];
			updateUndoRedo();
		}
	}
	initCore();

	/* Pinning Constrains And Line Visisbility */
	let states = {
		'pin-point' : false,
		'line-hidden' : false,
		'auto-join' : false
	}

	//context menu
	function initContextMenu() {

		//show hide context menu
		let childs = uiu.query('.radialMenu > i',true);
		uiu.setOn('mousedown','#c',function(e) {

			if(e.which === 3) {
				uiu.setStyle('.radialMenuCenter',{
					'left' : e.offsetX - 30 + 'px',
					'top' : e.offsetY - 31 + 'px',
				})
				uiu.radialMenu({
					parent : '.radialMenu',
					x : e.offsetX,
					y : e.offsetY,
					radius : 75
				},function() {
					for (let i = 0; i < childs.length; i++) {
						uiu.removeClass(childs[i],'noEvent');
					}
					//toggle states
					uiu.linkDOM('.radialMenuCenter',this,function(elm1,elm2){
						uiu.removeClass(elm1,'noEvent');
						uiu.removeClass(elm2,'hideRadialMenu');
					});
				})
			}
			if(e.which === 1) {
				//toggle states
				uiu.linkDOM('.radialMenuCenter','.radialMenu',function(elm1,elm2){
					uiu.addClass(elm1,'noEvent');
					uiu.addClass(elm2,'hideRadialMenu');
				});
				for (let i = 0; i < childs.length; i++) {
					uiu.addClass(childs[i],'noEvent');
				}
			}
		});

		//Show Info
		uiu.eventDelegate({
			parent : '.radialMenu',
			find : 'i',
		},function(target) {
			let attr = target.dataset.uid;
			let menu = uiu.query('.radialMenuCenter');
			menu.innerHTML = attr;
		});

		//toolbar option link
		uiu.eventDelegate({
			on : 'mousedown',
			parent : '.toolbar',
			find : '[data-tooltip]',
			noOverwrite : true
		},function(target) {
			let maintarget = target.closest('[data-tooltip]')
			let linkid = maintarget.getAttribute('id');

			uiu.linkDOM(maintarget,'#context-'+linkid,function(e1,e2) {
				uiu.toggleClass(e1,'button-active');
				uiu.toggleClass(e2,'button-active');

				//toggle states false||true
				let stid = linkid.replace('#','');
				states[stid] = states[stid] ? false : true;
			});

		});

		//main click handler and DOMLink
		uiu.eventDelegate({
			on : 'mousedown',
			parent : '.radialMenu',
			find : 'i',
			noOverwrite : true
		},function(target) {
			let linkid = target.dataset.link;
			let type = target.dataset.type;

			if(type === 'tool') {
				uiu.linkDOM(target,linkid,function(e1,e2) {
					uiu.toggleClass(e1,'button-active');
					uiu.toggleClass(e2,'button-active');

					//toggle states false||true
					let stid = linkid.replace('#','');
					states[stid] = states[stid] ? false : true;
				})
			} else {
				uiu.linkDOM(target,linkid,function(e1,e2) {
					uiu.toggleClass(e1,'button-active');

					//toggle checkbox
					let checkbox = uiu.query(linkid);
					checkbox.checked = (checkbox.checked) ? false : true

				});
			}
		});

		//checkboxDOMLink
		uiu.eventDelegate({
			on : 'change',
			parent : '#context-link',
			find : 'input[type="checkbox"]',
			noOverwrite : true
		},function(target) {
			let linkid = target.getAttribute('id');

			uiu.linkDOM(target,'#context-'+linkid,function(e1,e2) {
				uiu.toggleClass(e2,'button-active');
			})
		});

	}
	initContextMenu();


	//drag draw
	drag.init(verlet.canvas,function(x,y,w,h) {
		drawBox(x,y,w,h);
	});
	drag.init(verlet.canvas,function(x,y,w,h) {
		drawRope(x,y,w,h);
	});
	drag.init(verlet.canvas,function(x,y,w,h) {
		drawHexagon(x,y,w,h);
	});


	//draw and create with shortcuts
	box.draw.onchange = function() {
		if(box.draw.checked == true) {
			canvas.style.cursor = 'crosshair';
		} else {
			canvas.style.cursor = 'default';
		}
	}
	uiu.onkey('b',function() {
		box.draw.checked = true;
		canvas.style.cursor = 'crosshair';

	});
	uiu.onkey('r',function() {
		rope.draw.checked = true;
		canvas.style.cursor = 'crosshair';
	});

	uiu.draggable({
		parent : '.tooltips',
		child : '#floating-content',
		dragger : '.dragger'
	})
	uiu.onkey('h',function() {
		hexa.draw.checked = true;
		canvas.style.cursor = 'crosshair';
		let fContent = document.getElementById('floating-content');
		fContent.style.opacity = 1;
		fContent.style.pointerEvents = 'all';

	});
	uiu.on('keyup',document,function() {
		let fContent = document.getElementById('floating-content');
		box.draw.checked = false;
		rope.draw.checked = false;
		hexa.draw.checked = false;
		canvas.style.cursor = 'default';
		fContent.style.opacity = 0;
		fContent.style.pointerEvents = 'none';
	})

	function _drawbox(x,y,w,h) {
		ctx.beginPath();
		ctx.strokeStyle = 'gray';
		ctx.strokeRect(x,y,w,h);
		ctx.stroke();
		ctx.closePath();
	}
	function drawTmpBox(x,y,w,h) {
		_drawbox(x,y,w,h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('w: ' + w + 'px',w+x+10,h+y-25);
		ctx.fillText('h: ' + h + 'px',w+x+10,h+y-10);
		ctx.fill();
		ctx.closePath();
	}

	function drawTmpRope(x,y,w,h) {
		_drawbox(x,y,w,h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('gap: ' + h + 'px',x+10,h+y+20);
		ctx.fillText('parts: ' + Math.round(w/12) + '',w+x+15,y+15);
		ctx.fill();
		ctx.closePath();
	}
	function drawTmpHexa(x,y,w,h) {
		_drawbox(x,y,w,h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('radius: ' + h/2 + 'px',x+10,h+y+20);
		ctx.fillText('parts: ' + Math.round(w/12) + '',w+x+15,y+15);
		ctx.fill();
		ctx.closePath();
	}


	// render toggling variables
	let isRenderShapes;
	let isRenderDots;
	let isRenderLines;
	let isRenderHiddenLines;
	let isRenderPointIndex;

	verlet.Interact.move(points,'white');
	/* ====== ANIMATE ====== */
	function animate() {
		verlet.clear();

		drag.draw(function(x,y,w,h) {
			drawTmpBox(x,y,w,h);
		},box.draw.checked);
		drag.draw(function(x,y,w,h) {
			drawTmpRope(x,y,w,h);
		},rope.draw.checked);
		drag.draw(function(x,y,w,h) {
			drawTmpHexa(x,y,w,h);
		},hexa.draw.checked);

		verlet.gravity 		= parseFloat(grav.value) 			|| 0;
		verlet.bounce 		= parseFloat(bounce.value) 		|| 0;
		verlet.friction 	= parseFloat(friction.value) 	|| 1;
		verlet.stiffness 	= parseFloat(stiffness.value) || 1;

		//physics update
		verlet.superUpdate(points,constrains,PhysicsAccuracy.value,{hoverColor : 'white'});

		(shapeOpt.checked === true) ? verlet.renderShapes(forms) : false;
		isRenderLines = LineOpt.checked;
		isRenderHiddenLines = LineHiddenOpt.checked;
		isRenderPointIndex = IndexOpt.checked;
		isRenderDots = dotOpt.checked;

		verlet.superRender(points,constrains,{
			renderDots : isRenderDots,
			renderLines : isRenderLines,
			renderHiddenLines : isRenderHiddenLines,
			renderPointIndex : isRenderPointIndex,
			preset : 'shadowBlue'
		});

		drawGrid();

		/* Temp Circles */
		if(tmpCir.length > 0) {
			for (let i = 0; i < tmpCir.length; i++) {
				verlet.Draw.arc(tmpCir[i].x,tmpCir[i].y,5,'gray',1,true);
			}
		}
		getFps = getFrameRate();

		requestAnimationFrame(animate);
	}

	window.setInterval(function() {
		initUI.debug(points,constrains,getFps,verlet);
	},100);
	animate();

	initLivePreviews(hexa,map);

}//verletDrawing;
