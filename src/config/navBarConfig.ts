import {
	type NavBarConfig,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = {
	links: [
		{ name: "主页", url: "/", icon: "material-symbols:home" },
		{ name: "归档", url: "/archive/", icon: "material-symbols:archive" },
		{ name: "关于我", url: "/about/", icon: "material-symbols:person" },
		{
			name: "GitHub",
			url: "https://github.com/MoeMengMoe",
			external: true,
			icon: "fa7-brands:github",
		},
	],
};
