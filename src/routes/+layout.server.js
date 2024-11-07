// src/routes/+layout.server.js
export async function load({ locals }) {
  console.log(locals)
    return {
      user: locals.user,
      isLoggedIn: locals.user?.organizationName ? true : false,
      isAdmin: locals.user?.isAdmin ? true : false 
    };
  }
  