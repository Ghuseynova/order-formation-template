function createCustomSelect() {
	document
		.querySelector('.f-select__btn')
		.addEventListener('click', function () {
			const parentEl = this.parentElement;
			parentEl.classList.toggle('f-select--opened');
		});

	for (const selectItem of document.querySelectorAll('.f-select__item ')) {
		selectItem.addEventListener('click', function (e) {
			e.stopPropagation();

			const el = e.currentTarget;

			if (!el.classList.contains('selected')) {
				if (el.parentNode.querySelector('.f-select__item.selected')) {
					el.parentNode
						.querySelector('.f-select__item.selected')
						.classList.remove('selected');
				}

				el.classList.add('selected');
				el
					.closest('.f-select')
					.querySelector('.f-select__txt').textContent = el.querySelector(
					'.f-select__item-label'
				).textContent;
				el.closest('.f-select').classList.remove('f-select--opened');
			}
		});
	}

	window.addEventListener('click', function (e) {
		const select = document.querySelector('.f-select');
		if (!select.contains(e.target)) {
			select.classList.remove('f-select--opened');
		}
	});
}

function createCustomInputFile() {
	const fileInput = document.querySelector('.form__input--upload');

	fileInput.addEventListener('change', function () {
		const currFiles = this.files;
		if (currFiles.length !== 0) {
			document.querySelector(
				'.form__label--upload .form__label-txt'
			).textContent = currFiles[0].name;
		} else {
			document.querySelector(
				'.form__label--upload > .form__label-txt'
			).textContent = 'No files uploaded';
		}
	});
}

function onRangeInput() {
	const rangeInput = document.querySelector('#range');

	rangeInput.addEventListener('input', function (e) {
		// console.log(e);
		const value = e.target.value;
		const min = e.target.min;
		const max = e.target.max;
		const percent = Math.floor((value / (max - min)) * 100);
		document.querySelector('.form__label-percent').textContent = `${percent} %`;
	});
}
createCustomSelect();
createCustomInputFile();
onRangeInput();
