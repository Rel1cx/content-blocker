import * as Effect from "@effect/io/Effect";

import { Collect } from "../core/collect";
import { Disposal } from "../core/disposal";
import { Extract } from "../core/extract";
import { textContentNormalize } from "../lib/text-content-normalize";

const selectors = [
	// Main site
	'[class^="floor-card"]',
	'[class^="carousel-slide"]',
	'[class^="rank-item"]',
	// '[class^="feed-card"]',
	'[class^="video-page-card"]',
	'[class*="video-card"]',
	'[class*="related-item"]',

	// Live
	'[class^="room-card"]',

	// Article
	'[class^="article-item"]',

	// Misc
	"[data-aid]",
	"[data-cid]",
	'[href*="bilibili.com/video/BV"]',
];

export const collect = Collect.of({
	collect: () => Effect.succeed(document.querySelectorAll(selectors.join(", "))),
});

export const extract = Extract.of({
	extract: (el) => {
		return Effect.sync(() => {
			return textContentNormalize(el.textContent ?? "")
				.toLowerCase()
				.trim();
		});
	},
});

export const disposal = Disposal.of({
	dispose: (el) => {
		return Effect.sync(() => {
			el.setAttribute("data-content-blocker-blocked", "true");
			el.setAttribute("aria-hidden", "true");
			el.setAttribute("aria-disabled", "true");
		});
	},
	recover: (el) => {
		return Effect.sync(() => {
			el.removeAttribute("data-content-blocker-blocked");
			el.removeAttribute("aria-hidden");
			el.removeAttribute("aria-disabled");
		});
	},
});
