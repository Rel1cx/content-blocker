// import { keyword } from "../block-list.example.json";
import { keywords } from "../block-list.json";
import { textContentNormalize } from "./lib/text-content-normalize";

export const NORMALIZED_KEYWORDS = keywords.map(textContentNormalize);
