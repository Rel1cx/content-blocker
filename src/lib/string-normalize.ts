export function stringNormalize(str: string) {
	return str.normalize("NFKC");
}
