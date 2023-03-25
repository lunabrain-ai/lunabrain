import type { SvelteComponent } from "svelte";

export interface NavLink {
	label: string;
	to: string;
	Component: typeof SvelteComponent;
}
