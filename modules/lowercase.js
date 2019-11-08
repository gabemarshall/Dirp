module.exports = async function (paths, ext) {

  return paths.map(function (path) {
    return path.toLowerCase();
  });

}