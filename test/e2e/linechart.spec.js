browser.ignoreSynchronization = true;

describe('Simple linechart', () => {
  it('should match the title', () => {
    browser.driver.get('http://localhost:9000/examples/simple_linechart.html');
    expect(browser.getTitle()).toEqual('Simple linechart');
  }); 
});