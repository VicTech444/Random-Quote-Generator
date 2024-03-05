"use strict";

const $ = (selector) => document.querySelector(selector);

const $authorName = $(`#author-name`);
const $famousQuoteBtn = $(`#famous-quote`);
const $inspirationalQuoteBtn = $(`#inspirational-quote`);
const $quoteMessage = $(`#quote`);
const $regroup = $(`#regroup`);
const $copyQuote = $(`#copy-quote`);

const callToApi = async () => {
    return new Promise(async (resolve, reject) => {
        const apiOptions = {
            method: 'GET',
            params: {
                language_code: 'en'
            },
            headers: {
                'X-RapidAPI-Key': 'd71277fb3amsh48f2e738c039c11p106d64jsnf5af55d3ca18',
                'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
            }
        }

        let apiResponse = await fetch(`https://quotes15.p.rapidapi.com/quotes/random/`, apiOptions);
        let quoteInformation = await apiResponse.json();
        let validation = "content" in quoteInformation;

        if (validation) {
            resolve(quoteInformation);

        } else {
            reject(`An error has been occured while calling the API`);
        }
    })
}

const getFamousQuote = async () => {
    return new Promise(async (resolve, reject) => {
        $quoteMessage.innerHTML = `Searching information...`;
        let quoteInformation = await callToApi().catch((error) => console.log(error));
        let { content: quote, originator: { name: author }, tags } = quoteInformation;
        resolve([author, quote, tags])
    })
}

const getInspirationalQuote = async () => {
    return new Promise(async (resolve, reject) => {
        $quoteMessage.innerHTML = `Searching information...`;
        let quoteInformation = await callToApi().catch((error) => console.log(error));

        let { content: quote, originator: { name: author }, tags } = quoteInformation;
        let validation = new Set([...tags]);

        if (validation.has(`Inspirational`)) {
            resolve([author, quote, tags]);

        } else {
            setTimeout(async () => {
                resolve(getInspirationalQuote());
            }, 3000)
        }
    });
}

const placeInfoInBody = async (functionToExecute) => {
    let infoToPlace = await functionToExecute;
    $quoteMessage.innerHTML = `Found...`;
    setTimeout((ev) => {
        let [author, quote, tags] = infoToPlace;
        $authorName.innerHTML = author;
        $quoteMessage.innerHTML = quote;
    }, 1000)
}

$famousQuoteBtn.addEventListener(`click`, (ev) => {
    $authorName.innerHTML = "";
    placeInfoInBody(getFamousQuote());
});

$inspirationalQuoteBtn.addEventListener(`click`, (ev) => {
    $authorName.innerHTML = "";
    placeInfoInBody(getInspirationalQuote());
});

$copyQuote.addEventListener(`click`, () => {
    if($authorName.textContent != ""){
        navigator.clipboard.writeText(`${$quoteMessage.textContent} ~${$authorName.textContent}`);
    }
})

$regroup.addEventListener(`click`, (ev) => {
    window.open(`https://github.com/VicTech444/Random-Quote-Generator`);
});