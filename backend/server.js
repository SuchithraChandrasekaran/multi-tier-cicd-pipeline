const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
	  res.json({
		      name: 'Multi-Tier Backend API',
		      version: process.env.BUILD_NUMBER || '1.0.0',
		      status: 'running',
		      endpoints: [
			            'GET /api/health',
			            'GET /api/users',
			            'POST /api/users',
			            'GET /api/metrics'
			          ]
		    });
});

// Error handling middleware
app.use((err, req, res, next) => {
	  console.error(err.stack);
	  res.status(500).json({ 
		      error: 'Something went wrong!',
		      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
		    });
});

// 404 handler
app.use('*', (req, res) => {
	  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
	  console.log(`Server running on port ${PORT}`);
	  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
	  console.log(`Build: ${process.env.BUILD_NUMBER || '1.0.0'}`);
});

module.exports = app;
