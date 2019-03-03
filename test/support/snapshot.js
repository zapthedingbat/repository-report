const chai = require('chai');
const fs = require('fs');

module.exports = exports = function snapshot(filePath, data) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, data);
    return true;
  }
  const snapshotData = fs.readFileSync(filePath, 'utf8');
  return chai.expect(snapshotData).to.eql(data);
}
