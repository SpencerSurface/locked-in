const handleNewBet = async (event) => {

    event.preventDefault();

    //Get form values
    const sendTo = document.querySelector("#send-to").value.trim();
    const title = document.querySelector("#bet-title").value.trim();
    const stake = parseFloat(document.querySelector("#stake-amount").value.trim()); 
    const betAmount = stake;

    if(sendTo && title && stake){
        const response = await fetch("/profile/new-bet", {
            method: "POST",
            body: JSON.stringify({ sendTo, title, stake, betAmount }),
            headers: { "Content-Type": "application/json" },
        });

        if(response.ok){
            location.replace("/profile")
        }else{
            console.error("Error making bet");
        }

    }else{
        console.error("Error getting values");
    }
}


document.querySelector("#new-bet").addEventListener("submit", handleNewBet);