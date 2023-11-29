//Fontion et évenement pour mettre è jour le jeton

const getTokenFromSessionStorage = () => {
    return sessionStorage.getItem('authToken');    
};

window.addEventListener('storage', (event) => {
    if (event.key === 'authToken') {
        // Mettre à jour la valeur du token lorsqu'elle change
        const updatedToken = getTokenFromSessionStorage();        
    }
});

//Fonction pour mettre à jour la gallerie et la modale
const updateGalleryAndModal = async () => {
    const gallery = document.querySelector('.gallery');
    const modalContent = document.querySelector('.modal-gallery');   
    
    try {
        const authToken = getTokenFromSessionStorage();
        
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }

        const imagesData = await response.json(); 
        gallery.innerHTML = '';
        modalContent.innerHTML = '';       
        getProjets(imagesData);
        openModalWithGalleryItems(imagesData);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Fonction pour récupérer les éléments de la galerie dans la modale
const openModalWithGalleryItems = async () => {
    const modal = document.getElementById('edit-modal');
    const modalContent = modal.querySelector('.modal-gallery');
    // Effacer le contenu actuel de la modal
    modalContent.innerHTML = ''; 
    console.log(getTokenFromSessionStorage());
 

    try {       
       const authToken = getTokenFromSessionStorage();

        // Récupérer les images avec les IDs depuis le serveur
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }

        const imagesData = await response.json();

        // Créer les éléments de la galerie dans la modal avec les données récupérées
        imagesData.forEach(image => {
            const figure = document.createElement('figure');
            figure.setAttribute('data-image-id', image.id);   
            const img = document.createElement('img');
            img.src = image.imageUrl; 

            // Créer le bouton de suppression et l'attacher à la figure
            const deleteButton = createDeleteButton(image.id); 
            figure.appendChild(img);
            figure.appendChild(deleteButton);

            // Ajouter la figure à la modale
            modalContent.appendChild(figure);
        });

        // Afficher la modale
        modal.style.display = 'block';
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Sélectionnez toutes les images de la galerie modale
const images = document.querySelectorAll('.modal-gallery img');

// Ajoutez le bouton de suppression à chaque image
images.forEach(image => {
    let deleteButton = createDeleteButton();
    image.parentElement.appendChild(deleteButton);
});


// Fonction pour fermer la modale
const closeModal = (event) => {    
    const modal = document.getElementById('edit-modal');
    const closeIcon = document.getElementById('close-button');    
       
    if (event.target === modal) {
        modal.style.display = 'none';      
        resetFormFields();
        backButton.click();
        
        // Supprimer les éléments de la modal pour éviter les duplications
        const modalContent = modal.querySelector('.modal-gallery');
        modalContent.innerHTML = '';
    }

    if (event.target === closeIcon) {
        modal.style.display = 'none';       
        resetFormFields();
        backButton.click();      
    }     
};

// Événement pour ouvrir la modale avec les éléments de la galerie
const editLink = document.getElementById('edit-link');
if (editLink) {
    editLink.addEventListener('click', openModalWithGalleryItems);    
}

// Événement pour fermer la modale lorsqu'on clique à l'extérieur
const modal = document.getElementById('edit-modal');
if (modal) {
    modal.addEventListener('click', closeModal);    
}

// Gestionnaire d'événement pour le bouton "Ajouter une image"
const addImageButton = document.getElementById('add-image-button');
const backButton = document.getElementById('back-button');
const additionalContent = document.querySelector('.additional-content');
const modalGallery = document.querySelector('.modal-gallery');
const modalSeparator = document.getElementById('modalSeparator');
const modalTitle = document.querySelector('.modal-title h2')

if (addImageButton && backButton) {
    addImageButton.addEventListener('click', () => {
        modalGallery.style.display = 'none'; // Masque la galerie principale
        additionalContent.style.display = 'block'; // Affiche le contenu supplémentaire        
        addImageButton.style.display = 'none';
        modalSeparator.style.display = 'none';
        modalTitle.textContent = 'Ajout photo';          
    });   

    backButton.addEventListener('click', () => {
        modalGallery.style.display = 'grid'; // Affiche à nouveau la galerie principale
        additionalContent.style.display = 'none'; // Masque le contenu supplémentaire
        addImageButton.style.display = 'block';
        modalSeparator.style.display = 'block';
        modalTitle.textContent = 'Galerie photo';
        backButton.style.display = 'none';
        resetFormFields();              
    });      
}

addImageButton.addEventListener('click', () => {
     backButton.style.display = 'block';
});

const fileInput = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const uploadSectionContent = document.querySelector('.upload-section-content');

fileInput.addEventListener('change',  function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {           
            const img = new Image();
            img.src = e.target.result;
            imagePreview.innerHTML = ''; // Efface tout contenu précédent de l'aperçu
            imagePreview.appendChild(img);
            imagePreview.style.display = 'block'; // Afficher l'aperçu de l'image
            uploadSectionContent.style.display = 'none'; // Cache le contenu de upload-section           
        };        
        reader.readAsDataURL(file);
    }
});

const titleInput = document.getElementById('image-title');
const categoryInput = document.getElementById('image-category');
const submitButton = document.getElementById('submit-image-button');
const imageUpload = document.getElementById('file-upload');

titleInput.addEventListener('input', toggleSubmitButtonState);
categoryInput.addEventListener('change', toggleSubmitButtonState);
imageUpload.addEventListener('change', toggleSubmitButtonState);

function toggleSubmitButtonState() {
    const isTitleFilled = titleInput.value.trim() !== '';    
    const isCategorySelected = categoryInput.value !== '';
    const isImageLoaded = imageUpload.files.length > 0;    

    if (isTitleFilled && isCategorySelected && isImageLoaded) {
        submitButton.disabled = false;
        submitButton.classList.add('active');
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove('active');
    }        
}

submitButton.addEventListener('click', async () => {
    const titleInput = document.getElementById('image-title').value;    
    const categoryInput = document.getElementById('image-category').value;
    const fileInput = document.getElementById('file-upload').files[0];    
    
    const formData = new FormData();
    formData.append('title', titleInput);
    formData.append('image', fileInput);
    formData.append('category', parseInt(categoryInput));

    try {
        const authToken = getTokenFromSessionStorage();        
        const response = await fetch('http://localhost:5678/api/works/', {
            method: 'POST',            
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            const imageUrl = await response.json();                          
             // Mettre à jour la galerie et la modal
             updateGalleryAndModal(); 
             resetFormFields();     
           
        } else {
            throw new Error('Erreur lors de la soumission des données');
        }
    } catch (error) {
        console.error('Erreur:', error);
        // Gérer les erreurs
    }
});

modalGallery.addEventListener('click', async (event) => {
    const deleteButton = event.target.closest('.trash-button');
    if (deleteButton) {
        const figureToDelete = deleteButton.closest('figure');
        if (figureToDelete) {
            const id = figureToDelete.getAttribute('data-image-id');                        
            await deleteImage(id);
            figureToDelete.remove();
        }
    }
});

//Fonction pour la suppression d'images
const deleteImage = async (imageId) => {     
        
    try {
        const authToken = getTokenFromSessionStorage();
        const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: imageId })
        });

        if (response.ok) {
            const imageToDelete = document.querySelector(`figure[data-image-id="${imageId}"]`);
            if (imageToDelete) {
                imageToDelete.remove();
                updateGalleryAndModal(); // Mise à jour de la galerie                 
            }
            return true;
        } else {
            return `Erreur lors de la suppression de l'image: ${response.status}`;
        }
    } catch (error) {
        console.error('Erreur lors de la suppression côté serveur:', error);
    }
};


// Fonction pour créer le bouton de suppression
const createDeleteButton = () => {    
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('trash-button'); // Ajoutez la classe pour le style CSS
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    return deleteButton;
};

//Fonction pour remetre à zéro les Champs après l'ajout d'image
const resetFormFields = () => {
    const titleInput = document.getElementById('image-title');
    const categoryInput = document.getElementById('image-category');
    const imagePreview = document.getElementById('image-preview');

    // Réinitialiser la valeur de l'input text
    titleInput.value = '';

    // Réinitialiser la sélection de l'option
    categoryInput.selectedIndex = 0;

    // Masquer l'aperçu de l'image et afficher la section de téléchargement
    imagePreview.innerHTML = ''; // Réinitialise le contenu de image-preview pour décharger l'image
    fileInput.value = '';
    imagePreview.style.display = 'none'; // Afficher l'aperçu de l'image
    uploadSectionContent.style.display = 'block'; // Cache le contenu de upload-section
    submitButton.classList.remove('active');
};


