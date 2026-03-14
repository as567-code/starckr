/**
 * All the middleware functions related to admin users
 */
import express from 'express';
import ApiError from '../util/apiError.ts';
import { IUser } from '../models/user.model.ts';

/**
 * Middleware to check if a user has the admin or superadmin role.
 * Creates an {@link ApiError} to pass on to error handlers if not.
 */
const isAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const user: IUser | null = req.user as IUser;
  if (!user) {
    next(ApiError.unauthorized('Not a valid user.'));
    return;
  }
  if (user.roles?.includes('admin') || user.roles?.includes('superadmin')) {
    next();
  } else {
    next(ApiError.unauthorized('Need admin status.'));
  }
};

/**
 * Middleware factory that checks if a user has ANY of the provided roles.
 * Creates an {@link ApiError} to pass on to error handlers if not.
 */
const hasRole =
  (...roles: string[]) =>
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const user: IUser | null = req.user as IUser;
    if (!user) {
      next(ApiError.unauthorized('Not a valid user.'));
      return;
    }
    const hasAny = roles.some((r) => user.roles?.includes(r));
    if (hasAny) {
      next();
    } else {
      next(ApiError.unauthorized('Insufficient role.'));
    }
  };

export { isAdmin, hasRole };
