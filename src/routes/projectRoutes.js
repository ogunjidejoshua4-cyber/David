// Line 1: Import Express Router module
import express from 'express';

// Line 2: Import Mongoose Project model
import Project from '../models/Project.js';

// Line 3: Import Cloudinary upload middleware instance
import { upload } from '../config/cloudinary.js';

// Line 4: Initialize Express router
const router = express.Router();

// Line 5: GET /api/projects - Retrieve portfolio works, with optional category filtering
router.get('/', async (req, res) => {
  // Line 6: Wrap inside try block for safe query execution
  try {
    // Line 7: Extract category or genre from query parameters
    const { category, genre } = req.query;
    // Line 8: Resolve query key prioritizing category then genre
    const selectedFilter = category || genre;
    // Line 9: Build MongoDB filter object based on whether 'All' was passed
    const filter = selectedFilter && selectedFilter !== 'All' ? { genre: selectedFilter } : {};
    // Line 10: Query MongoDB projects collection sorted by newest first
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    // Line 11: Return 200 OK status with the projects array
    return res.status(200).json(projects);
  // Line 12: Catch block for database query errors
  } catch (err) {
    // Line 13: Return 500 error status with JSON message
    return res.status(500).json({ message: 'Error retrieving projects', error: err.message });
  }
});

// Line 14: POST /api/projects - Upload artwork or trailer video and create a project record
router.post('/', (req, res) => {
  // Line 15: Execute multer middleware manually to intercept errors before Express crashes
  upload.single('coverImage')(req, res, async (err) => {
    // Line 16: Catch Multer and Cloudinary upload errors
    if (err) {
      // Line 17: Log exact upload failure to terminal
      console.error('Project Upload Error:', err);

      // Line 18: Detect Cloudinary HTTP 413 Payload Too Large error
      if (err.http_code === 413 || (err.message && err.message.includes('413'))) {
        return res.status(413).json({
          message: 'Video file exceeds Cloudinary upload limit. Please upload a compressed clip under 40MB.',
          error: 'Cloudinary 413: Payload Too Large',
        });
      }

      // Line 19: Detect Multer internal size threshold error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File exceeds maximum server limit (200MB).',
          error: err.message,
        });
      }

      // Line 20: Return general upload error as pure JSON
      return res.status(400).json({ message: 'Media upload failed', error: err.message });
    }

    // Line 21: Check if a file was attached in the request
    if (!req.file) {
      // Line 22: Return 400 error indicating missing file
      return res.status(400).json({ message: 'Please select an image or video file' });
    }

    // Line 23: Try block for saving record in MongoDB
    try {
      // Line 24: Destructure form fields from request body
      const { title, authorName, genre, description } = req.body;

      // Line 25: Create new project document in MongoDB with Cloudinary URL from req.file.path
      const newProject = await Project.create({
        title,
        authorName,
        genre,
        description,
        coverImageUrl: req.file.path,
      });

      // Line 26: Return 201 Created status with the newly saved document
      return res.status(201).json(newProject);
    // Line 27: Catch database insertion errors
    } catch (dbErr) {
      // Line 28: Log database error
      console.error('Database Save Error:', dbErr);
      // Line 29: Return 500 JSON response
      return res.status(500).json({ message: 'Database save failed', error: dbErr.message });
    }
  });
});

// Line 30: PUT /api/projects/:id - Update an existing project
router.put('/:id', async (req, res) => {
  // Line 31: Try block for database update
  try {
    // Line 32: Destructure updated fields from request body
    const { title, authorName, genre, description } = req.body;
    // Line 33: Find document by ID and update fields with new document returned
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, authorName, genre, description },
      { new: true }
    );
    // Line 34: Return updated record with 200 OK status
    return res.status(200).json(updated);
  // Line 35: Catch update errors
  } catch (err) {
    // Line 36: Return 500 status on update failure
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

// Line 37: DELETE /api/projects/:id - Remove project from portfolio
router.delete('/:id', async (req, res) => {
  // Line 38: Try block for database deletion
  try {
    // Line 39: Find by ID and delete from MongoDB
    await Project.findByIdAndDelete(req.params.id);
    // Line 40: Return success confirmation
    return res.status(200).json({ message: 'Project deleted successfully' });
  // Line 41: Catch delete errors
  } catch (err) {
    // Line 42: Return 500 status on deletion failure
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

// Line 43: Export the router as default
export default router;