// ==UserScript==
// @name         Neopets Pound Info
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  Show info about pound pets!
// @author       Ellime @GitHub
// @match        https://www.neopets.com/pound/adopt.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

/**
 * Pets whose age cannot be queried:
 * Bori, Ixi, Korbat, Kougra, Quiggle, Ruki, Usul, Xweetok
 */

/**
 * The ways age can show up on a petpage are:
 * "### hour(s)"
 * "### hour(s) old"
 * "###, hour(s) old"
 * "### old"
 * "Age: ###" (possibly in separate elements)
 * 
 * We also have to handle weird formatting (more than one whitespace char where one is expected).
 */

const AGE_REGEX = /(\d+,?\s+hours?)|(Age: \d+)|(\d+\s+old)/g;

const AGE_INDICATORS = [
    "age",
    "Age",
    "hour",
    "old",
]

function formatPetName(i) {
    return "#pet" + i + "_name";
}

function getPetNames() {
    let petNames = [];
    for(let i = 0; i < 3; i++) {
        let petId = formatPetName(i);
        if($(petId).length) {
            petNames.push($(petId).text());
        }
    }
    if(petNames.length == 0) {
        console.log("No pets found.");
    }
    return petNames;
}

function getPetpageUrl(petname) {
    return "neopets.com/~" + petname;
}

function getElementContainingAge(HTML) {
    return $('*', HTML);
}

function getAgeText(text) {
    return text.match(AGE_REGEX);
}

function main() {
    const petNames = getPetNames();
    petNames.forEach(petName => {
        const petpageUrl = getPetpageUrl(petName);
        $.ajax({
            async: false,
            type: "GET",
            url: petpageUrl,
            success: (petpageHTML) => {
                const ageText = getElementContainingAge(petpageHTML).text();
                const petAge = getAgeText(ageText);
                console.log(petName + ": " + petAge);
            }
        });
    });
}

main();