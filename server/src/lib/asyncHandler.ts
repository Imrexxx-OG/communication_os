import type { NextFunction, Request, Response } from "express";

// Express 4 does not catch errors thrown (or rejected) inside an async
// route handler on its own -- without this wrapper, a failed await inside
// a route becomes an unhandled promise rejection, and Node kills the whole
// process instead of returning a 500. Wrapping every handler with this
// forwards the error to next(err), which routes it to the centralized
// error handler in index.ts instead of crashing the server.
export function asyncHandler<T extends (req: Request, res: Response, next: NextFunction) => Promise<any>>(
  fn: T
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
