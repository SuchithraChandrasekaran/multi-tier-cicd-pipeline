import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
	  const [message, setMessage] = useState('');
	  const [loading, setLoading] = useState(true);

	  useEffect(() => {
		      const fetchData = async () => {
			            try {
					            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001'}/api/health`);
					            setMessage(response.data.message);
					          } catch (error) {
							          setMessage('Backend connection failed');
							          console.error('Error:', error);
						  } finally {
							  setLoading(false);
						  }
		      };

		      fetchData();
		    }, []);

	  return (
		      <div className="App">
		        <header className="App-header">
		          <h1>Multi-Tier Application</h1>
		          <p>Frontend Status: Running</p>
		          <p>Backend Status: {loading ? 'Checking...' : message}</p>
		          <p>Build: {process.env.REACT_APP_BUILD_NUMBER || 'development'}</p>
		        </header>
		      </div>
		    );
}

export default App;
