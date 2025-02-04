import type { ChangeEvent } from 'react';
import React, { useCallback } from 'react';
import { TextInput, FileInput } from '@mongodb-js/compass-components';
import type { SSHConnectionOptions } from '../../../utils/connection-ssh-handler';
import FormFieldContainer from '../../form-field-container';
import type { ConnectionFormError } from '../../../utils/validation';
import {
  errorMessageByFieldName,
  fieldNameHasError,
} from '../../../utils/validation';
import type { UpdateConnectionFormField } from '../../../hooks/use-connect-form';

type IdentityFormKeys = keyof SSHConnectionOptions;

function SshTunnelIdentity({
  sshTunnelOptions,
  updateConnectionFormField,
  errors,
}: {
  sshTunnelOptions?: SSHConnectionOptions;
  updateConnectionFormField: UpdateConnectionFormField;
  errors: ConnectionFormError[];
}): React.ReactElement {
  const formFieldChanged = useCallback(
    (key: IdentityFormKeys, value: string) => {
      return updateConnectionFormField({
        type: 'update-ssh-options',
        key,
        value,
      });
    },
    [updateConnectionFormField]
  );

  const fields = [
    {
      name: 'host',
      label: 'SSH Hostname',
      type: 'text',
      optional: false,
      value: sshTunnelOptions?.host,
      errorMessage: errorMessageByFieldName(errors, 'sshHostname'),
      state: fieldNameHasError(errors, 'sshHostname') ? 'error' : 'none',
    },
    {
      name: 'port',
      label: 'SSH Port',
      type: 'number',
      optional: false,
      value: sshTunnelOptions?.port?.toString(),
      errorMessage: '',
      state: 'none',
    },
    {
      name: 'username',
      label: 'SSH Username',
      type: 'text',
      optional: false,
      value: sshTunnelOptions?.username,
      errorMessage: errorMessageByFieldName(errors, 'sshUsername'),
      state: fieldNameHasError(errors, 'sshUsername') ? 'error' : 'none',
    },
    {
      name: 'identityKeyFile',
      label: 'SSH Identity File',
      type: 'file',
      errorMessage: errorMessageByFieldName(errors, 'sshIdentityKeyFile'),
      state: fieldNameHasError(errors, 'sshIdentityKeyFile') ? 'error' : 'none',
      value:
        sshTunnelOptions?.identityKeyFile && sshTunnelOptions.identityKeyFile
          ? [sshTunnelOptions.identityKeyFile]
          : undefined,
    },
    {
      name: 'identityKeyPassphrase',
      label: 'SSH Passphrase',
      type: 'password',
      optional: true,
      value: sshTunnelOptions?.identityKeyPassphrase,
      errorMessage: undefined,
      state: 'none',
    },
  ];

  return (
    <>
      {fields.map(
        ({ name, label, type, optional, value, errorMessage, state }) => {
          if (type === 'file') {
            return (
              <FormFieldContainer key={name}>
                <FileInput
                  id={name}
                  dataTestId={name}
                  onChange={(files: string[]) => {
                    formFieldChanged(name as IdentityFormKeys, files[0]);
                  }}
                  label={label}
                  error={Boolean(errorMessage)}
                  errorMessage={errorMessage}
                  values={value as string[] | undefined}
                  description={'Learn More'}
                  link={'https://mongodb.com'}
                />
              </FormFieldContainer>
            );
          }
          return (
            <FormFieldContainer key={name}>
              <TextInput
                onChange={({
                  target: { value },
                }: ChangeEvent<HTMLInputElement>) => {
                  formFieldChanged(name as IdentityFormKeys, value);
                }}
                name={name}
                data-testid={name}
                label={label}
                type={type}
                optional={optional}
                value={value as string | undefined}
                errorMessage={errorMessage}
                state={state as 'error' | 'none'}
                spellCheck={false}
              />
            </FormFieldContainer>
          );
        }
      )}
    </>
  );
}

export default SshTunnelIdentity;
