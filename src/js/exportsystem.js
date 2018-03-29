/* Load And Export Model */
/**
 *	Export as .json file with file reader api
 */
"use strict";
function exportModel(dots,cons,shapes,unnamed) {
	let tmpP = [];
	let pushInMe = [];
	let tmpS = [];

	//points
	for (let i = 0; i < dots.length; i++) {
		const p = dots[i];
		tmpP.push([p.x,p.y,p.oldx,p.oldy,p.pinned, p.color]);
	}

	//cons
	for (let j = 0; j < cons.length; j++) {
		let tmpPush = [];
		const c = cons[j];
		tmpPush = c.id;
		tmpPush[2] = c.hidden;
		tmpPush.length = 3;
		pushInMe.push(tmpPush);
	}
	
	//forms
	// TODO: FIX SHAPES MULTIPLE COLOR
	for (let k = 0; k < shapes.length; k++) {
		// debugger;
		let tmpShapePush = [];
		const c = shapes[k];
		
		console.log(typeof shapes[k].id[shapes[k].id.length - 1])		
		
		let idLen = c.id.length;
		tmpShapePush = c.id;
		
		tmpShapePush.push(c.color);
		tmpShapePush.length = idLen+1;
		tmpS.push(tmpShapePush);
	}

	//time
	let time = new Date().toLocaleString();
	let name = unnamed;

	//file info
	let info = {
		file : unnamed,
		type : 'text/json',
		hierarchy : '[ {info}, points[[]], constrains[[]], forms[[]] ]',
		pointsCount : tmpP.length,
		constrainsCount : pushInMe.length,
		formsCount : tmpS.length,
		dateCreated : time,
		generator : 'VerletDrawing',
		author : 'Anurag Hazra',
		email : 'hazru.anurag@gmail.com',
		poweredBy : 'Verlet.js',
		repo : 'wwww.github.com/anuraghazra/verlet.js',
		license : 'MIT'
	}

	//Compilation For Verlet.create And Verlet.clamp
	const strInfo = info;
	const strP = tmpP;
	const strC = pushInMe;
	const strS = tmpS;

	let compiled = JSON.stringify([strInfo,strP,strC,strS]);
	// regExp for triming floating integers for 
	// low file size
	compiled = compiled.replace(/\.\d{5,}\,/img,',');

	if(typeof unnamed === 'string') {
		name = unnamed + '.vdart';
	}
	if(Boolean(unnamed) === false) {
		name = time + '.vdart';
	}

	fs.create({
		type : 'text/json',
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
		let result = JSON.parse(data[0].result);
		let arrDots = result[1]; //Points
		let arrCons = result[2]; //Constrains
		verlet.create(arrDots,dots); //create
		verlet.clamp(arrCons,cons,dots); //clamp

		if(result[3].length > 1) { // Forms
			let arrForms = result[3];
			for (let i = 0; i < arrForms.length; i++) {
				verlet.shape(arrForms[i],shapes,dots);
			}
		}
	};
	// reinit Interaction and physics
	verlet.Interact.move(dots,cons,10,'white');
	verlet.superUpdate(dots,cons,PhysicsAccuracy.value);
}