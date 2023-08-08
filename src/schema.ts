import * as v from "valibot";

export const Response = v.object({
	code: v.number(),
	data: v.unknown(),
});

export const VideoTag = v.array(
	v.object({
		tag_id: v.number(),
		tag_name: v.string(),
		content: v.string(),
	}),
);

export const VideoInfo = v.object({
	bvid: v.string(),
	title: v.string(),
	desc: v.string(),
	tid: v.number(),
	tname: v.string(),
	aid: v.number(),
	cid: v.number(),
	owner: v.object({
		mid: v.number(),
		name: v.string(),
		face: v.string(),
	}),
});
