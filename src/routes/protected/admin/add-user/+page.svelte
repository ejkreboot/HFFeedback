<!-- src/routes/add-user/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { session } from '$stores/session.js';

    let name = '';
    let email = '';
    let institution = $session.institution;
    let isadmin = false;
    let sms = '';
    let roles = '';
    let error = '';
    let success = '';
  
    async function handleSubmit() {
      const response = await fetch('/api/protected/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, institution, isadmin, sms, roles })
      });
  
      if (response.ok) {
        success = 'User added successfully!';
        error = '';
        success = 'User added.'
      } else {
        const { error: serverError } = await response.json();
        error = 'Could not add user.';
        success = '';
      }
    }
  </script>

  <style>

  @media (max-width: 800px) {
    .form-container {
      width: 80%;
      max-width: 80%;
      margin: auto;
    }
  }

  @media (min-width: 800px) {
    .form-container {
      width: 400px;
      margin: auto;
    }
  }
     input {
      width: 100%;
      background-color: #fafafa;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 20px;
      box-sizing: border-box;
    }

    label * {
      width: 50px;
      min-width: 50px;
      max-width: 50px;
    }

    label, label * {
      background-color: #fafafa;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 15px 0px 20px 0px;
      color: #737373;
    }

    input[type="checkbox"]{
      width: 50%;
      background-color: #fafafa;
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 8px;
      box-sizing: border-box;
    }

    input:disabled {
      color: #ccc;
    }
  
    button {
      margin: 40px 0px 20px 0px;
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

    .form-container {
      width: 400px;
      margin: auto;
    }
  </style>
  

  <div class="form-container">
    <h2> 
      Add user
    </h2>
    Enter user details below.<br><br>
    <form on:submit|preventDefault={handleSubmit}>
      <input type="text" bind:value={name} placeholder="Name" required />
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="text" bind:value={sms} placeholder="Phone" />
      <input type="text" value={$session.institution} disabled required />
      <input type="text" bind:value={roles} placeholder="Roles (comma-separated)" required />
      <label>
        Is Admin
        <input type="checkbox" bind:checked={isadmin} /> 
      </label>
      <button type="submit">Add User</button>
    
      {#if error}<p style="color: red;">{error}</p>{/if}
      {#if success}<p style="color: green;">{success}</p>{/if}
    </form>  
  </div>
  