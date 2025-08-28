window.addEventListener('load', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };

    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://YOUR-API-ID.execute-api.REGION.amazonaws.com/STAGE/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      alert(result.message || 'Message sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.name === 'AbortError') {
        alert('Request timeout. Please try again.');
      } else {
        alert('Failed to send message. Please try again.');
      }
    }
  });
});