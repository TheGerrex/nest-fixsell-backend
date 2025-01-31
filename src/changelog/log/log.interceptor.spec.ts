import { LogInterceptor } from './log.interceptor';
import { LogService } from './log.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LogInterceptor', () => {
  let interceptor: LogInterceptor;
  let logService: LogService;

  beforeEach(() => {
    logService = {
      logAction: jest.fn(),
      getAllLogs: jest.fn(),
      getLogById: jest.fn(),
    } as any;

    interceptor = new LogInterceptor(logService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log action with userName on relevant HTTP methods', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user-id', name: 'John Doe' },
          method: 'DELETE',
          originalUrl: '/printers/10',
          ip: '127.0.0.1',
          params: { id: '10' },
          body: {},
        }),
      }),
    } as ExecutionContext;

    const next = {
      handle: () => of({}),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe();

    expect(logService.logAction).toHaveBeenCalledWith(
      'user-id',
      'John Doe', // Expect userName
      'delete',
      'printers',
      '10',
      {},
      'DELETE',
      '/printers/10',
      '127.0.0.1',
    );
  });

  it('should not log action for unknown methods', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'user-id', name: 'John Doe' },
          method: 'OPTIONS',
          originalUrl: '/printers',
          ip: '127.0.0.1',
          params: {},
          body: {},
        }),
      }),
    } as ExecutionContext;

    const next = {
      handle: () => of({}),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe();

    expect(logService.logAction).not.toHaveBeenCalled();
  });

  it('should default to "anonymous" if user is not present', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: null,
          method: 'POST',
          originalUrl: '/printers',
          ip: '127.0.0.1',
          params: {},
          body: { name: 'New Printer' },
        }),
      }),
    } as ExecutionContext;

    const next = {
      handle: () => of({}),
    } as CallHandler;

    interceptor.intercept(context, next).subscribe();

    expect(logService.logAction).toHaveBeenCalledWith(
      'anonymous',
      'anonymous', // Expect userName as 'anonymous'
      'create',
      'printers',
      'unknown',
      { name: 'New Printer' },
      'POST',
      '/printers',
      '127.0.0.1',
    );
  });
});
