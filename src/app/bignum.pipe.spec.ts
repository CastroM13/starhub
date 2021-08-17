import { BignumPipe } from './bignum.pipe';

describe('BignumPipe', () => {
  it('create an instance', () => {
    const pipe = new BignumPipe();
    expect(pipe).toBeTruthy();
  });
});
