const ElderCare = require('../models/ElderCare');

// @GET /api/elder-care - Get all requests (volunteers see open ones)
exports.getRequests = async (req, res) => {
  try {
    const { serviceType, urgency, status, city, page = 1, limit = 10 } = req.query;
    const query = {};

    // Non-admins/volunteers only see pending or their own
    if (req.user.role === 'volunteer') {
      query.$or = [{ status: 'pending' }, { assignedVolunteer: req.user.id }];
    } else if (req.user.role === 'user') {
      query.requestedBy = req.user.id;
    }

    if (serviceType) query.serviceType = serviceType;
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;
    if (city) query['address.city'] = new RegExp(city, 'i');

    const total = await ElderCare.countDocuments(query);
    const requests = await ElderCare.find(query)
      .populate('requestedBy', 'name phone avatar')
      .populate('assignedVolunteer', 'name phone avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, pages: Math.ceil(total / limit), requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/elder-care - Create a care request
exports.createRequest = async (req, res) => {
  try {
    const request = await ElderCare.create({ ...req.body, requestedBy: req.user.id });
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/elder-care/:id/accept - Volunteer accepts a request
exports.acceptRequest = async (req, res) => {
  try {
    const request = await ElderCare.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already taken' });

    request.status = 'accepted';
    request.assignedVolunteer = req.user.id;
    await request.save();
    res.json({ success: true, message: 'Request accepted!', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/elder-care/:id/complete
exports.completeRequest = async (req, res) => {
  try {
    const request = await ElderCare.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = 'completed';
    if (req.body.rating) request.rating = req.body.rating;
    if (req.body.feedback) request.feedback = req.body.feedback;
    await request.save();
    res.json({ success: true, message: 'Service marked as completed', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/elder-care/:id
exports.getRequest = async (req, res) => {
  try {
    const request = await ElderCare.findById(req.params.id)
      .populate('requestedBy', 'name phone avatar address')
      .populate('assignedVolunteer', 'name phone avatar bio');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/elder-care/:id
exports.deleteRequest = async (req, res) => {
  try {
    const request = await ElderCare.findOneAndDelete({ _id: req.params.id, requestedBy: req.user.id });
    if (!request) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ success: true, message: 'Request removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
