let currentIndex = 0;
const records = [];


function updateCarousel() {
    const carousel = document.querySelector('.carousel');
    const cardWidth = carousel.querySelector('.card-container').offsetWidth;
    const moveAmount = cardWidth * 3;
    carousel.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
}

function moveLeft() {
    const carousel = document.querySelector('.carousel');
    const totalCards = carousel.querySelectorAll('.card-container').length;
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = Math.ceil(totalCards / 3) - 1;
    }
    updateCarousel();
}

function moveRight() {
    const carousel = document.querySelector('.carousel');
    const totalCards = carousel.querySelectorAll('.card-container').length;
    if (currentIndex < Math.ceil(totalCards / 3) - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    updateCarousel();
}

window.addEventListener('resize', updateCarousel);

function createCard(actor) {
    const cardWrapper = document.createElement('li');
    cardWrapper.classList.add('card-wrapper');
  
    const cardContainer = document.createElement('article');
    cardContainer.classList.add('card-container');
  
    cardContainer.append(createFoto(actor), createName(actor), createContacts(actor));
    cardWrapper.append(cardContainer);
  
    return cardWrapper;
}
  
function createFoto(actor) {
    const cardPhoto = document.createElement('img');
    cardPhoto.classList.add('card-photo');
    
    cardPhoto.setAttribute('src', actor.profilePicture);
    
    cardPhoto.addEventListener('error', () => {
        cardPhoto.setAttribute('src', 'img/user-circle.svg');
    });
    // cardPhoto.addEventListener('load', () => { 
    // });
    cardPhoto.addEventListener('click', () => { addRecord(actor); });

    return cardPhoto;
}

function createName(actor) {
    const cardFullName = document.createElement('h2');
    cardFullName.classList.add('card-fullname');
    cardFullName.innerText = fullName(actor);

    return cardFullName;
}

function fullName(actor) {
    let thisName = '';
    if(actor.firstName =="" && actor.lastName==""){
        thisName = `Unknown ${actor.id}`;
    }
    else {
        thisName = `${actor.firstName} ${actor.lastName}`; 
    }
    return thisName;
}

// function createContacts(actor) {
//     const cardContacts = document.createElement('div');
//     cardContacts.classList.add('card-contacts');
//     for (let i = 0; i < actor.contacts.length; i++) {
//         let contact= actor.contacts[i];
//         let logo;
//         let subContact = [];
//         subContact = contact.split('/');       
//         for (let y = 0; y < subContact.length; y++) {
//             if (subContact[y] == "www.facebook.com") {
//                     logo = 'facebook-logo';
//             }
//             if (subContact[y] == "www.instagram.com") {
//                 logo = 'instagram-logo';
//             }
//             if (subContact[y] == "twitter.com") {
//                 logo = 'twitter-logo';
//             }
//         }       
//         const socialButton = document.createElement('a');
//         socialButton.classList.add('social-button');
//         socialButton.classList.add(logo);
//         socialButton.setAttribute('href', contact);
//         socialButton.setAttribute('target', '_blank');
//         cardContacts.append(socialButton);
//     };
//     return cardContacts;
// }

function createContacts(actor) {
    const cardContacts = document.createElement('div');
    cardContacts.classList.add('card-contacts');

    const logoMap = new Map([
        ["www.facebook.com", "facebook-logo"],
        ["www.instagram.com", "instagram-logo"],
        ["twitter.com", "twitter-logo"]
    ]);

    actor.contacts.forEach(contact => {
        let logo = '';

        for (const [domain, logoClass] of logoMap.entries()) {
            if (contact.includes(domain)) {
                logo = logoClass;
                break;
            }
        }

        const socialButton = document.createElement('a');
        socialButton.classList.add('social-button', logo);
        socialButton.setAttribute('href', contact);
        socialButton.setAttribute('target', '_blank');
        cardContacts.append(socialButton);
    });

    return cardContacts;
}

function checkRecord(actor) {
    return records.some(record => record === fullName(actor));
}

function createRecord(actor) {
    const recordList = document.createElement('li');
    recordList.classList.add('record-list');

    const recordContainer = document.createElement('div');
    recordContainer.classList.add('record-container');


    const cardPhoto = document.createElement('img');
    cardPhoto.classList.add('record-photo');
    
    cardPhoto.setAttribute('src', actor.profilePicture);
    
    cardPhoto.addEventListener('error', () => {
        cardPhoto.setAttribute('src', 'img/user-circle.svg');
    });



    const record = document.createElement('div');
    record.classList.add('record');
    record.innerText = fullName(actor);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.innerText = "x";

    deleteButton.addEventListener('click', () => {
        recordList.remove();
        records.splice(records.indexOf(fullName(actor)), 1);
        checkVisibility();
    });

    recordContainer.append(cardPhoto,record, deleteButton);
    recordList.append(recordContainer);

    return recordList;
}

function addRecord(actor) {
    if (!checkRecord(actor)) {
        records.push(fullName(actor));
        const listContainer = document.getElementById('list-container');
        listContainer.prepend(createRecord(actor));
    }
    checkVisibility()
}

function checkVisibility() {
    const listContainer = document.getElementById('list-container');
    const choosedTitle = document.getElementById('choosedTitle');
    if (records.length === 0) {
        choosedTitle.style.visibility = 'visible';
    } else {
        choosedTitle.style.visibility = 'hidden';
    }
}

function createElement(tag, { classNames, click }, ...children) {
    const element = document.createElement(tag);
    element.classList.add(...classNames);
    element.addEventListener('click', click);
    element.append(...children);
    return element;
}

const cardsList = document.getElementById('cards-list');

fetch('./actors.json')
.then((response) => response.json())
.then((actors) => (actors));

const HTMLCards = actors.map(actor => createCard(actor));
cardsList.append(...HTMLCards);


