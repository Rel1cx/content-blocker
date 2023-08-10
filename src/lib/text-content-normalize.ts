export function textContentNormalize(str: string) {
	return str
		.normalize("NFKC")
		.replaceAll(/[\u0300-\u036F]/gu, "")
		.replaceAll(/\s+/gu, " ");
}
