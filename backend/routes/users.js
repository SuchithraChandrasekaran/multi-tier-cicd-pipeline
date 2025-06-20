const express = require('express');
const router = express.Router();

// Mock user data 
let users = [
	  { id: 1, name: 'suchithra c', email: 'suchithrac@example.com', role: 'admin', created: '2024-01-15' },
	  { id: 2, name: 'thenmozhi v', email: 'thenmozhiv@example.com', role: 'user', created: '2024-01-16' },
	  { id: 3, name: 'iswarya j', email: 'iswaryaj@example.com', role: 'user', created: '2024-01-17' },
	  { id: 4, name: 'indhumathy k', email: 'indhumathyk@example.com', role: 'moderator', created: '2024-01-18' }
];

// GET all users
router.get('/', (req, res) => {
	  const { page = 1, limit = 10, role } = req.query;
	  
	  let filteredUsers = users;
	  
	  SSS// Filter by role if specified
	  if (role) {
		      filteredUsers = users.filter(user => user.role === role);
		    }
	  
	  const startIndex = (page - 1) * limit;
	  const endIndex = page * limit;
	  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
	  
	  res.json({
		      users: paginatedUsers,
		      pagination: {
			            currentPage: parseInt(page),
			            totalPages: Math.ceil(filteredUsers.length / limit),
			            totalUsers: filteredUsers.length,
			            hasNext: endIndex < filteredUsers.length,
			            hasPrev: startIndex > 0
			          }
		    });
});

// GET user by ID
router.get('/:id', (req, res) => {
	  const userId = parseInt(req.params.id);
	  const user = users.find(u => u.id === userId);
	  
	  if (!user) {
		      return res.status(404).json({ error: 'User not found' });
		    }
	  
	  res.json({ user });
});

// POST create new user
router.post('/', (req, res) => {
	  const { name, email, role = 'user' } = req.body;
	  
	  // Validation
	  if (!name || !email) {
		      return res.status(400).json({ error: 'Name and email are required' });
		    }
	  
	  // Check if email already exists
	  const existingUser = users.find(u => u.email === email);
	  if (existingUser) {
		      return res.status(409).json({ error: 'Email already exists' });
		    }
	  
	  // Create new user
	  const newUser = {
		      id: users.length + 1,
		      name,
		      email,
		      role,
		      created: new Date().toISOString().split('T')[0]
		    };
	  
	  users.push(newUser);
	  
	  res.status(201).json({ 
		      message: 'User created successfully',
		      user: newUser 
		    });
});

// PUT update user
router.put('/:id', (req, res) => {
	  const userId = parseInt(req.params.id);
	  const { name, email, role } = req.body;
	  
	  const userIndex = users.findIndex(u => u.id === userId);
	  if (userIndex === -1) {
		      return res.status(404).json({ error: 'User not found' });
		    }
	  
	  // Update user data
	  if (name) users[userIndex].name = name;
	  if (email) {
		      // Check if new email already exists
		      const existingUser = users.find(u => u.email === email && u.id !== userId);
		      if (existingUser) {
			            return res.status(409).json({ error: 'Email already exists' });
			          }
		      users[userIndex].email = email;
		    }
	  if (role) users[userIndex].role = role;
	  
	  res.json({ 
		      message: 'User updated successfully',
		      user: users[userIndex] 
		    });
});

// DELETE user
router.delete('/:id', (req, res) => {
	  const userId = parseInt(req.params.id);
	  const userIndex = users.findIndex(u => u.id === userId);
	  
	  if (userIndex === -1) {
		      return res.status(404).json({ error: 'User not found' });
		    }
	  
	  users.splice(userIndex, 1);
	  
	  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
