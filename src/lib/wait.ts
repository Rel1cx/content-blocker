export function wait(ms: number) {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function waitUntilIdle() {
	return new Promise((resolve) => {
		requestIdleCallback(resolve, {
			timeout: 1000,
		});
	});
}
