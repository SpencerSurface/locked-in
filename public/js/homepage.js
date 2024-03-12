const newBetHandler = async (event) => {
    document.location.replace('/profile/new-bet');
};

const loginHandler = async (event) => {
    document.location.replace('/login');
};

const signupHandler = async (event) => {
    document.location.replace('/signup');
};

document.querySelector('#new-bet-button').addEventListener('click', newBetHandler);
document.querySelector('#login-button').addEventListener('click', loginHandler);
document.querySelector('#signup-button').addEventListener('click', signupHandler);