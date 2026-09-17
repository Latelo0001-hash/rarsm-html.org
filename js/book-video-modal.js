(function ($) {
	"use strict";

	var $modal = $("#bookPresentationVideoModal");
	var video = $modal.find("[data-book-presentation-video]").get(0);

	if (!$modal.length || !video) {
		return;
	}

	$modal.on("shown.bs.modal", function () {
		var playback = video.play();
		if (playback && typeof playback.catch === "function") {
			playback.catch(function () {
				// Certains navigateurs exigent une seconde action de l’utilisateur.
			});
		}
	});

	$modal.on("hide.bs.modal", function () {
		video.pause();
		video.currentTime = 0;
	});
})(jQuery);
