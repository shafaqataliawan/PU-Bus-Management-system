const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// ADD a new route
router.post('/add', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { 
      routeName, 
      routeNumber, 
      busName, 
      driverName, 
      busStops, 
      startPoint, 
      endPoint, 
      waypoints 
    } = req.body;

    // Validate required fields
    if (!routeName || !routeNumber || !busName || !driverName) {
      console.log('Missing required fields:', { routeName, routeNumber, busName, driverName });
      return res.status(400).json({ 
        success: false,
        message: 'Route name, route number, bus name, and driver name are required' 
      });
    }

    // Validate waypoints
    if (!Array.isArray(waypoints) || waypoints.length === 0) {
      console.log('Invalid waypoints:', waypoints);
      return res.status(400).json({ 
        success: false,
        message: 'At least one waypoint is required' 
      });
    }

    // Validate each waypoint
    for (const waypoint of waypoints) {
      if (!waypoint.name || !waypoint.coordinates || 
          typeof waypoint.coordinates.lat !== 'number' || 
          typeof waypoint.coordinates.lng !== 'number') {
        console.log('Invalid waypoint:', waypoint);
        return res.status(400).json({ 
          success: false,
          message: 'Each waypoint must have a name and valid coordinates' 
        });
      }
    }

    console.log('Creating new route with data:', { 
      routeName, 
      routeNumber, 
      busName, 
      driverName, 
      busStops, 
      startPoint, 
      endPoint, 
      waypoints 
    });

    const newRoute = new Route({
      routeName,
      routeNumber,
      busName,
      driverName,
      busStops,
      startPoint,
      endPoint,
      waypoints
    });

    console.log('Attempting to save route...');
    const savedRoute = await newRoute.save();
    console.log('Route saved successfully:', savedRoute);
    
    res.status(201).json({ 
      success: true,
      message: 'Route added successfully',
      route: savedRoute 
    });
  } catch (error) {
    console.error('Detailed error adding route:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      success: false,
      message: 'Error adding route', 
      error: error.message
    });
  }
});

// GET all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    console.error('Error retrieving routes:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving routes' 
    });
  }
});

// GET route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ 
        success: false,
        message: 'Route not found' 
      });
    }
    res.status(200).json(route);
  } catch (err) {
    console.error('Error retrieving route:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error retrieving route' 
    });
  }
});

// UPDATE a route by ID
router.put('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    // Update fields
    route.routeName = req.body.routeName || route.routeName;
    route.routeNumber = req.body.routeNumber || route.routeNumber;
    route.busName = req.body.busName || route.busName;
    route.driverName = req.body.driverName || route.driverName;
    route.startPoint = req.body.startPoint || route.startPoint;
    route.endPoint = req.body.endPoint || route.endPoint;
    // Add more fields as needed
    await route.save();
    res.status(200).json({ success: true, message: 'Route updated successfully', route });
  } catch (err) {
    console.error('Error updating route:', err);
    res.status(500).json({ success: false, message: 'Error updating route' });
  }
});

// DELETE a route
router.delete('/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ 
        success: false,
        message: 'Route not found' 
      });
    }
    res.status(200).json({ 
      success: true,
      message: 'Route deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting route:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting route' 
    });
  }
});

// PATCH route status (Active/Inactive)
router.patch('/:id/status', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    if (req.body.status && (req.body.status === 'Active' || req.body.status === 'Inactive')) {
      route.status = req.body.status;
    } else {
      route.status = route.status === 'Active' ? 'Inactive' : 'Active';
    }
    await route.save();
    res.status(200).json({ success: true, message: `Route status updated to ${route.status}`, route });
  } catch (err) {
    console.error('Error updating route status:', err);
    res.status(500).json({ success: false, message: 'Error updating route status' });
  }
});

module.exports = router;
