import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa'; // Import des icônes Facebook et Instagram
import foodRecipe from '../assets/foodRecipe.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeItems from '../components/RecipeItems';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import InputForm from '../components/InputForm';

export default function Home() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            console.log("Logged in user:", user);
            setRole(user.role);
        }
    }, []);

    const addRecipe = () => {
        let token = localStorage.getItem("token");
        if (token)
            navigate("/addRecipe");
        else {
            setIsOpen(true);
        }
    };

    return (
        <>
            <section className='home'>
                <div className='left'>
                    <h1>Food Recipe</h1>
                    <h5>
                    Bienvenue à tous dans l'univers de la cuisine ! Explorez, créez, et savourez avec notre plateforme dédiée aux recettes. Nous sommes ravis de vous accompagner dans vos aventures culinaires. Que vous soyez ici pour préparer un festin ou découvrir de nouvelles inspirations, nous sommes là pour rendre votre expérience enrichissante et gourmande. Alors, installez-vous confortablement, et surtout… bon appétit ! 😊
                        
                    </h5>

                    {role !== "user" && (
                        <button onClick={addRecipe}>Share your recipe</button>
                    )}
                </div>
                {/* Section Réseaux Sociaux et Contact */}
            <section className='social-contact'>
                <h2>Suivez-nous</h2>
                <div className='social-icons' style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4267B2' }}>
                        <FaFacebook style={{ fontSize: '40px' }} /> Facebook
                    </a>
                    <a href="https://instagram.com/FoodRecipe" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#C13584' }}>
                        <FaInstagram style={{ fontSize: '40px' }} /> Instagram
                    </a>
                </div>
                <div className='contact-info' style={{ marginTop: '20px' }}>
                    <p>📧 Contactez-nous : <a href="mailto:mohamedazizmiled66@gmail.com">medaziz_montassar@gmail.com</a></p>
                    <p>📞 Téléphone : +216 23555001</p>
                </div>
            </section>
                <div className='right'>
                    <img src={foodRecipe} width="320px" height="300px" alt="Food Recipe"></img>
                </div>
            </section>

            <div className='bg'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#d4f6e8" fillOpacity="1" d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
                </svg>
            </div>

            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
            <div className='recipe'>
                <RecipeItems />
            </div>

            
        </>
    );
}
