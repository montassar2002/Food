const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID de l'utilisateur ayant effectué le paiement
    recipeTitle: { type: String, required: true }, // Titre de la recette
    amount: { type: Number, required: true }, // Montant payé
    paymentStatus: { type: String, required: true }, // Statut du paiement (ex: "succeeded")
    paymentDate: { type: Date, default: Date.now }, // Date du paiement
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
