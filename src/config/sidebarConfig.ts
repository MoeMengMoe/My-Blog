import type { SidebarLayoutConfig } from "../types/sidebarConfig";

export const sidebarLayoutConfig: SidebarLayoutConfig = {
	enable: true,
	position: "both",
	tabletSidebar: "left",
	hideSidebarOnPostPage: false,
	leftComponents: [
		{ type: "profile", enable: true, position: "top", showOnPostPage: true },
		{
			type: "categories",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			specificConfig: { collapseThreshold: 5 },
		},
		{
			type: "tags",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			specificConfig: { collapseThreshold: 10 },
		},
	],
	rightComponents: [
		{
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			hideOnNonPostPage: true,
		},
	],
	mobileBottomComponents: [],
};
