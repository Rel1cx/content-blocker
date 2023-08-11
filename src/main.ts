import "@total-typescript/ts-reset";
import "./styles/base.css";

// import "./styles/lag-radar.css";
import { Effect, pipe } from "effect";
import elementReady from "element-ready";
import { debounce } from "throttle-debounce";

import { Collect } from "./core/collect";
import { Disposal } from "./core/disposal";
import { Extract } from "./core/extract";
import { make } from "./core/mod";
import * as bilibili from "./impl/bilibili.com";
// import { lagRadar } from "./lib/lag-radar";
import * as preset from "./presets/test.json";
// import * as preset from "./presets/example.json";

const blockerRunnable = pipe(
	make(preset),
	Effect.provideService(Collect, bilibili.collect),
	Effect.provideService(Extract, bilibili.extract),
	Effect.provideService(Disposal, bilibili.disposal),
	// Effect.provideLayer(Logger.replace(Logger.defaultLogger, SimpleLogger)),
);

const debouncedRunBlocker = debounce(100, () => Effect.runFork(blockerRunnable), { atBegin: true });

function observe(container = document.body) {
	return Effect.sync(() => {
		const mutationObserver = new MutationObserver(debouncedRunBlocker);

		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
		});

		window.addEventListener("focus", debouncedRunBlocker);
	});
}

const program = pipe(
	Effect.promise(() => elementReady("body")),
	Effect.tap(() => bilibili.init),
	Effect.flatMap(observe),
	// Effect.tap(() => Effect.sync(() => lagRadar({}))),
	Effect.map(() => "Content Filter is running..."),
);

Effect.runPromise(program).then(console.info);
