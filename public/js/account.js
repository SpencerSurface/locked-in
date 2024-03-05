const accountFormHandler = async (event) => {
    event.preventDefault();

    const newEmail = document.querySelector('#email-account').value.trim();
    const newPassword = document.querySelector('#password-account').value.trim();

    if (newEmail && newPassword) {
        const response = await fetch('/api/account', {
            method: 'PUT',
            body: JSON.stringify({email: newEmail, password: newPassword}),
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