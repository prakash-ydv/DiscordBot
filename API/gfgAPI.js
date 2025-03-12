
const gfgUserDetails = async(username) => {
    const url = `https://geeks-for-geeks-api.vercel.app/${username}`
    const details = await fetch(url).then(response => response.json())
    return details
}

module.exports = {gfgUserDetails}

