const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
let balance = 0;
let pay = 0;
let allComputers;
let loanVar = 0;
let chosenComputer;
let balanceBasic = 0;

window.addEventListener("load", startUp());

function startUp() {
  document.getElementById("balance").innerHTML = balance;
  document.getElementById("payAmount").innerHTML = pay;
  document.getElementById("loanLbl").innerHTML = pay;

  document.getElementById("balanceBasic").innerHTML = balanceBasic;

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

  console.log(computers);
});

function loan() {
  let regex = /\d/i;

  if (loanVar > 0) {
    alert("Pay of loan before taking another one");
  } else {
    const result = prompt("Please enter amount");
    if (regex.test(result)) {
      const loanAmount = parseInt(result);

      if (balance * 2 < loanAmount) {
        alert("Loan cannot be higher than *2 balance");
      } else {
        balance += loanAmount;
        loanVar += loanAmount;
        document.getElementById("repayLoanBtn").style.display = "block";
        document.getElementById("loanLbl").innerHTML = loanVar;
      }
    } else {
      alert("Please enter a number");
    }
  }

  document.getElementById("balance").innerText = balance;
}

function printComputers() {
  console.log(allComputers);
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

  console.log(updateTexts(selection.options[selection.selectedIndex].value));

  chosenComputer = allComputers.filter(
    (item) => item.id == selection.options[selection.selectedIndex].value
  )[0];
}

function displayFeatures(features) {
  //let split = features.split(",");
  let newFeatures = "";

  //console.log("Test");
  //console.log(split);

  console.log(" ");
  console.log("Features");
  console.log(features);
  console.log(" ");

  // for(str of features) {
  //     console.log(str + "\n");
  //     newFeatures += str + "\n";
  // }
  let listView = document.createElement("ul");
  let list = document.getElementById("featureList");
  document.getElementById("featureList").innerHTML = "";

  features.forEach((text) => {
    //newFeatures += `${text} \n`;
    let listViewItem = document.createElement("li");

    listViewItem.appendChild(document.createTextNode(text));
    //listView.appendChild(listViewItem);
    list.appendChild(listViewItem);
  });

  console.log(listView);

  //document.getElementById("featureList").innerHTML = listView;

  //console.log(newFeatures);

  //return newFeatures;
}

function updateTexts(computerId) {
  const computer = allComputers.filter((item) => item.id == computerId);

  // displayFeatures(computer[0].specs);

  console.log(computer[0]);
  displayFeatures(computer[0].specs);
  document.getElementById("priceLbl").innerHTML = computer[0].price;
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
  document.getElementById("payAmount").innerHTML = pay;
}

function bank() {
  //Fixa logic

  if (pay > 0) {
    if (loanVar > 0) {
      let loanPay = pay * 0.1;

      if (loanPay <= loanVar) {
        loanVar -= loanPay;
        balance += pay * 0.9;
        pay = 0;
      } else {
        pay -= loanPay;
        balance += pay;
        loanVar = 0;
        pay = 0;
      }
    } else {
      balance += pay;
      pay = 0;
    }
  }

  document.getElementById("payAmount").innerHTML = pay;
  document.getElementById("balance").innerHTML = balance;
  document.getElementById("loanLbl").innerHTML = loanVar;
}

function buy() {
  if (balance >= chosenComputer.price) {
    balance -= chosenComputer.price;
    document.getElementById("balance").innerHTML = balance;
    alert("You bought a new computer!");
  } else {
    alert("Insufficient funds");
  }
}

//fix
function repayLoan() {
  let regex = /\d/i;

  if (loanVar == 0) {
    alert("You have no loan to pay off");
  } else {
    const result = prompt("Please enter amount");
    if (regex.test(result)) {
      const payBack = parseInt(result);

      //ändra till utom lån
      if (payBack > balance) {
        alert("Insufficient funds");
      } else {
        balance -= payBack;
        loanVar -= payBack;

        if (loanVar == 0) {
          document.getElementById("repayLoanBtn").style.display = "block";
        }
        document.getElementById("balance").innerHTML = balance;
        document.getElementById("loanLbl").innerHTML = loanVar;
      }
    } else {
      alert("Please enter a number");
    }
  }
}
