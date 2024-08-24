const axios = require('axios');

// Bannerbear API Key
const apiKey = 'bb_pr_c190bfdcfee3e5fb30670c58525547';

// Payload to generate an image
const payload = {
  template: 'qY4mReZpXlYPZ97lP8',
  modifications: [
    {
      name: 'message',
      text: 'Excellent training to help you crack a technical job in top MNC where you pay the fee in installment',
    },
    {
      name: 'face',
      image_url: 'https://cdn.bannerbear.com/sample_images/welcome_bear_photo.jpg',
    },
  ],
  transparent: false,
};

// Function to generate an image
const generateImage = async () => {
  try {
    // Step 1: Send the initial request to generate the image
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

    console.log('Image generation requested:', response.data);

    // Step 2: Poll the status until the image is generated
    const checkImageStatus = async (url) => {
      let status = 'pending';
      while (status === 'pending') {
        // Wait for a few seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Check the image status
        const statusResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });

        status = statusResponse.data.status;
        console.log('Current status:', status);

        if (status === 'completed') {
          console.log('Image Generated:', statusResponse.data);
          console.log('Image URL:', statusResponse.data.image_url);
          break;
        }
      }
    };

    // Step 3: Check the status using the self URL
    checkImageStatus(response.data.self);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Generate the image
generateImage();
