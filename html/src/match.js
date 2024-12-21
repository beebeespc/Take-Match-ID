async function fetchPlayerNames(participants) {
    const playerNames = [];
    for (const puuid of participants) {
        const apiUrl = Proxy(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}?api_key=RGAPI-a9d80a77-538e-4b0c-9c88-26f686216ffb`);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                    "Accept-Language": "vi,en;q=0.9,en-US;q=0.8,fr;q=0.7,fr-FR;q=0.6",
                    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                    "Origin": "https://developer.riotgames.com"
                }
            });
            if (response.ok) {
                const data = await response.json();
                playerNames.push(`${data.gameName}#${data.tagLine}`);
            } else {
                console.error(`Failed to fetch player ${puuid}: ${response.status} ${response.statusText}`);
                playerNames.push("Unknown Player");
            }
        } catch (error) {
            console.error(`Error fetching player ${puuid}:`, error);
            playerNames.push("Error Fetching Player");
        }
        await delay(50);
    }
return playerNames;
}

async function fetchMatchData() {
    const matchId = document.getElementById('matchId').value;
    const API_KEY = TakeAPIKEY();
    const prefix = matchId.split('_')[0];
    const region = getRegionFromMatchId(prefix);
    try {
        const response = await fetch(Proxy(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`));
        const data = await response.json();
        const matchInfo = data.info;
        const metadata = data.metadata;

        const participants = matchInfo.participants;
        const teamBlue = participants.filter(p => p.teamId === 100);
        const teamRed = participants.filter(p => p.teamId === 200);

        const blueWin = matchInfo.teams.find(team => team.teamId === 100)?.win;
        const redWin = matchInfo.teams.find(team => team.teamId === 200)?.win;
        
        const teamBlueTitle = document.querySelector(".team.blue h2");
        const teamRedTitle = document.querySelector(".team.red h2");

        teamBlueTitle.textContent = blueWin ? "Team Blue (Victory)" : "Team Blue";
        teamRedTitle.textContent = redWin ? "Team Red (Victory)" : "Team Red";

        displayPlayers("team-blue", teamBlue);
        displayPlayers("team-red", teamRed);

        const maponeone = await fetchMapData(matchInfo.mapId)
        const gameC = formatTimestampToUTC(matchInfo.gameCreation)
        const gameCLC = formatTimestampToLocalTime(matchInfo.gameCreation);
        document.getElementById("datetime").textContent = `${gameC} - ${gameCLC} (Local)`;
        document.getElementById("map-name").textContent = `Map: ${maponeone}`;
        updatePatchElement(matchInfo.gameVersion);

        const gameD = formatDuration(matchInfo.gameDuration);
        document.getElementById("blue-kills").textContent = teamBlue.reduce((sum, p) => sum + p.kills, 0);
        document.getElementById("red-kills").textContent = teamRed.reduce((sum, p) => sum + p.kills, 0);
        document.getElementById("duration").textContent = `${gameD}`;

        const Namelist = await fetchPlayerNames(metadata.participants);
        const dsphtml = `<div class="player-list">
        ${Namelist.map(name => `<p class="player"><a href="player.html?playerName=${name}" target="_blank">${name}</a></p>`).join('')}
    </div>`
        document.getElementById("ridc").innerHTML = dsphtml;

    } catch (error) {
        console.error("Error fetching match data:", error);
    }
}

function displayPlayers(sectionId, players) {
    const section = document.getElementById(sectionId);
    section.innerHTML = ""; // Clear previous data

    players.forEach(player => {
        const playerDiv = document.createElement("div");
        const iconPath = `champion/${player.championName}.png`;

if (player.riotIdGameName) {
    playerDiv.innerHTML = `
    <div class="player-info">
    <img src="${iconPath}" alt="${player.championName}" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<span>${player.championName}</span>');">
    <div class="player-text">
        <p class="player-name">${player.riotIdGameName}#${player.riotIdTagline}</p>
        <p class="player-kda">K/D/A: ${player.kills}/${player.deaths}/${player.assists}</p>
    </div>
</div>
        `;
} else {
    playerDiv.innerHTML = `
            <div class="player-info">
            <img src="${iconPath}" alt="${player.championName}" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<span>${player.championName}</span>');">
    <div class="player-text">
        <p class="player-name">${player.summonerName}</p>
        <p class="player-kda">K/D/A: ${player.kills}/${player.deaths}/${player.assists}</p>
    </div>
        `;
}
        
        section.appendChild(playerDiv);
    });
}

fetchMatchData();
