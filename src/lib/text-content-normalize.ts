export function textContentNormalize(str: string) {
	return str.normalize("NFKC").replaceAll(/\s/gu, "");
}
