const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    height: {
        type: Number,
        min: 0
    },
    weight: {
        type: Number,
        min: 0
    },
    allergies: [{
        name: String,
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
        },
        notes: String
    }],
    medicalConditions: [{
        name: String,
        diagnosisDate: Date,
        status: {
            type: String,
            enum: ['active', 'resolved', 'chronic']
        },
        notes: String
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
        prescribedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        notes: String
    }],
    familyHistory: [{
        condition: String,
        relation: String,
        notes: String
    }],
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
        email: String
    },
    insurance: {
        provider: String,
        policyNumber: String,
        groupNumber: String,
        expiryDate: Date
    },
    primaryDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastVisit: Date,
    nextAppointment: Date,
    notes: String
}, {
    timestamps: true
});

// Add indexes for better query performance
patientSchema.index({ user: 1 });
patientSchema.index({ primaryDoctor: 1 });
patientSchema.index({ 'medicalConditions.status': 1 });
patientSchema.index({ nextAppointment: 1 });

module.exports = mongoose.model('Patient', patientSchema); 