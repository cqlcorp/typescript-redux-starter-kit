// boilerplate helper method code inspired by axios/lib/core/Axios.js ;)

//only caching get requests for now
//if more http methods require cachine, add them to the following arrays
const datalessMethods = [    
    'get'    
  ];
  
  const dataMethods = [
    // 'post',
    // 'put',
    // 'patch',
  ];
  
  function extendPrototype(cachiosPrototype) {
    datalessMethods.forEach((method) => {
      cachiosPrototype[method] = function aliasDatalessMethod(url, config) {
        const baseRequest = {
          url,
          method,
        };
  
        const mergedRequest = Object.assign(config || {}, baseRequest);
  
        return this.request(mergedRequest);
      };
    });
  
    dataMethods.forEach((method) => {
      cachiosPrototype[method] = function aliasDataMethod(url, data, config) {
        const baseRequest = {
          url,
          method,
          data,
        };
  
        const mergedRequest = Object.assign(config || {}, baseRequest);
  
        return this.request(mergedRequest);
      };
    });
  }
  
  export default extendPrototype;
  