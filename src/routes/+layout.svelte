<script>
    export let data;
    console.log(data);
</script>

<style>
    @media (max-width: 499px) {
        .nav-title {
            font-size: 16px;
        }   
    }

    @media (min-width: 500px) {
        .nav-title {
            font-size: 20px;
        }   
    }

    .navbar {
        display: flex;
            background-color: #eee;
            padding-left: 10px;
        }

        .navbar {
            background-color: white;
            padding: 10px;
            min-width: 800px;
        }

        .nav-title {
            font-family: "Quicksand";
            color: #0095f2;
        }

        .nav-subtitle {
            font-weight: 100;
            color: rgb(152, 152, 152);
        }

        .navbar .nav-title {
            font-family: "Lato";
            padding-top: 8px;
            margin-left: 10px;
        }

        .navbar .nav-menu {
            margin-left: auto;
            color: #0095f2;
            font-family: "Lato";
            font-size: 14px;
            padding-top: 8px;
            margin-right: 20px;
            font-weight: 300;
        }

        .navbar .nav-menu ~ .nav-menu{
            color: #0095f2;
            margin-left: 10px;
        }

        a {
            text-decoration: none;
        }

        a:visited {
            color: #0095f2;
        }

        .footer {
            font-family: "Quicksand";
            color: #ccc;
            text-align: center;
            padding: 20px;
        }
</style>


<div class="navbar">
    <img alt="logo" src="/logo.png" height="40" width="40">
    <div class="nav-title">rezilliant. <span class="nav-subtitle">residency made easier.</span></div>
    {#if data.isLoggedIn}
        <div class="nav-menu"><a href="./api/logout">Logout</a></div>
    {/if}
    <div class="nav-menu"><a href="/">Home</a></div>
</div>

<slot />

<div class="footer">©2024 Eric J. Kort. All rights reserved.</div>