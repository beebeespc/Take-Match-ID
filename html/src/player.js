let currentPage = 0;
let puuid = '';

async function fetchPuuid(player, tagline) {
    const API_KEY = TakeAPIKEY();
    const url = Proxy(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${player}/${tagline}?api_key=${API_KEY}`);
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data.puuid;
    } else {
        alert('Error fetching PUUID');
        return null;
    }
}

async function fetchMatches() {
    const playerid = document.getElementById('playerId').value;
    const playerIdParts = playerid.split('#')
    const player = playerIdParts[0]
    const tagline = playerIdParts[1]
    const ts = document.getElementById('timestart').value;
    const te = document.getElementById('timeend').value;

    if(ts)
    {
        timestart = formatLocalTimeToEpochTimestamp(ts);
    }else{
        timestart = ts;
    }

    if(te)
    {
        timeend = formatLocalTimeToEpochTimestamp(te);
    }else{
        timeend = te;
    }

    const matchtype = document.getElementById('matchtype').value;

    puuid = await fetchPuuid(player, tagline);
    if (!puuid) return;

    await fetchMatchIds(timestart, timeend, matchtype);
}

async function fetchMatchIds(timestart, timeend, matchtype) {
    const apiKey = TakeAPIKEY();
    const regions = ['americas', 'asia', 'europe', 'sea'];
    const matchesContainer = document.getElementById('matches');
    matchesContainer.innerHTML = '';

    for (const region of regions) {
        const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${timestart}&endTime=${timeend}&type=${matchtype}&start=${currentPage}&count=10&api_key=${apiKey}`
        const response = await fetch(url);
        if (response.ok) {
            const matchIds = await response.json();
            for (const matchId of matchIds) {
                await fetchMatchDetails(region, matchId);
            }
        }
    }

    document.getElementById('prevButton').disabled = currentPage === 0;
    document.getElementById('nextButton').disabled = false;
}

async function fetchMatchDetails(region, matchId) {
    const apiKey = TakeAPIKEY();
    const url = Proxy(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`);
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        displayMatch(data);
    }
}

function displayMatch(matchData) {
    const matchesContainer = document.getElementById('matches');
    const participant = matchData.info.participants.find(p => p.puuid === puuid);
    const gcutc = formatTimestampToUTC(matchData.info.gameCreation)
    const gclocal = formatTimestampToLocalTime(matchData.info.gameCreation)

    const matchDiv = document.createElement('div');
    matchDiv.className = 'match-container2';
    if(participant.riotIdGameName){
        matchDiv.innerHTML = `
        <div class="player-info"><img src="champion/${participant.championName}.png" alt="${participant.championName}" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<span>${participant.championName}</span>');"></div>
        <div class="match-info2">
            <div>Match ID: <a href="match.html?matchid=${matchData.metadata.matchId}">${matchData.metadata.matchId}</a></div>
            <div>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</div>
            <div>Game Creation (UTC): ${gcutc}</div>
            <div>Game Creation (Local): ${gclocal}</div>
        </div>
        <div class="player-list2">
            ${matchData.info.participants.map(p => p.riotIdGameName + "#" + p.riotIdTagline).join('<br>')}
        </div>
    `;  
    }else{
    matchDiv.innerHTML = `
        <div class="champion-icon"><img src="champion/${participant.championName}" alt="${participant.championName}" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<span>${participant.championName}</span>');"></div>
        <div class="match-info2">
            <div>Match ID: <a href="player.html?playerName=${matchData.metadata.matchId}" target="_blank">${matchData.metadata.matchId}</a></div>
            <div>KDA: ${participant.kills}/${participant.deaths}/${participant.assists}</div>
            <div>Game Creation (UTC): ${gcutc}</div>
            <div>Game Creation (Your Local): ${gclocal}</div>
        </div>
        <div class="player-list2">
            ${matchData.info.participants.map(p => p.summonerName).join('<br>')}
        </div>
    `;
    }
    matchesContainer.appendChild(matchDiv);
}

function nextPage() {
    currentPage = currentPage + 10;
    fetchMatches();
}

function prevPage() {
    if (currentPage > 0) {
        currentPage = currentPage - 10;
        fetchMatches();
    }
}