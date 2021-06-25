const Cache = require("@11ty/eleventy-cache-assets");
function shortenLargeNumber(num, digits) {
    const units = ['k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
    let decimal;
  
    // eslint-disable-next-line no-plusplus
    for(let i=units.length-1; i>=0; i--) {
        decimal = 1000 ** (i+1);
  
        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }
    return num;
  }

const _fetchGithubRepo = ({user, repository}) => {
    const url = `https://api.github.com/repos/${user}/${repository}`;
    return Cache(url, {
        duration: "1d", // save for 1 day
        type: "json"    // we’ll parse JSON for you
    });
};
module.exports = {

    async fetchGithubInfo({user, repository, stars = false} = {}) {
       if(!user || !repository) {
           return {};
       }
       const repo = await _fetchGithubRepo({user, repository});
       return {
           url: repo.html_url,
           stars: stars ? shortenLargeNumber(repo.stargazers_count) : undefined
       }
    },
    async fetchNPMWeeklyDownload ({package} = {}) {
        if(package) {
            return;
        }
        const url = `https://api.npmjs.org/downloads/point/last-week/${package}`;
        const downloadsData = await Cache(url, {
            duration: "1d", // save for 1 day
            type: "json"    // we’ll parse JSON for you
        });
        return shortenLargeNumber(downloadsData.downloads)
    }
}