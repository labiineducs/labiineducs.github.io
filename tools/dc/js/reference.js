let refs = {
	'Funciones Básicas': {
		0: ['pintar', 'derecha', 'izquierda', 'arriba', 'abajo'],
	},
	'Color': {
		2: ['seleccionarColor', 'siguienteColor', 'colores' ]
	},
	'Valores': {
		4: ['números'],
		2: ['colores']
	},
	'Sensores': {
		3: ['estaPintado', 'colorCelda', 'colorActivo'],
		4: ['posicionX', 'posicionY']
	},
	'q5.js basics': {
		'https://p5js.org/reference/p5/': [
			'let',
			'if',
			'function',
			'while',
			'Boolean',
			'String',
			'Number',
			'Array',
			'for',
			'random',
			'max',
			'min'
		]
	}
};

let refsDiv = document.getElementById('refs');

for (let refPage in refs) {
	let ref = refs[refPage];
	let className = refPage;
	let p5playRef = true;
	if (className.slice(0, 2) != 'q5') {
		className = className.split('.')[0];
		if (className == 'Sensores') { 
			className = 'Sensores';
		    refPage = 'tutorial.html'; 
		}	
		if (className == 'Sprite_Animation') className = 'Animation';
		if (className == 'Input_Devices') className = 'Input';
		refPage = refPage.toLowerCase();
	} else {
		if (className == 'q5.js basics') className = 'JavaScript basics';
		refPage = 'https://q5js.org/learn';
		p5playRef = false;
	}
	
	refPage = 'tutorial.html'; 

	let div = document.createElement('div');
	div.className = 'ref';
	if (className == 'Sprite' || className == 'JavaScript basics') div.classList.add('full');
	let heading = document.createElement('h2');
	heading.innerHTML = `${className}`;
	div.append(heading);
	refsDiv.children[refsDiv.children.length - 3].insertAdjacentElement('afterend', div);

	let links = [];
	for (let pageNum in ref) {
		let url;
		if (pageNum.length <= 2) {
			url = refPage + '?page=' + pageNum;
		} else {
			url = pageNum;
		}
		let topics = ref[pageNum];
		for (let topic of topics) {
			let a = document.createElement('a');
			if (p5playRef) {
				a.href = url;
			} else {
				a.href = url + topic;
				a.target = '_blank';
			}
			a.innerHTML = topic;
			links.push(a);
		}
	}

	// Step 1: Listen for Input Events
	const searchInput = document.getElementById('searchInput');
	const refsContainer = document.getElementById('refs');

	searchInput.addEventListener('input', function (event) {
		const searchTerm = event.target.value.toLowerCase();

		// filter results based on search
		filterReferences(searchTerm);
	});

	// filter the references on the page
	function filterReferences(searchTerm) {
		const refsElements = refsContainer.querySelectorAll('.ref');

		for (let refElement of refsElements) {
			const topics = refElement.querySelectorAll('a:not(h2 a)');
			let hasMatchingTopic = false;

			for (let topic of topics) {
				if (topic.textContent.toLowerCase().includes(searchTerm)) {
					topic.style.display = 'flex';
					hasMatchingTopic = true;
				} else {
					topic.style.display = 'none';
				}
			}

			refElement.style.display = hasMatchingTopic ? 'flex' : 'none';
		}
	}

	for (let link of links) {
		div.append(link);
	}
}

document.body.children[0].style.display = 'flex';
