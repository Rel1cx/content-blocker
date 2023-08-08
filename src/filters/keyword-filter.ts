import * as Effect from "@effect/io/Effect";

import { stringNormalize } from "../lib/string-normalize";
import { BlockerService } from "../services/block-service";

// eslint-disable-next-line filenames-simple/named-export
export function make(selector: string, blockList: string[]) {
	const checkedEls = new WeakSet<HTMLElement>();
	const blockedEls = new WeakSet<HTMLElement>();
	const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

	return Effect.gen(function* gen(_) {
		const blocker = yield* _(BlockerService);
		const elements = document.querySelectorAll<HTMLElement>(selector);

		for (const el of elements) {
			if (checkedEls.has(el) || blockedEls.has(el)) {
				continue;
			}

			yield* _(
				Effect.fork(
					Effect.gen(function* gen(_) {
						const textContent = stringNormalize(el.textContent?.toLowerCase() ?? "");
						const segmentIter = segmenter.segment(textContent)[Symbol.iterator]();

						for (const { segment } of segmentIter) {
							if (blockList.includes(segment)) {
								blockedEls.add(el);
								yield* _(blocker.block(el));
								yield* _(Effect.log(`Blocked: ${textContent}`));
								break;
							}

							checkedEls.add(el);
						}
					}),
				),
			);
		}

		return Effect.unit;
	});
}
