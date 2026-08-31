import type { Request, Response, NextFunction } from "express";

export function requireUser(request: Request, response: Response, next: NextFunction) {
  const userId = request.header("x-dev-user") ?? "demo-user";
  response.locals.user = { id: userId, permissions: ["*"] };
  next();
}

export function requirePermission(permission: string) {
  return (_request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user;
    if (!user?.permissions?.includes("*") && !user?.permissions?.includes(permission)) {
      response.status(403).json({ message: "You do not have permission to perform this action." });
      return;
    }
    next();
  };
}
