export const requireAdmin = (req, res, next) => {
  const role = req.headers['x-user-role'];
  const allowedRoles = ['admin', 'super_admin', 'order_manager', 'support', 'finance'];
  
  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  next();
};

export const requirePermission = (permissionKey) => {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];
    if (role === 'super_admin' || role === 'admin') {
      return next();
    }

    let permissions = [];
    try {
      if (req.headers['x-user-permissions']) {
        permissions = JSON.parse(req.headers['x-user-permissions']);
      }
    } catch (e) {
      permissions = [];
    }

    if (permissions.includes('*') || permissions.includes(permissionKey)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden: Missing required permission '${permissionKey}'`
    });
  };
};
