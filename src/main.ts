import "@total-typescript/ts-reset";
import "./styles/base.css";

import { Effect, pipe } from "effect";
import { constVoid } from "effect/Function";
import elementReady from "element-ready";
import { debounce } from "throttle-debounce";

import { Collect, Disposal, Extract, make } from "./core";
import * as bilibili from "./impl/bilibili.com";
import * as preset from "./presets/test.json";
// import * as preset from "./presets/example.json";

const blockerRunnable = pipe(
	make(preset),
	Effect.provideService(Collect, bilibili.collect),
	Effect.provideService(Extract, bilibili.extract),
	Effect.provideService(Disposal, bilibili.disposal),
	// Effect.provideLayer(Logger.replace(Logger.defaultLogger, SimpleLogger)),
);

const runBlocker = () => Effect.runFork(blockerRunnable);

function listenFocus(handler = constVoid) {
	return Effect.sync(() => {
		window.addEventListener("focus", handler);
	});
}

function listenChildList(container = document.body, handler = constVoid) {
	const debouncedHandler = debounce(
		100,
		() => {
			requestAnimationFrame(handler);
		},
		{ atBegin: true },
	);

	return Effect.sync(() => {
		const mutationObserver = new MutationObserver((mutations) => {
			const childListChanged = mutations.some((mutation) => mutation.type === "childList");

			if (!childListChanged) {
				return;
			}

			debouncedHandler();
		});

		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
		});
	});
}

const program = pipe(
	Effect.promise(() => elementReady("body")),
	Effect.flatMap((el) => listenChildList(el, runBlocker)),
	Effect.flatMap(() => listenFocus(runBlocker)),
	Effect.map(() => "Content Filter is running..."),
);

Effect.runPromise(program).then(console.info);
