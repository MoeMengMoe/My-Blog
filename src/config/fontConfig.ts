import type { FontDefinition, FontSelectionConfig } from "@/types/fontConfig";

export const fontsList: FontDefinition[] = [
	{
		name: "Noto Serif CJK",
		cssVariable: "--font-source-han-serif",
		provider: "external",
		stylesheet: "https://fontsapi.zeoseven.com/285/main/result.css",
		fallbacks: ["Songti SC", "SimSun", "serif"],
	},
	{
		name: "LXGW WenKai",
		cssVariable: "--font-lxgw-wenkai",
		provider: "external",
		stylesheet: "https://fontsapi.zeoseven.com/292/main/result.css",
		fallbacks: ["KaiTi", "STKaiti", "serif"],
	},
	{
		name: "JetBrains Mono",
		cssVariable: "--font-jetbrains-mono",
		provider: "external",
		stylesheet:
			"https://registry.npmmirror.com/@fontsource/jetbrains-mono/5.2.8/files/latin.css",
		fallbacks: ["monospace"],
	},
];

export const fontConfig: FontSelectionConfig = {
	enable: true,
	selected: ["--font-source-han-serif"],
	readingFont: "--font-lxgw-wenkai",
	bannerTitleFont: "--font-source-han-serif",
	bannerSubtitleFont: "--font-lxgw-wenkai",
	navbarTitleFont: "--font-source-han-serif",
	codeFont: "--font-jetbrains-mono",
	// Online CJK stylesheets use unicode-range subsets, including comment text.
	subsetFonts: {},
};
