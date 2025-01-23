import ARTIFACTS from "@/constants/artifact";
import URL from "@/constants/url";
import WEAPONS from "@/constants/weapons";
// import EnkaNetwork from 'enkanetwork';
const { ENKA_URL } = URL;
import getListCodes from "@/utils/getListCodes";
import getListNames from "@/utils/getListNames";
// const EnkaNetwork = require("enkanetwork");

export default async function convert(req, res) {
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RndEnkaToGcsimConverter/1.0",
        },
      };

    const uid = req.body.uid;
    let link = ENKA_URL + uid;

    const listCodes = getListCodes(req.body.team);
    const listCharNames = getListNames(req.body.team);
    let configString = "";
    try {
        const response = await fetch(link, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const selectedData = data.avatarInfoList.filter((character) => listCodes.includes(character.avatarId));
        selectedData.forEach((character) => {
            let indexCodes = listCodes.indexOf(character.avatarId);
            let characterName = listCharNames[indexCodes].toLowerCase();
            let characterConfig, weaponConfig;
            if (characterName == 'mavuika'){
                characterConfig = "mavuika char lvl=90/90 cons=0 talent=10,10,10;";
                weaponConfig = 'mavuika add weapon="athousandblazingsuns" refine=1 lvl=90/90;';
            }
            else { 
                characterConfig = characterName + " char lvl=90/90 cons=0 talent=9,9,9;";
                weaponConfig = characterName + ' add weapon="' + WEAPONS[character.equipList[5].flat.nameTextMapHash] + '" refine=' + (character.equipList[5].weapon.promoteLevel - 1) + " lvl=90/90;";
            }
            let artifactSetConfig = characterName + ' add set="' + ARTIFACTS[character.equipList[0].flat.setNameTextMapHash] + '" count=4;';
            configString = configString + characterConfig + weaponConfig + artifactSetConfig;
        });

        console.log(configString);
        res.status(200).json(selectedData);
    } catch (e) {
        res.status(500).json({ error: e });
        console.error("Error ketika fetch ke Enka:",e);
    }
}