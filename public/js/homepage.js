const newBetHandler = async (event) => {
    document.location.replace('/profile/new-bet');
};

const newBet = document.querySelectorAll('#new-bet-button');
newBet.forEach((btn) => {
    btn.addEventListener('click', newBetHandler);
});
