import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AdvancedOptionsTabs from './advanced-options-tabs';

const testUrl = 'mongodb+srv://0ranges:p!neapp1es@localhost/?ssl=true';

describe('AdvancedOptionsTabs Component', function () {
  let updateConnectionFormFieldSpy: sinon.SinonSpy;

  beforeEach(function () {
    updateConnectionFormFieldSpy = sinon.spy();
  });

  afterEach(cleanup);

  it('should render all of the tabs', function () {
    render(
      <AdvancedOptionsTabs
        connectionOptions={{
          connectionString: testUrl,
        }}
        errors={[]}
        updateConnectionFormField={updateConnectionFormFieldSpy}
      />
    );

    [
      'General',
      'Authentication',
      'TLS/SSL',
      'Proxy/SSH Tunnel',
      'Advanced',
    ].forEach((tabName) => {
      expect(screen.getByText(tabName)).to.be.visible;
    });
  });

  it('should have the tab with an error have the error', function () {
    render(
      <AdvancedOptionsTabs
        connectionOptions={{
          connectionString: testUrl,
        }}
        errors={[
          {
            fieldTab: 'advanced',
            fieldName: 'connectionString',
            message: 'oranges',
          },
        ]}
        updateConnectionFormField={updateConnectionFormFieldSpy}
      />
    );

    ['General', 'Authentication', 'TLS/SSL', 'Proxy/SSH Tunnel'].forEach(
      (tabName) => {
        const tab = screen.getAllByTestId(`${tabName}-tab`)[0];
        expect(tab.getAttribute('data-has-error')).to.equal('false');
      }
    );
    expect(
      screen.getAllByTestId('Advanced-tab')[0].getAttribute('data-has-error')
    ).to.equal('true');
  });

  it('should have an aria-label for the tab that shows the error count', function () {
    render(
      <AdvancedOptionsTabs
        connectionOptions={{
          connectionString: testUrl,
        }}
        errors={[
          {
            fieldTab: 'tls',
            fieldName: 'tls',
            message: 'oranges',
          },
          {
            fieldTab: 'tls',
            fieldName: 'tlsCertificateKeyFile',
            message: 'peaches',
          },
        ]}
        updateConnectionFormField={updateConnectionFormFieldSpy}
      />
    );

    ['General', 'Authentication', 'Proxy/SSH Tunnel', 'Advanced'].forEach(
      (tabName) => {
        const tab = screen.getAllByTestId(`${tabName}-tab`)[0];
        expect(tab.getAttribute('aria-label')).to.equal(tabName);
      }
    );
    expect(
      screen.getAllByTestId('TLS/SSL-tab')[0].getAttribute('aria-label')
    ).to.equal('TLS/SSL (2 errors)');
  });
});
