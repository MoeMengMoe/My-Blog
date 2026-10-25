import type { FontDefinition, FontSelectionConfig } from "@/types/fontConfig";

export const fontsList: FontDefinition[] = [
	{
		name: "LXGWWenKai",
		cssVariable: "--font-lxgw-wenkai",
		provider: "local",
		options: {
			variants: [
				{
					src: ["./public/fonts/lxgw-wenkai/LXGWWenKaiLite-Regular.ttf"],
					weight: 400,
					style: "normal",
				},
				{
					src: ["./public/fonts/lxgw-wenkai/LXGWWenKaiLite-Medium.woff2"],
					weight: 700,
					style: "normal",
				},
			],
		},
		fallbacks: ["sans-serif"],
	},
	{
		name: "JetBrains Mono",
		cssVariable: "--font-jetbrains-mono",
		provider: "local",
		options: {
			variants: [
				{
					src: ["./public/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2"],
					weight: 400,
					style: "normal",
				},
				{
					src: ["./public/fonts/jetbrains-mono/JetBrainsMono-Bold.woff2"],
					weight: 700,
					style: "normal",
				},
			],
		},
		fallbacks: ["monospace"],
	},
];

export const fontConfig: FontSelectionConfig = {
	enable: true,
	selected: ["--font-lxgw-wenkai"],
	bannerTitleFont: "--font-lxgw-wenkai",
	bannerSubtitleFont: "--font-lxgw-wenkai",
	navbarTitleFont: "--font-lxgw-wenkai",
	codeFont: "--font-jetbrains-mono",
	// Keep the full fonts so comments can display characters absent from posts.
	subsetFonts: {},
};
