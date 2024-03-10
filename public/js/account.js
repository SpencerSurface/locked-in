
const accountFormHandler = async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email-account').value.trim();
    const password = document.querySelector('#password-account').value.trim();

    if (email && password) {
        const response = await fetch(`/api/users/`, {
            method: 'PUT',
            body: JSON.stringify({email: email, password: password}),
            headers: {'Content-Type': 'application/json'},
        });

        if (response.ok) {
            console.log('Account updated successfully');
        } else {
            console.error('Failed to update account');
        }
    }
};
document.querySelector('.account-form').addEventListener('submit', accountFormHandler);

//listen for a `click` to connect when clicking the button
document.getElementById('connectButton').addEventListener('click', async () => {
    //check if Metamask is installed
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      // Request the user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Get the connected accounts
      const accounts = await web3.eth.getAccounts();

      // Display the connected account
      document.getElementById('connectedAccount').innerText = accounts[0];
    } else {
      // Alert the user to download Metamask
      alert('Please download Metamask');
    }
  });