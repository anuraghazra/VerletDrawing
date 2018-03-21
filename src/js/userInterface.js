// Verlet-Drawing UI
"use strict";
function initUI() {
	//uiu dropdown
	let isDown = false;
	uiu.dropdown({
		on : 'mousedown',
		off : 'mouseleave',
		parent : '.toolbar',
		childs : '.dd-button',
		content : '.dropdown-content',
		timer : 2000,
		dispatch : '#c',
		dispatchEvt : 'mousedown',
		effect : 'fadeSlide',
		effectStyles : {
			'top' : ['250%','32px']
		},
		noOverwrite : true
	},function(is) {
		isDown = is;
		let inputs = this.querySelectorAll('input, button');
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].blur();
		}
	});
	
	//hide contextmenu when dropdown is clicked
	uiu.setOn('mousedown','.toolbar',function(){
		const childs = uiu.query('.radialMenu > i',true);
		uiu.addClass('.radialMenu','hideRadialMenu');
		uiu.addClass('.radialMenuCenter','noEvent');
		for (let i = 0; i < childs.length; i++) {
			uiu.addClass(childs[i],'noEvent');
		}
	})

	//wooSlider
	uiu.wooSlider({
		parent : '.toolbar',
		childs : '.dd-button',
		offset : {
			x : -1
		}
	});

	//peekPop
	function peekPop() {
		uiu.eventDelegate({
			on : 'mouseover',
			parent : '.titleinfo-hover',
			find : '.dd-button',
			findDeeper : false,
			all : true,
			noOverwrite : true
		},function(target,p){
			let pop = p.querySelector('.firstmenu');
			
			if(!isDown) {
				uiu.setStyle(pop,{'top' : '40px'});
			}
			uiu.on('mouseleave',p,function(){
				uiu.setStyle(pop,{'top' : '0px'});
			});
			uiu.on('click','.toolbar',function() {
				uiu.setStyle(pop,{'top' : '0px'});
			});
		});
	}
	peekPop()

	//statusbar info
	uiu.eventDelegate({
		parent : '.toolbar',
		find : 'div.dd-button',
		findDeeper : false,
		noOverwrite : true
	},function(target,p){
		let data = target.closest('[data-name], [data-tooltip]');
		let statusText = uiu.id('statusbar');
		statusText.innerText = data.dataset.name ||
							   					data.dataset.tooltip;
	});


	//tooltips
	const tooltipOffset = {
		x : - 80,
		y : 30
	}
	uiu.tooltip({
		parent : '#pin-point',
		content : 'Create With Pinned Dots',
		contentClass : 'uiuTooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#line-hidden',
		content : 'Create With Hidden Lines',
		contentClass : 'uiuTooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#auto-join',
		content : 'Auto Join From Selected First And Last Point',
		contentClass : 'uiuTooltip',
		offset : tooltipOffset
	});

	//setting render tooltips	
	uiu.tooltip({
		parent : '#li-dots',
		content : `Toggle render dots`,
		contentClass : 'uiuTooltip',
		id : 'li-dots-tooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#li-lines',
		content : `Toggle render lines`,
		contentClass : 'uiuTooltip',
		id : 'li-lines-tooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#li-pointIndex',
		content : `Toggle render pointIndex`,
		contentClass : 'uiuTooltip',
		id : 'li-pointIndex-tooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#li-shapes',
		content : `Toggle render shapes`,
		contentClass : 'uiuTooltip',
		id : 'li-shapes-tooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#li-hiddenlines',
		content : `Toggle render hiddenlines`,
		contentClass : 'uiuTooltip',
		id : 'li-hiddenlines-tooltip',
		offset : tooltipOffset
	});
	uiu.tooltip({
		parent : '#li-gridguid',
		content : `Toggle render gridguid`,
		contentClass : 'uiuTooltip',
		id : 'li-gridguid-tooltip',
		offset : tooltipOffset
	});

	uiu.eventDelegate({
		on : 'click',
		parent : 'ul.rendersettings-icons',
		find : 'li',
		findDeeper : false
	},function(target) {
		let status = target.children[0].checked;
		let id = target.getAttribute('id');
		let text = id.replace('li-','');
		uiu.query('#'+id+'-tooltip').innerHTML = 'Toggle render '+ text +' <br>Status : '+status;

	})


	//input scroll
	// if mousewheel listener is added automatically
	// inputs will inscrease and decrease values
	uiu.eventDelegate({
		on : 'click',
		parent : '.toolbar',
		noOverwrite : true,
		find : 'input[type=number]',
		findDeeper : false,
	},function(target) {
		uiu.on('mousewheel',target,function() {})
	})

	//file info
	let fileinfo = uiu.id('fileinfo');
	let file = uiu.id('loadPoints');
	uiu.setOn('change',file,function() {
		let filedata = this.files[0];
		fileinfo.innerHTML = '<p>File Name : ' + filedata.name + '</p>' +
							 '<p>File Size : ' + Math.ceil(filedata.size / 1024) + 'kb</p>'
	})

	//debug panle
	function debug(dots, cons, fps, verlet) {
		const debugEnb = uiu.id('debug-enable'),
			debugPanel = uiu.id('debugpanel'),
			debugOut = uiu.id('debug-out'),
			consOut = uiu.id('debug-out-cons');
		debugOut.innerText = ' Points : ' + dots.length
							+ ' | Constrains : ' + cons.length
							+ ' | Handle Index : ' + verlet.handleIndex
							+ ' | FPS : ' + fps;
	}

	function fullSrc() {
		const doc = document.body;
		if (doc.webkitRequestFullScreen) {
			doc.webkitRequestFullScreen();
		}
		if (doc.mozRequestFullScreen) {
			doc.mozRequestFullScreen();
		}
	}
	
	
	/*
		Return To Global namespace 
	*/
	initUI.debug = debug;
	initUI.fullSrc = fullSrc;
}

initUI();
