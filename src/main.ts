import "./styles.css";
import "@total-typescript/ts-reset";

import * as F from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import elementReady from "element-ready";
import { debounce } from "throttle-debounce";

import { KEYWORD_FILTER_SELECTORS, NORMALIZED_KEYWORDS } from "./constants";
import { make } from "./filters/keyword-filter";
import { BlockServiceLive } from "./services/block-service";

const keywordFilterProgram = make(KEYWORD_FILTER_SELECTORS.join(", "), NORMALIZED_KEYWORDS);

const keywordFilterRunnable = F.pipe(keywordFilterProgram, Effect.provideLayer(BlockServiceLive));

const debouncedRunKeywordFilter = debounce(100, () => Effect.runFork(keywordFilterRunnable), {
	atBegin: true,
});

function observer(container = document.body) {
	window.addEventListener("hashchange", debouncedRunKeywordFilter);
	window.addEventListener("focus", debouncedRunKeywordFilter);

	const mutationObserver = new MutationObserver((mutations) => {
		const childListChanged = mutations.some((mutation) => mutation.type === "childList");

		if (!childListChanged) {
			return;
		}

		debouncedRunKeywordFilter();
	});

	mutationObserver.observe(container, {
		childList: true,
		subtree: true,
	});

	return Effect.sync(() => {
		mutationObserver.disconnect();
		window.removeEventListener("focus", debouncedRunKeywordFilter);
		window.removeEventListener("hashchange", debouncedRunKeywordFilter);
	});
}

function main() {
	F.pipe(
		Effect.promise(() => elementReady("body")),
		Effect.flatMap(() => Effect.sync(observer)),
		Effect.tap(() => Effect.log("BiliBili Filter is running...")),
		Effect.catchAll((e) => Effect.sync(() => console.error(e))),
		Effect.runPromise,
	);
}

main();
