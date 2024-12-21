function getRegionFromMatchId(prefix) {
    const regionMap = {
        "americas": ["NA1", "BR1", "LA1", "LA2"],
        "europe": ["EUN1", "EUW1", "ME1", "TR1", "RU1"],
        "asia": ["JP1", "KR1"],
        "sea": ["OC1", "PH2", "SG2", "TH2", "TW2", "VN2"]
    };

    for (const [region, prefixes] of Object.entries(regionMap)) {
        if (prefixes.includes(prefix)) {
            return region;
        }
    }

    throw new Error("Unknown region prefix in Match ID");
}
function Proxy(apiUrl) {
    const proxyUrl = "http://localhost:9135/proxy";
    return `${proxyUrl}?url=${apiUrl}`;
}

async function fetchMapData(mapId) {
    const response = await fetch("https://static.developer.riotgames.com/docs/lol/maps.json");
    const mapData = await response.json();
    const mapInfo = mapData.find(map => map.mapId === mapId);
    return mapInfo ? mapInfo.mapName : "Unknown Map";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function simplifyVersion(version) {
    if (version.startsWith("15")) {
        return version.split('.').slice(0, 3).join('.'); 
    } else {
        return version.split('.').slice(0, 2).join('.'); 
    }
}

function updatePatchElement(version) {
    const patchElement = document.getElementById("patch");

    const simplifiedVersion = simplifyVersion(version);

    patchElement.textContent = `Patch: ${simplifiedVersion}`;
    patchElement.title = `Full Version: ${version}`;
}