const express = require('express');
const router = express.Router();
const enrichService = require('../services/enrichService');
const dbService = require('../services/database');
const vectorDbService = require('../services/vectorDb');

// POST /api/enrich - Enrich prompt and fetch results
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required and must be a non-empty string'
      });
    }

    // Step 1: Enrich prompt with context from Vector DB
    const enrichedPrompt = await enrichService.enrichWithContext(prompt);

    // Step 2: Search Vector DB for similar content
    const vectorResults = await vectorDbService.search(prompt, 5);

    // Step 3: Fetch data from database
    const dbResults = await dbService.searchData(enrichedPrompt);

    // Step 4: Combine and format results
    const results = enrichService.combineResults(vectorResults, dbResults);

    res.json({
      success: true,
      originalPrompt: prompt,
      enrichedPrompt: enrichedPrompt,
      results: results
    });
  } catch (error) {
    console.error('Error in enrich endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;

