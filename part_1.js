
const tBody = document.getElementById("t-body");

const getErgast = (season, round)=>{
    setupGlowers()
    const ergastURL = `https://ergast.com/api/f1/${season}/${round}/driverStandings.json`;
    axios.get(ergastURL)
        .then(ok => {
            const rows = ok?.data?.MRData?.StandingsTable?.StandingsLists[0]?.DriverStandings;
            clearGlowers();
            rows.forEach(({Driver, position, wins, Constructors}, index)=>{
                const { dateOfBirth, familyName, givenName, nationality } = Driver;
                const carName = Constructors[0].name;
                tBody.insertAdjacentHTML("beforeend", `
                <tr>
                    <th scope="row">${index+1}</th>
                    <td>${givenName}</td>
                    <td>${familyName}</td>
                    <td>${dateOfBirth}</td>
                    <td>${position}</td>
                    <td>${wins}</td>
                    <td>${nationality}</td>
                    <td>${carName}</td>
                </tr>
                `);
            });
        })
        .catch(err => {
            console.error(err);
            mainContainer.insertAdjacentHTML("beforeend", makePoppup("Error when trying to build table!"));
        });
}

const clearTable = ()=>{
    while (tBody.children.length > 0) {
        tBody.removeChild(tBody.firstChild);
    }
}

const makePoppup = (message, theme="warning")=> `
<div class="alert alert-${theme} alert-dismissible fade show m-auto mb-5 mx-5 width-max-content" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`;

const glowers = document.getElementById("glowers");

const addGlowRow = ()=>{
    const col = [1, 1, 1, 1, 2, 2, 2];
    const rows = col.length;
    let result = `<p class="placeholder-glow"> </p>`;
    const row = (glowers.insertAdjacentHTML("beforeend", result), glowers.lastChild);
    for (let i = 0; i < rows; i++) {
        setTimeout(()=>{
            const insert = `<span class="placeholder col-${col.splice(Math.floor(Math.random()*col.length), 1)[0]} placeholder-lg"></span>\n`;
            row.insertAdjacentHTML("beforeend", insert);
        }, 150*i);
    }
}
const setupGlowers = ()=>{
    for (let i = 0; i < 20; i++) {
        setTimeout(()=> {
            addGlowRow();
        }, 100*i)
    }
};

const clearGlowers = ()=>{
    while (glowers.children.length > 0) {
        glowers.removeChild(glowers.firstChild);
    }
}

const mainContainer = document.getElementById("main-container");

const submitBtn = document.getElementById("submit-btn");
const seasonInp = document.getElementById("season-inp");
const roundInp = document.getElementById("round-inp");
submitBtn.onclick = ()=>{
    const season = seasonInp.value;
    const round = roundInp.value;
    clearTable();
    if (isNaN(season) || isNaN(round)) {
        mainContainer.insertAdjacentHTML("beforeend", makePoppup("Inputs must be numbers!"));
        return;
    }
    getErgast(season, round);
}

// getErgast(2020, 1);


/* "season" and "round"
retrieve and show:
    first name
    last name
    date of birth
    position
    wins
    nationality
    Constructor
*/