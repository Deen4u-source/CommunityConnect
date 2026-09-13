const React = require('react');
const { render, screen } = require('@testing-library/react-native');
const { StatusBadge } = require('../../src/components/StatusBadge');

describe('StatusBadge component', () => {
  it('renders a label and styling', () => {
    const { getByText } = render(React.createElement(StatusBadge, { label: 'Verified', tone: 'success' }));

    expect(getByText('Verified')).toBeTruthy();
  });

  it('supports a warning tone', () => {
    const { getByText } = render(React.createElement(StatusBadge, { label: 'Needs review', tone: 'warning' }));

    expect(getByText('Needs review')).toBeTruthy();
  });
});
