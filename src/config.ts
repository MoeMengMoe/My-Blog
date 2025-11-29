import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	CommentConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "面包板上的帕秋莉",
	subtitle: "MoeMengMoe 的面包板日记",
	lang: "zh-CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/wallpaper/wallpaper.png", // Use wallpaper as the homepage hero image (from /public/wallpaper)
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/avatar/tag.jpg",
			sizes: "any",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/MoeMengMoe", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/avatar/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "面包板上的帕秋莉",
	bio: "面包板上的电子手账记录者",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/MoeMengMoe",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const commentConfig: CommentConfig = {
	enable: true,
	type: "waline",
	waline: {
		serverURL: "https://regal-rabanadas-33d957.netlify.app/.netlify/functions/comment", // 替换为你的 Waline 服务端地址
		lang: "zh-CN",
		pageSize: 10,
		wordLimit: 0,
		count: 5,
		pageview: true,
		reaction: true,
		requiredMeta: ["nick", "mail"],
		whiteList: [],
	},
};
