import * as Context from "@effect/data/Context";
import type * as Effect from "@effect/io/Effect";

export type Extract = {
	readonly extract: (el: HTMLElement) => Effect.Effect<never, never, string>;
};

export const Extract = Context.Tag<Extract>();
