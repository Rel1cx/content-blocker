import { Effect } from "effect";

import { CONTENT_BLOCKER_OVERRIDES, DATA_CONTENT_BLOCKER_BLOCKED } from "../constants";
import { Collect, Disposal, Extract } from "../core";
import { textContentNormalize } from "../lib/text-content-normalize";

const selectors = [
	// Main
	"[data-aid]",
	"[data-cid]",
	'[class^="feed-card"]',
	'[class*="video-card"]',
	'[class^="video-page-card"]',
	'[class*="related-item"]',
	'[class^="rank-item"]',

	// Live
	'[class^="room-card"]',

	// Article
	'[class^="article-item"]',

	// Reply
	'[class="reply-item"]',
	'[class="sub-reply-item"]',

	// Misc
	'[class^="floor-card"]',
	'[class^="carousel-slide"]',
	'[href*="bilibili.com/video/BV"]',
];

const selectorsCombined = `:where(${selectors.join(", ")}):not([${DATA_CONTENT_BLOCKER_BLOCKED}="true"])`;

export const collect = Collect.of({
	collect: () => Effect.succeed(document.querySelectorAll(selectorsCombined)),
	collectBlocked: () => Effect.succeed(document.querySelectorAll(`[${DATA_CONTENT_BLOCKER_BLOCKED}="true"]`)),
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
			el.setAttribute(DATA_CONTENT_BLOCKER_BLOCKED, "true");
			el.setAttribute("hidden", "true");
			el.setAttribute("aria-hidden", "true");
			el.setAttribute("aria-disabled", "true");
		});
	},
	recover: (el) => {
		return Effect.sync(() => {
			el.removeAttribute(DATA_CONTENT_BLOCKER_BLOCKED);
			el.removeAttribute("hidden");
			el.removeAttribute("aria-hidden");
			el.removeAttribute("aria-disabled");
		});
	},
});
