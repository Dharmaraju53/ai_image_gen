const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (like index.html)

// Your Bannerbear API Key
const apiKey = 'bb_pr_c190bfdcfee3e5fb30670c58525547';

// Web scraping route
app.post('/scrape', async (req, res) => {
  try {
    const url = req.body.url;

    // Fetch the webpage
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract content from meta description 
    const metaDescription = document.querySelector("meta[name='description']");
    const content = metaDescription ? metaDescription.getAttribute("content") : "No description available.";

    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch website data' });
  }
});

// Image generation route using Bannerbear
app.post('/generate-image', async (req, res) => {
  const { content } = req.body;

  const payload = {
    template: 'qY4mReZpXlYPZ97lP8', // Template ID
    modifications: [
      {
        name: 'message',
        text: content, // Use scraped content as text on the image
      },
      {
        name: 'face',
        image_url: 'https://cdn.bannerbear.com/sample_images/welcome_bear_photo.jpg',
      },
    ],
    transparent: false,
  };

  try {
    // Step 1: Request image generation from Bannerbear
    const response = await axios.post(
      'https://api.bannerbear.com/v2/images',
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Step 2: Poll the status until the image is generated
    const checkImageStatus = async (url) => {
      let status = 'pending';
      while (status === 'pending') {
        // Wait for a few seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        status = statusResponse.data.status;
        if (status === 'completed') {
          return statusResponse.data.image_url; // Return the image URL once completed
        }
      }
    };

    // Step 3: Check the status using the self URL
    const imageUrl = await checkImageStatus(response.data.self);
    res.json({ imageUrl }); // Send the generated image URL back to the client

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
