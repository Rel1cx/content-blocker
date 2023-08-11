import { Effect } from "effect";

import { DATA_CONTENT_BLOCKER_BLOCKED } from "../constants";
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

	// Reply
	'[class="reply-item"]',
	'[class="sub-reply-item"]',

	// Misc
	"[data-aid]",
	"[data-cid]",
	'[href*="bilibili.com/video/BV"]',
];

const finalSelectors = `:where(${selectors.join(", ")}):not([${DATA_CONTENT_BLOCKER_BLOCKED}="true"])`;

export const collect = Collect.of({
	collect: () => Effect.succeed(document.querySelectorAll(finalSelectors)),
	collectBlocked: () => Effect.succeed(document.querySelectorAll(`[${DATA_CONTENT_BLOCKER_BLOCKED}="true"]`)),
	isBlocked: (el) => Effect.succeed(el.getAttribute(DATA_CONTENT_BLOCKER_BLOCKED) === "true"),
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
			el.setAttribute("aria-hidden", "true");
			el.setAttribute("aria-disabled", "true");
		});
	},
	recover: (el) => {
		return Effect.sync(() => {
			el.removeAttribute(DATA_CONTENT_BLOCKER_BLOCKED);
			el.removeAttribute("aria-hidden");
			el.removeAttribute("aria-disabled");
		});
	},
});
