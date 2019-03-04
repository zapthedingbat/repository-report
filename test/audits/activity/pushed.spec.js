const chai = require("chai");
const pushed = require("../../../src/audits/activity/pushed");

describe("Pushed", function() {
  describe("name", function() {
    it("should have a name", function() {
      chai.expect(pushed.name).to.equal("Recent commits");
    });
  });

  describe("description", function() {
    it("should have a description", function() {
      chai
        .expect(pushed.description)
        .to.equal("The project should continue to be maintained.");
    });
  });

  describe("audit", function() {
    it("should return a score of 1 when code has been pushed recently", async function() {
      const result = await pushed.audit(
        {
          repository: { pushed_at: new Date() }
        },
        {}
      );

      chai.expect(result).to.eql({ score: 1 });
    });
  });

  describe("audit", function() {
    it("should return a score of 0 when no code has been pushed for ages", async function() {
      const d = new Date();
      d.setDate(d.getDate() - 365);

      const result = await pushed.audit(
        {
          repository: { pushed_at: d.toISOString() }
        },
        {}
      );

      chai.expect(result).to.eql({ score: 0 });
    });
  });

  describe("audit", function() {
    it("should return a score based on a reasonable window of time", async function() {
      const d = new Date();
      d.setDate(d.getDate() - 37);

      const result = await pushed.audit(
        {
          repository: { pushed_at: d.toISOString() }
        },
        {}
      );

      chai.expect(result).to.eql({ score: 0.5 });
    });
  });
});
