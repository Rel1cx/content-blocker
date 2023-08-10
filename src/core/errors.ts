import { Data } from "effect";

export type InvalidRegExpError = Data.Case & {
	readonly _tag: "InvalidRegExpError";
	readonly message: string;
};

export const InvalidRegExpError = Data.tagged<InvalidRegExpError>("InvalidRegExpError");
