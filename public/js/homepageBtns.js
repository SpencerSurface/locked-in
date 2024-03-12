const loginHandler = async (event) => {
    document.location.replace('/login');
};

const signupHandler = async (event) => {
    document.location.replace('/signup');
};

document.querySelector('#login-button').addEventListener('click', loginHandler);
document.querySelector('#signup-button').addEventListener('click', signupHandler);