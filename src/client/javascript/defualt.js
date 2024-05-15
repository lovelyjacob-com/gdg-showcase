// This script is executed on ALL pages.
// Responsible for simple such as modifying the title.

/**
 * Change the documents title. (Append the name.)
 * @param {Document} document
 * @param {string} title
 * @param {string} name
 */
function changeTitle(document, title, name) {
    document.title = `${title} | ${name}`;
}

/**
 * Update the menu bar to the correct state.
 */
function updateMenuBar() {
    {
        const menubar = document.getElementById('menuBar');
        const anchors = menubar.getElementsByClassName('menuBarNormal');
        for (let i = 0; i !== anchors.length; i++) {
            const item = anchors.item(i);
            if (item.href.replace('?l', '') === window.location.href.replace('?l', '')) {
                item.classList.add('menuBarNormalCurrent');
            }
        }
    }

    {
        const menubar = document.getElementById('mobileLinksSideBar');
        const anchors = menubar.getElementsByClassName('menuBarNormal');
        for (let i = 0; i !== anchors.length; i++) {
            const item = anchors.item(i);
            if (item.href.replace('?l', '') === window.location.href.replace('?l', '')) {
                item.classList.add('menuBarNormalCurrent');
                //item.innerText = `➤ ${item.innerText}`
            }
        }
    }
}

/**
 * Insert loading divider.
 */
function insertLoadingDivider(tween, tweenCallback) {
    const divider = document.createElement('div');
    divider.id = 'loadingDiv';
    const img = document.createElement('img');
    img.src = '/assets/images/logo.png';
    const details = document.createElement('p');
    details.innerText = 'Loading...';
    if (tween) img.classList.add('no-anim');
    divider.insertAdjacentElement('afterbegin', details);
    divider.insertAdjacentElement('afterbegin', img);
    document.documentElement.insertAdjacentElement('beforeEnd', divider);
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    if (tween === true) {
        divider.style.opacity = 0;
        const interval = setInterval(() => {
            divider.style.opacity = parseFloat(divider.style.opacity) + 0.005;
            if (parseFloat(divider.style.opacity) >= 1) {
                clearInterval(interval);
                if (tweenCallback) tweenCallback();
            }
        }, 2);
    }
}

/**
 * Hide loading divider.
 */
function hideLoadingDivider(callback) {
    document.body.removeAttribute('style');
    const divider = document.getElementById('loadingDiv');
    divider.style.opacity = 1;
    const interval = setInterval(() => {
        divider.style.opacity = parseFloat(divider.style.opacity) - 0.005;
        if (parseFloat(divider.style.opacity) <= 0) {
            clearInterval(interval);
            divider.remove();
            document.documentElement.style.overflowY = 'auto';
            document.documentElement.style.overflowX = 'auto';
            if (callback) {
                callback();
            }
        }
    }, 0.5);
}

/**
 * Function to connect the loading menu to all anchor elements.
 */
function attachLoadingAnimation() {
    const links = document.getElementsByTagName('a');
    for (const link of links) {
        if (!link.href) continue;
        if (new URL(link.href).pathname.includes('.')) continue;
        if (new URL(link).origin !== document.location.origin) continue;
        const destination = link.href;
        link.dataset.href = destination;
        link.href = 'javascript:;';
        link.addEventListener('click', function (event) {
            if (event.ctrlKey) {
                window.open(destination);
            } else {
                insertLoadingDivider(true, function () {
                    document.location.href = `${destination}?l`;
                    setTimeout(hideLoadingDivider, 2000);
                });
            }
        });
    }
}

/**
 * Function that handles the mobile menu bar.
 */
function mobileMenuBarListeners() {
    const mobileCloseButton = document.getElementById('mobileCloseButton');
    const menuMobileButton = document.getElementById('menuMobileButton');
    const mobileLinksSideBarBackground = document.getElementById('mobileLinksSideBarBackground');
    const mobileLinksSideBar = document.getElementById('mobileLinksSideBar');

    menuMobileButton.addEventListener('click', function () {
        mobileLinksSideBar.style.display = 'block';
        mobileLinksSideBarBackground.style.display = 'block';
        mobileLinksSideBar.style.maxWidth = '200px';
        mobileLinksSideBarBackground.style.width = '100%';
        window.scrollTo(0, 0);
        document.documentElement.style.overflow = 'hidden';
    });

    mobileCloseButton.addEventListener('click', function () {
        mobileLinksSideBar.removeAttribute('style');
        mobileLinksSideBarBackground.removeAttribute('style');
        document.documentElement.style.overflow = 'auto';
    });
}

changeTitle(document, document.title, 'Game Day Grill');
libs.include.includeBody(document, '/includes/menu-bar.html', 'start');
libs.include.includeBody(document, '/includes/footer.html', 'end');
libs.include.includeHeadCSS(document, '/css/menu-bar.css', 'end');
libs.include.includeHeadCSS(document, '/css/footer.css', 'end');
waitForElement('menuBarContainer').then(function () {
    updateMenuBar();
    mobileMenuBarListeners();
});

window.addEventListener('load', async function () {
    const shouldDisplayLoadingScreen = new URLSearchParams(window.location.search).has('l');

    if (shouldDisplayLoadingScreen) {
        insertLoadingDivider();
    } else {
        document.body.removeAttribute('style');
    }

    if (shouldDisplayLoadingScreen) {
        await wait(500);
        // hideLoadingDivider(attachLoadingAnimation);
        hideLoadingDivider();
    } else {
        // attachLoadingAnimation();
    }
});
