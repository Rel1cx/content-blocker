import * as Option from "@effect/data/Option";
import * as Effect from "@effect/io/Effect";

import type { Preset } from "../types";
import { Collect } from "./collect";
import { Disposal } from "./disposal";
import { InvalidRegExpError } from "./errors";
import { Extract } from "./extract";
import * as segment from "./segment";

// eslint-disable-next-line filenames-simple/named-export
export function make({ locales, keywords, snippets, regexps }: Preset) {
	const checkedEls = new WeakSet<HTMLElement>();
	const blockedEls = new WeakSet<HTMLElement>();
	const segmenter = segment.make(locales);

	return Effect.gen(function* gen(_) {
		const collector = yield* _(Collect);
		const extractor = yield* _(Extract);
		const disposer = yield* _(Disposal);
		const elements = yield* _(collector.collect());

		yield* _(
			Effect.forEach(elements, (el) => {
				return Effect.gen(function* gen(_) {
					if (!(el instanceof HTMLElement)) {
						return;
					}

					if (checkedEls.has(el) || blockedEls.has(el)) {
						return;
					}

					const contentText = yield* _(extractor.extract(el));

					for (const snippet of snippets) {
						if (contentText.includes(snippet)) {
							blockedEls.add(el);
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by snippet: ${snippet}`));
							return;
						}
					}

					for (const regexp of regexps) {
						const exp = yield* _(
							Effect.try({
								// eslint-disable-next-line security/detect-non-literal-regexp
								try: () => new RegExp(regexp, "giu"),
								catch: () => new InvalidRegExpError(),
							}),
						);

						if (exp.test(contentText)) {
							blockedEls.add(el);
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by regexp: ${regexp}`));
							return;
						}
					}

					const segmentIter = yield* _(segmenter.segment(contentText));

					for (const { segment } of segmentIter) {
						const matched = Option.fromNullable(keywords.find((keyword) => segment.includes(keyword)));

						if (Option.isSome(matched)) {
							blockedEls.add(el);
							yield* _(disposer.dispose(el));
							yield* _(Effect.log(`Blocked by keyword: ${matched.value}`));
							return;
						}
					}

					checkedEls.add(el);
				});
			}),
		);
	});
}
