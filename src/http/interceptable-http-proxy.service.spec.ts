import { TestBed, inject } from '@angular/core/testing';
import {
  InterceptableHttpProxyService,
  InterceptableHttpProxyProviders,
  InterceptableHttpProxyNoOverrideProviders
} from './interceptable-http-proxy.service';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { HttpInterceptorService } from './http-interceptor.service';
import { Observable } from 'rxjs';

describe('Service: InterceptableHttpProxy', () => {
  let service: InterceptableHttpProxyService;
  const HttpMock = {testMethod: null}, HttpInterceptorServiceMock = {_interceptRequest: null, _interceptResponse: null};

  beforeEach(() => {
    HttpMock.testMethod = jasmine.createSpy('testMethod');
    HttpInterceptorServiceMock._interceptRequest = jasmine.createSpy('_interceptRequest');
    HttpInterceptorServiceMock._interceptResponse = jasmine.createSpy('_interceptResponse');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {provide: Http, useValue: HttpMock},
        {provide: HttpInterceptorService, useValue: HttpInterceptorServiceMock},
        InterceptableHttpProxyService
      ]
    });
  });

  beforeEach(inject([InterceptableHttpProxyService], s => service = s));

  it('should exist', () => expect(service).toBeTruthy());

  describe('get() method', () => {
    it('should return receiver from args', () => expect(service.get(null, null, 'target')).toBe('target'));
  });

  describe('apply() method', () => {
    it('should call _interceptRequest() on service and method on Http and _interceptResponse on service', () => {
      HttpMock.testMethod.and.returnValue('response');
      HttpInterceptorServiceMock._interceptRequest.and.returnValue(['url modified']);
      HttpInterceptorServiceMock._interceptResponse.and.returnValue('response modified');

      service.get(null, 'testMethod', null);
      const res = service.apply(null, null, ['url']);

      expect(HttpInterceptorServiceMock._interceptRequest).toHaveBeenCalledWith('url', 'testMethod', ['url']);
      expect(HttpMock.testMethod).toHaveBeenCalledWith('url modified');
      expect(HttpInterceptorServiceMock._interceptResponse).toHaveBeenCalledWith('url modified', 'testMethod', 'response');
      expect(res).toBe('response modified');
    });

    it('should call _interceptRequest() and cancel request if it returns false and return empty observable', () => {
      HttpInterceptorServiceMock._interceptRequest.and.returnValue(false);

      service.get(null, 'testMethod', null);
      const res = service.apply(null, null, ['url']);

      expect(HttpInterceptorServiceMock._interceptRequest).toHaveBeenCalledWith('url', 'testMethod', ['url']);
      expect(HttpMock.testMethod).not.toHaveBeenCalled();
      expect(res).toEqual(Observable.empty());
    });

    it('should call _interceptRequest() with Request and correctly extract url', () => {
      HttpInterceptorServiceMock._interceptRequest.and.returnValue(false);

      service.get(null, 'testMethod', null);
      service.apply(null, null, [{url: 'url'}]);

      expect(HttpInterceptorServiceMock._interceptRequest).toHaveBeenCalledWith('url', 'testMethod', [{url: 'url'}]);
    });
  });
});

describe('Provider factory', () => {
  beforeEach(() => spyOn(window, 'Proxy').and.returnValue(() => 'proxy'));

  describe('InterceptableHttpProxyProviders', () => {
    const factory: (backend, options, interceptor) => any = (<any>InterceptableHttpProxyProviders[0]).useFactory;

    it('should wrap HttpInterceptorService into Proxy and return it', () => {
      const proxy = factory(XHRBackend, RequestOptions, {});
      expect(proxy).toEqual(jasmine.any(Function));
      expect(proxy()).toBe('proxy');
    });
  });

  describe('InterceptableHttpProxyNoOverrideProviders', () => {
    const factory: (http, interceptor) => any = (<any>InterceptableHttpProxyNoOverrideProviders[0]).useFactory;

    it('should wrap HttpInterceptorService into Proxy and return it', () => {
      const proxy = factory(Http, {});
      expect(proxy).toEqual(jasmine.any(Function));
      expect(proxy()).toBe('proxy');
    });
  });
});
