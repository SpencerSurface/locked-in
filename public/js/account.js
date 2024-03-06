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