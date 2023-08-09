import * as Effect from "@effect/io/Effect";

// eslint-disable-next-line filenames-simple/named-export
export function make(locales: string | string[] = ["en", "zh-CN"]) {
	const segmenter = new Intl.Segmenter(locales, { granularity: "word" });

	return {
		segment: (text: string) => Effect.sync(() => segmenter.segment(text)[Symbol.iterator]()),
	};
}
