// Fonction pour stocker le jeton côté client (sessionStorage)
const setAuthToken = (token) => {
    sessionStorage.setItem('authToken', token);    
};

// Fonction pour supprimer le jeton côté client (sessionStorage)
const removeAuthToken = () => {    
    sessionStorage.removeItem('authToken');  
};

// Fonction pour vérifier si l'utilisateur est connecté
const isUserLoggedIn = () => {    
    return sessionStorage.getItem('authToken') !== null;
};

const updateVisibility = () => {
    const loginButton = document.getElementById('login-button');
    const banner = document.getElementById('black-banner');
    const filteredContent = document.getElementById('filtered-content');
    const editLink = document.getElementById('edit-link');
    const header =document.getElementById('header');
    const modal = document.getElementById('edit-modal');

   if (banner && filteredContent && editLink && header && modal) {    
    if (isUserLoggedIn()) {
        loginButton.textContent = 'Logout';
        loginButton.setAttribute('href', '/index.html');
        loginButton.addEventListener('click', () => logoutUser());
        banner.style.display = 'block'; // Affiche le bandeau si l'utilisateur est connecté
        // Masquer le contenu filtré si l'utilisateur est connecté
        filteredContent.style.display = 'none';
        editLink.classList.remove('hidden');
        modal.style.display = 'none';                
    } else { 
        loginButton.textContent = 'Login';
        loginButton.setAttribute('href', '/login.html');
        header.classList.remove('space')        
        banner.style.display = 'none'; // Masque le bandeau sinon
        // Afficher le contenu filtré si l'utilisateur n'est pas connecté
        filteredContent.style.display = 'block'; // Ou toute autre valeur de display appropriée
        modal.style.display = 'none'; // Cacher la modale sinon
    }
  }  
};

// Fonction pour déconnecter l'utilisateur
const logoutUser = () => {
    // Supprimer le jeton côté client
    removeAuthToken();
    sessionStorage.clear();
    // Réinitialisez l'état de connexion
    alert('Vous êtes déconnecté!');

    // Redirigez vers la page d'accueil après la déconnexion
    window.location.href = '/index.html';
};

// Fonction pour gérer la soumission du formulaire de connexion
const handleLoginSubmit = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json(); // Récupérer les données JSON de la réponse
            const authToken = data.token;           

            // Stocker le jeton côté client
            setAuthToken(authToken);            

            alert('Connecté avec succès!');
            window.location.href = '/index.html';
        } else {
            const errorText = await response.text(); // Récupérer le texte de l'erreur
            console.error('Erreur lors de la connexion:', errorText);
            alert('“Erreur dans l\'identifiant ou le mot de passe');
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de connexion:', error);
    }
};

// Ajout d'un gestionnaire d'événements pour la soumission du formulaire de connexion
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le rechargement de la page
            await handleLoginSubmit();
            updateVisibility();
        });
    }

    // Appel initial pour mettre à jour l'apparence du bouton
    updateVisibility();    
});






