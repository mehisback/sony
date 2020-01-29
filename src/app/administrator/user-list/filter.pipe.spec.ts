import { FilterPipeUser } from './filter.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPipeUser();
    expect(pipe).toBeTruthy();
  });
});
