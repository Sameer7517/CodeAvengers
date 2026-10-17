import { exchangeStore } from '../services/exchangeStore.js';

export const createExchangeRequest = async (req, res) => {
  try {
    const { listingId, offeredListingId, proposedMeetingTime, proposedSpot, message } = req.body;

    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'Target listing ID is required'
      });
    }

    const created = await exchangeStore.create(
      { listingId, offeredListingId, proposedMeetingTime, proposedSpot, message },
      req.user
    );

    return res.status(201).json({
      success: true,
      message: 'Exchange request submitted successfully',
      data: created
    });
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to submit exchange request',
      code: error.code
    });
  }
};

export const getExchangeRequests = async (req, res) => {
  try {
    const { role = 'all', status } = req.query;
    const userId = req.user._id || req.user.id;

    const requests = await exchangeStore.getAll({
      userId,
      role,
      status
    });

    return res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve exchange requests'
    });
  }
};

export const getExchangeRequestById = async (req, res) => {
  try {
    const item = await exchangeStore.getById(req.params.id, req.user);
    return res.json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve exchange request'
    });
  }
};

export const acceptExchangeRequest = async (req, res) => {
  try {
    const accepted = await exchangeStore.accept(req.params.id, req.user);
    return res.json({
      success: true,
      message: 'Exchange request accepted. Items reserved for campus meetup!',
      data: accepted
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to accept exchange request',
      code: error.code
    });
  }
};

export const rejectExchangeRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const rejected = await exchangeStore.reject(req.params.id, req.user, reason);
    return res.json({
      success: true,
      message: 'Exchange proposal declined',
      data: rejected
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to decline exchange request'
    });
  }
};

export const cancelExchangeRequest = async (req, res) => {
  try {
    const cancelled = await exchangeStore.cancel(req.params.id, req.user);
    return res.json({
      success: true,
      message: 'Exchange request cancelled',
      data: cancelled
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to cancel exchange request'
    });
  }
};

export const completeExchangeRequest = async (req, res) => {
  try {
    const completed = await exchangeStore.complete(req.params.id, req.user);
    return res.json({
      success: true,
      message: '🎉 Exchange completed! Eco-Karma points and reuse metrics awarded.',
      data: completed
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to complete exchange request'
    });
  }
};
