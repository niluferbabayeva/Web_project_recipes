import React, { useState } from 'react';
import './style/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setResponseMessage('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        // Clear the response message after 5 seconds
        setTimeout(() => {
          setResponseMessage('');
        }, 5000);
      } else {
        setResponseMessage('Failed to send the message. Please try again later.');
        setTimeout(() => {
          setResponseMessage('');
        }, 5000);
      }
    } catch (error) {
      setResponseMessage('Error: Could not send the message.');
      setTimeout(() => {
        setResponseMessage('');
      }, 5000);
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Send
        </button>
      </form>
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default ContactPage;
