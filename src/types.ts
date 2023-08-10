export type MatchType = "KEYWORD" | "SNIPPET" | "REGEXP";

export type Preset = {
	version: string;
	locales: string[];
	keywords: string[];
	snippets: string[];
	regexps: string[];
};
