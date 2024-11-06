<script>
    import { onMount } from 'svelte';
    let message, button;

    onMount(() => {
        button.addEventListener('click', () => {
            alert(1);
            message = 'Hello world.'
            return;
        })
    })
</script>

<button bind:this={button}>Click me.</button>
Message: {message}
