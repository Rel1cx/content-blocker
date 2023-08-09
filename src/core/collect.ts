import * as Context from "@effect/data/Context";
import type * as Effect from "@effect/io/Effect";

export type Collect = {
	readonly collect: () => Effect.Effect<never, never, NodeListOf<Element>>;
};

export const Collect = Context.Tag<Collect>();
