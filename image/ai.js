const axios = require('axios');

const apiKey = 'bb_pr_97dd5ebfef1403a00f5e8ac57a45dc'; // Replace with your actual Bannerbear API Key
const templates = ['vz9ByYbNavJnDRGXrw', 'Kp21rAZjYBqrb6eLnd', 'RnxGpW5lvNJQbEXrJ1']; // Replace with your actual template IDs

const createImage = async (content) => {
  // Randomly select a template
  const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
  console.log('Selected template:', selectedTemplate);

  const payload = {
    template: selectedTemplate,
    modifications: [
      {
        name: 'message',
        text: content, // Use the analyzed content as the message
      },
      {
        name: 'face',
        image_url: 'https://cdn.bannerbear.com/sample_images/welcome_bear_photo.jpg', // Example image URL
      },
    ],
    transparent: false,
  };

  try {
    // Step 1: Request Bannerbear to generate an image
    const response = await axios.post('https://api.bannerbear.com/v2/images', payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const { uid } = response.data;
    console.log('Image creation requested. Image ID:', uid);

    // Step 2: Poll the status until the image is generated
    const checkImageStatus = async (imageId) => {
      let status = 'pending';
      let imageData;

      while (status === 'pending') {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const statusResponse = await axios.get(`https://api.bannerbear.com/v2/images/${imageId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        status = statusResponse.data.status;

        if (status === 'completed') {
          imageData = statusResponse.data;
          break;
        } else if (status === 'failed') {
          throw new Error('Image creation failed.');
        }
      }

      return imageData;
    };

    const generatedImage = await checkImageStatus(response.data.self);

    // Return the generated image URL
    return generatedImage.image_url;
  } catch (error) {
    console.error('Error creating image:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { createImage };
