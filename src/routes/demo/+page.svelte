<script>
    import TestComponent from "$lib/TestComponent.svelte";
    let a = [1,2,3];
</script> 

{#each a as e, i (i)}
    <TestComponent />
 {/each}  
