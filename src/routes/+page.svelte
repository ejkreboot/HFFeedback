<script>
    import { session } from '../stores/session.js';
    let institution;
    let code = '';
    let phone = '';
    let errorMessage = '';
    export let data;

    $: organization = $session; 

    if(data) {
      session.set(data);
    }

    async function login() {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          credentials: 'include' 
        });
        if (response.ok) {
          const sessionData = await response.json();
          session.set(sessionData);
        } else {
          errorMessage = 'Invalid code. Please try again.';
        }
    }

    async function logout() {
        const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
        });
        if (response.ok) {
          session.set(null);
          // Redirect to login page or perform any other necessary actions
          window.location.href = '/';
        } else {
          console.error('Logout failed');
        }
    }
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
      height: clamp(550px, 60vw, 800px);
      width: clamp(1000px, 100vw, 12000px);
      background-color: #fbfdff;
    }

    #hero {
      position: absolute;
      top: clamp(0px, 10vh, 50px);
      left: clamp(275px, 27.2vw , 410px);
      width: clamp(220px, 20.3vw, 320px);
    }

    .hero-title {
      margin: auto;
      font-family: "Quicksand";
      font-size: clamp(2rem, 2.8vw, 3vw);
      font-weight: 600;
      padding-top: 120px;
    }

    .hero-subtitle {
      padding-top: 20px;
      margin: auto;
      font-family: "Quicksand";
      font-size: clamp(0.8rem, 1.1vw, 5rem) ;
      font-weight: 300;
      color: #ff7f00;
    }

    .hero-sub-subtitle {
      padding-top: 20px;
      margin: auto;
      font-family: "Quicksand";
      font-size: clamp(0.8rem, 1.0vw, 5rem);
      font-weight: 300;
      color: #999;
    }

    .login-box {
      max-width: clamp(150px, 15vw, 15vw);
      min-width: 110%;
      max-height: 170px;
      min-height: 100px;
      margin: 40px auto 20px auto;
      padding: 30px;
      border: 1px solid black;
      border-radius: 0px;
      color: black;
      font-family: Lato;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
  
    .message {
      font-size: clamp(14px, 1.3vw, 24px);
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
      height: 40px;
      font-size: 14px;
      width: 100%;
      padding: 0.75rem;
      margin-top: 10px;
      margin-bottom: 10px;
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
      color: #e3342f;
      margin-top: 0.5rem;
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

  @media (max-width: 499px) {

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
      font-size: clamp(0.8rem, 1.1vw, 5rem) ;
      font-weight: 300;
      color: #ff7f00;
    }

    .hero-sub-subtitle {
      padding: 20px;
      font-family: "Quicksand";
      font-size: clamp(0.8rem, 1.0vw, 5rem);
      font-weight: 300;
      color: #999;
    }

    .login-box {
      width: 80%;
      max-height: 150px;
      margin: auto;
      border: 1px solid black;
      border-radius: 0px;
      color: black;
      font-family: Lato;
      background-color: #ffffff;
      padding: 1.3rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
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
      color: #e3342f;
      margin-top: 0.5rem;
    }

  }

  </style>
  
  <div class="container">
    <img alt="hero" src="/hero_mobile.webp" class="mobile-only" />
    <div id="hero">
      <div class="hero-title">
        rezilliant.
      </div>
      <div class="hero-subtitle">
        Painless, efficient learner feedback designed with your busy schedule in mind. 
      </div> 
      <div class="hero-sub-subtitle">
        Curious? <a href="mailto:ericjkort@startmail.com">Send us an email today</a> to inquire about how we can help you and and your learners.
      </div>
      <div class="login-box-container">
        <div class="login-box">
          {#if organization?.user}
          <div class="message">
            {organization.user.organizationName}
          </div>
          <div class="row">
            <button class="narrow" on:click={document.location='/protected/eval'}>Enter Portal</button>
            <button class="narrow gray" on:click={logout}>Logout</button>
          </div>
          {:else}
          <div class="message">
            To Log In, Enter Phone #:
          </div>
          <input
            type="text"
            placeholder="123-456-7890"
            bind:value={phone}
          />
          <div class="sms-notification">(By clicking submit, user agrees to receiving text messages from Rezilliant. Carrier rates may apply.)</div>
          <button on:click={login}>Submit</button>
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}
          {/if}
        </div>  
      </div>
  
    </div>


  </div>
  