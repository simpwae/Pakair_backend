import mongoose from "mongoose";

// @desc    Get all recommendations from recomendation_model collection
// @route   GET /api/recommendations
// @access  Private (Officials only)
export const getRecommendations = async (req, res) => {
  try {
    // Access the recomendation_model collection directly without schema
    const db = mongoose.connection.db;
    const collection = db.collection("recomendation_model");

    // Get all documents from recomendation_model collection
    const recommendations = await collection.find({}).toArray();

    console.log(`Retrieved ${recommendations.length} recommendations`);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recommendations",
      error: error.message,
    });
  }
};

// @desc    Get single recommendation by ID
// @route   GET /api/recommendations/:id
// @access  Private (Officials only)
export const getRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = mongoose.connection.db;
    const collection = db.collection("recomendation_model");

    const recommendation = await collection.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("Get recommendation by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recommendation",
      error: error.message,
    });
  }
};
