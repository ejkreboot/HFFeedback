<script>
    let code = '';
    let errorMessage = '';
    export let data;
    async function login() {
        const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
        credentials: 'include' // Important to include cookies
        });

        if (response.ok) {
            errorMessage = 'You are logged in.';
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
        console.log('Logged out successfully');
        // Redirect to login page or perform any other necessary actions
        window.location.href = '/';
        } else {
        console.error('Logout failed');
        }
    }
  </script>
  
  <style>
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f3f4f6;
    }
  
    .login-box {
      max-width: 400px;
      width: 100%;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
      text-align: center;
    }
  
    h1 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1rem;
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
      font-size: 1rem;
      color: #fff;
      background-color: #007bff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  
    .error-message {
      color: #e3342f;
      margin-top: 0.5rem;
    }
  </style>
  
  <button on:click={logout}>Logout</button>
  <div class="container">
    {#if data.user}
      Organization: {data.user.organizationName.toString()}
    {/if}

    <div class="login-box">
      <h1>Enter Your Login Code</h1>
      <input
        type="text"
        placeholder="Login Code"
        bind:value={code}
      />
      <button on:click={login}>Submit</button>
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </div>
  </div>
  