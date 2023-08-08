// import { keyword } from "../block-list.example.json";
import { keyword } from "../block-list.json";
import { stringNormalize } from "./lib/string-normalize";

export const NORMALIZED_KEYWORDS = keyword.map(stringNormalize).map((word) => word.toLowerCase().trim());

export const KEYWORD_FILTER_SELECTORS = [
	// Main site
	'[class^="rank-item"]',
	'[class^="feed-card"]',
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
	'[class^="floor-card"]',
	'[class^="carousel-slide"]',
	'[href*="bilibili.com/video/BV"]',
] as const;
