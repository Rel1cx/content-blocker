import { Duration, Effect, Option } from "effect";
import c from "tinyrainbow";

import type { Preset } from "../types";
import { Collect } from "./collect";
import { Disposal } from "./disposal";
import { InvalidRegExpError } from "./errors";
import { Extract } from "./extract";

// eslint-disable-next-line filenames-simple/named-export
export function make({ locales, keywords, snippets, regexps }: Preset) {
	const segmenter = new Intl.Segmenter(locales, { granularity: "word" });

	return Effect.gen(function* gen(_) {
		const collector = yield* _(Collect);
		const extractor = yield* _(Extract);
		const disposer = yield* _(Disposal);
		const elements = yield* _(collector.collect());

		const makeWorkEffect = (el: HTMLElement) => {
			return Effect.gen(function* gen(_) {
				if (!(el instanceof HTMLElement)) {
					return;
				}

				const contentText = yield* _(extractor.extract(el));

				for (const snippet of snippets) {
					if (contentText.includes(snippet)) {
						yield* _(disposer.dispose(el));
						yield* _(Effect.log(`Blocked an item by SNIPPET: ${c.gray(c.strikethrough(snippet))}`));
						return;
					}
				}

				for (const regexp of regexps) {
					const exp = yield* _(
						Effect.try({
							// eslint-disable-next-line security/detect-non-literal-regexp
							try: () => new RegExp(regexp, "giu"),
							catch: () =>
								InvalidRegExpError({
									message: `Invalid RegExp: ${c.gray(regexp)}`,
								}),
						}),
					);

					if (exp.test(contentText)) {
						yield* _(disposer.dispose(el));
						yield* _(Effect.log(`Blocked an item by REGEXP: ${c.gray(regexp)}`));
						return;
					}
				}

				const segmentIter = segmenter.segment(contentText)[Symbol.iterator]();

				for (const { segment } of segmentIter) {
					const matched = Option.fromNullable(keywords.find((keyword) => segment.includes(keyword)));

					if (Option.isSome(matched)) {
						yield* _(disposer.dispose(el));
						yield* _(Effect.log(`Blocked an item by KEYWORD: ${c.gray(c.strikethrough(matched.value))}`));
						return;
					}
				}

				yield* _(Effect.sleep(Duration.millis(0)));
			});
		};

		const workEffects = Array.from(elements).map(makeWorkEffect);

		yield* _(Effect.all(workEffects, { concurrency: 800 }));
	});
}
