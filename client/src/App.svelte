<script lang="ts">
    import { Router, Route } from "svelte-routing";

    import Navbar from "./components/Navbar.svelte";
    import Home from "./routes/Home.svelte";
    import type { NavLink } from "./types/nav";

    const links: NavLink[] = [
        {
            label: "Home",
            to: "/",
            Component: Home,
        },
    ];
</script>

<main>
    <Router>
        <Navbar {links} />
        <div class="max-w-2xl px-6 py-16 mx-auto space-y-12">
            {#each links as link}
                <Route path={link.to} component={link.Component} />
            {/each}
        </div>
    </Router>
</main>
