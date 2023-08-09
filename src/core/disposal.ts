import * as Context from "@effect/data/Context";
import type * as Effect from "@effect/io/Effect";

export type Disposal = {
	readonly dispose: (el: HTMLElement) => Effect.Effect<never, never, void>;
	readonly recover: (el: HTMLElement) => Effect.Effect<never, never, void>;
};

export const Disposal = Context.Tag<Disposal>();
