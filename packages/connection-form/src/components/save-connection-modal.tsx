import React, { useState } from 'react';
import {
  ConfirmationModal,
  TextInput,
  css,
  spacing,
} from '@mongodb-js/compass-components';
import type { ConnectionFavoriteOptions } from 'mongodb-data-service';

import FormFieldContainer from './form-field-container';
import { FavoriteColorPicker } from './favorite-color-picker';

const connectionNameInputStyles = css({
  marginTop: spacing[5],
});

function SaveConnectionModal({
  initialFavoriteInfo,
  onCancelClicked,
  onSaveClicked,
  open,
}: {
  initialFavoriteInfo?: ConnectionFavoriteOptions;
  onCancelClicked: () => void;
  onSaveClicked: (favoriteInfo: ConnectionFavoriteOptions) => Promise<void>;
  open: boolean;
}): React.ReactElement {
  const [editingFavorite, setEditingFavorite] = useState({
    name: '',
    ...initialFavoriteInfo,
  });

  return (
    <ConfirmationModal
      title={
        initialFavoriteInfo ? 'Edit favorite' : 'Save connection to favorites'
      }
      open={open}
      onConfirm={() => {
        void onSaveClicked({
          ...editingFavorite,
        });
      }}
      submitDisabled={(editingFavorite.name || '').trim() ? false : true}
      onCancel={onCancelClicked}
      buttonText="Save"
    >
      <FormFieldContainer>
        <TextInput
          className={connectionNameInputStyles}
          spellCheck={false}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLInputElement>) => {
            setEditingFavorite({
              ...editingFavorite,
              name: value,
            });
          }}
          label="Name"
          value={editingFavorite.name}
        />
      </FormFieldContainer>
      <FormFieldContainer>
        <FavoriteColorPicker
          colorCode={editingFavorite.color}
          onChange={(newColor?: string) => {
            setEditingFavorite({
              ...editingFavorite,
              color: newColor,
            });
          }}
        />
      </FormFieldContainer>
    </ConfirmationModal>
  );
}

export default SaveConnectionModal;
