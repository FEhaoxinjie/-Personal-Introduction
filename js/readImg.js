let fs = require('fs'),
    bgImgList = fs.readdirSync('../Images/bg'),
    obstacleImgList = fs.readdirSync('../Images/obstacle'),
    personImgList = fs.readdirSync('../Images/person');
    bgImgList = bgImgList.map(function (item) {
        return `Images/bg/${item}`
    });
obstacleImgList = obstacleImgList.map(function (item) {
    return `Images/obstacle/${item}`
});
personImgList = personImgList.map(function (item) {
    return `Images/person/${item}`
});
console.log(bgImgList);
console.log(obstacleImgList);
console.log(personImgList);