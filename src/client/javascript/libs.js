// Libraries.
const libs = {};
const storage = localStorage;

/**
 * Wait for an element to be present/loaded via it's ID.
 * @param {string} id ID of the element to wait for.
 * @returns {Promise.<void>}
 */
function waitForElement(id) {
    return new Promise(function (resolve) {
        const interval = setInterval(function () {
            if (document.getElementById(id) !== null) {
                clearInterval(interval);
                resolve();
            }
        });
    });
}

/**
 * Wait for the body to be present.
 * @returns {Promise.<void>}
 */
function waitForBody() {
    return new Promise(function (resolve) {
        const interval = setInterval(function () {
            if (document.body !== null) {
                clearInterval(interval);
                resolve();
            }
        });
    });
}

/**
 * Wait for the head to be present.
 * @returns {Promise.<void>}
 */
function waitForHead() {
    return new Promise(function (resolve) {
        const interval = setInterval(function () {
            if (document.head !== null) {
                clearInterval(interval);
                resolve();
            }
        });
    });
}

// Library which helps with the insertion of HTML documents.
libs.include = {
    /**
     * Include a html file in the body.
     * @param {Document} document
     * @param {string} url
     * @param {"start"|"end"} place
     */
    includeBody: function (document, url, place) {
        let finalPlace = place;
        if (place === 'start') finalPlace = 'afterbegin';
        if (place === 'end') finalPlace = 'beforeend';
        waitForBody().then(() => {
            fetch(url).then(async function (response) {
                document.body.insertAdjacentHTML(finalPlace, await response.text());
            });
        });
    },

    /**
     * Include a css file in the head.
     * @param {Document} document
     * @param {string} url
     * @param {"start"|"end"} place
     */
    includeHeadCSS: function (document, url, place) {
        let finalPlace = place;
        if (place === 'start') finalPlace = 'afterbegin';
        if (place === 'end') finalPlace = 'beforeend';
        const rel = document.createElement('link');
        rel.rel = 'stylesheet';
        rel.href = url;
        waitForHead().then(() => {
            document.head.insertAdjacentElement(finalPlace, rel);
        });
    }
};

/**
 * @typedef {Object} cartItem Represents an item in the cart/bag.
 * @property {string} id ID of this item.
 * @property {string} displayName Display name of this item.
 * @property {number} amount Amount of this item.
 * @property {number} priceIncrease Price increase of this item.
 * @property {string} bagId Bag ID of this item.
 */

// Library to add and remove items from the shopping cart.
libs.cart = {
    /** @type {cartItem[]} IDs of the items. */
    items: [],

    /** @type {string} Name of the local storage key. */
    key: 'cartData_v3',

    /**
     * Save all items in cart.
     */
    save: function () {
        storage.setItem(this.key, JSON.stringify(this.items));
        if (window.updateCheckout) window.updateCheckout();
    },

    /**
     * Add an item to the cart.
     * @param {string} id The ID of the item to add.
     * @param {string} displayName Display name of the item to add.
     * @param {number} amount Amount of the item to add.
     * @param {number} [priceIncrease] Price increase of the item to add.
     */
    add: function (id, displayName, amount, priceIncrease) {
        this.items.push({
            id: id,
            displayName: displayName,
            amount: amount,
            priceIncrease: priceIncrease ?? 0,
            bagId: `${Date.now()}${Math.floor(Math.random() * 100000)}`
        });
        this.save();
    },

    /**
     * Remove an item from the cart.
     * @param {bagId} displayName The bag ID of this item.
     */
    remove: function (bagId) {
        this.items = this.items.filter((item) => item.bagId !== bagId);
        this.save();
    },

    /**
     * Clear all items from the cart.
     */
    clear: function () {
        this.items = [];
        this.save();
    },

    /**
     * Sync with the currently saved.
     */
    sync: function () {
        let data = storage.getItem(this.key) ?? '[]';
        try {
            this.items = JSON.parse(data);
        } catch {
            this.items = [];
        }
        if (!Array.isArray(this.items)) this.items = [];
    }
};

libs.cart.sync();
setInterval(() => {
    libs.cart.sync();
}, 2000);

/**
 * Function to parse JSONC.
 * @param {string} string
 * @returns {any} JSON
 */
function parseJSONC(string) {
    const newString = string.replace(new RegExp('//.*', 'mg'), '');
    // console.log(newString);
    return JSON.parse(newString);
}

// Wasn't really sure how to do this, but I found a good solution on stack overflow that matched my needs.
/**
 * Function to sort objects.
 * SOURCE: https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
 */
const sortObjectByKeys = (object, { desc = false } = {}) =>
    Object.fromEntries(Object.entries(object).sort(([k1], [k2]) => ((k1 < k2) ^ desc ? -1 : 1)));

/**
 * Function to wait a certain amount of time. (in ms)
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Function to check if an HTML element is in the current viewport.
 * SOURCE: https://stackoverflow.com/a/7557433/12588803
 * @param {HTMLElement} el
 * @returns
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}
