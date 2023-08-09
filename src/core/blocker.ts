import * as Effect from "@effect/io/Effect";

import { Collect } from "./collect";
import { Disposal } from "./disposal";
import { Extract } from "./extract";
import * as segment from "./segment";

// eslint-disable-next-line filenames-simple/named-export
export function make(locales: string[], keywords: string[]) {
	const checkedEls = new WeakSet<HTMLElement>();
	const blockedEls = new WeakSet<HTMLElement>();
	const segmenter = segment.make(locales);

	return Effect.gen(function* gen(_) {
		const collector = yield* _(Collect);
		const extractor = yield* _(Extract);
		const disposer = yield* _(Disposal);
		const elements = yield* _(collector.collect());

		for (const el of elements) {
			if (!(el instanceof HTMLElement)) {
				continue;
			}

			if (checkedEls.has(el) || blockedEls.has(el)) {
				continue;
			}

			const contentText = yield* _(extractor.extract(el));
			const segmentIter = yield* _(segmenter.segment(contentText));

			for (const { segment } of segmentIter) {
				if (keywords.includes(segment)) {
					blockedEls.add(el);
					yield* _(disposer.dispose(el));
					yield* _(Effect.log(`Blocked by keyword: ${segment}`));
					break;
				}

				checkedEls.add(el);
			}
		}

		return Effect.unit;
	});
}
