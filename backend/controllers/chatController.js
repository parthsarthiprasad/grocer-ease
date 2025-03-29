const handleMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Here you can integrate with any AI service or implement your own logic
    // For now, we'll create a simple response based on the message content
    let response = '';
    
    // Simple keyword-based responses
    if (message.toLowerCase().includes('price')) {
      response = 'I can help you find prices for items. Please specify which item you\'re interested in.';
    } else if (message.toLowerCase().includes('location')) {
      response = 'I can help you find the location of items in our stores. Which item are you looking for?';
    } else if (message.toLowerCase().includes('stock')) {
      response = 'I can check the stock availability of items. Please let me know which item you\'re interested in.';
    } else if (message.toLowerCase().includes('help')) {
      response = 'I can help you with:\n- Finding item prices\n- Locating items in stores\n- Checking stock availability\n- General store information\nWhat would you like to know?';
    } else {
      response = 'I\'m here to help! You can ask me about prices, locations, stock availability, or general store information.';
    }

    res.json({ response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

module.exports = {
  handleMessage
}; 