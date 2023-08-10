import { Effect, Option } from "effect";
import c from "tinyrainbow";

import type { Preset } from "../types";
import { Collect } from "./collect";
import { Disposal } from "./disposal";
import { InvalidRegExpError } from "./errors";
import { Extract } from "./extract";
import * as segment from "./segment";

// eslint-disable-next-line filenames-simple/named-export
export function make({ locales, keywords, snippets, regexps }: Preset) {
	const segmenter = segment.make(locales);

	return Effect.gen(function* gen(_) {
		const collector = yield* _(Collect);
		const extractor = yield* _(Extract);
		const disposer = yield* _(Disposal);
		const elements = yield* _(collector.collect());

		return yield* _(
			elements,
			Effect.forEach((el) => {
				// eslint-disable-next-line array-callback-return
				return Effect.gen(function* gen(_) {
					if (!(el instanceof HTMLElement)) {
						return Effect.unit;
					}

					if (yield* _(collector.isBlocked(el))) {
						return Effect.unit;
					}

					const contentText = yield* _(extractor.extract(el));

					for (const snippet of snippets) {
						if (contentText.includes(snippet)) {
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by SNIPPET: ${c.gray(c.strikethrough(snippet))}`));
							return Effect.unit;
						}
					}

					for (const regexp of regexps) {
						const exp = yield* _(
							Effect.try({
								// eslint-disable-next-line security/detect-non-literal-regexp
								try: () => new RegExp(regexp, "giu"),
								catch: () => InvalidRegExpError({ message: `Invalid RegExp: ${c.gray(regexp)}` }),
							}),
						);

						if (exp.test(contentText)) {
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by REGEXP: ${c.gray(regexp)}`));
							return Effect.unit;
						}
					}

					const segmentIter = yield* _(segmenter.segment(contentText));

					for (const { segment } of segmentIter) {
						const matched = Option.fromNullable(keywords.find((keyword) => segment.includes(keyword)));

						if (Option.isSome(matched)) {
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by KEYWORD: ${c.gray(c.strikethrough(matched.value))}`));
							return Effect.unit;
						}
					}

					return Effect.unit;
				});
			}),
		);
	});
}
