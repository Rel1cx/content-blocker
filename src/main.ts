import "@total-typescript/ts-reset";
import "./styles/base.css";

import * as F from "@effect/data/Function";
import * as Effect from "@effect/io/Effect";
import elementReady from "element-ready";
import { debounce } from "throttle-debounce";

import { make } from "./core/blocker";
import { Collect } from "./core/collect";
import { Disposal } from "./core/disposal";
import { Extract } from "./core/extract";
import * as bilibili from "./impl/bilibili.com";
import * as preset from "./presets/test.json";

const blocker = make(preset);

const BiliBiliBlockRunnable = F.pipe(
	blocker,
	Effect.provideService(Collect, bilibili.collect),
	Effect.provideService(Extract, bilibili.extract),
	Effect.provideService(Disposal, bilibili.disposal),
);

const debouncedRunKeywordFilter = debounce(100, () => Effect.runSync(BiliBiliBlockRunnable), {
	atBegin: true,
});

function observer(container = document.body) {
	return Effect.sync(() => {
		const mutationObserver = new MutationObserver(debouncedRunKeywordFilter);

		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
		});

		Effect.addFinalizer(() => Effect.sync(() => mutationObserver.disconnect()));
	});
}

const program = F.pipe(
	Effect.promise(() => elementReady("body")),
	Effect.flatMap(observer),
	Effect.flatMap(() => Effect.sync(() => window.addEventListener("focus", debouncedRunKeywordFilter))),
	Effect.flatMap(() => Effect.log("Content Filter is running...")),
);

Effect.runPromise(program);
