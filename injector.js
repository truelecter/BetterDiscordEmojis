(function() {
    // https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
    const getContent = function(host, path, isSecure) {
        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const lib = isSecure ? require('https') : require('http');

            const options = {
                hostname: host,
                path: path,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
                }
            };

            const request = lib.get(options, (response) => {
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(body.join('')));
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        })
    };

    // Add custom javascript to execute
    const addJS = function(customJS) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = customJS;
        document.head.appendChild(script);
    };

    const loadScripts = function() {
        // Skip loading if already loaded
        if (window.better_emojis && window.better_emojis.loaded) {
            return;
        }

        window.better_emojis = {};

        // Get information about latest commit
        getContent("api.github.com", "/repos/TrueLecter/BetterDiscordEmojis/git/refs/heads/master", true)
            .then((json) => {
                const commitId = JSON.parse(json).object.sha;
                // Get jquery from latest github commit
                getContent("raw.githubusercontent.com", "/TrueLecter/BetterDiscordEmojis/" + commitId + "/jquery.js", true)
                    .then((js) => {
                        // Add jquery code to page if not done yet
                        if (!window.better_emojis.jquery) {
                            addJS(js);
                            window.better_emojis.jquery = true;
                        }

                        // Get main script from latest commit
                        getContent("raw.githubusercontent.com", "/TrueLecter/BetterDiscordEmojis/" + commitId + "/better-emojis.js", true)
                            .then((js) => {
                                // Add main script if not done yet
                                if (!window.better_emojis.be) {
                                    addJS(js);
                                    window.better_emojis.be = true;
                                }
                                window.better_emojis.loaded = true;
                            })
                            .catch((err) => {
                                console.log("Error loading Better Emojis");
                                console.log(err);
                                console.log("Retrying in 5 seconds...");
                                setTimeout(loadScripts, 5000);
                            })
                            // End Better Emojis loader promise
                    })
                    .catch((err) => {
                        console.log("Error loading jQuery");
                        console.log(err);
                        console.log("Retrying in 5 seconds...");
                        setTimeout(loadScripts, 5000);
                    })
                    // End jQuery loader promise
            })
            .catch((err) => {
                console.log("Error getting commit info");
                console.log(err);
                console.log("Retrying in 5 seconds...");
                setTimeout(loadScripts, 5000);
            })
            // End github info getter promise;
    }

    loadScripts();

}())
