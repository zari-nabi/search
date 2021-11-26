/* Loaded with <script type="module"> */

/**
 * Remove the HTML Child Elements from parent element
 *
 * @param {HTMLdivElement} element with childes
 * @returns {HTMLdivElement} element with no child
 */
const removeChildeNodes = (countainer) => {
    while (countainer?.firstChild) {
        countainer.removeChild(countainer.firstChild);
    }
    return countainer;
};

/**
 * Clear All histories
 *
 */
const clearAllHistories = async () => {
    const historyContainer = initialValues.elements.historyContainer;

    removeChildeNodes(historyContainer);

    const url = new URL(initialValues.options.clearAllHistoryUrl.toString());
    try {
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-type": "application/json;"
            }
        });

        // allItems = options.responseParser(response);
        // const filteredValue = allItems?.filter((item) =>
        //   item?.first_name.toLowerCase().startsWith(query.toLowerCase())
        // );
        // return initialValues.options.responseParser(response);
        if (response?.ok) {
            initialValues.histories = [];
            alert("all history was cleared");
        }
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * Delete selected history item
 *
 * @param {string} query Search query
 */
const deleteHistory = async (query) => {
    const url = new URL(initialValues.options.historyDeleteUrl.toString());
    url.searchParams.set(initialValues.options.queryDelParam, query);
    try {
        await fetch(url, {
            method: "delete",
            headers: {
                "Content-type": "application/json;"
            }
        });

        // allItems = options.responseParser(response);
        // const filteredValue = allItems?.filter((item) =>
        //   item?.first_name.toLowerCase().startsWith(query.toLowerCase())
        // );
        // return initialValues.options.responseParser(response);
    } catch (err) {
        console.error(err);
        return [];
    }
};

const handleClickHistory = (result) => {
    const histories = initialValues.histories;

    for (let i = 0; i < histories.length; i++) {
        if (histories[i]?.title === result?.title) {
            histories.splice(i, 1);
        }
    }

    if (histories?.length < 1) {
        initialValues.elements.historyContainer.removeChild(
            initialValues.elements.historyContainer.firstChild
        );
    }
    deleteHistory(result?.id).then(() => {
        fetchHistory().then((results) => {
            return populateHistoryResults(results);
        });
    });
};

/**
 * Convert Date format
 *
 * @param {dateTime} date of search
 * @returns {string}
 */
const convertedDate = (date) => {
    return date.slice(0, 16).replace("T", " ");
};

/**
 * Creates the HTML to represents a single result in the list of histories.
 *
 * @param {Object} result An instant history result
 * @returns {HTMLdivElement}
 */
const createHistoryElement = (result) => {
    const divElement = document.createElement("div");
    // divElement.setAttribute("id", result?.id);
    divElement.classList.add("custom-search__result-history");
    const divLeftElement = document.createElement("div");
    divLeftElement.classList.add("custom-search__title");
    divLeftElement.textContent = result?.title;

    const divRightElement = document.createElement("div");
    divRightElement.classList.add("custom-search__history");

    const divDateElement = document.createElement("div");
    divDateElement.classList.add("custom-search__date");
    divDateElement.textContent = convertedDate(result?.dateTime);

    const deleteIconElement = document.createElement("i");
    deleteIconElement.classList.add("material-icons");
    deleteIconElement.classList.add("custom-search__clear-icon");
    deleteIconElement.textContent = `clear`;

    divRightElement.appendChild(divDateElement);
    divRightElement.appendChild(deleteIconElement);

    divElement.appendChild(divLeftElement);
    divElement.appendChild(divRightElement);
    // divElement.insertAdjacentHTML(
    //   "afterbegin",
    //   initialValues.options.templateHistoryFunction(
    //     result,
    //     convertedDate(result?.dateTime)
    //   )
    // );
    deleteIconElement.onclick = () => {
        handleClickHistory(result);
    };
    return divElement;
};

/**
 * Creates the HTML to represents a single result in the list of histories.
 *
 * @param {Object} result An instant history result
 * @returns {HTMLAnchorElement}
 */
const createHistoryTitleElement = () => {
    const anchorElement = document.createElement("div");
    anchorElement.classList.add("custom-search__results-container-history");
    anchorElement.insertAdjacentHTML(
        "afterbegin",
        initialValues.options.templateHeaderFunction()
    );
    anchorElement.onclick = () => clearAllHistories();
    return anchorElement;
};

const populateHistoryResults = (results) => {
    const historyContainer = initialValues.elements.historyContainer;


    removeChildeNodes(historyContainer);
    // Update list of results under the search bar
    historyContainer.appendChild(createHistoryTitleElement());
    for (const result of results) {
        historyContainer.appendChild(createHistoryElement(result));
    }
};

/**
 * Makes a request at the history URL and retrieves results of histories.
 *
 * @returns {Promise<Object[]>}
 */
const fetchHistory = async () => {
    const url = new URL(initialValues.options.historyUrl.toString());
    // url.searchParams.set(initialValues.options.queryParam, query);
    try {
        const res = await fetch(url, {
            method: "get",
            headers: {
                "Content-type": "application/json;"
            }
        });
        const response = await res.json();
        console.log("all", response);
        // allItems = options.responseParser(response);
        // const filteredValue = allItems?.filter((item) =>
        //   item?.first_name.toLowerCase().startsWith(query.toLowerCase())
        // );
        return initialValues.options.responseParser(response);
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * append selected item to search history
 *
 * @param {string} query append query
 * @returns {Promise<Object[]>}
 */
const apendHistory = async (query) => {
    const url = new URL(initialValues.options.historyUrl.toString());
    url.searchParams.set(initialValues.options.queryParam, query);
    try {
        const res = await fetch(url, {
            method: "post",
            headers: {
                "Content-type": "application/json;"
            }
        });
        const response = await res.json();

        return initialValues.options.responseParser(response);
    } catch (err) {
        console.error(err);
        return [];
    }
};

const handleClickResult = (result) => {
    const histories = initialValues.histories;
    const existsItem = histories.find(
        (history) => history?.title === result?.title
    );

    if (existsItem) {
        fetchHistory().then((results) => {
            return populateHistoryResults(results);
        });
    } else {
        initialValues.histories = [...histories, result];
        apendHistory(result?.title).then(() => {
            fetchHistory().then((results) => {
                return populateHistoryResults(results);
            });
        });
    }
    initialValues.elements.input.value = result?.title;
};

/**
 * Creates the HTML to represents a single result in the list of results.
 *
 * @param {Object} result An instant search result
 * @returns {HTMLAnchorElement}
 */
const createResultElement = (result) => {
    const anchorElement = document.createElement("a");
    anchorElement.classList.add("custom-search__result");
    anchorElement.insertAdjacentHTML(
        "afterbegin",
        initialValues.options.templateFunction(result)
    );
    anchorElement.onclick = () => handleClickResult(result);
    return anchorElement;

    // return initialValues.options.templateFunction(result);
};

/**
 * Updates the HTML to display each result under the search bar.
 *
 * @param {Object[]} results
 */
const populateResults = (results) => {
    // const htmlResult = results
    //   .map((result) => {
    //      return createResultElement(result)
    //   })
    //   .join("");
    // initialValues.elements.resultContainer.innerHTML = htmlResult;

    const resultCountainer = initialValues.elements.resultContainer;
    // Clear all existing results
    removeChildeNodes(resultCountainer);

    for (const result of results) {
        resultCountainer.appendChild(createResultElement(result));
    }
};

/**
 * Makes a request at the search URL and retrieves results.
 *
 * @param {string} query Search query
 * @returns {Promise<Object[]>}
 */
const performSearch = async (query) => {
    const url = new URL(initialValues.options.searchUrl.toString());
    url.searchParams.set(initialValues.options.queryParam, query);
    try {
        const res = await fetch(url, {
            method: "get",
            headers: {
                "Content-type": "application/json;"
            }
        });
        const response = await res.json();

        return initialValues.options.responseParser(response);
    } catch (err) {
        console.error(err);
        return [];
    }
};

/**
 * Reset the instant search and remove elements.
 *  * @param {object} elements The container element for the custom search
 */
const resetSearch = (elements) => {
        elements.resultContainer.classList.remove(
            "custom-search__results-container--visible"
        );
        
        removeChildeNodes(elements.resultContainer);
        removeChildeNodes(elements.historyContainer);

        elements.input.value =null;
}

/**
 * Adds event listeners for reset of the instant search.
 *  * @param {object} elements The container element for the custom search
 */
const addResetListener = (elements) => {
    const reset = document.getElementById("reset-search");
    reset.addEventListener("click", () => {
       resetSearch(elements);
    });
}

/**
 * Adds event listeners for elements of the instant search.
 */
const addListener = (elements) => {
    let delay;
    elements.input.addEventListener("input", (e) => {
        clearTimeout(delay);
        const query = e.target.value;
        initialValues.searchQuery = query;
        delay = setTimeout(() => {
            if (query.length < 1) {
                populateResults([]);
                return;
            }
            performSearch(query).then((results) => {
                populateResults(results);
                fetchHistory().then((results) => {
                    populateHistoryResults(results);
                });
            });
        }, 200);
    });

    elements.input.addEventListener("focus", () => {
        fetchHistory().then((results) => {
            initialValues.histories = results;
        });

        elements.resultContainer.classList.add(
            "custom-search__results-container--visible"
        );
    });

    elements.input.addEventListener("blur", () => {
        elements.resultContainer.classList.remove(
            "custom-search__results-container--visible"
        );
    });
};

/**
 * Initialises the custom search bar. Retrieves and creates elements.
 *
 * @property {baseUrl} searchUrl the base Url of search items and of histories
 * @property {string} queryParam The name of the query parameter to be used in each request
 * @property {string} queryDelParam The name of the query parameter to be used in each delete request
 * @property {Function} responseParser Takes the response from the instant search and returns an array of results
 * @property {Function} templateFunction Takes an instant search result and produces the HTML for it
 * @property {Function} templateHistoryFunction Takes an history search result and produces the HTML for it
 * @property {Function} templateHeaderFunction is header of history search result to cleare all history and produces the HTML for it
 * @param {HTMLElement} customSearch The container element for the custom search
 * @param {CustomSearchOptions} options A list of options for configuration
 * */

const initialValues = (function () {
    const searchBar = document.getElementById("functional-searchbar");
    const searchQuery = "";
    const histories = [];
    const baseUrl = `http://2.144.245.172:8050/searchapi`;
    const options = {
        searchUrl: `${baseUrl}/search?searchTerm`,
        historyUrl: `${baseUrl}/SearchHistory`,
        historyDeleteUrl: `${baseUrl}/SearchHistory?id`,
        clearAllHistoryUrl: `${baseUrl}/ClearSearchHistory`,
        // searchUrl: `https://reqres.in/api/users`,
        queryParam: "searchTerm",
        queryDelParam: "id",

        responseParser: (response) => {
            return response;
        },

        templateFunction: (result) => {
            let re = new RegExp(initialValues.searchQuery, "ig");
            const title = result?.title
                .replace(/- /g, "")
                .replace(/\./g, "")
                .replace(re, `<b> ${initialValues.searchQuery} </b>`);
            return `
        <div class="custom-search__result" >
        ${title} 
        </div>
    `;
        },
        templateHeaderFunction: () => {
            return `
        <div class="custom-search__result">
          <div class="custom-search__title-history">Search History</div>
          <a href="#" class="custom-search__cleare-history">
            cleare all stories
          </a>
        </div>`;
        },
        templateHistoryFunction: (result, date) => {
            return `
        <div class="custom-search__title">${result.title}</div>
        <div class="custom-search__history">
            <div class="custom-search__date">${date}</div>
            <i class="material-icons custom-search__clear-icon" id=${result.id} onClick={console.log(${result?.id})}>clear</i>
        </div>
        `;
        }
    };
    const elements = {
        main: searchBar,
        input: searchBar.querySelector(".custom-search__input"),
        result: searchBar.querySelector(".custom-search__result"),
        resultContainer: document.createElement("div"),
        historyContainer: document.createElement("div")
    };

    elements.resultContainer.classList.add("custom-search__results-container");

    elements.main.appendChild(elements.resultContainer);

    elements.historyContainer.classList.add(
        "custom-search__results-container-history"
    );
    elements.main.appendChild(elements.historyContainer);

    addListener(elements);
    addResetListener(elements);

    return {
        searchBar,
        searchQuery,
        options,
        elements,
        histories
    };
})();
