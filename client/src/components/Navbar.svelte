<script lang="ts">
    import { Link } from "svelte-routing";
    import type { NavLink } from "../types/nav";
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'

    export let links: NavLink[] = [];
    let path: string = window.location.pathname;

    const updatePath = (newPath: string) => (path = newPath);
</script>

<Navbar let:hidden let:toggle>
    <NavBrand>Sifty</NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        {#each links as l}
            <NavLi active={l.to === path}>
                <Link
                    on:click={() => updatePath(l.to)}
                    to={l.to}
                >
                    <span>{l.label}</span>
                </Link>
            </NavLi>
        {/each}
    </NavUl>
</Navbar>
