import passport from 'passport';

const requireUser = passport.authenticate('jwt', { session: false });

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        return next();
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }
};

export { requireUser, requireAdmin };