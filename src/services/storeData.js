require("dotenv").config();
const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
});
const predictionCollection = db.collection("predictions");

async function storeData(id, data) {
  try {
    const predictCollection = db.collection("predictions");
    await predictCollection.doc(id).set(data);
    return { success: true };
  } catch (error) {
    console.error("Error storing data: ", error);
    return { success: false, error: "Failed to store data" };
  }
}

module.exports = { predictionCollection, storeData };
