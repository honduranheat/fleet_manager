const inquirer = require("inquirer");
let count = 0;
let pilots = [];
let startersArr = [];
let subArr = [];
let score;

function Pilot(name, pos, off, def) {
  this.name = name;
  this.pos = pos;
  this.off = off;
  this.def = def;
  this.printStats = function() {
    console.log(this.name);
    console.log(this.pos);
  };
  this.goodGame = function() {
    let coinFlip = Math.floor(Math.random() * 2);

    if (coinFlip === 1) {
      this.off++;
      console.log("Offense: " + this.off);
    } else {
      this.def++;
      console.log("Defense: " + this.def);
    }
  };
  this.badGame = function() {
    let coinFlip = Math.floor(Math.random() * 2);

    if (coinFlip === 1) {
      this.off--;
      console.log("Offense: " + this.off);
    } else {
      this.def--;
      console.log("Defense: " + this.def);
    }
  };
}

Pilot.prototype.printInfo = function() {
  console.log(
    `Name: ${this.name} \nRank: ${this.pos} \nOffense: ${
      this.off
    } \nDefense: ${this.def}`
  );
};

let buildTeam = function() {
  if (count < 3) {
    console.log("New Pilot");

    inquirer
      .prompt([
        {
          name: "name",
          message: "What is the pilots name?"
        },
        {
          name: "pos",
          message: "What is the pilots rank?"
        },
        {
          name: "off",
          message: "Offense Rating?"
        },
        {
          name: "def",
          message: "Defense rating?"
        }
      ])
      .then(function(answers) {
        let newPilot = new Pilot(
          answers.name,
          answers.pos,
          answers.off,
          answers.def
        );

        if (count < 2) {
          pilots.push(newPilot);
          startersArr.push(newPilot);
          count++;
          buildTeam();
        } else {
          pilots.push(newPilot);
          subArr.push(newPilot);
          count++;
          buildTeam();
        }
      });
  } else {
    for (let x = 0; x < pilots.length; x++) {
      pilots[x].printInfo();
    }
    // console.log(startersArr);
    // console.log(subArr);
    PlayGame();
  }
};

function PlayGame() {
  let rNum1;
  let rNum2;
  score = 0;

  for (let r = 0; r < 6; r++) {
    let off1 = parseInt(startersArr[0].off);
    let off2 = parseInt(startersArr[1].off);
    let offense = off1 + off2;
    let def1 = parseInt(startersArr[0].def);
    let def2 = parseInt(startersArr[1].def);
    let defense = def1 + def2;

    rNum1 = Math.floor(Math.random() * 20) + 1;
    rNum2 = Math.floor(Math.random() * 20) + 1;

    if (rNum1 < offense) {
      score++;
      //console.log(score);
    }

    if (rNum2 > defense) {
      score--;
      //console.log(score);
    }

    inquirer
      .prompt([
        {
          name: "confirm",
          type: "confirm",
          message: "Would you like to use a sub?"
        }
      ])
      .then(function(answer) {
        if (answer.confirm === true) {
          inquirer
            .prompt([
              {
                name: "sub",
                type: "rawlist",
                message: "Who would you like to sub in?",
                choices: subArr
              }
            ])
            .then(function(subIn) {
              let sideline = {};
              let number = 0;
              for (let i = 0; i < subArr.length; i++) {
                if (subArr[i].name === subIn.sub) {
                  number = i;
                  sideline = subs[i];
                }
              }
              inquirer.prompt([{
                name: "sub",
                type: "rawlist",
                message: "Who would you like to sub out?",
                choices: startersArr
              }]).then(function(subOut) {
                for (let i = 0; i < startersArr.length; i++) {
                  if (startersArr[i].name === subOut.subArr) {
                    subArr[number] = starters[i];
                    starters[i] = sideline;
                    console.log('Sub made');
                  }
                }
                
              })
            });
        }
      });
  } 
  console.log(`Game Over! \nFinal Score: ${score}`);
  if (score > 0) {
    console.log(`Good job fleet! \nWe saved the Earth! \nI can tell everyone has gotten a little better after that one!`);
    for (let i = 0; i < startersArr.length; i++) {
      startersArr[i].goodGame();
    }
    
  }

  if (score < 0) {
    console.log(`We failed. Earth is doomed...`);
    for (let i = 0; i < startersArr.length; i++) {
      startersArr[i].badGame();
    }
  }

  if (score === 0 ) {
    console.log(`No time for rest! Lets give it everything we got!`);
  }

  playAgain();
}

function playAgain() {
  inquirer.prompt({
    name: 'again',
    type: 'confirm',
    message: 'Play again?'
  }).then(function(answer) {
    if (answer.again === true) {
      score = 0;
      PlayGame();
    } else {
      console.log('See you l8r');
    }
  })
}

buildTeam();
//PlayGame();
