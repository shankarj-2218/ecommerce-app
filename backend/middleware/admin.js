const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin required.' });
  }
};

export const admins = [
    { email: 'admin@example.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'},
];

export default admin;