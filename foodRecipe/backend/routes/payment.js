const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Assure-toi que la clé est bien dans ton .env
const bodyParser = require("body-parser");
const Payment = require("../models/payment"); // Modèle MongoDB pour les paiements

// Route pour créer une session Stripe
router.post("/create-checkout-session", async (req, res) => {
  
  const { title, price, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: price * 100, // en cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      client_reference_id: userId, // Référence utilisateur
      metadata: {
        recipeTitle: title, // Informations sur la recette pour le Webhook
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Erreur lors de la création de la session Stripe :", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route Webhook pour capturer l'événement Stripe
router.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Clé secrète du Webhook
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Erreur lors de la validation du Webhook :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestion de l'événement `checkout.session.completed`
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Enregistrer le paiement dans MongoDB
      const payment = new Payment({
        userId: session.client_reference_id, // ID utilisateur
        recipeTitle: session.metadata.recipeTitle, // Titre de la recette
        amount: session.amount_total / 100, // Convertir les cents en dollars
        paymentStatus: "succeeded",
        paymentDate: Date.now(),
      });

      await payment.save();
      console.log("Paiement enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement :", error.message);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
