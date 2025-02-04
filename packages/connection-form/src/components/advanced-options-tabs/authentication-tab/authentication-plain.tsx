import React from 'react';
import { TextInput } from '@mongodb-js/compass-components';

import type ConnectionStringUrl from 'mongodb-connection-string-url';
import type { UpdateConnectionFormField } from '../../../hooks/use-connect-form';
import FormFieldContainer from '../../form-field-container';
import type { ConnectionFormError } from '../../../utils/validation';
import { errorMessageByFieldName } from '../../../utils/validation';
import {
  getConnectionStringPassword,
  getConnectionStringUsername,
} from '../../../utils/connection-string-helpers';

export const PLAIN_USERNAME_LABEL = 'Username';
export const PLAIN_PASSWORD_LABEL = 'Password';

function AuthenticationPlain({
  connectionStringUrl,
  updateConnectionFormField,
  errors,
}: {
  connectionStringUrl: ConnectionStringUrl;
  errors: ConnectionFormError[];
  updateConnectionFormField: UpdateConnectionFormField;
}): React.ReactElement {
  const username = getConnectionStringUsername(connectionStringUrl);
  const password = getConnectionStringPassword(connectionStringUrl);
  const usernameError = errorMessageByFieldName(errors, 'username');
  const passwordError = errorMessageByFieldName(errors, 'password');

  return (
    <>
      <FormFieldContainer>
        <TextInput
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => {
            updateConnectionFormField({
              type: 'update-username',
              username: value,
            });
          }}
          label={PLAIN_USERNAME_LABEL}
          value={username || ''}
          errorMessage={usernameError}
          state={usernameError ? 'error' : undefined}
        />
      </FormFieldContainer>
      <FormFieldContainer>
        <TextInput
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => {
            updateConnectionFormField({
              type: 'update-password',
              password: value,
            });
          }}
          label={PLAIN_PASSWORD_LABEL}
          type="password"
          value={password || ''}
          errorMessage={passwordError}
          state={passwordError ? 'error' : undefined}
        />
      </FormFieldContainer>
    </>
  );
}

export default AuthenticationPlain;
