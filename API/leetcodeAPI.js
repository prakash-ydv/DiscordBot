
const leetcodeDetails = async(username) => {
    const url = `https://leetcode-api-red.vercel.app/api/user/${username}`
    const details = await fetch(url).then(response => response.json())
    return details
}

module.exports = {leetcodeDetails}

