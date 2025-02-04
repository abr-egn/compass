import React, { useState } from 'react';
import type {
  ConnectionInfo,
  ConnectionFavoriteOptions,
} from 'mongodb-data-service';
import {
  Banner,
  BannerVariant,
  Card,
  Description,
  FavoriteIcon,
  Icon,
  IconButton,
  H3,
  spacing,
  css,
  uiColors,
} from '@mongodb-js/compass-components';
import { cloneDeep } from 'lodash';

import ConnectionStringInput from './connection-string-input';
import AdvancedConnectionOptions from './advanced-connection-options';
import ConnectFormActions from './connect-form-actions';
import { useConnectForm } from '../hooks/use-connect-form';
import { validateConnectionOptionsErrors } from '../utils/validation';
import SaveConnectionModal from './save-connection-modal';

const formContainerStyles = css({
  margin: 0,
  padding: 0,
  height: 'fit-content',
  width: 700,
  position: 'relative',
  display: 'inline-block',
});

const formCardStyles = css({
  margin: 0,
  height: 'fit-content',
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexFlow: 'column nowrap',
  maxHeight: '95vh',
});

const descriptionStyles = css({
  marginTop: spacing[2],
});

const formContentContainerStyles = css({
  padding: spacing[4],
  overflowY: 'auto',
  position: 'relative',
});

const formFooterStyles = css({
  marginTop: 'auto',
});

const favoriteButtonStyles = css({
  position: 'absolute',
  top: spacing[2],
  right: spacing[2],
  hover: {
    cursor: 'pointer',
  },
  width: spacing[7],
  height: spacing[7],
});

const favoriteButtonContentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const formHeaderStyles = css({
  button: {
    visibility: 'hidden',
  },
  '&:hover': {
    button: {
      visibility: 'visible',
    },
  },
});

const editFavoriteButtonStyles = css({
  verticalAlign: 'text-top',
});

const favoriteButtonLabelStyles = css({
  paddingTop: spacing[1],
  color: uiColors.black,
  fontWeight: 'bold',
  fontSize: 12,
});

function ConnectForm({
  initialConnectionInfo,
  connectionErrorMessage,
  onConnectClicked,
  // The connect form will not always used in an environment where
  // the connection info can be saved.
  onSaveConnectionClicked,
}: {
  initialConnectionInfo: ConnectionInfo;
  connectionErrorMessage?: string | null;
  onConnectClicked: (connectionInfo: ConnectionInfo) => void;
  onSaveConnectionClicked?: (connectionInfo: ConnectionInfo) => Promise<void>;
}): React.ReactElement {
  const [
    {
      enableEditingConnectionString,
      isDirty,
      errors,
      warnings,
      connectionOptions,
    },
    { setEnableEditingConnectionString, updateConnectionFormField, setErrors },
  ] = useConnectForm(initialConnectionInfo, connectionErrorMessage);

  const [showSaveConnectionModal, setShowSaveConnectionModal] = useState(false);

  const connectionStringInvalidError = errors.find(
    (error) => error.fieldName === 'connectionString'
  );

  return (
    <>
      <div className={formContainerStyles} data-testid="new-connect-form">
        <Card className={formCardStyles}>
          <div className={formContentContainerStyles}>
            <H3 className={formHeaderStyles}>
              {initialConnectionInfo.favorite?.name ?? 'New Connection'}
              {!!onSaveConnectionClicked && (
                <IconButton
                  aria-label="Save Connection"
                  className={editFavoriteButtonStyles}
                  onClick={() => {
                    setShowSaveConnectionModal(true);
                  }}
                >
                  <Icon glyph="Edit" />
                </IconButton>
              )}
            </H3>
            <Description className={descriptionStyles}>
              Connect to a MongoDB deployment
            </Description>
            {!!onSaveConnectionClicked && (
              <IconButton
                aria-label="Save Connection"
                className={favoriteButtonStyles}
                size="large"
                onMouseDown={(event: React.MouseEvent) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  setShowSaveConnectionModal(true);
                }}
              >
                <div className={favoriteButtonContentStyles}>
                  <FavoriteIcon
                    isFavorite={!!initialConnectionInfo.favorite}
                    size={spacing[5]}
                  />
                  <span className={favoriteButtonLabelStyles}>FAVORITE</span>
                </div>
              </IconButton>
            )}
            <ConnectionStringInput
              connectionString={connectionOptions.connectionString}
              enableEditingConnectionString={enableEditingConnectionString}
              setEnableEditingConnectionString={
                setEnableEditingConnectionString
              }
              updateConnectionFormField={updateConnectionFormField}
            />
            {connectionStringInvalidError && (
              <Banner variant={BannerVariant.Danger}>
                {connectionStringInvalidError.message}
              </Banner>
            )}
            <AdvancedConnectionOptions
              errors={connectionStringInvalidError ? [] : errors}
              disabled={!!connectionStringInvalidError}
              updateConnectionFormField={updateConnectionFormField}
              connectionOptions={connectionOptions}
            />
          </div>
          <div className={formFooterStyles}>
            <ConnectFormActions
              errors={connectionStringInvalidError ? [] : errors}
              warnings={connectionStringInvalidError ? [] : warnings}
              saveButton={
                initialConnectionInfo.favorite
                  ? isDirty
                    ? 'enabled'
                    : 'disabled'
                  : 'hidden'
              }
              onSaveClicked={async () => {
                if (onSaveConnectionClicked) {
                  await onSaveConnectionClicked({
                    ...cloneDeep(initialConnectionInfo),
                    connectionOptions: cloneDeep(connectionOptions),
                  });
                }
              }}
              onConnectClicked={() => {
                const updatedConnectionOptions = cloneDeep(connectionOptions);
                const formErrors = validateConnectionOptionsErrors(
                  updatedConnectionOptions
                );
                if (formErrors.length) {
                  setErrors(formErrors);
                  return;
                }
                onConnectClicked({
                  ...initialConnectionInfo,
                  connectionOptions: updatedConnectionOptions,
                });
              }}
            />
          </div>
        </Card>
      </div>
      {!!onSaveConnectionClicked && (
        <SaveConnectionModal
          open={showSaveConnectionModal}
          onCancelClicked={() => {
            setShowSaveConnectionModal(false);
          }}
          onSaveClicked={async (favoriteInfo: ConnectionFavoriteOptions) => {
            setShowSaveConnectionModal(false);

            try {
              await onSaveConnectionClicked({
                ...cloneDeep(initialConnectionInfo),
                connectionOptions: cloneDeep(connectionOptions),
                favorite: {
                  ...favoriteInfo,
                },
              });
            } catch (err) {
              setErrors([err as Error]);
            }
          }}
          key={initialConnectionInfo.id}
          initialFavoriteInfo={initialConnectionInfo.favorite}
        />
      )}
    </>
  );
}

export default ConnectForm;
