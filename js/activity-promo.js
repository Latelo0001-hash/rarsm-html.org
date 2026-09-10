(function (window, document) {
	"use strict";

	var modal = document.getElementById("activityPromoModal");
	if (!modal || typeof window.fetch !== "function") {
		return;
	}

	var params = new URLSearchParams(window.location.search);
	var previewDate = params.get("activity_preview");
	var endpoint = "api/activity-today.php" + (previewDate ? "?date=" + encodeURIComponent(previewDate) : "");

	function language() {
		return window.localStorage.getItem("rarsm-language") === "en" ? "en" : "fr";
	}

	function labels(lang) {
		return lang === "en" ? {
			eyebrow: "TODAY'S MINING EVENT",
			details: "View event details",
			close: "Close",
			more: "Other events are also taking place today."
		} : {
			eyebrow: "ACTIVITÉ MINIÈRE DU JOUR",
			details: "Voir les détails",
			close: "Fermer",
			more: "D’autres activités ont également lieu aujourd’hui."
		};
	}

	function setText(selector, value) {
		var element = modal.querySelector(selector);
		if (element) {
			element.textContent = value || "";
		}
	}

	function render(payload) {
		var activity = payload.activity;
		if (!activity) {
			return;
		}

		var lang = language();
		var copy = labels(lang);
		var storageKey = "rarsm-activity-promo:" + payload.date + ":" + activity.id;
		if (!previewDate && window.localStorage.getItem(storageKey)) {
			return;
		}

		setText("[data-activity-promo-eyebrow]", copy.eyebrow);
		setText("[data-activity-promo-title]", activity.title);
		setText("[data-activity-promo-date]", activity.date_label);
		setText("[data-activity-promo-location]", activity.location);
		setText("[data-activity-promo-summary]", activity.summary);
		setText("[data-activity-promo-more]", payload.activity_count > 1 ? copy.more : "");
		setText("[data-activity-promo-details]", copy.details);

		var image = modal.querySelector("[data-activity-promo-image]");
		if (image) {
			image.src = activity.image;
			image.alt = activity.image_alt;
		}

		var link = modal.querySelector("[data-activity-promo-link]");
		if (link) {
			link.href = activity.details_url;
		}

		var closeButtons = modal.querySelectorAll("[data-dismiss='modal']");
		Array.prototype.forEach.call(closeButtons, function (button) {
			button.setAttribute("aria-label", copy.close);
		});

		if (!previewDate) {
			window.localStorage.setItem(storageKey, "shown");
		}

		if (window.jQuery && typeof window.jQuery.fn.modal === "function") {
			window.jQuery(modal).modal("show");
		}
	}

	window.fetch(endpoint, { credentials: "same-origin", headers: { Accept: "application/json" } })
		.then(function (response) {
			if (!response.ok) {
				throw new Error("Activity API unavailable");
			}
			return response.json();
		})
		.then(function (payload) {
			if (payload && payload.ok) {
				render(payload);
			}
		})
		.catch(function () {
			// The homepage remains fully usable if PHP or the API is unavailable.
		});
}(window, document));
