import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "../model/prisma.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import dotenv from 'dotenv';
dotenv.config();
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "default_secret_key"
};

passport.use(new LocalStrategy(async function (username, password, done) {
    try {
        const user = await prisma.user.findUnique({ where: { username: username } });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}
));

passport.use(new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
        const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));

