import { getStateBatch } from '../support/support-forms';

describe('Support Forms: State batching', () => {
  it('covers every state once regardless of dropdown order', () => {
    const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI']
      .map((value) => ({ value }));
    const batches = Array.from({ length: 5 }, (_, batch) => getStateBatch(states, batch, 5));
    const selected = batches.flat().map((state) => state.value);

    expect(new Set(selected).size).to.equal(states.length);
    expect(selected.sort()).to.deep.equal(states.map((state) => state.value).sort());
    expect(getStateBatch([...states].reverse(), 2, 5)).to.deep.equal(batches[2]);
  });

  it('allows batches with no states', () => {
    expect(getStateBatch([{ value: 'NE' }], 1, 5)).to.deep.equal([]);
  });
});