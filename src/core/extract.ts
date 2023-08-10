import type { Effect } from "effect";
import { Context } from "effect";

export type Extract = {
	readonly extract: (el: HTMLElement) => Effect.Effect<never, never, string>;
};

export const Extract = Context.Tag<Extract>();
