module.exports = async function (paths, ext) {
  if (ext.toLowerCase() === 'none') {
    ext = '';
  }
  return paths.map(function (path) {
    let modifiedPath = path.replace(/(\.\w+)/g, ext);
    if (modifiedPath.length > 0) {
      return modifiedPath;
    } else {
      return path;
    }

  });

}