import * as Context from "@effect/data/Context";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";

export type BlockService = {
	readonly block: (el: HTMLElement) => Effect.Effect<never, never, void>;
	readonly unBlock: (el: HTMLElement) => Effect.Effect<never, never, void>;
};

export const BlockerService = Context.Tag<BlockService>();

export const BlockServiceLive = Layer.succeed(
	BlockerService,
	BlockerService.of({
		block(el) {
			return Effect.sync(() => {
				el.setAttribute("data-blocked", "true");
			});
		},
		unBlock(el) {
			return Effect.sync(() => {
				el.removeAttribute("data-blocked");
			});
		},
	}),
);
