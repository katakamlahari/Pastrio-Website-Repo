const Paste = require('../models/Paste');

const HASH_LENGTH = parseInt(process.env.HASH_LENGTH) || 6;

// Create a new paste
exports.createPaste = async (req, res) => {
  try {
    const { content, expirationTime, expirationUnit, maxViews } = req.body;

    // Validation
    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    // Generate unique hash (dynamically import nanoid to support ESM-only package)
    let hash;
    let isUnique = false;
    let _nanoid = null;
    while (!isUnique) {
      if (!_nanoid) {
        const mod = await import('nanoid');
        _nanoid = mod.nanoid || mod.default;
      }
      hash = _nanoid(HASH_LENGTH);
      const existing = await Paste.findOne({ hash });
      isUnique = !existing;
    }

    // Calculate expiresAt if expiration is set
    let expiresAt = null;
    if (expirationTime && expirationUnit) {
      const now = new Date();
      const time = parseInt(expirationTime);

      if (time > 0) {
        switch (expirationUnit) {
          case 'minutes':
            expiresAt = new Date(now.getTime() + time * 60 * 1000);
            break;
          case 'hours':
            expiresAt = new Date(now.getTime() + time * 60 * 60 * 1000);
            break;
          case 'days':
            expiresAt = new Date(now.getTime() + time * 24 * 60 * 60 * 1000);
            break;
          default:
            expiresAt = null;
        }
      }
    }

    // Prepare paste data
    const pasteData = {
      hash,
      content: content.trim(),
      expiresAt,
      maxViews: maxViews ? parseInt(maxViews) : null,
    };

    // Create and save paste
    const paste = new Paste(pasteData);
    await paste.save();

    res.status(201).json({
      success: true,
      message: 'Paste created successfully',
      url: `/${hash}`,
      hash,
    });
  } catch (error) {
    console.error('Error creating paste:', error);
    res.status(500).json({ success: false, message: 'Error creating paste' });
  }
};

// Get and view a paste
exports.getPaste = async (req, res) => {
  try {
    const { hash } = req.params;

    // Find the paste
    const paste = await Paste.findOne({ hash });

    if (!paste) {
      return res.status(404).render('error', {
        title: 'Paste Not Found',
        message: '❌ This paste does not exist or has been deleted.',
        statusCode: 404,
      });
    }

    // Check if paste is accessible
    if (!paste.isAccessible()) {
      return res.status(404).render('error', {
        title: 'Paste Expired',
        message: '⏰ This paste has expired and is no longer available.',
        statusCode: 404,
      });
    }

    // Increment view count
    await paste.incrementView();

    // If view limit reached, delete the paste
    if (paste.maxViews !== null && paste.views >= paste.maxViews) {
      await Paste.deleteOne({ _id: paste._id });
    }

    // Render the paste
    res.render('paste', {
      title: 'View Paste',
      paste: {
        hash: paste.hash,
        content: paste.content,
        views: paste.views,
        createdAt: paste.createdAt,
      },
    });
  } catch (error) {
    console.error('Error retrieving paste:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: '❌ An error occurred while retrieving the paste.',
      statusCode: 500,
    });
  }
};

// API endpoint to get paste as JSON
exports.getPasteJson = async (req, res) => {
  try {
    const { hash } = req.params;

    const paste = await Paste.findOne({ hash });

    if (!paste) {
      return res.status(404).json({
        success: false,
        message: 'Paste not found',
      });
    }

    if (!paste.isAccessible()) {
      return res.status(404).json({
        success: false,
        message: 'Paste has expired',
      });
    }

    res.json({
      success: true,
      data: {
        hash: paste.hash,
        content: paste.content,
        views: paste.views,
        createdAt: paste.createdAt,
      },
    });
  } catch (error) {
    console.error('Error retrieving paste:', error);
    res.status(500).json({ success: false, message: 'Error retrieving paste' });
  }
};
