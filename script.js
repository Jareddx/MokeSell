const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    // Validate Username
    if (usernameValue === '') {
        setError(username, 'Username is required');
    } else if (usernameValue.length < 3) {
        setError(username, 'Username must be at least 3 characters');
    } else {
        setSuccess(username);
    }

    // Validate Email
    if (emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    // Validate Password
    if (passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length < 6) {
        setError(password, 'Password must be at least 6 characters');
    } else {
        setSuccess(password);
    }

    // Validate Confirm Password
    if (password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError(password2, 'Passwords do not match');
    } else {
        setSuccess(password2);
    }
};

const API_URL = "https://mokesell-8e7e.restdb.io/rest/listings"; // Replace with your actual RestDB API URL
const API_KEY = "67a59a029c97970a4c1b2a74"; // Replace with your API key

async function fetchListings() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": API_KEY
            }
        });

        const listings = await response.json();
        const listingsGrid = document.querySelector(".listing-grid");

        listingsGrid.innerHTML = listings.map(listing => `
            <div class="listing-card" onclick="viewListing('${listing._id}')">
                <img src="${listing.image}" alt="${listing.title}" class="listing-image">
                <div class="listing-info">
                  <h3>${listing.title}</h3>
                  <p>${listing.description}</p>
                  <p>$${listing.price}</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

function viewListing(listingId) {
    window.location.href = `listing.html?id=${listingId}`;
}

document.addEventListener("DOMContentLoaded", fetchListings);