document.body.onload = function () {
	let preloader = document.querySelector('.preloader');
	if (!preloader.classList.contains('done')) {
		preloader.classList.add('done');
	}
};

const sSlider = () => {
	const sSliders = document.querySelectorAll('.js-slider');
	const width = window.innerWidth || document.clientWidth || body.clientWidth;

	sSliders.forEach((sSlider, i) => {
		const slider = tns({
			container: sSlider,
			items: 1,
			slideBy: 1,
			nav: true,
			speed: 500,
			controls: false,
			mouseDrag: true,
			navAsThumbnails: true,
			swipeAngle: false,
			preventScrollOnTouch: 'auto',
			autoplay: i === 0 ? true : false,
			autoplayTimeout: 5000,
			autoplayText: ['', ''],
			autoplayButton: false,
		});

		slider.events.on('transitionStart', function (info) {
			info.slideItems[info.index].classList.remove('fadeInLeft');
		});

		slider.events.on('transitionEnd', function (info) {
			info.slideItems[info.index].classList.add('fadeInLeft');
		});

		if (i > 2 && width >= 1024) {
			slider.destroy();
		}
	});
};

const tabs = () => {
	const tabLinks = document.querySelectorAll('.h-tab__link');
	const tabContent = document.querySelectorAll('.h-content__pane');

	tabLinks.forEach(function (el) {
		el.addEventListener('click', openTabs);
	});

	function openTabs(el) {
		el.preventDefault();
		var tab = el.currentTarget;
		var tabPane = tab.getAttribute('href');

		tabContent.forEach(function (el) {
			el.classList.remove('is-active');
		});

		tabLinks.forEach(function (el) {
			el.classList.remove('is-active');
		});

		document.querySelector('#' + tabPane).classList.add('is-active');

		tab.classList.add('is-active');
	}
};

const toRemoveSectionSlider = () => {
	const section = document.querySelector('.js-section');
	const sectionContainer = document.querySelector('.js-section .container');
	const sSlider = document.querySelector('.js-section .section__inner');
	const width = window.innerWidth || document.clientWidth || body.clientWidth;

	if (width >= 1024) {
		const sItems = document.querySelectorAll('.section__item');

		sSlider.remove();

		sectionContainer.insertAdjacentHTML(
			'beforeend',
			'<div class="section__inner"></div>'
		);

		sItems.forEach((sItem, i) => {
			sItem = sItem.cloneNode(true);
			document
				.querySelector('.section__inner')
				.insertAdjacentElement('beforeend', sItem);
		});
	}
};

const popupClose = () => {
	const popup = document.querySelector('.popup');
	const popupOverlay = document.querySelector('.popup__overlay');
	const popCLose = document.querySelector('.js-popup-close');
	const body = document.body;

	popupOverlay.addEventListener('click', function (event) {
		const parent = getClosest(event.target, '.popup');
		parent.classList.remove('popup--opened');
		body.classList.remove('is-unscrolled');
	});

	popCLose.addEventListener('click', function (event) {
		const parent = getClosest(event.target, '.popup');
		parent.classList.remove('popup--opened');
		body.classList.remove('is-unscrolled');
	});
};

const getClosest = function (elem, selector) {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function (s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	for (; elem && elem !== document; elem = elem.parentNode) {
		if (elem.matches(selector)) return elem;
	}
	return null;
};

const validateForm = () => {
	jQuery.validator.addMethod(
		'emailfull',
		function (value, element) {
			return (
				this.optional(element) ||
				/^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(
					value
				)
			);
		},
		'Обязательное поле'
	);

	if ($('.js-validate').length > 0) {
		$('.js-validate').each(function () {
			$(this).validate({
				rules: {
					user_name: 'required',
					phone: 'required',
					user_email: {
						required: true,
						emailfull: true,
					},
				},

				messages: {
					user_name: '',
					user_email: '',
				},

				submitHandler: function (form) {
					const spinner = document.querySelector('.s-form__load');
					const btn = document.querySelector('.s-form__btn');

					emailjs
						.sendForm('gmail', 'flexsent', form, 'user_SKdGUhnh40zTmMySWblYy')
						.then(
							(result) => {
								const popup = document.querySelector('#done');
								const body = document.body;
								console.log(result.text);

								popup.classList.add('popup--opened');
								body.classList.add('is-unscrolled');

								setTimeout(() => {
									if (popup.classList.contains('popup--opened')) {
										setTimeout(() => {
											popup.classList.remove('popup--opened');
											body.classList.remove('is-unscrolled');
										}, 3000);
									}
								}, 3000);

								spinner.classList.remove('is-sending');
								btn.classList.remove('is-disabled');
							},
							(error) => {
								console.log(error.text);
							}
						);

					spinner.classList.add('is-sending');
					btn.classList.add('is-disabled');
				},
			});
		});
	}

	return false;
};

const getContactUs = () => {
	const contactBtn = document.querySelector('.js-contact');

	function smoothScroll(e) {
		e.preventDefault();

		const currentAttr = this.getAttribute('href');
		const currentBlock = document.querySelector(currentAttr);
		const currentBlockOffset = currentBlock.offsetTop;

		window.scroll({
			top: currentBlockOffset,
			left: 0,
			behavior: 'smooth',
		});
	}

	contactBtn.addEventListener('click', smoothScroll);
};

function toFixSrx() {
	const isSafari =
		navigator.vendor &&
		navigator.vendor.indexOf('Apple') > -1 &&
		navigator.userAgent &&
		navigator.userAgent.indexOf('CriOS') == -1 &&
		navigator.userAgent.indexOf('FxiOS') == -1;

	function src() {
		const imgSrc = document.querySelector('img[data-src]');
		const imgLogo = document.querySelector('img[data-logo]');

		const width = window.innerWidth || document.clientWidth || body.clientWidth;

		if (width > 1023 && width < 1440) {
			imgSrc.src = 'assets/img/bg-tablet.svg';
		} else if (width >= 1440 && width < 1920) {
			imgSrc.src = 'assets/img/bg-desktop.svg';
		} else if (width >= 1920) {
			imgSrc.src = 'assets/img/bg-lg-screen.svg';
		} else {
			imgSrc.src = 'assets/img/bg-mobile.svg';
		}
	}

	if (isSafari == true) {
		window.addEventListener('load', src);
		window.addEventListener('resize', src);
	}
}

function init() {
	sSlider();

	tabs();

	toRemoveSectionSlider();

	validateForm();

	popupClose();

	getContactUs();

	toFixSrx();
}

init();
