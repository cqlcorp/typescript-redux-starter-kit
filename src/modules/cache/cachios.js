import extendPrototype from './extendPrototype';
import SimpleCache from './cache';

const hash = require('object-hash');

function defaultCacheIdentifer(config) {
  return {
    method: config.method,
    url: config.url,
    params: config.params,    
  };
}

function defaultResponseCopier(response) {
  return response;
}

function Cachios(axiosInstance) {
  this.axiosInstance = axiosInstance;
  this.cache = new SimpleCache();

  this.getCacheIdentifier = defaultCacheIdentifer;
  this.getResponseCopy = defaultResponseCopier;
}

Cachios.prototype.getCacheKey = function getCacheKey(config) {
  return hash(this.getCacheIdentifier(config));
};

Cachios.prototype.getCachedValue = function getCachedValue(cacheKey) {
  return this.cache.get(cacheKey);
};

Cachios.prototype.setCachedValue = function setCachedValue(cacheKey, value) {
  return this.cache.set(cacheKey, value);
};

Cachios.prototype.request = function request(config) {  
  
  const cacheKey = this.getCacheKey(config);
  const cachedValue = this.getCachedValue(cacheKey);

  let promise;

  if (!cachedValue) {
    promise = this.axiosInstance.request(config).then( resp => {      
      this.setCachedValue(cacheKey, this.getResponseCopy(resp));
      return resp;
    });
  } else {
    promise = Promise.resolve(cachedValue);
  }

  return promise;
};

extendPrototype(Cachios.prototype);

export default Cachios;
