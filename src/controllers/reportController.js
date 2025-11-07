import CitizenReport from '../models/CitizenReport.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Create new report
// @route   POST /api/reports
// @access  Private (Citizen)
export const createReport = async (req, res) => {
  try {
    const { description, title, useCurrentLocation, address, latitude, longitude, city, province } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image or video',
      });
    }

    // Upload file to Cloudinary
    let cloudinaryResult;
    try {
      cloudinaryResult = await uploadToCloudinary(
        req.file.buffer,
        'pakair/reports',
        req.file.mimetype
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload media file',
        error: uploadError.message,
      });
    }

    // Determine media type
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    // Prepare location data
    const locationData = {
      useCurrentLocation: useCurrentLocation === 'true' || useCurrentLocation === true,
      address: address || '',
      coordinates: {
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
      },
      city: city || '',
      province: province || '',
    };

    // Create report
    const report = await CitizenReport.create({
      userId: req.user.id,
      media: {
        type: mediaType,
        url: cloudinaryResult.secure_url,
        filename: cloudinaryResult.original_filename || req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      location: locationData,
      description: description || '',
      title: title || '',
      status: 'pending',
      verified: false,
    });

    // Populate user data
    await report.populate('userId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating report',
      error: error.message,
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
export const getReports = async (req, res) => {
  try {
    const { status, verified, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { isDeleted: false };

    if (status) {
      query.status = status;
    }

    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get reports
    const reports = await CitizenReport.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('verifiedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await CitizenReport.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reports',
      error: error.message,
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
export const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await CitizenReport.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('verifiedBy', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report',
      error: error.message,
    });
  }
};

// @desc    Verify report (Official only)
// @route   PATCH /api/reports/:id/verify
// @access  Private (Official)
export const verifyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationNotes } = req.body;

    const report = await CitizenReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Update report
    report.verified = true;
    report.verifiedBy = req.user.id;
    report.verifiedAt = new Date();
    report.status = 'verified';
    if (verificationNotes) {
      report.verificationNotes = verificationNotes;
    }

    await report.save();

    // Populate user data
    await report.populate('userId', 'firstName lastName email');
    await report.populate('verifiedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Report verified successfully',
      data: report,
    });
  } catch (error) {
    console.error('Verify report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying report',
      error: error.message,
    });
  }
};

// @desc    Reject report (Official only)
// @route   PATCH /api/reports/:id/reject
// @access  Private (Official)
export const rejectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationNotes } = req.body;

    const report = await CitizenReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Update report
    report.verified = false;
    report.verifiedBy = req.user.id;
    report.verifiedAt = new Date();
    report.status = 'rejected';
    if (verificationNotes) {
      report.verificationNotes = verificationNotes;
    }

    await report.save();

    // Populate user data
    await report.populate('userId', 'firstName lastName email');
    await report.populate('verifiedBy', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Report rejected',
      data: report,
    });
  } catch (error) {
    console.error('Reject report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting report',
      error: error.message,
    });
  }
};

