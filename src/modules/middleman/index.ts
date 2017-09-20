/**
 * Middleman
 * ---------------------
 * A tiny lib for creating extendable providers and middleware
 */

export type Middleware<Provider> = (provider: Provider) => Provider;

/**
 * Add custom functionality to any provider that is an object.
 *
 * @param provider A provider to extend. Must be an object.
 */
export function extendProvider<Provider extends Object>(provider: Provider) {
    return {
        /**
         * Apply middleware to your provider.
         *
         * @param middleware A function that takes an instance of the provider, and returns a modified instance.
         */
        applyMiddleware(...middleware: Middleware<Provider>[]): Provider {
            return middleware.reduce((newProvider, createProvider) => createProvider(newProvider), Object.assign({}, provider));
        }
    }
}
