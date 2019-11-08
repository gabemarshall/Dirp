module.exports = function (srcName) {
  srcName = srcName.split(':')[0]
  let altSrcName = srcName.replace(/\./g, '-')
  let customResultArr = [
    srcName + '.tar',
    srcName + '.tar.gz',
    srcName + '.gz',
    srcName + '.zip',
    srcName + '.bz2',
    srcName + '.tar.bz2',
    altSrcName + '.tar',
    altSrcName + '.tar.gz',
    altSrcName + '.gz',
    altSrcName + '.zip',
    altSrcName + '.bz2',
    altSrcName + '.tar.bz2',
    altSrcName
  ];

  return customResultArr;
}