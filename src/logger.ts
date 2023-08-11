import { Logger } from "effect";
import c from "tinyrainbow";

// eslint-disable-next-line filenames-simple/named-export
export const SimpleLogger = Logger.make(({ logLevel, message }) => {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	globalThis.console.log(c.bgWhite(`[${logLevel.label}] ${message}`));
});
