import { Effect } from "effect";

import { CONTENT_BLOCKER_OVERRIDES, DATA_CONTENT_BLOCKER_BLOCKED } from "../constants";
import { Collect } from "../core/collect";
import { Disposal } from "../core/disposal";
import { Extract } from "../core/extract";
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

const styleOverrides = `
[data-content-blocker-blocked="true"] {
	display: none !important;
	opacity: 0 !important;
	visibility: hidden !important;
	overflow: hidden !important;
	pointer-events: none !important;
}
`;

export const init = Effect.sync(() => {
	const styleEl = document.createElement("style");
	styleEl.id = CONTENT_BLOCKER_OVERRIDES;
	styleEl.textContent = styleOverrides;
	document.head.append(styleEl);
});

export const deinit = Effect.sync(() => {
	// eslint-disable-next-line unicorn/prefer-query-selector
	document.getElementById(CONTENT_BLOCKER_OVERRIDES)?.remove();
});

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
