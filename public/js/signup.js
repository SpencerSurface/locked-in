const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector("#signup-username").value.trim();
    const email = document.querySelector("#signup-email").value.trim();
    const password = document.querySelector("#signup-password").value.trim();
  
    if (username && email && password) {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        document.location.replace("/");
      } else {
        alert(response.statusText, "Error with logging in");
      }
    }
  };
  
  document.querySelector("#signup").addEventListener("submit", signupFormHandler);