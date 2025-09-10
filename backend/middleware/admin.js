const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin required.' });
  }
};

export const admins = [
    { username: 'admin1', password: 'password1' },
    { username: 'admin2', password: 'password2' }
];

export default admin;