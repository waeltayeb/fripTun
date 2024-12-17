const axios = require("axios");

module.exports = {
    Add: async (req, res) => {
        const url = "https://developers.flouci.com/api/generate_payment";
        
        // Vérifiez que les tokens sont définis
        if (!process.env.FLOUCI_TOKEN || !process.env.FLOUCI_SECRET) {
            return res.status(500).json({ error: "FLOUCI_TOKEN ou FLOUCI_SECRET non configuré" });
        }

        // Valider le montant
        const amount = parseFloat(req.body.totalAmount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Montant invalide" });
        }

        const payload = {
            app_token: process.env.FLOUCI_TOKEN,
            app_secret: process.env.FLOUCI_SECRET,
            amount: amount,
            accept_card: "true",
            session_timeout_secs: 1200,
            success_link: "http://localhost:3000/checkout",
            fail_link: "https://localhost:3000/fail",
            developer_tracking_id: "199b923d-5247-4318-8775-84d7a1afe1e9",
        };

        const headers = {
            "Content-Type": "application/json",
        };

        try {
            const result = await axios.post(url, payload, { headers });
            res.status(200).json(result.data);
            
            
        } catch (error) {
           
            res.status(400).json({
                status: "error",
                message: error.response?.data || "Erreur inconnue",
            });
        }

    },
    verify: async (req, res) => {
        const id_payment = req.params.id;
        const url = `https://developers.flouci.com/api/verify_payment/${id_payment}`;
        
        // Vérifiez que la clé publique et la clé secrète sont configurées
        if (!process.env.FLOUCI_TOKEN || !process.env.FLOUCI_SECRET) {
            return res.status(500).json({ error: "Clé publique 'FLOUCI_TOKEN' ou 'FLOUCI_SECRET' non configurée" });
        }

        const headers = {
            "Content-Type": "application/json",
            "apppublic": process.env.FLOUCI_TOKEN,
            "appsecret": process.env.FLOUCI_SECRET
        };

        try {
            const response = await axios.get(url, { headers });
            res.status(200).json(response.data);
            if (response.data.status === "SUCCESS") {
                // insert order ===> 
                    
            };
        } catch (error) {
            console.error("Erreur lors de la vérification :", error.response?.data || error.message);
            res.status(400).json({
                status: "error",
                message: error.response?.data || "Erreur inconnue",
            });
        }
    },
    
};
