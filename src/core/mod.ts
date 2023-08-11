import { Duration, Effect, Option } from "effect";
import { createColors } from "tinyrainbow";

import { makeChunksFromArray } from "../lib/chunk";
import type { Preset } from "../types";
import { Collect } from "./collect";
import { Disposal } from "./disposal";
import { InvalidRegExpError } from "./errors";
import { Extract } from "./extract";
import * as segment from "./segment";

const c = createColors(false);

// eslint-disable-next-line filenames-simple/named-export
export function make({ locales, keywords, snippets, regexps }: Preset) {
	const segmenter = segment.make(locales);

	return Effect.gen(function* gen(_) {
		const collector = yield* _(Collect);
		const extractor = yield* _(Extract);
		const disposer = yield* _(Disposal);
		const elements = yield* _(collector.collect());

		const chunks = makeChunksFromArray(Array.from(elements), 2000);

		for (const chunk of chunks) {
			yield* _(
				chunk,
				Effect.forEach((el) => {
					// eslint-disable-next-line array-callback-return
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

						const segmentIter = yield* _(segmenter.segment(contentText));

						for (const { segment } of segmentIter) {
							const matched = Option.fromNullable(keywords.find((keyword) => segment.includes(keyword)));

							if (Option.isSome(matched)) {
								yield* _(disposer.dispose(el));
								yield* _(
									Effect.log(`Blocked an item by KEYWORD: ${c.gray(c.strikethrough(matched.value))}`),
								);
								return;
							}
						}
					});
				}),
			);

			yield* _(Effect.sleep(Duration.millis(0)));
		}
	});
}
