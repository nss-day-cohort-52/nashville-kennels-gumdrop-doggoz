//fetchIt takes parameters of a url, a method (default of "GET"), and a body (default of null)
export const fetchIt = (url, method = "GET", body = null) => {
    let options = {
        "method": method,
        "headers": {}
    }

    //evaluate the value of method, and execute the case it applies to.
    switch (method) {
        //if the method is POST, add the content-type property onto the headers property
        //this happens because there is no break line included in POST case, so it skips to the next case.
        case "POST":
        //if the method is PUT, add the content-type property onto the headers property
        //fall through
        case "PUT":
            options.headers = {
                "Content-Type": "application/json"
            }
            break;
        //if the method is anything else other than the above, do nothing (break).
        default:
            break;
    }

    //if a body parameter was entered, use it to add a body property onto the options object
    if (body !== null) {
        options.body = body
    }

    //function returns a fetch with the url and options arguments as parameters, parsed as javascript
    return fetch(url, options).then(r => r.json())
}

//the below function was created but not used. Appears to be a different way of simplifying fetches/repositories then fetchIt

export const request = {
    //this = some sort of global variable you can continually change the value of?
    init(url) {
        this.options = {}
        this.options.headers = {}
        this.url = url
        /* 
        {
            url: url,
            options: {
                headers: {}
            }
        }

        does not return. only used as a nested function
        */

    },

    get(url) {
        this.init(url)
        this.options.method = "GET"
        return this.send()
        /* 
        return fetch(url, options: {
            headers: {}
            method: "GET"
        }).then(res.json)
        */
    },

    post(url) {
        this.init(url)
        this.options.method = "POST"
        //square bracket notation instead of dot notation on object keys
        this.options.headers["Content-Type"] = "application/json"
        this.options.headers["Accept"] = "application/json"
        return this
        /* 
        return {
            url: url,
            options: {
                headers: {
                    "Content-Type" = "application/json"
                    "Accept" = "application/json"
                }
            method: "POST"
        }}
        */
    },

    put(url) {
        this.init(url)
        this.options.method = "PUT"
        this.options.headers = {
            "Content-Type": "application/json"
        }
        return this
        /* 
        return {
            url: url, 
            options: {
                headers: {
                    "Content-Type" = "application/json"
                }
            method: "PUT"
        }
        */
    },

    delete(url) {
        this.init(url)
        this.options.method = "DELETE"
        return this.send()
        /* 
        return fetch(url, options: {
            headers: {}
            method: "DELETE"
        }).then(res.json)
        */
    },

    withBody(body) {
        if (this.options.method === "POST" || this.options.method === "PUT") {
            this.options.body = JSON.stringify(body)
        }
        return this

        /* ex:
        return {
            url: url, 
            options: {
                headers: {
                    "Content-Type" = "application/json"
                },
                method: "PUT",
                body: JSON.stringify(body)
            }
        }
        */
    },

    async send() {
        const req = await fetch(this.url, this.options)
        const parsed = await req.json()
        return parsed
        /*
        used in the above functions. takes the url and options from value of "this" object
        to perform a fetch and parse as javascript
        */
    }
}