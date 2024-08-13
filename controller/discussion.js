const jwt_decode = require('jwt-decode');
const client = require('../database/connect');
const Discussion = require('../model/discussion');
const User = require('../../API_Auth/model/user'); 
const { ObjectId } = require('mongodb');
const { response } = require('express');

var user2Id;

const searchUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(email);
    const user2 = await client.db().collection('user').findOne({ email });;
    console.log(user2);

    if (!user2) {
      return res.status(404).json({ error: "L'utilisateur 2 (celui dont l'email est recherché dans le front) n'existe pas" });
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log(token) // Supposer que le header Authorization est de la forme "Bearer <token>"
    const decodedToken = jwt_decode(token);
    const user1Id = decodedToken.userId;
    //essayer quand j'ai le temps : user1Id = req.userInfo.userId (récupère l'id du token via le middleware)

    user2Id = user2._id.toString();
    console.log(user2Id, user1Id);

    // Appel de la fonction createDiscussion avec les ID des utilisateurs
    const discussion = await createDiscussion(user1Id, user2Id);

    res.status(200).json(discussion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur est survenue lors de la recherche de l'utilisateur" });
  }
};

const createDiscussion = async (user1Id, user2Id) => {
  try {
    let discussionFound = false; // Variable pour vérifier si une discussion a été trouvée
    //console.log(user1Id, user2Id);
    const existingDiscussion = await client.db().collection('discussion').findOne({
      participants: {
        $elemMatch: {
          $or: [
            { user1_id: user1Id, user2_id: user2Id },
            { user1_id: user2Id, user2_id: user1Id },
          ],
        },
      },
    });

    if (existingDiscussion) {
      discussionFound = true;
      console.log("discussion trouvée");
      return existingDiscussion;
    }
    if (!discussionFound) {
    const newDiscussion = new Discussion({
      participants: [
        { user1_id: user1Id, user2_id: user2Id },
      ],
      conversation: [],
    });

    const result = await client.db().collection('discussion').insertOne(newDiscussion, { maxTimeMS: 30000 });
    console.log(result.insertedId);
    const discussionId = result.insertedId;

    const response = {
      discussionId: discussionId,
      user1Id: user1Id,
      user2Id: user2Id
    };
    console.log("discussion crée");
    return response;
  }
  } catch (error) {
    console.error(error);
    throw new Error('Une erreur est survenue lors de la création de la discussion');
  }
};

const findDiscussionById = async (user1Id, user2Id) => {
  try {
    console.log(user1Id, user2Id);
    const discussion = await client.db().collection('discussion').findOne({
      participants: {
        $elemMatch: {
          $or: [
            { user1_id: user1Id, user2_id: user2Id },
            { user1_id: user2Id, user2_id: user1Id },
          ],
        },
      },
    });

    if (discussion) {
      return discussion._id.toString();
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Une erreur est survenue lors de la recherche de la discussion');
  }
};

const addMessageToDiscussion = async (req, res) => {
  try {
    const { messageUserId, content, email } = req.body;
    console.log(messageUserId, content, email);

    const user1Id = req.userInfo.userId;
    
    console.log(email);
    const user2 = await client.db().collection('user').findOne({ email });;
    console.log(user2);

    if (!user2) {
      return res.status(404).json({ error: "L'utilisateur 2 (celui dont l'email est recherché dans le front) n'existe pas" });
    }
    user2Id = user2._id.toString();
    console.log(user1Id, user2Id);

    // Trouver l'ID de la discussion en utilisant les ID des utilisateurs
    const discussionId = await findDiscussionById(user1Id, user2Id);

    if (!discussionId) {
      return res.status(404).json({ error: 'Discussion introuvable' });
    }

    // Ajouter le message à la discussion
    const updatedDiscussion = await client.db().collection('discussion').updateOne(
      { _id: ObjectId(discussionId) },
      { $push: { conversation: { messageUserId, content } } }
    );

    if (updatedDiscussion.matchedCount === 0) {
      return res.status(404).json({ error: 'Discussion introuvable' });
    }

    return res.status(200).json(discussionId, user1Id, user2Id);
  } catch (error) {
    console.error(error);

    if (error.name === 'MongoError' && error.code === 11000) {
      // Gérer l'erreur de duplication du message (si le message est déjà présent dans la discussion)
      return res.status(400).json({ error: 'Le message existe déjà dans la discussion' });
    }

    return res.status(500).json({ error: 'Une erreur est survenue lors de la sauvegarde du message' });
  }
};



const getDiscussions = async (req,res) => {
  try{
    let cursor = client.db().collection("discussion").find();
    let result = await cursor.toArray();
    if(result.length>0){
        res.status(200).json(result);
    }else{
        res.status(204).json({msg : "Aucune discussion trouvée"});
    }
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createDiscussion, searchUserByEmail, addMessageToDiscussion, getDiscussions };
