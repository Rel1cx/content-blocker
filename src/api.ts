import * as v from "valibot";

import { Response, VideoInfo, VideoTag } from "./schema";

export async function getVideoInfo(bvid: string) {
	const qs = new URLSearchParams({ bvid }).toString();
	const resp = await fetch(`https://api.bilibili.com/x/web-interface/view?${qs}`);
	const json = await resp.json();
	const { data } = v.parse(Response, json);
	return v.parse(VideoInfo, data);
}

export async function getVideoTags(bvid: string) {
	const qs = new URLSearchParams({ bvid }).toString();
	const resp = await fetch(`https://api.bilibili.com/x/tag/archive/tags?${qs}`);
	const { data } = v.parse(Response, await resp.json());
	return v.parse(VideoTag, data);
}
