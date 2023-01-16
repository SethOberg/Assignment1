const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
const numberRegExp = /^[0-9]+$/;
let balance = 0;
let pay = 0;
let loan = 0;
let hasLoan = false;
let allComputers;
let selectedComputer;

window.addEventListener("load", startUp());

function startUp() {
  updateBalanceText(balance);
  updatePayText(pay);
  updateLoanText(loan);
  fetchUsers();
}

async function fetchUsers() {
  const response = await fetch(API_URL);
  const computers = await response.json();

  return computers;
}

fetchUsers().then((computers) => {
  allComputers = computers;

  addToSelect(computers);
  //first computer marked as selected
  selectedComputer = allComputers[0];
  updateComputerDetails(selectedComputer);
});

function takeLoan() {
  if (hasLoan && loan > 0) {
    alert("Pay off loan before taking another one");
  } else {
    const result = prompt("Please enter amount");
    //Check if input is a positive number
    if (numberRegExp.test(result)) {
      const loanAmount = parseInt(result);

      //cannot take loan larger than twice the current balance
      if (balance * 2 < loanAmount) {
        alert("Loan cannot be higher than twice your balance");
      } else {
        balance += loanAmount;
        loan += loanAmount;
        displayLoanRelatedInfo();
        updateLoanText(loan);
        hasLoan = true;
      }
    } else {
      alert("Please enter a number");
    }
  }

  updateBalanceText(balance);
}

function updateComputerImage(str) {
  document.getElementById("computerImage").src =
    "https://hickory-quilled-actress.glitch.me/" + str;
}

function addComputersToDropdown(computers) {
  let select = document.getElementById("computerSelect");

  for (computer of computers) {
    let option = document.createElement("option");
    const id = document.createTextNode(computer["id"]);
    const text = document.createTextNode(computer["title"]);

    option.value = id;
    option.innerHTML = text;

    select.appendChild(option);
  }
}

function computerSelected() {
  let selection = document.getElementById("computerSelect");

  selectedComputer = allComputers.filter(
    (item) => item.id == selection.options[selection.selectedIndex].value
  )[0];

  updateComputerDetails(selectedComputer);
}

function displayComputerFeatures(features) {
  let list = document.getElementById("featureList");
  document.getElementById("featureList").innerHTML = "";

  features.forEach((text) => {
    let listViewItem = document.createElement("li");
    listViewItem.appendChild(document.createTextNode(text));
    list.appendChild(listViewItem);
  });
}

function updateComputerDetails(computer) {
  displayComputerFeatures(computer.specs);
  updateComputerPriceText(computer.price);
  document.getElementById("computerNameTxt").innerHTML = computer.title;
  document.getElementById("computerDescriptionTxt").innerHTML =
    computer.description;
  updateComputerImage(computer.image);
}

function addToSelect(computers) {
  let options = "";

  for (let computer of computers) {
    let title = computer.title;
    let id = computer.id;

    options += `<option value="${id}">${title}</option>`;
  }

  document.getElementById("computerSelect").innerHTML = options;
}

function work() {
  pay += 100;
  updatePayText(pay);
}

function bank() {
  if (pay > 0) {
    if (hasLoan && loan > 0) {
      //pay off 10 percent of loan when transferring to bank if person has loan
      let loanPayOff = pay * 0.1;

      //amount to pay off smaller or equal to loan, decrease with 10 percent
      if (loanPayOff <= loan) {
        loan -= loanPayOff;
        balance += pay * 0.9;
        pay = 0;
      } else {
        //if loan pay off is larger than loan left, decrease salary with the remaining loan
        balance += pay - loan;
        loan = 0;
        pay = 0;
      }
    } else {
      balance += pay;
      pay = 0;
    }
  } else {
    alert("No salary to bank");
  }

  checkIfLoanPaidOff();
  updatePayText(pay);
  updateBalanceText(balance);
  updateLoanText(loan);
}

function buyComputer() {
  if (balance >= selectedComputer.price) {
    balance -= selectedComputer.price;
    updateBalanceText(balance);
    alert("You bought a new computer!");
  } else {
    alert("Insufficient funds");
  }
}

function repayLoan() {
  if (loan === 0) {
    alert("You have no loan to pay off");
  } else {
    const result = prompt("Please enter amount");
    //Check if input is a positive number
    if (numberRegExp.test(result)) {
      const amountToPayOff = parseInt(result);

      if (amountToPayOff > pay) {
        alert("Insufficient funds");
      } else if (amountToPayOff > loan) {
        alert("Cannot pay back more than loan");
      } else {
        pay -= amountToPayOff;
        loan -= amountToPayOff;

        checkIfLoanPaidOff();
        updatePayText(pay);
        updateLoanText(loan);
      }
    } else {
      alert("Please enter a number");
    }
  }
}

function updateBalanceText(amount) {
  document.getElementById("balanceTxt").innerHTML =
    new Intl.NumberFormat().format(amount);
}

function updateLoanText(amount) {
  document.getElementById("loanTxt").innerHTML = new Intl.NumberFormat().format(
    amount
  );
}

function updatePayText(amount) {
  document.getElementById("payTxt").innerHTML = new Intl.NumberFormat().format(
    amount
  );
}

function updateComputerPriceText(price) {
  document.getElementById("computerPriceTxt").innerHTML =
    new Intl.NumberFormat().format(price);
}

function hideLoanRelatedInfo() {
  document.getElementById("repayLoanBtn").style.display = "none";
  document.getElementById("loanInfo").style.display = "none";
}

function displayLoanRelatedInfo() {
  document.getElementById("repayLoanBtn").style.display = "block";
  document.getElementById("loanInfo").style.display = "block";
}

function imageMissing() {
  document.getElementById("computerImage").src = "images/imageMissing.jpg";
}

function checkIfLoanPaidOff() {
  if (hasLoan && loan === 0) {
    hideLoanRelatedInfo();
    hasLoan = false;
    alert("Loan paid off");
  }
}
