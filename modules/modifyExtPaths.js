module.exports = async function (paths, ext) {
  if (ext.toLowerCase() === 'none') {
    ext = '';
  }
  return paths.map(function (path) {
    let modifiedPath = path.replace(/(\.\w+)/g, ext);
    if (modifiedPath.length > 0) {
      if (modifiedPath != path) {
        return modifiedPath;
      } else {
        if (!modifiedPath.includes(ext)) {
          return modifiedPath + ext;
        } else {
          return modifiedPath;
        }
      }

    } else {
      return path;
    }

  });

}