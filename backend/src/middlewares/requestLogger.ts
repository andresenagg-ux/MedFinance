import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const contentLengthHeader = res.getHeader('content-length');
    const contentLength = Array.isArray(contentLengthHeader)
      ? contentLengthHeader.join(',')
      : (contentLengthHeader ?? undefined);

    logger.info('HTTP request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTimeMs: Number(durationMs.toFixed(3)),
      contentLength,
      userAgent: req.get('user-agent') ?? undefined,
    });
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      logger.warn('HTTP request closed before completion', {
        method: req.method,
        path: req.originalUrl,
      });
    }
  });

  next();
}
