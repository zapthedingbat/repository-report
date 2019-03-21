const sinon = require('sinon');
const createRenderer = require('../../src/report/renderer');

describe('Report renderer', function () {
  it('should render the report to the writer', async function () {
    const mockResponse = 'test response';
    const mockRenderer = sinon.stub().returns(mockResponse);
    const renderers = { "test renderer": mockRenderer };
    const render = createRenderer(renderers);
    const group = { name:'test name' };
    const report = {};
    const writer = sinon.stub();

    await render(group, report, writer);

    sinon.assert.calledWithExactly(writer, 'test name', 'test response', 'test renderer');
    sinon.assert.calledWith(mockRenderer, group, report);
  });
});
