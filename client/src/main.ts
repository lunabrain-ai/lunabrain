import App from "./App.svelte";

if (process.env.NODE_ENV === "development") {
	new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

const app = new App({
	target: document.body,
});

export default app;
