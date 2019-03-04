module.exports = exports = function json(writer, appId, owner) {
  return async function generate(results) {
    const write = writer(owner);
    await write(JSON.stringify({ appId, owner, results }));
  };
};
