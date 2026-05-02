const Career = require('../models/Career');

// @GET /api/careers - Get all active careers with filters
exports.getCareers = async (req, res) => {
  try {
    const { category, jobType, experienceLevel, location, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (location) query.location = new RegExp(location, 'i');
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') }
    ];

    const total = await Career.countDocuments(query);
    const careers = await Career.find(query)
      .populate('postedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, pages: Math.ceil(total / limit), careers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/careers/:id
exports.getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).populate('postedBy', 'name avatar email');
    if (!career) return res.status(404).json({ message: 'Job not found' });
    career.views += 1;
    await career.save();
    res.json({ success: true, career });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/careers - Create job listing
exports.createCareer = async (req, res) => {
  try {
    const career = await Career.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json({ success: true, career });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/careers/:id/apply
exports.applyCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = career.applicants.find(a => a.user.toString() === req.user.id);
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied to this job' });

    career.applicants.push({ user: req.user.id, coverLetter: req.body.coverLetter });
    await career.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/careers/:id
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!career) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ success: true, career });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/careers/:id
exports.deleteCareer = async (req, res) => {
  try {
    await Career.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
    res.json({ success: true, message: 'Job listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
