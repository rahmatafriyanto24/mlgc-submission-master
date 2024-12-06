const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const { predictionCollection, storeData } = require("../services/storeData");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, classification, suggestion } =
    await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: classification,
    suggestion: suggestion,
    createdAt: createdAt,
    consfidenceScore: confidenceScore,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message:
      confidenceScore > 0
        ? "Model is predicted successfully"
        : "Model is predicted successfully but under the threshold. Please use the correct picture",
    data,
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  const histories = (await predictionCollection.get()).docs.map((doc) =>
    doc.data()
  );
  const data = histories.map((item) => ({
    id: item.id,
    history: item,
  }));
  return h.response({ status: "success", data }).code(200);
}

module.exports = { postPredictHandler, getHistoriesHandler };
