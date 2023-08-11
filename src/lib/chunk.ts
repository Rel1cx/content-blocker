// eslint-disable-next-line filenames-simple/named-export
export function* makeChunksFromArray<T>(sourceArray: T[], chunkSize = 50) {
	const arraySize = sourceArray.length;
	for (let i = 0; i < sourceArray.length; i += chunkSize) {
		if (i + chunkSize <= arraySize) {
			yield sourceArray.slice(i, i + chunkSize);
			continue;
		}
		yield sourceArray.slice(i, arraySize);
	}
}
