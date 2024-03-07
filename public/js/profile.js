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

// Hnadling a vote made
const handleVote = async (event) => {
  event.preventDefault();

  console.log(event.target.parentNode.parentNode);
  //Value of the voted user
  const votedUser = event.target.querySelector("h5").getAttribute("data-types");

  // The betId
  const betId = event.target.getAttribute("data-types");

  // For creating a new vote
  const createVote = await fetch("/api/votes", {
    method: "POST",
    body: JSON.stringify({ votedUser, betId }),
    headers: { "Content-Type": "application/json" },
  });

  // Check votes to see if other user voted
  const checkVotes = await fetch(`/api/votes/check/${betId}`, {
    method: "GET",
  });

  const responseVote = await checkVotes.json();

  if (responseVote.userVoted) {
    // Handle the case where there's only one vote
    const entireContainer = event.target.parentNode.parentNode;
    waitingActiveBets(entireContainer);
  }

  if (createVote.ok) {
    location.reload();
  }
};

// checking votes on page load
const checkVotes = () => {
  // Check votes to see if other user voted
  const allActiveBets = document.querySelectorAll(".active-bet");
  allActiveBets.forEach(async (bet) => {
    const betId = bet
      .querySelector("#first-user-form")
      .getAttribute("data-types");

    const checkVotes = await fetch(`/api/votes/check/${betId}`, {
      method: "GET",
    });

    const responseVote = await checkVotes.json();

    // If only user Voted
    if (responseVote.userVoted) {
      waitingActiveBets(bet);

      //If only the opposite user voted
    } else if (responseVote.otherUserVoted) {
      console.log(responseVote.otherUserVoted);
    }
  });
};

//For editng container when there is only one vote
const waitingActiveBets = async (entireContainer) => {
  const forms = entireContainer.querySelectorAll(".vote-user");
  forms.forEach((form) => {
    form.style.display = "none";
  });
  const otherUsername =
    entireContainer.querySelector(".other-username").textContent;
  console.log(otherUsername);

  const text = entireContainer.querySelector(".active-text");
  text.textContent = `Waiting for ${otherUsername} to vote`;
};

document.addEventListener("DOMContentLoaded", checkVotes);

const voteBtns = document.querySelectorAll(".vote-user");
voteBtns.forEach((btn) => {
  btn.addEventListener("submit", handleVote);
});

const choiceBtns = document.querySelectorAll(".choice-btns");
choiceBtns.forEach((btn) => {
  btn.addEventListener("click", handlePendingChoice);
});
