import React from 'react';
import {
  spacing,
  Label,
  Description,
  Link,
  css,
} from '@mongodb-js/compass-components';
import type ConnectionStringUrl from 'mongodb-connection-string-url';

import type { UpdateConnectionFormField } from '../../../hooks/use-connect-form';

import UrlOptionsTable from './url-options-table';

const urlOptionsContainerStyles = css({
  marginTop: spacing[3],
  width: '70%',
});

function UrlOptions({
  updateConnectionFormField,
  connectionStringUrl,
}: {
  updateConnectionFormField: UpdateConnectionFormField;
  connectionStringUrl: ConnectionStringUrl;
}): React.ReactElement {
  return (
    <div className={urlOptionsContainerStyles} data-testid="url-options">
      <Label htmlFor={''}>Url Options</Label>
      <Description>
        Add additional MongoDB url options to customize your connection.&nbsp;
        <Link
          href={
            'https://docs.mongodb.com/manual/reference/connection-string/#connection-string-options'
          }
        >
          Learn More
        </Link>
      </Description>
      <UrlOptionsTable
        connectionStringUrl={connectionStringUrl}
        updateConnectionFormField={updateConnectionFormField}
      />
    </div>
  );
}

export default UrlOptions;
