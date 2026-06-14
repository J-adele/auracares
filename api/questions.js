const path = require('path');

exports.handler = async (event, context) => {
  // Handle OPTIONS request for CORS if needed
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Load the question bank generated during the build phase
    const bank = require('../assets/js/question-bank.json');

    const params = event.queryStringParameters || {};
    const category = params.category;

    if (category) {
      const filtered = bank.questions.filter(
        q => q.category.toLowerCase() === category.toLowerCase()
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          version: bank.version,
          generated: bank.generated,
          total: filtered.length,
          categories: bank.categories.filter(c => c.key.toLowerCase() === category.toLowerCase()),
          questions: filtered
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(bank)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to load question bank',
        details: error.message
      })
    };
  }
};
