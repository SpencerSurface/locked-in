const handlePendingChoice = async (event) => {
  event.preventDefault();

  const betId = event.target.getAttribute("data-types");
  const userChoice = event.target.value;

  if (userChoice === "accept") {
    const status = "IN_PROGRESS";

    //If accepted the status for the bet is set to IN_PROGRESS
    const response = await fetch(`/api/bets/${betId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      location.reload();
    } else {
      console.error(err);
    }
  } else if (userChoice === "deny") {
    const status = "DENIED";
    // If denied the bet status is set to denied
    const response = await fetch(`/api/bets/${betId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      location.reload();
    } else {
      console.error(err);
    }
  }
};

const handleVote = async (event) => {
  event.preventDefault();

  //Value of the voted user
  const votedUser = event.target.querySelector('h5').textContent.trim();

  // The betId
  const betId = event.target.getAttribute("data-types");

  // For creating a new vote
  const responseVote = await fetch('/api/votes', {
    method: "POST",
    body: JSON.stringify({ votedUser, betId }),
    headers: { "Content-Type": "application/json" },
  });

  // Check votes
  const responseCheckVotes = await fetch(`/api/votes/check/${betId}`, {
    method: "GET",
  })

  if(responseVote.ok && responseCheckVotes){
    // location.reload();
    console.log(responseCheckVotes);
  }
}

const voteBtns = document.querySelectorAll(".vote-user");
voteBtns.forEach((btn) => {
  btn.addEventListener("submit", handleVote);
})

const choiceBtns = document.querySelectorAll(".choice-btns");
choiceBtns.forEach((btn) => {
  btn.addEventListener("click", handlePendingChoice);
});
