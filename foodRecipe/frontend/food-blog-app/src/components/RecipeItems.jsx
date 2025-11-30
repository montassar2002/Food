import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import foodImg from '../assets/foodRecipe.png';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6"; // Icone cœur
import { FaEdit } from "react-icons/fa"; // Icone édition
import { MdDelete } from "react-icons/md"; // Icone suppression
import axios from 'axios';

export default function RecipeItems() {
    const [allRecipes, setAllRecipes] = useState([]); // Toutes les recettes
    const [favItems, setFavItems] = useState(
        JSON.parse(localStorage.getItem("fav")) ?? [] // Favoris depuis localStorage
    );
    const navigate = useNavigate();
    const isFavPage = window.location.pathname === "/favRecipe"; // Vérifie si l'utilisateur est sur la page Favourites
    const [role, setRole] = useState(""); // Rôle utilisateur

    // Charger les recettes
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/recipe');
                setAllRecipes(response.data); // Charge les données
            } catch (error) {
                console.error("Erreur lors du chargement des recettes :", error);
            }
        };
        fetchRecipes();
    }, []);

    // Charger le rôle utilisateur depuis localStorage
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setRole(user.role);
        }
    }, []);

    // Ajouter ou retirer une recette des favoris
    const favRecipe = (item) => {
        const updatedFavorites = favItems.some((recipe) => recipe._id === item._id)
            ? favItems.filter((recipe) => recipe._id !== item._id) // Supprime des favoris
            : [...favItems, item]; // Ajoute aux favoris

        setFavItems(updatedFavorites); // Mise à jour
        localStorage.setItem("fav", JSON.stringify(updatedFavorites)); // Persistant
    };

    // Supprimer une recette
    const onDelete = async (id) => {
        await axios.delete(`http://localhost:5000/recipe/${id}`);
        setAllRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
        const updatedFavorites = favItems.filter((recipe) => recipe._id !== id);
        setFavItems(updatedFavorites);
        localStorage.setItem("fav", JSON.stringify(updatedFavorites));
    };

    // Paiement avec Stripe
    // Paiement avec Stripe
const handlePayment = async (recipe) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id; // Récupérer l'ID utilisateur

    try {
        const response = await axios.post('http://localhost:5000/api/payment/create-checkout-session', {
            title: recipe.title,
            price: recipe.price || 10,
            userId: userId, // Transmettre l'ID utilisateur
        });

        window.location.href = response.data.url; // Redirige vers Stripe Checkout
    } catch (error) {
        console.error("Erreur lors de la création de la session Stripe :", error.message);
        alert("Une erreur est survenue lors du paiement !");
    }
};


    // Filtrage des recettes à afficher
    const recipesToDisplay = isFavPage ? favItems : allRecipes;

    return (
        <div className="card-container">
            {recipesToDisplay.length > 0 ? (
                recipesToDisplay.map((item, index) => (
                    <div key={index} className="card" onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                        <img
                            src={item.coverImage ? `http://localhost:5000/images/${item.coverImage}` : foodImg}
                            width="120px"
                            height="100px"
                            alt={item.title}
                        />
                        <div className="card-body">
                            <div className="title">{item.title}</div>
                            <div className="icons">
                                <div className="timer"><BsStopwatchFill /> {item.time}</div>
                                {role !== "admin" && (
                                <FaHeart
                                    onClick={() => favRecipe(item)}
                                    style={{
                                        color: favItems.some((recipe) => recipe._id === item._id) ? "red" : "" // Rouge si favori
                                    }}
                                />
                                )}
                                {/* Afficher le bouton Pay seulement sur la page Favourites */}
                                {isFavPage && role !== "admin" && (
                                    <button
                                        onClick={() => handlePayment(item)}
                                        className="pay-button"
                                        style={{
                                            marginLeft: '10px',
                                            padding: '5px 10px',
                                            background: '#6772e5',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        Payer 
                                    </button>
                                )}
                                {role !== "user" && (
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link> // Ajout du bouton édition
                                )}
                                {role !== "user" && (
                                    <MdDelete onClick={() => onDelete(item._id)} className="deleteIcon" />
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
                    {isFavPage ? "Aucun favori pour le moment." : "Aucune recette disponible."}
                </div>
            )}
        </div>
    );
}
