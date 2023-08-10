import type { Effect } from "effect";
import { Context } from "effect";

export type Disposal = {
	readonly dispose: (el: HTMLElement) => Effect.Effect<never, never, void>;
	readonly recover: (el: HTMLElement) => Effect.Effect<never, never, void>;
};

export const Disposal = Context.Tag<Disposal>();
