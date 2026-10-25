import type { CommentConfig } from "../types/commentConfig";

export const commentConfig: CommentConfig = {
	type: "waline",
	waline: {
		serverURL:
			"https://regal-rabanadas-33d957.netlify.app/.netlify/functions/comment",
		lang: "zh-CN",
		emoji: [
			"https://unpkg.com/@waline/emojis@1.2.0/weibo",
			"https://unpkg.com/@waline/emojis@1.2.0/bilibili",
		],
		login: "enable",
		visitorCount: true,
		pageSize: 10,
		wordLimit: 0,
		reaction: true,
		requiredMeta: ["nick", "mail"],
		avatar: "retro",
	},
};
