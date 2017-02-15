export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/ng-http-interceptor.umd.js',
    format: 'umd',
    moduleName: 'httpInterceptor',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/http': 'ng.http',
        'rxjs/Observable': 'Rx',
        'rxjs/add/observable/of': 'Rx.Observable',
        'rxjs/add/observable/empty': 'Rx.Observable',
        'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    },
    external: [
        '@angular/core',
        '@angular/http',
        'rxjs/Observable',
        'rxjs/add/observable/of',
        'rxjs/add/observable/empty',
        'rxjs/add/operator/switchMap',
        'rxjs/add/operator/mergeMap',
    ]
}
