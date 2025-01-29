import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from './log.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = user?.id || 'anonymous';
    const userName = user?.name || 'anonymous'; // Extract userName
    const method = request.method;
    const url = request.originalUrl || request.url;
    const ip = request.ip || request.connection.remoteAddress || 'unknown';
    const entityId = request.params.id || 'unknown';
    const changes = { ...request.body };

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token'];
    sensitiveFields.forEach((field) => {
      if (changes[field]) {
        delete changes[field];
      }
    });

    const actionMap = {
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
      GET: 'read',
    };

    const action = actionMap[method] || 'unknown';

    // Determine the entity based on the URL or other logic
    const pathSegments = url.split('/').filter((segment) => segment.length > 0);
    const entity = pathSegments[0] || 'unknown';

    return next.handle().pipe(
      tap(() => {
        // Log only if the action is relevant
        if (action !== 'unknown' && action !== 'read') {
          this.logService.logAction(
            userId,
            userName, // Pass userName
            action,
            entity,
            entityId,
            changes,
            method,
            url,
            ip,
          );
        }
      }),
    );
  }
}
