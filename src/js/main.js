/**
 * Verlet Drawing
 * @author AnuragHazra<hazru.anurag@gmail.com>
 * @name VerletDrawing
 *
 * // Dependencies (order is important):
 * 1) verlet.js
 * 2) uiUtils.js
 * 3) dragdraw.js
 // // 4) fs.js
 // // 5) exportsystem.js
 * 6) livePreviews.js
 * 7) userInterface.js
 */
"use strict";
window.onload = function () {
	// console.clear();
	console.time('Startup');
	verletDrawing();
	console.timeEnd('Startup');
};
function verletDrawing() {
	const verlet = new Verlet();
	verlet.init(1000, 500, '#c', 0.0, 0.99, 1);

	const canvas = verlet.canvas;
	const ctx = canvas.getContext('2d');
	const container = document.getElementsByClassName('container')[0];

	function resizeCanvas() {
		let containerHeight = container.getBoundingClientRect().height;
		let containerWidth = container.getBoundingClientRect().width;
		canvas.height = containerHeight - 50;
		canvas.width = containerWidth;
		verlet.osCanvas.width = canvas.width;
		verlet.osCanvas.height = canvas.height;
	}

	resizeCanvas();
	window.onresize = () => resizeCanvas();

	//All arrays
	let points = [];
	let constrains = [];
	let forms = [];
	let trig = [];
	let tmpCir = [];
	let tmpLine = [];
	let formsArray = [];
	let handleArray = [];
	let tmpHandleArray = [];
	let AutojoinArr = [];


	/**
	 * ========= Redo And Undo System =========
	 */

	let redoUndoData = [];
	function initUndoRedo() {
		uiu.onkey('CTRL+Z', doUndo);
		uiu.onkey('CTRL+Y', doRedo);
	};

	//UndoRedo setps and settings
	const MAX_UNDO_REDO_STEPS = Infinity;
	let ctrlZ = 0;
	let ctrlY = 0;
	updateUndoRedo();
	function updateUndoRedo() {
		let tmpdots = [];
		let tmpcons = [];
		let tmpshapes = [];

		if (redoUndoData.length < MAX_UNDO_REDO_STEPS) {

			//dots
			for (let i = 0; i < points.length; i++) {
				const p = points[i];
				tmpdots.push([p.x, p.y, p.oldx, p.oldy, p.pinned, p.color]);
			}

			//cons
			// [0, 2, { "hidden": true, "stiffness": 1 }]
			for (let j = 0; j < constrains.length; j++) {
				const c = constrains[j];
				tmpcons.push([
					c.id[0], c.id[1],
					{ 'hidden': c.hidden, 'stiffness': c.stiffness, 'length': c.len }
				]);
			}

			//forms
			// [4,5,6,7,'yellowgreen']
			for (let k = 0; k < forms.length; k++) {
				tmpshapes.push([
					...forms[k].id, forms[k].color
				])
			}

			redoUndoData.push([tmpdots, tmpcons, tmpshapes]);
			ctrlZ = redoUndoData.length;
			ctrlY = 0;
		}

	}

	// Just For Removing DRY Code
	function recoverDataFromRedoUndoArray(value) {
		points = [];
		constrains = [];
		forms = [];
		verlet.create(redoUndoData[value][0], points, constrains);
		verlet.clamp(redoUndoData[value][1], points, constrains);
		if (redoUndoData[value][2].length > 0) {
			verlet.shape(redoUndoData[value][2], forms, points);
		}
	}
	function doUndo() {
		if (ctrlZ > 0) {
			--ctrlZ;
		}
		recoverDataFromRedoUndoArray(ctrlZ);
		ctrlY = ctrlZ;
		verlet.Interact.move(points);
		verlet.superUpdate(points, constrains, PhysicsAccuracy.value)
	}
	function doRedo() {
		if (ctrlY <= redoUndoData.length) {
			++ctrlY;
		}
		// clamp the value of ctrlY
		if (ctrlY > redoUndoData.length - 1) {
			ctrlY = redoUndoData.length - 1;
		}
		recoverDataFromRedoUndoArray(ctrlY);
		ctrlZ = ctrlY;
		// ctrlY = ctrlZ;
		verlet.Interact.move(points);
		verlet.superUpdate(points, constrains, PhysicsAccuracy.value)
	}
	initUndoRedo();


	/* ======== UI Variables ======== */
	const PhysicsAccuracy = id('Iterrations'),
		stiffness = id('stiffness'),
		bounce = id('bounce'),
		friction = id('friction'),
		dotOpt = id('dots'),
		LineOpt = id('lines'),
		LineStressOpt = id('stress'),
		dotsAsBoxOpt = id('dotsasbox'),
		LineHiddenOpt = id('hiddenlines'),
		IndexOpt = id('pointIndex'),
		shapeOpt = id('shapes'),
		gridOpt = id('gridguid'),
		gridGap = id('gridgap'),
		grav = id('gravity'),
		exportbtn = id('export'),
		loadModelpoint = id('loadmodelpoint'),
		dragDrop_load = id('overlaydrag'),
		shapecolor = id('shapecolor');

	/*Create Variables*/
	const box = {
		X: id('boxX'),
		Y: id('boxY'),
		W: id('boxW'),
		H: id('boxH'),
		create: id('createBox'),
		draw: id('drawBox'),
		select: id('selectcreate')
	}
	const rope = {
		X: id('ropeX'),
		Y: id('ropeY'),
		GAP: id('ropeGap'),
		SEGS: id('ropeSegs'),
		draw: id('drawRope'),
		create: id('createrope')
	}
	const cloth = {
		X: id('clothX'),
		Y: id('clothY'),
		GAPX: id('clothGapX'),
		GAPY: id('clothGapY'),
		SEGS: id('clothSegs'),
		RATIO: id('clothPinRatio'),
		create: id('createcloth')
	}
	const hexa = {
		X: id('hexaX'),
		Y: id('hexaY'),
		RADIUS: id('hexaRadius'),
		SIDES: id('hexaSides'),
		SLICE1: id('hexaSlice1'),
		SLICE2: id('hexaSlice2'),
		CENTER: id('hexaCenter'),
		create: id('createhexa'),
		draw: id('drawhexa')
	}
	const map = {
		X: id('mapX'),
		Y: id('mapY'),
		SIZEX: id('mapSizeX'),
		SIZEY: id('mapSizeY'),
		DATA: id('mapData'),
		create: id('createmap')
	}
	const beam = {
		X: id('beamX'),
		Y: id('beamY'),
		W: id('beamW'),
		H: id('beamH'),
		SEGS: id('beamSegs'),
		create: id('createbeam')
	}


	// verlet.Poly.cloth({x : 0,y : 0,segs : 50},points,constrains);

	/* ======== UI Events ======== */
	box.create.onclick = () => {
		(box.select.value === 'box') ? createBox() : createTri();
	};
	rope.create.onclick = () => createRope();
	cloth.create.onclick = () => createCloth();
	hexa.create.onclick = () => createHexagon();
	map.create.onclick = () => createMap();
	beam.create.onclick = () => createBeam();

	/*Load And Export*/
	exportbtn.onclick = () => {
		const filename = document.getElementById("filename");
		verlet.export(filename.value, points, constrains, forms)
		// exportModel(points,constrains,forms,);
	};

	//disabled load button if no file is selected
	uiu.on('change', '#loadPoints', function () {
		if (uiu.query('#loadPoints').value) {
			loadModelpoint.removeAttribute('disabled');
		} else {
			loadModelpoint.setAttribute('disabled', true);
		}
	});
	loadModelpoint.onclick = () => {
		verlet.import('#loadPoints', points, constrains, forms)
	};

	//create methods
	function createBox() {
		verlet.Poly.box({
			x: parseInt(box.X.value),
			y: parseInt(box.Y.value),
			width: parseInt(box.W.value),
			height: parseInt(box.H.value)
		}, points, constrains);
		updateUndoRedo();
	}
	function drawBox(posx, posy, w, h) {
		if (box.draw.checked === true) {
			if (box.select.value !== 'box') {
				verlet.Poly.triangle({
					x: posx,
					y: posy,
					width: w,
					height: h
				}, points, constrains);
			} else {
				verlet.Poly.box({
					x: posx,
					y: posy,
					width: w,
					height: h
				}, points, constrains);
			}
			updateUndoRedo();
		}
	}
	function createTri() {
		verlet.Poly.triangle({
			x: parseInt(box.X.value),
			y: parseInt(box.Y.value),
			width: parseInt(box.W.value),
			height: parseInt(box.H.value)
		}, points, constrains);
		updateUndoRedo();
	}
	function createRope() {
		verlet.Poly.rope({
			x: parseInt(rope.X.value),
			y: parseInt(rope.Y.value),
			gap: parseInt(rope.GAP.value),
			segs: parseInt(rope.SEGS.value),
		}, points, constrains);
		updateUndoRedo();
	}
	function drawRope(posx, posy, w, h) {
		if (rope.draw.checked === true) {
			verlet.Poly.rope({
				x: (posx + w),
				y: (posy + h),
				gap: h,
				segs: w / 12,
			}, points, constrains);
			updateUndoRedo();
		}
	}
	function createCloth() {
		verlet.Poly.cloth({
			x: parseInt(cloth.X.value),
			y: parseInt(cloth.Y.value),
			gapX: parseInt(cloth.GAPX.value),
			gapY: parseInt(cloth.GAPY.value),
			segs: parseInt(cloth.SEGS.value),
			pinRatio: parseInt(cloth.RATIO.value),
			tearable: false
		}, points, constrains);
		updateUndoRedo();
	}
	function createHexagon() {
		verlet.Poly.hexagon({
			x: parseInt(hexa.X.value),
			y: parseInt(hexa.Y.value),
			radius: parseInt(hexa.RADIUS.value),
			sides: parseInt(hexa.SIDES.value),
			slice1: parseInt(hexa.SLICE1.value),
			slice2: parseInt(hexa.SLICE2.value),
			center: hexa.CENTER.checked
		}, points, constrains);
		updateUndoRedo();
	}
	function drawHexagon(x, y, w, h) {
		if (hexa.draw.checked === true) {
			verlet.Poly.hexagon({
				x: x + w,
				y: y + h,
				radius: (h) / 2,
				sides: parseInt(hexa.SIDES.value),
				slice1: parseInt(hexa.SLICE1.value),
				slice2: parseInt(hexa.SLICE2.value),
				vx: x + w,
				vy: y + h,
				center: hexa.CENTER.checked
			}, points, constrains);
			updateUndoRedo();
		}
	}
	function createBeam() {
		verlet.Poly.beam({
			x: parseInt(beam.X.value),
			y: parseInt(beam.Y.value),
			width: parseInt(beam.W.value),
			height: parseInt(beam.H.value),
			segs: parseInt(beam.SEGS.value),
		}, points, constrains);
		updateUndoRedo();
	}
	function createMap() {
		let raw = map.DATA.value;
		let splitRaw = map.DATA.value.split(",");
		let parsedRaw = '';
		for (let i = 0; i < splitRaw.length; i++) {
			parsedRaw += "\"" + splitRaw[i] + "\",";
		}
		let toBeParsed = "[" + parsedRaw.replace(/,$/, '').replace(/\n/img, '') + "]";

		let val = JSON.parse(toBeParsed);
		verlet.Poly.map({
			x: parseInt(map.X.value),
			y: parseInt(map.Y.value),
			sizeX: parseInt(map.SIZEX.value),
			sizeY: parseInt(map.SIZEY.value),
			data: val
		}, points, constrains);
		updateUndoRedo();
	}


	/* ========= Miscellaneous ========= */
	uiu.preventRightClick();

	function id(id) {
		return document.getElementById(id);
	}

	const mouse = { x: 0, y: 0 }
	canvas.addEventListener('mousemove', function (e) {
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	});

	function distance(p1x, p1y, p2x, p2y) {
		let dx = p1x - p2x;
		let dy = p1y - p2y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	function colDetect(x, y, circle) {
		let dx = x - circle.x;
		let dy = y - circle.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	// DRAW GRID
	function drawGrid() {
		if (gridOpt.checked === true) {
			let gap = parseInt(gridGap.value);
			let gridX = 0;
			let gridY = 0;
			ctx.beginPath();
			ctx.strokeStyle = 'limegreen';
			for (let i = 0; i < canvas.width; i++) {
				gridX += gap;
				ctx.moveTo(gridX, canvas.width);
				ctx.lineTo(gridX, 0);
			}
			for (let i = 0; i < canvas.height; i++) {
				gridY += gap;
				ctx.moveTo(canvas.width, gridY);
				ctx.lineTo(0, gridY);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
	//drawTmpCir
	function drawTmpCir(arr) {
		if (arr.length > 0) {
			for (let i = 0; i < arr.length; i++) {
				verlet.Draw.arc(arr[i].x, arr[i].y, 5, 'gray', 1, true);
			}
		}
	}
	function drawTmpLine(arr) {
		// tmpLine
		if (arr.length > 0) {
			verlet.ctx.beginPath();
			verlet.ctx.strokeStyle = 'white';
			verlet.ctx.moveTo(arr[0].x, arr[0].y);
			for (let i = 0; i < arr.length; i++) {
				verlet.ctx.lineTo(arr[i].x, arr[i].y);
			}
			verlet.ctx.stroke();
			verlet.ctx.closePath();
		}
	}

	//FPS
	let lastframe;
	let fps;
	let getFps;
	let frameTime;
	function getFrameRate() {
		if (!lastframe) {
			lastframe = Date.now();
			fps = 0;
			return;
		}
		let delta = (Date.now() - lastframe) / 1000;
		frameTime = (Date.now() - lastframe);
		lastframe = Date.now();
		fps = 1 / delta;
		return Math.round(fps);
	}

	//Get Range Slider Values And Display It
	function getVal(el) {
		uiu.setOn('input', el, function () {
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
	uiu.setOn('dragenter', canvas, function (e) {
		uiu.setStyle(dragDrop_load, {
			display: 'block'
		})
	});
	uiu.setOn('dragleave', dragDrop_load, function (e) {
		e.preventDefault();
		uiu.setStyle(dragDrop_load, {
			display: 'none'
		});
	});

	uiu.setOn('drop', dragDrop_load, function (e) {
		window.setTimeout(function () {
			forms = [];
			verlet.import('#overlaydrag', points, constrains, forms);
			uiu.setStyle(dragDrop_load, {
				display: 'none'
			});
			console.log('loaded');
		}, 100)
	});

	//save with CTRL+S
	function toggleModal(e) {
		uiu.modal({
			on: function () {
				return e
			},
			parent: '.container',
			toggle: '#ctrlSaveModal',
			in: ['top', '0%', '35%'],
		}, function () {
			uiu.query('#ctrlSaveModal > input').classList.remove('show');
		})
	}
	toggleModal(false);
	function ctrlSave(e) {
		e.preventDefault();
		toggleModal(true);

		let name = uiu.query('#ctrlSaveModal > input');
		uiu.onkey('enter', function () {
			// exportModel(points,constrains,forms,name.value);
			verlet.export(name.value, points, constrains, forms);
			toggleModal(false);
			uiu.query('#ctrlSaveModal > input').classList.add('show');

		}, name)
	}
	uiu.onkey('ctrl+s', ctrlSave);

	// Event Subscribers
	uiu.event.subEvent('toggleCursor', cbkToggle);
	function cbkToggle(pointers, once) {
		let bdy = document.body.style
		if (!once) {
			if (bdy.cursor === pointers[0]) {
				bdy.cursor = pointers[1];
			} else {
				bdy.cursor = pointers[0];
			}
		} else {
			bdy.cursor = once;
		}
	}

	// TODO:  FIX LAGGING ON "W" KEY WITH hexagon floating MENU


	/*
	 * ======= Keyboard Functionalities =======
	 */
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
						if (initUI.states['line-hidden'] == true) {
							hidden = true;
						}
						if (initUI.states['auto-join'] === false) {
							for (let k = 0; k < handleArray.length; k++) {
								handleArray[k][2] = { hidden: hidden };
								console.log(handleArray)
								verlet.clamp([handleArray[k]], points, constrains);
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
							verlet.clamp(tmpAuto, points, constrains);
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
					uiu.showTooltip(mouse, '#colorIndicator', { x: 19, y: 30 }, function () {
						this.style.backgroundColor = shapecolor.value;
					});
					canvas.style.cursor = 'alias';

					let fContentShape = id('floating-content-shape');
					fContentShape.classList.add('show');

					uiu.draggable({
						parent: '.tooltips',
						child: '#floating-content-shape',
						dragger: '.shape'
					})
					break;

				case 87:
					canvas.addEventListener('mousedown', pushAutoJoinArr);
					canvas.style.cursor = 'crosshair';
			}
		}

		// Delete and update undoredo explicitly to improve performence
		// and also added uiu.throttle
		uiu.onkey('DELETE', uiu.throttle(function () {
			for (let i = 0; i < constrains.length; i++) {
				while (constrains[i].id.indexOf(verlet.handleIndex) !== -1) {
					constrains.splice(i, 1);
					// break;
				}
			}
			updateUndoRedo();
		}, 100));

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
					tmpLine = [];
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

					let fContentShape = id('floating-content-shape');
					fContentShape.classList.remove('show');

				// updateUndoRedo();
				case 87:
					createAutoJoin();
					canvas.removeEventListener('mousedown', pushAutoJoinArr);
					canvas.style.cursor = 'pointer';
			}
		}

		/*
		 * ======= Core Functionalities =======
		 */

		/* Create Points */
		function definePoints(e) {
			let pinned;
			let color;
			pinned = (initUI.states['pin-point']) ? true : false;
			color = (initUI.states['pin-point']) ? 'crimson' : null;
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

					// tmpLine.push({x : points[i].x,y :  points[i].y})
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

			// console.log(tmpHandleForTmpLine)

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


		// Auto Create And JOIN
		function pushAutoJoinArr(e) {
			//push to arrays
			tmpCir.push({ x: e.offsetX, y: e.offsetY });
			tmpLine.push({ x: e.offsetX, y: e.offsetY });
			AutojoinArr.push([e.offsetX, e.offsetY]);
		}
		function createAutoJoin(e) {
			if (AutojoinArr.length > 1) {
				let first = AutojoinArr[0];
				let last = AutojoinArr[AutojoinArr.length - 1]
				let join = false;
				//join if last and first point is touching
				if (distance(first[0], first[1], last[0], last[1]) < 10) {
					join = true;
					AutojoinArr.splice(AutojoinArr.length - 1, 1);
				}
				verlet.Poly.line({
					data: AutojoinArr,
					joinEnd: join
				}, points, constrains);
			}
			//reset arrays
			AutojoinArr = [];
			tmpCir = [];
			tmpLine = [];
		}
	}
	initCore();


	/*
		Dragging and Drawing
	*/
	initDragDrawing();
	function initDragDrawing() {
		//drag draw
		drag.init(verlet.canvas, (x, y, w, h) => drawBox(x, y, w, h));
		drag.init(verlet.canvas, (x, y, w, h) => drawRope(x, y, w, h));
		drag.init(verlet.canvas, (x, y, w, h) => drawHexagon(x, y, w, h));

		//draw and create with shortcuts
		box.draw.onchange = function () {
			uiu.event.emit('toggleCursor', [['crosshair', 'default']]);
		}

		uiu.onkey('b', function () {
			box.draw.checked = true;
			canvas.style.cursor = 'crosshair';
		});

		uiu.onkey('r', function () {
			rope.draw.checked = true;
			canvas.style.cursor = 'crosshair';
		});

		uiu.onkey('h', function (e) {
			hexa.draw.checked = true;
			canvas.style.cursor = 'crosshair';
			let fContent = id('floating-content');
			fContent.classList.add('show');
		});
		uiu.draggable({
			parent: '.tooltips',
			child: '#floating-content',
			dragger: '.dragger'
		});

		uiu.on('keyup', document, function (e) {
			box.draw.checked = false;
			rope.draw.checked = false;
			canvas.style.cursor = 'default';

			if (e.which === 72) {
				let fContent = id('floating-content');
				hexa.draw.checked = false;
				fContent.classList.remove('show');
			}
		});
	}
	function _drawbox(x, y, w, h) {
		ctx.beginPath();
		ctx.strokeStyle = 'gray';
		ctx.strokeRect(x, y, w, h);
		ctx.stroke();
		ctx.closePath();
	}
	function drawTmpBox(x, y, w, h) {
		_drawbox(x, y, w, h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('w: ' + w + 'px', w + x + 10, h + y - 25);
		ctx.fillText('h: ' + h + 'px', w + x + 10, h + y - 10);
		ctx.fill();
		ctx.closePath();
	}

	function drawTmpRope(x, y, w, h) {
		_drawbox(x, y, w, h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('gap: ' + h + 'px', x + 10, h + y + 20);
		ctx.fillText('parts: ' + Math.round(w / 12) + '', w + x + 15, y + 15);
		ctx.fill();
		ctx.closePath();
	}
	function drawTmpHexa(x, y, w, h) {
		_drawbox(x, y, w, h);
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.font = '12px Century Gothic';
		ctx.fillText('radius: ' + h / 2 + 'px', x + 10, h + y + 20);
		ctx.fillText('parts: ' + Math.round(w / 12) + '', w + x + 15, y + 15);
		ctx.fill();
		ctx.closePath();
	}



	// render toggling variables
	let isRenderShapes;
	let isRenderDots;
	let isRenderLines;
	let isRenderHiddenLines;
	let isRenderPointIndex;
	let isRenderStress;
	let isRenderDotsAsBox;

	verlet.Interact.move(points, 'white');
	/* ====== ANIMATE ====== */
	function animate() {
		verlet.clear();

		drag.draw(function (x, y, w, h) {
			drawTmpBox(x, y, w, h);
		}, box.draw.checked);
		drag.draw(function (x, y, w, h) {
			drawTmpRope(x, y, w, h);
		}, rope.draw.checked);
		drag.draw(function (x, y, w, h) {
			drawTmpHexa(x, y, w, h);
		}, hexa.draw.checked);

		verlet.gravity = parseFloat(gravity.value) || 0;
		verlet.bounce = parseFloat(bounce.value) || 0;
		verlet.friction = parseFloat(friction.value) || 1;
		verlet.stiffness = parseFloat(stiffness.value) || 1;

		//physics update
		verlet.superUpdate(points, constrains, PhysicsAccuracy.value, { hoverColor: 'white' });


		//render conditions
		(shapeOpt.checked === true) ? verlet.renderShapes(forms) : false;
		isRenderLines = LineOpt.checked;
		isRenderHiddenLines = LineHiddenOpt.checked;
		isRenderPointIndex = IndexOpt.checked;
		isRenderDots = dotOpt.checked;
		isRenderStress = LineStressOpt.checked;
		isRenderDotsAsBox = dotsAsBoxOpt.checked;

		//render loop
		verlet.superRender(points, constrains, {
			renderDots: isRenderDots,
			renderLines: isRenderLines,
			renderHiddenLines: isRenderHiddenLines,
			renderPointIndex: isRenderPointIndex,
			renderDotsAsBox: isRenderDotsAsBox,
			preset: 'shadowBlue'
		});
		if (isRenderStress) { verlet.renderStress(constrains); }

		/* Temp Circles and Miscs */
		drawGrid();
		drawTmpCir(tmpCir);
		drawTmpLine(tmpLine);
		getFps = getFrameRate();


		requestAnimationFrame(animate);
	}

	window.setInterval(function () {
		initUI.debug(points, constrains, getFps, verlet);
	}, 100);
	animate();

	initLivePreviews(hexa, map);

}//verletDrawing;
