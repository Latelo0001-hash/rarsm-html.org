(function () {
	'use strict';

	function initMotion() {
		var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		var sectionSelector = [
			'#box_wrapper > section:not(.page_slider):not(.rarsm-mobile-hero):not(.page_footer):not(.page_copyright):not(#author)',
			'#main-content > section:not(.page_slider):not(.rarsm-mobile-hero):not(#about):not(#quotes)'
		].join(',');
		var cardSelector = '.institutions-service-card, .activities-detail-main-card, .activities-detail-side-card, .rarsm-status-card, .hero-bg, .card';
		var sections = Array.prototype.slice.call(document.querySelectorAll(sectionSelector)).filter(function (section) {
			return !section.closest('.activities-main-content');
		});
		var cards = Array.prototype.slice.call(document.querySelectorAll(cardSelector));
		var authorPortraits = Array.prototype.slice.call(document.querySelectorAll('#author .author-photo'));
		var authorTextItems = Array.prototype.slice.call(document.querySelectorAll('#author p, #author h2.special-heading, #author .columns-two'));
		var authorItems = authorPortraits.concat(authorTextItems);
		var aboutRows = Array.prototype.slice.call(document.querySelectorAll('#about > .container > .row'));
		var aboutItems = [];

		authorItems.forEach(function (item, itemIndex) {
			item.dataset.motionSequence = String(itemIndex);
		});

		aboutRows.forEach(function (row) {
			var rowItems = Array.prototype.slice.call(row.querySelectorAll('.border-r-def.overflow-hidden, h3.special-heading, p'));

			rowItems.forEach(function (item, itemIndex) {
				item.dataset.motionSequence = String(itemIndex);
				aboutItems.push(item);
			});
		});

		var items = sections.concat(cards, authorItems, aboutItems).filter(function (item, index, list) {
			return list.indexOf(item) === index && !item.closest('.page_header, .modal');
		});

		items.forEach(function (item, index) {
			item.classList.add('rarsm-motion-item');
			var aboutSequence = Number(item.dataset.motionSequence);
			var delayStep = Number.isFinite(aboutSequence) ? Math.min(aboutSequence, 10) : Math.min(index % 4, 3);
			item.style.setProperty('--motion-delay', delayStep * 85 + 'ms');

			if (cards.indexOf(item) !== -1) {
				item.classList.add('motion-scale');
			} else if (authorItems.indexOf(item) !== -1) {
				item.classList.add(item.matches('.author-photo') ? 'motion-scale' : 'motion-from-left');
			} else if (aboutItems.indexOf(item) !== -1) {
				if (item.matches('.border-r-def.overflow-hidden')) {
					item.classList.add('motion-scale');
				} else {
					var column = item.closest('.col-lg-6');
					var columns = column && column.parentElement
						? Array.prototype.slice.call(column.parentElement.children).filter(function (child) {
							return child.classList.contains('col-lg-6');
						})
						: [];
					item.classList.add(columns.indexOf(column) === 0 ? 'motion-from-left' : 'motion-from-right');
				}
			} else {
				item.classList.add(index % 2 ? 'motion-from-right' : 'motion-from-left');
			}
		});

		if (reduced || !window.IntersectionObserver) {
			items.forEach(function (item) { item.classList.add('motion-visible'); });
			return;
		}

		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('motion-visible');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

		items.forEach(function (item) { observer.observe(item); });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initMotion, { once: true });
	} else {
		initMotion();
	}
}());
