/* =========================================================
   NEURAL
   FUTURE PERSONAL SYSTEM
   FRONTEND ONLY
   INDEXEDDB
========================================================= */


/* =========================================================
   DATABASE
========================================================= */

const DB_NAME = "NeuralPersonalDB";
const DB_VERSION = 1;

let db;


/* =========================================================
   OPEN DATABASE
========================================================= */

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );


        request.onupgradeneeded = event => {

            const database =
                event.target.result;


            if (!database.objectStoreNames.contains("settings")) {

                database.createObjectStore(
                    "settings",
                    {
                        keyPath: "key"
                    }
                );

            }


            if (!database.objectStoreNames.contains("images")) {

                database.createObjectStore(
                    "images",
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );

            }

        };


        request.onsuccess = event => {

            db = event.target.result;

            resolve(db);

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/* =========================================================
   SETTINGS
========================================================= */

function saveSetting(key, value) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "settings",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "settings"
            );


        const request =
            store.put({
                key,
                value
            });


        request.onsuccess =
            () => resolve();

        request.onerror =
            () => reject(request.error);

    });

}


function getSetting(key) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "settings",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "settings"
            );


        const request =
            store.get(key);


        request.onsuccess = () => {

            resolve(
                request.result
                    ? request.result.value
                    : null
            );

        };


        request.onerror =
            () => reject(request.error);

    });

}


function deleteSetting(key) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "settings",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "settings"
            );


        const request =
            store.delete(key);


        request.onsuccess =
            () => resolve();

        request.onerror =
            () => reject(request.error);

    });

}


/* =========================================================
   IMAGES
========================================================= */

function saveImage(blob, name) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "images",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "images"
            );


        const request =
            store.add({

                name,

                blob,

                createdAt:
                    Date.now()

            });


        request.onsuccess =
            () => resolve(
                request.result
            );

        request.onerror =
            () => reject(request.error);

    });

}


function getImages() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "images",
                "readonly"
            );

        const store =
            transaction.objectStore(
                "images"
            );


        const request =
            store.getAll();


        request.onsuccess =
            () => resolve(
                request.result || []
            );

        request.onerror =
            () => reject(request.error);

    });

}


function deleteImage(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                "images",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "images"
            );


        const request =
            store.delete(id);


        request.onsuccess =
            () => resolve();

        request.onerror =
            () => reject(request.error);

    });

}


/* =========================================================
   DOM
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    document.querySelectorAll(selector);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    title,
    message
) {

    const toast =
        $("#toast");

    const toastTitle =
        $("#toastTitle");

    const toastMessage =
        $("#toastMessage");


    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   NAVIGATION
========================================================= */

const navButtons =
    $$(".nav-btn");

const sections =
    $$(".page-section");


function openSection(sectionId) {

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionId
        );

    });


    const target =
        document.getElementById(
            sectionId
        );


    if (!target) return;


    target.classList.add(
        "active-section"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            openSection(
                button.dataset.section
            );

        }
    );

});


/* =========================================================
   HOME BUTTONS
========================================================= */

$("#exploreBtn")
    ?.addEventListener(
        "click",
        () => {

            openSection("about");

        }
    );


$("#aboutBtn")
    ?.addEventListener(
        "click",
        () => {

            openSection("about");

        }
    );


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    const profile =
        await getSetting(
            "profile"
        );


    if (!profile) return;


    $("#nameInput").value =
        profile.name || "";

    $("#titleInput").value =
        profile.title || "";

    $("#locationInput").value =
        profile.location || "Egypt";

    $("#fieldInput").value =
        profile.field || "Web Developer";

    $("#descriptionInput").value =
        profile.description || "";


    updateProfileUI(
        profile
    );

}


function updateProfileUI(profile) {

    $("#aboutName").textContent =
        profile.name ||
        "اسمك";

    $("#aboutTitle").textContent =
        profile.title ||
        "أهلاً بك في عالمي.";

    $("#aboutLocation").textContent =
        profile.location ||
        "Egypt";

    $("#aboutField").textContent =
        profile.field ||
        "Web Developer";

    $("#aboutDescription").textContent =
        profile.description ||
        "اكتب هنا أي معلومات تحب الناس تعرفها عنك.";

}


$("#saveProfile")
    ?.addEventListener(
        "click",
        async () => {

            const profile = {

                name:
                    $("#nameInput").value.trim(),

                title:
                    $("#titleInput").value.trim(),

                location:
                    $("#locationInput").value.trim(),

                field:
                    $("#fieldInput").value.trim(),

                description:
                    $("#descriptionInput").value.trim()

            };


            await saveSetting(
                "profile",
                profile
            );


            updateProfileUI(
                profile
            );


            showToast(
                "PROFILE CORE",
                "Identity saved successfully."
            );

        }
    );


/* =========================================================
   HERO IMAGE
========================================================= */

let heroObjectURL = null;


async function loadHeroImage() {

    const saved =
        await getSetting(
            "heroImage"
        );


    if (!saved) return;


    if (heroObjectURL) {

        URL.revokeObjectURL(
            heroObjectURL
        );

    }


    heroObjectURL =
        URL.createObjectURL(
            saved.blob
        );


    $("#heroImage").style.backgroundImage =
        `url("${heroObjectURL}")`;

    $("#heroImage").innerHTML = "";

}


$("#heroUploadBtn")
    ?.addEventListener(
        "click",
        () => {

            $("#heroImageInput")
                .click();

        }
    );


$("#heroImageInput")
    ?.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];


            if (!file) return;


            await saveSetting(
                "heroImage",
                {
                    name: file.name,
                    blob: file
                }
            );


            await loadHeroImage();


            showToast(
                "IDENTITY",
                "Main image updated."
            );


            event.target.value = "";

        }
    );


/* =========================================================
   GALLERY
========================================================= */

const galleryObjectURLs =
    new Map();


async function renderGallery() {

    const grid =
        $("#galleryGrid");

    const empty =
        $("#emptyGallery");


    galleryObjectURLs.forEach(
        url => URL.revokeObjectURL(url)
    );

    galleryObjectURLs.clear();


    grid
        .querySelectorAll(".gallery-item")
        .forEach(item =>
            item.remove()
        );


    const images =
        await getImages();


    if (!images.length) {

        empty.style.display =
            "flex";

        return;

    }


    empty.style.display =
        "none";


    images
        .sort(
            (a, b) =>
                b.createdAt -
                a.createdAt
        )
        .forEach(image => {

            const url =
                URL.createObjectURL(
                    image.blob
                );


            galleryObjectURLs.set(
                image.id,
                url
            );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "gallery-item";


            item.innerHTML = `

                <img
                    src="${url}"
                    alt="${escapeHTML(image.name || "IMAGE")}"
                >

                <div class="gallery-overlay">

                    <span>
                        MEDIA_${String(image.id).padStart(3,"0")}
                    </span>

                    <button
                        class="gallery-delete"
                        data-id="${image.id}"
                        type="button"
                    >
                        ×
                    </button>

                </div>

            `;


            const imageElement =
                item.querySelector("img");


            imageElement.addEventListener(
                "click",
                () => {

                    openImageViewer(
                        url,
                        image.name
                    );

                }
            );


            item.querySelector(
                ".gallery-delete"
            ).addEventListener(
                "click",
                async event => {

                    event.stopPropagation();


                    const id =
                        Number(
                            event.currentTarget
                                .dataset
                                .id
                        );


                    await deleteImage(
                        id
                    );


                    await renderGallery();


                    showToast(
                        "MEDIA VAULT",
                        "Image deleted."
                    );

                }
            );


            grid.appendChild(
                item
            );

        });


    refreshCursorTargets();

}


$("#uploadBtn")
    ?.addEventListener(
        "click",
        () => {

            $("#imageInput").click();

        }
    );


$("#bigUploadBtn")
    ?.addEventListener(
        "click",
        () => {

            $("#imageInput").click();

        }
    );


$("#imageInput")
    ?.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files?.[0];


            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showToast(
                    "ERROR",
                    "Please select an image."
                );

                return;

            }


            try {

                await saveImage(
                    file,
                    file.name
                );


                await renderGallery();


                showToast(
                    "MEDIA VAULT",
                    "Image added successfully."
                );

            }
            catch(error) {

                console.error(error);

                showToast(
                    "ERROR",
                    "Could not save image."
                );

            }


            event.target.value = "";

        }
    );


/* =========================================================
   IMAGE VIEWER
========================================================= */

function openImageViewer(
    src,
    name
) {

    $("#viewerImage").src =
        src;

    $("#viewerName").textContent =
        name ||
        "IMAGE";


    $("#imageViewer")
        .classList.add(
            "active"
        );

}


function closeImageViewer() {

    $("#imageViewer")
        .classList.remove(
            "active"
        );

    $("#viewerImage").src =
        "";

}


$("#viewerClose")
    ?.addEventListener(
        "click",
        closeImageViewer
    );


$("#imageViewer")
    ?.addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "imageViewer"
            ) {

                closeImageViewer();

            }

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeImageViewer();

        }

    }
);


/* =========================================================
   CONTROL TABS
========================================================= */

const controlTabs =
    $$(".control-tab");

const controlPanels =
    $$(".control-panel");


controlTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            const panelId =
                tab.dataset.panel;


            controlTabs.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            controlPanels.forEach(
                panel =>
                    panel.classList.remove(
                        "active"
                    )
            );


            tab.classList.add(
                "active"
            );


            const panel =
                document.getElementById(
                    panelId
                );


            if (panel) {

                panel.classList.add(
                    "active"
                );

            }

        }
    );

});


/* =========================================================
   TOGGLES
========================================================= */

async function setupToggle(
    id,
    settingName,
    callback
) {

    const button =
        document.getElementById(id);


    if (!button) return;


    const saved =
        await getSetting(
            settingName
        );


    if (
        saved === false
    ) {

        button.classList.remove(
            "active"
        );

        callback(false);

    }
    else {

        button.classList.add(
            "active"
        );

        callback(true);

    }


    button.addEventListener(
        "click",
        async () => {

            const active =
                button.classList.toggle(
                    "active"
                );


            await saveSetting(
                settingName,
                active
            );


            callback(active);

        }
    );

}


/* =========================================================
   CITY TOGGLE
========================================================= */

function toggleCity(active) {

    document.body.classList.toggle(
        "city-disabled",
        !active
    );

}


setupToggle(
    "cityToggle",
    "cityEnabled",
    toggleCity
);


/* =========================================================
   PARTICLES
========================================================= */

let particlesRunning =
    true;


function createParticles(
    amount = 45
) {

    const container =
        $("#particleContainer");


    if (!container) return;


    container.innerHTML =
        "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${80 + Math.random() * 30}%`;


        particle.style.setProperty(
            "--duration",
            `${8 + Math.random() * 14}s`
        );


        particle.style.setProperty(
            "--drift",
            `${-80 + Math.random() * 160}px`
        );


        particle.style.setProperty(
            "--opacity",
            `${.15 + Math.random() * .55}`
        );


        particle.style.animationDelay =
            `${-Math.random() * 15}s`;


        container.appendChild(
            particle
        );

    }

}


function toggleParticles(active) {

    particlesRunning =
        active;


    $("#particleContainer")
        .style.display =
            active
                ? "block"
                : "none";

}


createParticles();


setupToggle(
    "particleToggle",
    "particlesEnabled",
    toggleParticles
);


/* =========================================================
   CURSOR TOGGLE
========================================================= */

function toggleCursor(active) {

    document.body.classList.toggle(
        "cursor-disabled",
        !active
    );

}


setupToggle(
    "cursorToggle",
    "cursorEnabled",
    toggleCursor
);


/* =========================================================
   CYBER CURSOR ENGINE
========================================================= */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let currentMouseX =
    mouseX;

let currentMouseY =
    mouseY;

let lastTrailTime =
    0;


function cursorIsAvailable() {

    return (
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    );

}


function updateMousePosition(
    x,
    y
) {

    mouseX = x;
    mouseY = y;


    /*
        نفس بيانات الحركة
        بنستخدمها كمان في
        خلفية المدينة
    */

    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight / 2;


    const parallaxX =
        (x - centerX) / 8;

    const parallaxY =
        (y - centerY) / 8;


    document.documentElement
        .style
        .setProperty(
            "--mouse-x",
            `${parallaxX.toFixed(2)}px`
        );


    document.documentElement
        .style
        .setProperty(
            "--mouse-y",
            `${parallaxY.toFixed(2)}px`
        );

}


window.addEventListener(
    "mousemove",
    event => {

        updateMousePosition(
            event.clientX,
            event.clientY
        );

    },
    {
        passive: true
    }
);


function createCursorTrail(
    x,
    y
) {

    const now =
        performance.now();


    if (
        now - lastTrailTime <
        40
    ) return;


    lastTrailTime =
        now;


    const trail =
        document.createElement(
            "span"
        );


    trail.className =
        "cursor-trail";


    trail.style.left =
        `${x}px`;

    trail.style.top =
        `${y}px`;


    document.body.appendChild(
        trail
    );


    setTimeout(
        () => trail.remove(),
        500
    );

}


function animateCursor() {

    if (
        cursorIsAvailable()
    ) {

        currentMouseX +=
            (
                mouseX -
                currentMouseX
            ) * .18;


        currentMouseY +=
            (
                mouseY -
                currentMouseY
            ) * .18;


        document.documentElement
            .style
            .setProperty(
                "--cursor-x",
                `${currentMouseX}px`
            );


        document.documentElement
            .style
            .setProperty(
                "--cursor-y",
                `${currentMouseY}px`
            );


        if (
            !document.body.classList.contains(
                "cursor-disabled"
            )
        ) {

            createCursorTrail(
                currentMouseX,
                currentMouseY
            );

        }

    }


    requestAnimationFrame(
        animateCursor
    );

}


animateCursor();


/* =========================================================
   CURSOR INTERACTIVE TARGETS
========================================================= */

function refreshCursorTargets() {

    const elements =
        $$(
            "button, a, input, textarea, select, " +
            ".magnetic, .project-card, " +
            ".gallery-item, .hero-image-card"
        );


    elements.forEach(element => {

        if (
            element.dataset.cursorReady
        ) return;


        element.dataset.cursorReady =
            "true";


        element.addEventListener(
            "mouseenter",
            () => {

                $(".cursor")
                    ?.classList.add(
                        "cursor-hover"
                    );

                $(".cursor-dot")
                    ?.classList.add(
                        "cursor-hover"
                    );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                $(".cursor")
                    ?.classList.remove(
                        "cursor-hover"
                    );

                $(".cursor-dot")
                    ?.classList.remove(
                        "cursor-hover"
                    );

            }
        );

    });

}


refreshCursorTargets();


/* Click effect */

window.addEventListener(
    "mousedown",
    () => {

        $(".cursor")
            ?.classList.add(
                "cursor-click"
            );

        $(".cursor-dot")
            ?.classList.add(
                "cursor-click"
            );

    }
);


window.addEventListener(
    "mouseup",
    () => {

        $(".cursor")
            ?.classList.remove(
                "cursor-click"
            );

        $(".cursor-dot")
            ?.classList.remove(
                "cursor-click"
            );

    }
);


/* =========================================================
   MAGNETIC LOGO
========================================================= */

const magneticElements =
    $$("[data-magnetic]");


magneticElements.forEach(
    element => {

        element.addEventListener(
            "mousemove",
            event => {

                const rect =
                    element.getBoundingClientRect();


                const x =
                    event.clientX -
                    (
                        rect.left +
                        rect.width / 2
                    );


                const y =
                    event.clientY -
                    (
                        rect.top +
                        rect.height / 2
                    );


                element.style.transform =
                    `translate(${x * .18}px, ${y * .18}px)`;

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                element.style.transform =
                    "";

            }
        );

    }
);


/* =========================================================
   HERO IMAGE TILT
========================================================= */

const heroCard =
    $("#heroImageCard");


if (heroCard) {

    heroCard.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroCard.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const rotateY =
                (
                    x /
                    rect.width -
                    .5
                ) * 12;


            const rotateX =
                -(
                    y /
                    rect.height -
                    .5
                ) * 12;


            heroCard.style.transform =
                `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
                `;

        }
    );


    heroCard.addEventListener(
        "mouseleave",
        () => {

            heroCard.style.transform =
                `
                perspective(1200px)
                rotateY(-8deg)
                rotateX(3deg)
                `;

        }
    );

}


/* =========================================================
   PROJECT HOVER PARALLAX
========================================================= */

$$(".project-card")
    .forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) / rect.width -
                    .5;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) / rect.height -
                    .5;


                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${y * -3}deg)
                    rotateY(${x * 4}deg)
                    translateY(-8px)
                    `;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });


/* =========================================================
   SYSTEM BUTTON
========================================================= */

$("#systemBtn")
    ?.addEventListener(
        "click",
        () => {

            showToast(
                "NEURAL SYSTEM",
                "All systems operating normally."
            );

        }
    );


/* =========================================================
   EXPORT
========================================================= */

$("#exportBtn")
    ?.addEventListener(
        "click",
        async () => {

            const profile =
                await getSetting(
                    "profile"
                );


            const images =
                await getImages();


            const data = {

                exportedAt:
                    new Date().toISOString(),

                profile:
                    profile || {},

                images:
                    images.map(
                        image => ({

                            id:
                                image.id,

                            name:
                                image.name,

                            createdAt:
                                image.createdAt

                        })
                    )

            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;

            link.download =
                "neural-backup.json";


            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "DATA CORE",
                "Backup exported."
            );

        }
    );


/* =========================================================
   CLEAR DATA
========================================================= */

$("#clearBtn")
    ?.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "مسح كل بيانات NEURAL من هذا المتصفح؟"
                );


            if (!confirmed) return;


            const transaction =
                db.transaction(
                    [
                        "settings",
                        "images"
                    ],
                    "readwrite"
                );


            transaction
                .objectStore(
                    "settings"
                )
                .clear();


            transaction
                .objectStore(
                    "images"
                )
                .clear();


            transaction.oncomplete =
                async () => {

                    $("#nameInput").value =
                        "";

                    $("#titleInput").value =
                        "";

                    $("#locationInput").value =
                        "";

                    $("#fieldInput").value =
                        "";

                    $("#descriptionInput").value =
                        "";


                    $("#aboutName")
                        .textContent =
                        "اسمك";

                    $("#aboutTitle")
                        .textContent =
                        "أهلاً بك في عالمي.";

                    $("#aboutLocation")
                        .textContent =
                        "Egypt";

                    $("#aboutField")
                        .textContent =
                        "Web Developer";

                    $("#aboutDescription")
                        .textContent =
                        "اكتب هنا أي معلومات تحب الناس تعرفها عنك.";


                    $("#heroImage")
                        .style
                        .backgroundImage =
                        "";


                    $("#heroImage")
                        .innerHTML =
                        `
                        <span>
                            YOUR<br>
                            PHOTO
                        </span>
                        `;


                    await renderGallery();


                    showToast(
                        "DATA CORE",
                        "All local data cleared."
                    );

                };

        }
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => ({

                "&":
                    "&amp;",

                "<":
                    "&lt;",

                ">":
                    "&gt;",

                '"':
                    "&quot;",

                "'":
                    "&#039;"

            })[character]
        );

}


/* =========================================================
   TOUCH EFFECT
========================================================= */

document.addEventListener(
    "touchstart",
    event => {

        const target =
            event.target.closest(
                "button"
            );


        if (!target) return;


        target.style.transform =
            "scale(.96)";


        setTimeout(
            () => {

                target.style.transform =
                    "";

            },
            120
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

async function initialize() {

    try {

        await openDatabase();

        await loadProfile();

        await loadHeroImage();

        await renderGallery();

        refreshCursorTargets();

        showToast(
            "NEURAL",
            "System initialized."
        );

    }
    catch(error) {

        console.error(
            "NEURAL INIT ERROR:",
            error
        );

        showToast(
            "SYSTEM ERROR",
            "Could not initialize local database."
        );

    }

}


initialize();


/* =========================================================
   CLEANUP
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        if (heroObjectURL) {

            URL.revokeObjectURL(
                heroObjectURL
            );

        }


        galleryObjectURLs.forEach(
            url =>
                URL.revokeObjectURL(
                    url
                )
        );

    }
);