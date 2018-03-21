/*FileSystem*/
const fs = (function(){
	function read(fid) {
		const input = document.querySelector(fid);
		const f = input.files[0];
		const fsys = new FileReader();
		fsys.readAsText(f);
		fsys.onerror = function(err) {
			console.log("fs.read =>> ERROR :" + err);
		};
		return [fsys,f];
	};
	function create(opt) {
		let content = opt.content || 'doIt.js FileSystem And Blobs',
			type = opt.type || 'text/plain',
			name = opt.name || 'doItJS',
			blob = new Blob([content],{type : type}),
			url = window.URL.createObjectURL(blob),
			lnk = document.createElement('a');
		lnk.download = name;
		lnk.href = url;
		lnk.innerHTML = "fs.create";
		lnk.style.display = 'none';
		document.body.appendChild(lnk);
		lnk.click();
		document.body.removeChild(lnk);
	};
	return {
		read : read,
		create : create
	}
})();