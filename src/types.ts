export type MatchType = "keyword" | "snippet" | "regexp";

export type MatchMethod = "exact" | "prefix" | "fuzzy";

export type Preset = {
	version: string;
	locales: string[];
	keywords: string[];
	snippets: string[];
	regexps: string[];
};
