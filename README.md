# Licensing System Updates

This backend has been updated to support the new hardware-bound licensing system used by the Electron application.

## Changes Overview

### 1. Database Schema
- **New Model**: `src/models/license.model.js`
    - Stores `machineId` (unique hardware identifier).
    - Stores `licenseKey`.
    - Tracks `lastLogin` and `previousMachineIds` for device migration history.
- **Integration**: `src/models/index.js`
    - Registered the `license` model.
    - Established a One-to-Many association: `User.hasMany(License)`.

### 2. Synchronization
- The database uses `db.sequelize.sync({ alter: true })` in `server.js` to automatically create the `licenses` table on startup.
- The schema is identical to the Flask backend's `License` model to ensure consistency across both authentication systems.

## Component Role
While the **Flask Backend** handles the primary sign-in for the Electron application (15-day persistent sessions), this **Node.js Backend** maintains the shared database schema and provides the foundational records for the licensing system.
