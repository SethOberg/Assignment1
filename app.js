const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
let balance = 0;
let pay = 0;
let allComputers;
let loan = 0;
let chosenComputer;

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
  updateTexts(allComputers[0].id);
});

function takeLoan() {
  let regex = /\d/i;

  if (loan > 0) {
    alert("Pay off loan before taking another one");
  } else {
    const result = prompt("Please enter amount");
    if (regex.test(result)) {
      const loanAmount = parseInt(result);

      if (balance * 2 < loanAmount) {
        alert("Loan cannot be higher than *2 balance");
      } else {
        balance += loanAmount;
        loan += loanAmount;
        document.getElementById("repayLoanBtn").style.display = "block";
        document.getElementById("loanInfo").style.display = "block";
        updateLoanText(loan);
      }
    } else {
      alert("Please enter a number");
    }
  }

  updateBalanceText(balance);
}

function updateImage(str) {
  document.getElementById("computerImage").src = str;
  document.getElementById("computerImage").style.display = "block";
}

function addComputersToDropdown(computers) {
  let ul = document.getElementById("computerListDropdown");
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

  updateTexts(selection.options[selection.selectedIndex].value);

  chosenComputer = allComputers.filter(
    (item) => item.id == selection.options[selection.selectedIndex].value
  )[0];
}

function displayFeatures(features) {
  let newFeatures = "";

  let listView = document.createElement("ul");
  let list = document.getElementById("featureList");
  document.getElementById("featureList").innerHTML = "";

  features.forEach((text) => {
    let listViewItem = document.createElement("li");

    listViewItem.appendChild(document.createTextNode(text));
    list.appendChild(listViewItem);
  });
}

function updateTexts(computerId) {
  const computer = allComputers.filter((item) => item.id == computerId);

  displayFeatures(computer[0].specs);

  updateComputerPriceText(computer[0].price);
  document.getElementById("computerName").innerHTML = computer[0].title;
  document.getElementById("computerDescription").innerHTML =
    computer[0].description;
  document.getElementById("computerImage").src =
    "https://hickory-quilled-actress.glitch.me/" + computer[0].image;
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
    if (loan > 0) {
      let loanPay = pay * 0.1;

      if (loanPay <= loan) {
        loan -= loanPay;
        balance += pay * 0.9;
        pay = 0;
      } else {
        pay -= loanPay;
        balance += pay;
        loan = 0;
        pay = 0;
      }
    } else {
      balance += pay;
      pay = 0;
    }
  }

  if (loan === 0) {
    document.getElementById("repayLoanBtn").style.display = "none";
    document.getElementById("loanInfo").style.display = "none";
  }

  updatePayText(pay);
  updateBalanceText(balance);
  updateLoanText(loan);
}

function buy() {
  if (pay >= chosenComputer.price) {
    pay -= chosenComputer.price;
    updatePayText(pay);
    alert("You bought a new computer!");
  } else {
    alert("Insufficient funds");
  }
}

function repayLoan() {
  let regex = /\d/i;

  if (loan === 0) {
    alert("You have no loan to pay off");
  } else {
    const result = prompt("Please enter amount");
    if (regex.test(result)) {
      const payBack = parseInt(result);

      if (payBack > pay) {
        alert("Insufficient funds");
      } else if (payBack > loan) {
        alert("Cannot pay back more than loan");
      } else {
        pay -= payBack;
        loan -= payBack;

        if (loan == 0) {
          document.getElementById("repayLoanBtn").style.display = "none";
          document.getElementById("loanInfo").style.display = "none";
        }
        updatePayText(pay);
        updateLoanText(loan);
      }
    } else {
      alert("Please enter a number");
    }
  }
}

function updateBalanceText(amount) {
  document.getElementById("balance").innerHTML = new Intl.NumberFormat().format(
    amount
  );
}

function updateLoanText(amount) {
  document.getElementById("loanLbl").innerHTML = new Intl.NumberFormat().format(
    amount
  );
}

function updatePayText(amount) {
  document.getElementById("payAmount").innerHTML =
    new Intl.NumberFormat().format(amount);
}

function updateComputerPriceText(price) {
  document.getElementById("priceLbl").innerHTML =
    new Intl.NumberFormat().format(price);
}
