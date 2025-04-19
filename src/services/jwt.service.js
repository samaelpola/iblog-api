import jwt from "jsonwebtoken";
import { appConfig } from "../config/index.js";

export class JwtService {
  constructor() {
    this.accessTokenSecret = appConfig.JWT_SECRET;
    this.refreshTokenSecret = appConfig.JWT_REFRESH_SECRET;
    this.accessTokenExpiresIn = appConfig.JWT_ACCESS_TOKEN_EXPIRES_IN;
    this.refreshTokenExpiresIn = appConfig.JWT_REFRESH_TOKEN_EXPIRES_IN;
  }

  getPayload = (user) => {
    return { id: user.id, email: user.email };
  };

  generateAccessToken = (payload) => {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn,
    });
  };

  generateRefreshToken = (payload) => {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  };

  verifyAccessToken = (token) => {
    return jwt.verify(token, this.accessTokenSecret);
  };

  verifyRefreshToken = (token) => {
    return jwt.verify(token, this.refreshTokenSecret);
  };

  refreshAccessToken = (refreshToken) => {
    const payload = this.verifyRefreshToken(refreshToken);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;

    return this.generateAccessToken(payload);
  };

  decodeToken = (token) => {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  };
}
