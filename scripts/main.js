// Fonction pour créer les options de catégorie dans le sélecteur
const createCategoryOptions = (categories) => {
    const categorySelector = document.getElementById('image-category');

    // Créer une option par défaut (vide)
    const defaultOption = document.createElement('option');
    defaultOption.value = ''; // Valeur vide
    defaultOption.textContent = 'Sélectionnez une catégorie'; // Texte descriptif
    categorySelector.appendChild(defaultOption);

    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelector.appendChild(option);
    });
};

// Fonction pour récupérer les catégories à partir de l'URL
const getCategories = () => {
    fetch("http://localhost:5678/api/categories/")
        .then((res) => res.json())
        .then((categories) => {
            if (Array.isArray(categories) && categories.length > 0) {
                categoryMapping = categories.reduce((acc, category) => {
                    acc[category.id] = category.name;
                    return acc;
                }, {});

                createCategoryFilters(categories);
                getProjets();

                // Ajout de la création des options de catégorie ici
                createCategoryOptions(categories);
            } else {
                console.error("La réponse du serveur ne contient pas de catégories valides.");
            }
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des catégories:', error);
        });
};

// Fonction pour créer les boutons de filtre en fonction des catégories
const createCategoryFilters = (categories) => {
    const filtersContainer = document.querySelector(".filters");

    // Ajouter le bouton "Toutes les catégories"
    const allCategoriesButton = document.createElement('button');
    allCategoriesButton.textContent = 'Tous';
    allCategoriesButton.addEventListener('click', () => {
        filterProjectsByCategoryId("all");
    });
    filtersContainer.appendChild(allCategoriesButton);

    // Ajouter les autres boutons de catégorie
    categories.forEach((category) => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category.name;
        filterButton.addEventListener('click', () => {
            filterProjectsByCategoryId(category.id);
        });
        filtersContainer.appendChild(filterButton);
    });
};

// Fonction pour filtrer les projets par ID de catégorie
const filterProjectsByCategoryId = (categoryId) => {
    const gallery = document.querySelector(".gallery");
    const figures = gallery.querySelectorAll('figure');

    figures.forEach((figure) => {
        const projectCategoryId = figure.getAttribute('data-category-id');
        figure.style.display = projectCategoryId == categoryId || categoryId == "all" ? 'block' : 'none';
    });
};

// Fonction pour récupérer les projets
const getProjets = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works/", {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error("La requête n'a pas abouti. Statut : " + response.status);
        }
        
        let imagesData = await response.json();
        if (Array.isArray(imagesData) && imagesData.length > 0) {
            imagesData.forEach((projet) => {
                displayProjectInGallery(projet);
            });
        } else {
            console.error("La réponse du serveur ne contient pas de données valides.");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
    }
};

// Fonction pour afficher un projet dans la galerie
const displayProjectInGallery = (projet) => {
    let gallery = document.querySelector(".gallery");
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    let figcaption = document.createElement('figcaption');
    gallery.appendChild(figure);
    figure.appendChild(img);
    img.src = projet.imageUrl; 
    figure.setAttribute('data-category-id', projet.category.id);    
    figure.appendChild(figcaption);
    figcaption.textContent = projet.title;
    
    
};

// Appel initial pour récupérer les catégories
getCategories();



