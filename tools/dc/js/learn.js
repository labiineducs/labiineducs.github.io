/* main.js */

if (typeof Q5 != 'undefined') Q5.canvasOptions.alpha = true;

/* learn.js */

let args = {};

{
	let url = location.href.split('?');
	if (url.length > 1) {
		let params = new URLSearchParams(url[1]);
		for (let pair of params.entries()) {
			args[pair[0]] = pair[1];
		}
	}
}

let pages = document.getElementsByClassName('page');
let pageNav = document.getElementById('pageNav');
let currentPage = 0;

let article;

async function start() {
	article = document.body.children[3].children[0].children[0].children[0].children[0];

	function loadScript(src) {
		return new Promise(function (resolve) {
			let script = document.createElement('script');
			script.src = src;
			script.onload = resolve;
			document.body.appendChild(script);
		});
	}

	async function loadScripts(sources) {
		for (let src of sources) await loadScript(src);
	}

	if (navigator.onLine) {
		await loadScripts([
			'https://cdn.jsdelivr.net/npm/ace-builds@1.42.0/src-min-noconflict/ace.min.js',
			'https://cdn.jsdelivr.net/npm/ace-builds@1.42.0/src-min-noconflict/ext-language_tools.js',
			'https://cdn.jsdelivr.net/npm/ace-builds@1.42.0/src-min-noconflict/ext-beautify.js'
		]);
	} else {
		await loadScripts([
			'/learn/ace/ace.min.js',
			'/learn/ace/ext-language_tools.js',
			'/learn/ace/mode-javascript.js',
			'/learn/ace/theme-dracula.js',
			'/learn/ace/theme-xcode.js',
			'ace/ext-beautify.js'
		]);
	}

	if (pageNav) {
		let previousPage = document.getElementById('prevPage');
		previousPage.onclick = function () {
			if (currentPage - 1 > -1) {
				let i = currentPage - 1;
				let url = `?page=${i}`;
				history.pushState({}, 'p5play : Sprite : ' + i, url);
				loadPage(i);
			}
		};

		let nextPage = document.getElementById('nextPage');
		nextPage.onclick = function () {
			if (currentPage + 1 < pages.length) {
				let i = currentPage + 1;
				let url = `?page=${i}`;
				history.pushState({}, 'p5play : Sprite : ' + i, url);
				loadPage(i);
			}
		};

		loadPage();
	}
}
start();

function loadPage(pageNum) {
	article.style.display = 'none';

	pageNum = pageNum ?? args.page ?? 0;

	for (let i = 0; i < pages.length; i++) {
		let el = pageNav.children[i];
		if (el.dataset.page == pageNum) {
			el.classList.add('active');
		} else {
			el.classList.remove('active');
		}
	}
	for (let mini of mie) {
		mini.remove();
	}
	for (let page of pages) {
		page.style.display = 'none';
	}
	let page = document.getElementById('page-' + pageNum);
	page.style.display = 'flex';
	mie.loadMinis(page);
	mie.theme = 'light';
	document.body.scrollTop = 0; // for Safari
	document.documentElement.scrollTop = 0; // Chrome, Firefox, and Opera
	currentPage = parseInt(pageNum);

	document.getElementById('toc').style.display = 'flex';

	article.style.display = 'flex';
}




