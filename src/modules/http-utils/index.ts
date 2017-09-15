//Utility function that converts standard urls to use the .json url
//Ergast requires to recieve a json response
export const jsonURL = (req: string): string => {
    var url = '';
    if(req.indexOf('?') !== -1) {
        let splitUrl = req.split('?')
        url = `${splitUrl[0]}.json?${splitUrl[1]}`;
    } else {
        url = `${req}.json`;
    }
    return url;
}
