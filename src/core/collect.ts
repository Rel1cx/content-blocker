import type { Effect } from "effect";
import { Context } from "effect";

export type Collect = {
	readonly collect: () => Effect.Effect<never, never, NodeListOf<HTMLElement>>;
	readonly collectBlocked: () => Effect.Effect<never, never, NodeListOf<HTMLElement>>;
	readonly isBlocked: (element: HTMLElement) => Effect.Effect<never, never, boolean>;
};

export const Collect = Context.Tag<Collect>();
