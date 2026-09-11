// این میدلور را بعد از authMiddleware استفاده کن
// مثال: router.get('/admin/sections', authMiddleware, requireRole('ADMIN'), handler)

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "دسترسی غیرمجاز برای این نقش." });
    }
    next();
  };
}

module.exports = requireRole;
