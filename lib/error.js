var error = module.exports = function(error, value, examples) {
  console.log();
  console.log((error + ': ').bold.red + value);
  if (examples) {
    console.log('Example(s): '.bold.white + examples);
  }
  console.log();
  process.exit();
};