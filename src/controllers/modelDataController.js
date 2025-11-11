import mongoose from "mongoose";

// @desc    Get all model data directly from model_data collection
// @route   GET /api/model-data
// @access  Private (Officials only)
export const getModelData = async (req, res) => {
  try {
    // Access the model_data collection directly without schema
    const db = mongoose.connection.db;
    const collection = db.collection("model_data");

    // Get all documents from model_data collection
    const modelData = await collection.find({}).toArray();

    console.log(`Retrieved ${modelData.length} model_data documents`);

    res.status(200).json({
      success: true,
      count: modelData.length,
      data: modelData,
    });
  } catch (error) {
    console.error("Get model data error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching model data",
      error: error.message,
    });
  }
};

// @desc    Get single model data entry by ID
// @route   GET /api/model-data/:id
// @access  Private (Officials only)
export const getModelDataById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = mongoose.connection.db;
    const collection = db.collection("model_data");

    const modelData = await collection.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!modelData) {
      return res.status(404).json({
        success: false,
        message: "Model data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: modelData,
    });
  } catch (error) {
    console.error("Get model data by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching model data",
      error: error.message,
    });
  }
};
