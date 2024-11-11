<script>
    import { onMount } from 'svelte';
    import { supabase } from "$lib/supabase.js";
    import { session } from '../stores/session.js';

    let code = '';
    let phoneOrEmail = '';
    let errorMessage = '';

    let loading = false;
    
    async function login() {
      loading = true;
      const { response, error } = await supabase.auth.signInWithOtp({
        email: phoneOrEmail,
        options: {
          shouldCreateUser: false,         
        },
      });
      loading = false;

      if (error) {
        errorMessage = "Email / Phone not recognized."
        document.getElementById("login").style.display="block";
        document.getElementById("otp").style.display="none";
      } else {
        document.getElementById("login").style.display="none";
        document.getElementById("otp").style.display="block";
      }
    }

    async function verify() {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code, phoneOrEmail })
      });
      const data = await response.json();
      session.set(data);
    }

    async function logout() {
      const { error } = await supabase.auth.signOut();
      if(error) {
        console.error('Logout failed');
      }
      await fetch('/api/auth/logout'); 
      session.set({});
    }

    onMount(async () => 
    {

    })

  </script>
  
  <style>

  .sms-notification {
    color: black;
    font-size: 11px;
    font-weight: 300;
  }

  @media (min-width: 500px) {

    .mobile-only {
      display: none;
    }
    
    .container {
      background-image: url("/hero2.webp");;
      background-size: contain;
      background-repeat: no-repeat;
      justify-content: center;
      align-items: center;
      height: clamp(620px, 60vw, 800px);
      width: clamp(1000px, 100vw, 12000px);
      background-color: #fbfdff;
    }

    #hero {
      position: absolute;
      top: clamp(0px, 10vh, 50px);
      left: clamp(150px, 18vw , 410px);
      width: clamp(300px, 22vw, 350px);
    }

    .hero-title {
      margin: auto;
      font-family: "Quicksand";
      font-size: clamp(3rem, 3.6vw, 4vw);
      font-weight: 600;
      padding-top: 120px;
    }

    .hero-subtitle {
      padding-top: 10px;
      padding-bottom: 10px;
      margin: auto;
      font-family: "Quicksand";
      font-size: clamp(0.9rem, 1vw, 5rem);
      font-weight: 300;
      line-height: 1.5rem;
      color: #999;
    }

    .form-box {
      border: 1px solid gray;
      border-radius: 5px;
      padding: 20px 35px 20px 35px;
      width: 300px;
      margin: 20px 0px 20px 0px;
      background-color: white;
          box-shadow:  0.3px 0.5px 0.6px hsl(0deg 0% 0% / 0.11),
          0.7px 1.5px 1.8px -0.9px hsl(0deg 0% 0% / 0.1),
          1.9px 3.8px 4.6px -1.9px hsl(0deg 0% 0% / 0.1),
          4.7px 9.5px 11.4px -2.8px hsl(0deg 0% 0% / 0.09);
    }

    .form-title {
      text-align: center;
      padding-bottom: 20px;
      font-size: 24px;
      font-weight: 300;
    }

    .form-label {
      font-size: 14px;
      color: gray;
      padding-bottom: 5px;
    }

    .sms-notification {
      font-size: 9pt;
      margin-top: -5px;
    }

    .message {
      font-size: clamp(14px, 1.1vw, 24px);
      font-weight: 500;
      padding-bottom: 20px;
      color: black;
    }
  
    input[type="text"] {
      width: 100%;
      background-color: #fafafa;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }
  
    button {
      margin: 20px 0px 20px 0px;
      height: 40px;
      font-size: 14px;
      width: 100%;
      padding: 0.75rem;
      color: #fff;
      background-color: #0095f2;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .gray:hover {
      background-color: #ddd;
    }
    
    .gray {
      background-color: #eee;
      color: #666;
    }

    .narrow {
      width: 10%;
    }  

    .error-message {
      color: #ff7f00;
      font-weight: 300;
      margin-top: 0.2rem;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .row > * {
      flex-grow: 1
    }
  }

  @media (max-width: 500px) {

    .mobile-only {
      display: block;
    }

    .container img {
      width: 100%;
    }

    .container {
      justify-content: center;
      align-items: center;
      width: 100%;
      background-color: #fbfdff;
    }

    #hero {
      position: relative;
    }

    .hero-title {
      font-family: "Quicksand";
      font-size: clamp(3rem, 4vw, 5rem);
      font-weight: 600;
      padding: 20px 20px 0px 20px;
    }

    .hero-subtitle {
      padding: 20px 20px 0px 20px;
      font-family: "Quicksand";
      font-size: clamp(1rem, 1.1vw, 5rem) ;
      font-weight: 300;
      color: #999;
    }
  
    .form-box {
      border: 1px solid gray;
      border-radius: 5px;
      padding: 20px 35px 20px 35px;
      width: 90%;
      box-sizing:border-box;
      margin: 10px 5% 10px 5%;
      background-color: white;
          box-shadow:  0.3px 0.5px 0.6px hsl(0deg 0% 0% / 0.11),
          0.7px 1.5px 1.8px -0.9px hsl(0deg 0% 0% / 0.1),
          1.9px 3.8px 4.6px -1.9px hsl(0deg 0% 0% / 0.1),
          4.7px 9.5px 11.4px -2.8px hsl(0deg 0% 0% / 0.09);
    }

    .form-title {
      text-align: center;
      padding-bottom: 20px;
      font-size: 24px;
      font-weight: 300;
    }

    .form-label {
      font-size: 14px;
      color: gray;
      padding-bottom: 5px;
    }

    .sms-notification {
      font-size: 9pt;
      margin-top: -15px;
      padding-bottom: 20px;
    }

    .message {
      font-size: clamp(14px, 1.3vw, 24px);
      font-weight: 300;
      padding-bottom: 20px;
      color: black;
    }
  
    input[type="text"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }
  
    button {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 10px;
      font-size: 1rem;
      color: #fff;
      background-color: #0095f2;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #0056b3;
    }

    .gray {
      background-color: #eee;
      color: #666;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .row > * {
      flex-grow: 1
    }

    .narrow {
      width: 10%;
    }

  
    .error-message {
      color: #ff7f00;
      font-weight: 300;
      margin-top: 0.5rem;
    }

  }

  </style>
  
  <div class="container" style='cursor: {loading? "wait" : "default"};'>
    <img alt="hero" src="/hero_mobile.webp" class="mobile-only" />
    <div id="hero">
      <div class="hero-title">
        be rezilliant.
      </div>
      <div class="hero-subtitle">
        <p>
          Painless, efficient learner feedback designed with your busy schedule in mind. 
        </p>
        <p>
          Curious? <a href="mailto:ericjkort@startmail.com">Send us an email today</a> to inquire about how we can help you and and your learners.
        </p>
      </div>
      <div class="login-box-container">
        <div class="form-box">
          {#if $session?.email}
          <div class="message">
            <br>Logged in as: <b>{$session.name}</b>
          </div>
          <div class="row">
            <button class="narrow" on:click={document.location='/protected/eval'}>Enter Portal</button>
            <button class="narrow gray" on:click={logout}>Logout</button>
          </div>
          {:else}
          <div id="login">
            <div class="form-title">
              Sign In
            </div>
          <div class="form-label">
            Phone or email
          </div>
            <input
              type="text"
              bind:value={phoneOrEmail}
            />
            <div class="sms-notification">(For phone based sign in, carrier rates may apply.)</div>
            <button style='cursor: {loading? "wait" : "default"} !important;' on:click={login}>Submit</button>
          </div>
          <div id="otp" style="display: none;">
            <div class="message">
              Enter code sent to phone/email:
            </div>
            <input
              type="text"
              placeholder="000000"
              bind:value={code}
            />
            <button on:click={verify}>Submit</button>            
          </div>
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}
          {/if}
        </div>  
      </div>
  
    </div>


  </div>
  