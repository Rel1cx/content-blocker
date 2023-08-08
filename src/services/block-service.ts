import * as Context from "@effect/data/Context";
import * as Effect from "@effect/io/Effect";
import * as Layer from "@effect/io/Layer";

export type BlockerService = {
	readonly block: (el: HTMLElement) => Effect.Effect<never, never, void>;
	readonly unBlock: (el: HTMLElement) => Effect.Effect<never, never, void>;
};

export const BlockerService = Context.Tag<BlockerService>();

export const BlockerServiceLive = Layer.succeed(
	BlockerService,
	BlockerService.of({
		block(el) {
			return Effect.sync(() => {
				el.setAttribute("data-blocked", "true");
				el.setAttribute("data-blocked-type", "keyword");
				// el.setAttribute("data-blocked-reason", words.join(String.fromCodePoint(0x200b)));
			});
		},
		unBlock(el) {
			return Effect.sync(() => {
				el.removeAttribute("data-blocked");
				el.removeAttribute("data-blocked-type");
				// el.removeAttribute("data-blocked-reason");
			});
		},
	}),
);
