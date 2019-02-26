const chai = require('chai');
const readmeStructure = require('./readme-length');

describe('Readme length', function () {
  describe('description', function () {
    it('should have a description', function () {
      chai.expect(readmeStructure.description).to.equal('Readme file should provide helpful information about the most important aspects of the project.');
    });
  });

  describe('audit', function () {
    it('should return a score of 0 when readme contains less than 50 words', async function () {
      const testFileContents = `this is too short`;
      
      const result = await readmeStructure.audit({
        filePaths: ['readme.md']
      }, { readFile: () => testFileContents});

      chai.expect(result).to.eql({ score: 0 });
    });

    it('should return a score of 1 when readme contains 50 or more words', async function () {
      const testFileContents = `
      A long readme with helpful information Lorem ipsum dolor sit amet, consectetur 
      adipiscing elit. Proin porta ipsum vel purus vestibulum volutpat. Etiam ut 
      convallis felis. Praesent arcu tortor, dignissim non sem id, accumsan ultrices
      elit. Maecenas semper massa at fringilla tristique. Integer efficitur
      ullamcorper mi non rutrum. Suspendisse ut congue orci. Cras porta quam nec est
      feugiat sagittis. Nullam sodales luctus velit ac viverra. Cras condimentum
      tortor sit amet est luctus pulvinar. Morbi ipsum magna, vestibulum eu metus nec,
      porttitor rhoncus ante. Mauris tristique lacus nec tincidunt congue. Morbi sed
      consectetur nisi. Fusce ut neque lorem. Nam nec luctus justo.

      Suspendisse convallis eu augue vel sollicitudin. Maecenas at fermentum ipsum.
      Donec non velit nibh. Phasellus ac turpis nunc. Etiam ut fringilla sapien, ut
      porta ipsum. Vivamus sit amet semper libero. Phasellus viverra odio et magna
      pretium, sit amet consequat odio volutpat. Phasellus vel sodales dolor.
      Suspendisse pharetra dui a elementum vestibulum. Quisque non ante ac quam
      pharetra lobortis. Ut luctus interdum convallis. Ut sit amet orci aliquet nunc
      ullamcorper venenatis et et nisi. Nam ultrices varius aliquam. Nullam sagittis
      tristique velit nec rutrum. Sed gravida mauris a turpis bibendum auctor.
      
      Sed porttitor, enim scelerisque efficitur tristique, risus purus aliquam nunc,
      hendrerit pretium justo metus sit amet turpis. Etiam fermentum eros laoreet,
      consequat ante eget, mollis turpis. Praesent pharetra ligula sed ex accumsan
      luctus. Curabitur sed venenatis tellus. Ut metus est, porttitor vel odio ac,
      fringilla pretium nunc. Phasellus euismod nisi in elit eleifend, nec eleifend
      massa lacinia. Phasellus elit sem, consequat non condimentum non, maximus eu
      elit. Fusce suscipit, libero et euismod viverra, diam magna auctor urna, at
      mollis odio ante et ligula. Vivamus eget ultricies massa. Nulla vehicula ante
      fermentum pulvinar sollicitudin. Integer malesuada lobortis eros in luctus.
      Suspendisse quis quam dictum, lacinia massa vitae, consectetur libero.`;
      
      const result = await readmeStructure.audit({
        filePaths: ['readme.md']
      }, { readFile: () => testFileContents});

      chai.expect(result).to.eql({ score: 1 });
    });
  });
});
