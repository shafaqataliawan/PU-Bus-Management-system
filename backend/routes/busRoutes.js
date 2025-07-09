const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// GET all buses
router.get('/', async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (err) {
        console.error('Error retrieving buses:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving buses',
            error: err.message 
        });
    }
});

// GET a single bus by ID
router.get('/:id', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ 
                success: false,
                message: 'Bus not found' 
            });
        }
        res.status(200).json(bus);
    } catch (err) {
        console.error('Error retrieving bus:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving bus',
            error: err.message 
        });
    }
});

// ADD a new bus
router.post('/add', async (req, res) => {
    try {
        const { busNumber, capacity, driver, startPoint, endPoint } = req.body;

        // Validate required fields
        if (!busNumber || !capacity || !driver || !startPoint || !endPoint) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: busNumber, capacity, driver, startPoint, endPoint'
            });
        }

        // Check if bus number already exists
        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus) {
            return res.status(400).json({
                success: false,
                message: 'Bus number already exists'
            });
        }

        // Create new bus
        const newBus = new Bus({
            busNumber,
            capacity: Number(capacity),
            driver,
            startPoint,
            endPoint,
            status: 'Active'
        });

        // Save bus
        const savedBus = await newBus.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Bus added successfully', 
            bus: savedBus 
        });
    } catch (err) {
        console.error('Error adding bus:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error adding bus',
            error: err.message 
        });
    }
});

// DELETE a bus
router.delete('/:id', async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) {
            return res.status(404).json({ 
                success: false,
                message: 'Bus not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Bus deleted successfully' 
        });
    } catch (err) {
        console.error('Error deleting bus:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting bus',
            error: err.message 
        });
    }
});

// UPDATE a bus
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        res.status(200).json({ success: true, message: 'Bus updated successfully', bus: updatedBus });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating bus', error: err.message });
    }
});

// TOGGLE bus status
router.patch('/:id/status', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) {
            return res.status(404).json({ success: false, message: 'Bus not found' });
        }
        bus.status = req.body.status || (bus.status === 'Active' ? 'Inactive' : 'Active');
        await bus.save();
        res.status(200).json({ success: true, message: 'Bus status updated', status: bus.status });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating status', error: err.message });
    }
});

module.exports = router; 