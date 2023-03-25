<script lang="ts">
    export let error: string = null;
</script>

<div class="my-4">
    {#if error}
        <div>
            <h4>There was a problem</h4>
            {error}
        </div>
    {/if}
</div>
