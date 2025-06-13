app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Маршрут для обработки запросов от формы
app.post('/api/brevo', async (req, res) => {
  console.log('Brevo request:', req.body);
  
  // Проверка наличия email в запросе
  if (!req.body.email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    // Временно возвращаем успех для тестирования
    return res.status(200).json({ success: true, message: 'Contact created successfully' });
  } catch (error) {
    console.error('Brevo API error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create contact' });
  }
});
