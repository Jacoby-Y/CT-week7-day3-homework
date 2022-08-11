
const tBody = document.getElementById("t-body");
const mainTable = document.getElementById("main-table");

let tData = [];

const bool = {
    false: false,
    true: true,
}

const buildTable = (key="index")=>{
    clearTable();
    if (tData.length == 0) return;

    if (key == mainTable.getAttribute("order")) {
        mainTable.setAttribute("reverse", !bool[mainTable.getAttribute("reverse")]);
    } else {
        mainTable.setAttribute("reverse", "false");
        mainTable.setAttribute("order", key);
    }

    tData.sort((a, b)=>{
        const v1 = a[key], v2 = b[key];
        if (v1 == v2) return 0;
        if (typeof v1 == "string") {
            if ([v1, v2].sort()[0] == v1) return -1;
            return 1;
        } else {
            return v1 - v2;
        }
    })
    if (bool[mainTable.getAttribute("reverse")]) {
        tData = tData.reverse();
    }
    tData.forEach((data)=>{
        tBody.insertAdjacentHTML("beforeend", `
            <tr>
                <th scope="row">${data.index+1}</th>
                <td>${data.givenName}</td>
                <td>${data.familyName}</td>
                <td>${data.dateOfBirth}</td>
                <td>${data.position}</td>
                <td>${data.wins}</td>
                <td>${data.nationality}</td>
                <td>${data.carName}</td>
            </tr>
        `);
    });
}

const getErgast = (season, round)=>{
    setupGlowers();
    const ergastURL = `https://ergast.com/api/f1/${season}/${round}/driverStandings.json`;
    axios.get(ergastURL)
        .then(ok => {
            const rows = ok?.data?.MRData?.StandingsTable?.StandingsLists[0]?.DriverStandings;
            clearGlowers();
            if (rows == undefined) {
                makeAlert("An error occured and the table couldn't be constructed!");
                return;
            }
            tData = rows.map((base, index)=>{
                // { dateOfBirth, familyName, givenName, nationality, position, wins, Constructors}
                const rowData = { ...base, ...base.Driver, index };
                rowData.carName = base.Constructors[0].name;
                return rowData;
            });
            mainTable.setAttribute("reverse", "true");
            mainTable.setAttribute("order", "index");
            buildTable();
        })
        .catch(err => {
            console.error(err);
            clearTable();
            clearAlerts();
            clearGlowers();
            mainContainer.insertAdjacentHTML("beforeend", makeAlert("Error when trying to build table!"));
        });
}

const clearTable = ()=>{
    while (tBody.children.length > 0) {
        tBody.removeChild(tBody.firstChild);
    }
}

const clearAlerts = ()=>{
    [].slice.call(document.querySelectorAll(".alert")).forEach(elem => elem.remove());
}

const makeAlert = (message, theme="warning")=> `
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
    clearAlerts();
    clearGlowers();
    if (isNaN(season) || isNaN(round)) {
        mainContainer.insertAdjacentHTML("beforeend", makeAlert("Inputs must be numbers!"));
        return;
    }
    tData = [];
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