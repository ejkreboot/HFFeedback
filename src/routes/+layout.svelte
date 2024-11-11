<script>
    import { onMount } from 'svelte';
    import { session } from '../stores/session.js';

    export let data;

    if(data) {
      session.set(data.user);
    }

    onMount(() => {
        document.getElementById('menu-toggle').addEventListener('click', function() {
            const navbarLinks = document.getElementById('navbar');
            navbarLinks.classList.toggle('active'); // Toggle visibility
        })
    });

</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
</svelte:head>

<style>
    @media (max-width: 800px) {
        .nav-title {
            font-size: 16px;
        }   

        .nav-subtitle {
            display: none;
        }

        nav {
            margin-left: auto;
            margin-right: 20px;
        }

        .navbar-links {
            display: flex;
            position: absolute;
            top: 0px;
            right: 0px;
            width: 250px;
            height: 200px;
            flex-direction: column;
            background-color: #fafafa;
            padding: 20px 50px 10px 5px;
            box-sizing: border-box;
            margin: 0px;
            border: 1px solid #0095f2;
            color: gray !important;
            font-family: "Lato";
            font-size: 148x;
            font-weight: 500;
            list-style-type: none;
            border-radius: 10px 00px 0px 10px;
            box-shadow:  0.3px 0.5px 0.6px hsl(0deg 0% 0% / 0.11),
                0.7px 1.5px 1.8px -0.9px hsl(0deg 0% 0% / 0.1),
                1.9px 3.8px 4.6px -1.9px hsl(0deg 0% 0% / 0.1),
                4.7px 9.5px 11.4px -2.8px hsl(0deg 0% 0% / 0.09);
            transition: all 0.3s ease-in-out;
            transform: translateY(-280px);
            z-index: 900; 

        }

        .navbar-links li {
            padding-left: 20px;
        }

        .nav-title {
            font-size: 20px;
        }   
        
        #menu-toggle {
            display: block;
            position: absolute;
            top: 0px;
            right: 10px;
            background-color: #ffffff00;
            border: none;
            font-size: 30px;
            font-weight: 100;
            color: #bbb;
            cursor: pointer;
            z-index: 2000;

        }
        
        :global(.navbar-links.active) {
            display: flex;
            transform: translateY(0px);
        }
    }

    @media (min-width: 800px) {
        #menu-toggle {
            display: none;
        }

        nav {
            margin-left: auto;
            margin-right: 20px;
        }

        .navbar-links {
            display: flex;
            flex-wrap: wrap;
            padding: 0px 20px 0px 20px;
            color: #0095f2;
            font-family: "Lato";
            font-size: 14px;
            font-weight: 300;
            list-style-type: none;
        }

        .navbar-links li {
            padding-left: 20px;
        }

        .nav-title {
            font-size: 20px;
        }   

    }

    .navbar {
        display: flex;
        padding-left: 10px;
        padding-top: 5px;
        z-index: 1100;
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
    <img alt="logo" src="/logo.png" height="35" width="32">
    <div class="nav-title">rezziliant. <span class="nav-subtitle">residency made easier.</span></div>

    <!-- Mobile nav menu -->
    <nav>
        <button id="menu-toggle" aria-label="Toggle menu">☰</button>
        <ul id="navbar" class="navbar-links">
        {#if $session?.email}
            <li><a href="/api/auth/logout">Logout</a></li>
            <li><a href="/protected/eval">Submit Evaluations</a></li>
        {/if}
        {#if $session?.isadmin}
            <li><a href="/protected/admin">View Evaluations</a></li>
            <li><a href="/protected/admin/add-user">Add users</a></li>
        {/if}
        <li><a href="/">Home</a></li>
        </ul>
    </nav>
</div>

<slot/>

<div class="footer">2024 Eric J. Kort. All rights reserved.</div>