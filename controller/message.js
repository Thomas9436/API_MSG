const client = require("../database/connect");
const Message = require("../model/message");

// Fonction pour ajouter un nouveau message
const addMessage = async (req, res) => {
  console.log("token validé");
  try {
    // Récupération des informations nécessaires depuis le corps de la requête
    const { content } = req.body;
    console.log(req.userInfo.userId);

    // Vérification des paramètres
    if (!content || !req.userInfo.userId) {
      return res.status(400).json({
        error:
          "Le contenu et l'ID utilisateur sont requis pour ajouter un message.",
      });
    }

    // Création d'un nouveau message avec les informations de l'utilisateur
    const message = new Message({
      content,
      userId: req.userInfo.userId,
      //userEmail: req.userInfo.email,
      //discussionId: recuperer l'id de la discussion selectionnée
    });

    // Sauvegarde du message dans la base de données
    const result = await client
      .db()
      .collection("messages")
      .insertOne(message, { maxTimeMS: 30000 });

    if (result) {
      return res.status(201).json({ message: "Message ajouté avec succès." });
    } else {
      throw new Error("Impossible d'ajouter le message.");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Une erreur est survenue lors de l'ajout du message." });
  }
};

// Fonction pour récupérer tous les messages
const getAllMessages = async (req, res) => {
  try {
    // Récupération de tous les messages de la collection
    const messages = await client.db().collection("messages").find().toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des messages.",
    });
  }
};

// Fonction pour récupérer tous les messages d'un utilisateur
const getMessageByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Récupération de tous les messages de l'utilisateur
    const messages = await Message.find({ userId });

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Une erreur est survenue lors de la récupération des messages de l'utilisateur.",
    });
  }
};

// Fonction pour supprimer un message
const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Message.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "Message supprimé avec succès." });
    } else {
      throw new Error("Impossible de supprimer le message.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du message.",
    });
  }
};

module.exports = {
  addMessage,
  deleteMessage,
  getAllMessages,
  getMessageByUserId,
};
