/* Load And Export Model */
/**
 *	Export as .json file with file reader api
 */
"use strict";
function exportModel(dots,cons,shapes,unnamed) {
	let tmpP = [];
	let pushInMe = [];
	let tmpS = [];
	for (let i = 0; i < dots.length; i++) {
		const p = dots[i];
		tmpP.push([p.x,p.y,p.oldx,p.oldy,p.pinned, p.color]);
	}
	for (let j = 0; j < cons.length; j++) {
		let tmpPush = [];
		const c = cons[j];
		tmpPush = c.id;
		tmpPush[2] = c.hidden;
		tmpPush.length = 3;
		pushInMe.push(tmpPush);
	}
	
	// TODO: FIX SHAPES MULTIPLE COLOR
	for (let k = 0; k < shapes.length; k++) {
		// debugger;
		let tmpShapePush = [];
		const c = shapes[k];
		
		console.log(typeof shapes[k].id[shapes[k].id.length - 1])		
		
		let idLen = c.id.length;
		tmpShapePush = c.id;
		
		tmpShapePush.push(c.color);
		// console.log(idLen +1)
		tmpShapePush.length = idLen+1;
		tmpS.push(tmpShapePush);
	}

	
	let time = new Date().toLocaleString();
	let name = unnamed;
	//Compilation For Verlet.create And Verlet.clamp

	//TODO : INFO IN SAVE FILES
	let info = {
		file : unnamed,
		dateCreated : time,
		type : 'JSON(invalid)',
		generator : 'VerletDrawing',
		author : 'Anurag Hazra <hazru.anurag@gmail.com>',
		poweredBy : 'Verlet.js',
		repo : 'wwww.github.com/anuraghazra/verlet.js'
	}

	const strInfo = JSON.stringify(info);
	const strP = JSON.stringify(tmpP);
	const strC = JSON.stringify(pushInMe);
	const strS = JSON.stringify(tmpS);
	let compiled = strP + ' || ' + strC + ' || ' + strS;
	// regExp for triming floating integers for 
	// low file size
	compiled = compiled.replace(/\.\d{5,}\,/img,',');
	console.log(compiled)

	if(typeof unnamed === 'string') {
		name = unnamed + '.json';
	}
	if(Boolean(unnamed) === false) {
		name = time + '.json';
	}

	fs.create({
		type : 'application/json',
		name : name,
		content : compiled
	});

}

/*Load Model*/
/*
 *	load .json file and parse it to verlet
 *	update Interact
 *	superUpdate
 */
function loadFile(fid,dots,cons,shapes,verlet) {
	const PhysicsAccuracy = document.getElementById('Iterrations');
	let data = fs.read(fid);
	dots.splice(0,dots.length);
	cons.splice(0,cons.length);
	data[0].onload = function() {
		let result = data[0].result.split(' || ');
		let arrDots = JSON.parse(result[0]); //Points
		let arrCons = JSON.parse(result[1]); //Constrains
		verlet.create(arrDots,dots);
		verlet.clamp(arrCons,cons,dots);

		if(result[2]) { //Backward Save File Compat // Forms
			let arrForms = JSON.parse(result[2]);
			for (let i = 0; i < arrForms.length; i++) {
				verlet.shape(arrForms[i],shapes,dots);
			}
		}
	};
	verlet.Interact.move(dots,cons,10,'white');
	verlet.superUpdate(dots,cons,PhysicsAccuracy.value);
}