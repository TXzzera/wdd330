const accountContainer = document.getElementById("account-container");

// Utility functions
function getProfile() {
    return JSON.parse(localStorage.getItem("user_profile") || "null");
}

function saveProfile(profile) {
    localStorage.setItem("user_profile", JSON.stringify(profile));
}

// Render account details
function renderAccount(profile) {
    if (!accountContainer) return;

    accountContainer.innerHTML = `
        <p>Username: ${profile.username}</p>
        <p>Full Name: ${profile.fullName || "-"}</p>
        <p>Email: ${profile.email}</p>
        <p>Phone: ${profile.phone || "-"}</p>
        <p>Country: ${profile.country || "-"}</p>
        <button id="logout-btn">Logout</button>
    `;

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user_profile");
        localStorage.removeItem("liked_playlists"); // Clear user data
        window.location.href = "/docs/index.html"; // Redirect to homepage
    });
}

// Login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();

        const profile = getProfile();
        if (!profile || profile.username !== username || profile.email !== email) {
            alert("User not found. Please sign up.");
            return;
        }

        window.location.href = "/docs/index.html"; // Redirect to homepage
    });
}

// Signup form
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", e => {
        e.preventDefault();
        const profile = {
            username: document.getElementById("username").value.trim(),
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            country: document.getElementById("country").value.trim()
        };
        saveProfile(profile);
        alert("Account created successfully!");
        window.location.href = "/docs/index.html"; // Redirect to homepage
    });
}

// Init My Account page
document.addEventListener("DOMContentLoaded", () => {
    const profile = getProfile();

    if (accountContainer) {
        if (profile) {
            renderAccount(profile);
        } else {
            accountContainer.innerHTML = `
                <p>You are not logged in.</p>
                <p>Please <a href="login.html">Login</a> or <a href="signup.html">Sign Up</a> to access your account.</p>
            `;
        }
    }
});
