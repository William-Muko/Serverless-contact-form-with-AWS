const { useState } = React;

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Sending...');
        
        try {
            const response = await fetch('https://YOUR-API-ID.execute-api.REGION.amazonaws.com/STAGE/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Error sending message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus('Error sending message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    };

    const titleStyle = {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600'
    };

    const fieldStyle = {
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontSize: '14px',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e1e5e9',
        borderRadius: '8px',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        width: '100%',
        backgroundColor: isLoading ? '#6c757d' : '#007bff',
        color: 'white',
        padding: '14px 20px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        marginTop: '10px'
    };

    const statusStyle = {
        marginTop: '20px',
        padding: '12px 16px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        backgroundColor: status.includes('success') ? '#d4edda' : status.includes('Error') ? '#f8d7da' : '#fff3cd',
        color: status.includes('success') ? '#155724' : status.includes('Error') ? '#721c24' : '#856404',
        border: `1px solid ${status.includes('success') ? '#c3e6cb' : status.includes('Error') ? '#f5c6cb' : '#ffeaa7'}`
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Get In Touch</h2>
            <form onSubmit={handleSubmit}>
                <div style={fieldStyle}>
                    <label style={labelStyle}>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>
                
                <div style={fieldStyle}>
                    <label style={labelStyle}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>
                
                <div style={fieldStyle}>
                    <label style={labelStyle}>Message</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        rows="6"
                        style={{...inputStyle, resize: 'vertical', minHeight: '120px'}}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={buttonStyle}
                    onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#007bff')}
                >
                    {isLoading ? '⏳ Sending...' : '📧 Send Message'}
                </button>
            </form>
            
            {status && (
                <div style={statusStyle}>
                    {status}
                </div>
            )}
        </div>
    );
}

// Add global styles
const globalStyles = `
    body {
        margin: 0;
        padding: 20px;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
        min-height: 100vh;
        font-family: 'Arial', sans-serif;
    }
    
    * {
        box-sizing: border-box;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.render(<ContactForm />, document.getElementById('root'));