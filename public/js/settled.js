// For the background color of each settled bet based on if the current user won it
const colorCode = async () => {

    const currentUserId = document.querySelector(".settled-container").getAttribute("data-types");
    const currentUserData = await fetch(`/api/users/${currentUserId}`, {
        method: "GET",
    });
    const userData = await currentUserData.json();
    const username = userData.userInfo.username;

    const settledBets = document.querySelectorAll(".settled-bet");
    settledBets.forEach((bet) => {
        console.log(bet)
        const winnerString = bet.querySelector(".winner").textContent;
        const winner = winnerString.slice(8);
        console.log(winner);

        if(username === winner){
            bet.style.backgroundColor = "rgba(73, 209, 112, 0.4)";
        } else if(winner === "VOIDED"){
            bet.style.backgroundColor = "rgba(82, 69, 69, 0.4)";
        } else{
            bet.style.backgroundColor = "rgba(208, 72, 72, 0.5)";
        }
    })
}


document.addEventListener("DOMContentLoaded", colorCode);