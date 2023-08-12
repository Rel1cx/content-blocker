import type { Effect } from "effect";
import { Context } from "effect";

export type Collect = {
	readonly collect: () => Effect.Effect<never, never, NodeListOf<HTMLElement>>;
	readonly collectBlocked: () => Effect.Effect<never, never, NodeListOf<HTMLElement>>;
};

export const Collect = Context.Tag<Collect>();
