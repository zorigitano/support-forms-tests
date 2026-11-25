import { getMatchingStates, getPolicyholderRoles, getStateBatch } from '../support/support-forms';

describe('Support Forms: State selection', () => {
  const states = [
    { value: 'NE', label: 'Nebraska' },
    { value: 'IA', label: 'Iowa' },
    { value: 'CA', label: 'California' },
  ];

  it('selects one or more state names and values', () => {
    expect(getMatchingStates(states, 'Nebraska')).to.deep.equal([states[0]]);
    expect(getMatchingStates(states, 'NE, Iowa')).to.deep.equal(states.slice(0, 2));
    expect(getMatchingStates(states)).to.deep.equal(states);
  });

  it('rejects unknown and empty state entries', () => {
    expect(() => getMatchingStates(states, 'Nebraska, Unknown')).to.throw('Unknown state names or values: Unknown');
    expect(() => getMatchingStates(states, 'Nebraska, ')).to.throw('State names or values must not be empty');
  });
});

describe('Support Forms: Policyholder types', () => {
  it('selects one policyholder type or all types by default', () => {
    expect(getPolicyholderRoles('Beneficiary')).to.deep.equal(['a Beneficiary']);
    expect(getPolicyholderRoles()).to.deep.equal([
      'a Beneficiary',
      'an Individual Policyholder',
      'a Plan Administrator (Employer)',
      'a Plan Member (Employee)',
    ]);
    expect(getPolicyholderRoles('Unknown')).to.deep.equal([]);
  });
});

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