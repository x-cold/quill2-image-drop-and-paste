import mylib from '../src';

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('mylib is instantiable', () => {
    expect(mylib).toBeInstanceOf(Object);
  });
});
