import React, { Fragment, useState } from 'react';
import {
  Button,
  FavoriteIcon,
  H2,
  Icon,
  uiColors,
  compassUIColors,
  spacing,
  css,
  cx,
} from '@mongodb-js/compass-components';
import type { ConnectionInfo } from 'mongodb-data-service';

import Connection from './connection';

const newConnectionButtonContainerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  alignItems: 'stretch',
  background: uiColors.gray.dark2,
  position: 'relative',
  fontWeight: 'bold',
  color: uiColors.white,
  height: spacing[6] + spacing[2],
  overflow: 'hidden',
});

const newConnectionButtonStyles = css({
  border: 'none',
  height: 'inherit',
  borderRadius: 0,
  ':hover': {
    border: 'none',
    boxShadow: 'none',
  },
});

const newConnectionButtonContent = css({
  fontSize: '18px',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const sectionHeaderStyles = css({
  marginTop: spacing[4],
  marginBottom: spacing[3],
  paddingLeft: spacing[3],
  paddingRight: spacing[2],
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  ':hover': {},
});

const recentHeaderStyles = css({
  marginTop: spacing[4],
});

const sectionHeaderTitleStyles = css({
  color: 'white',
  flexGrow: 1,
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 700,
});

const sectionHeaderIconStyles = css({
  fontSize: spacing[3],
  margin: 0,
  marginRight: spacing[2],
  padding: 0,
  display: 'flex',
});

const connectionListSectionStyles = css({
  overflowY: 'auto',
  padding: 0,
  paddingBottom: spacing[3],
  '::-webkit-scrollbar-thumb': {
    background: compassUIColors.transparentGray,
  },
});

const connectionListStyles = css({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
});

const recentIcon = (
  <svg
    width={spacing[4]}
    height={spacing[4]}
    viewBox="0 0 24 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.66663 11.6667C9.66663 14.0566 11.6101 16 14 16C16.3899 16 18.3333 14.0566 18.3333 11.6667C18.3333 9.27677 16.3899 7.33333 14 7.33333C11.6101 7.33333 9.66663 9.27677 9.66663 11.6667Z"
      stroke="white"
    />
    <path
      d="M4.99998 12.449C4.99998 12.2348 4.99998 12.0475 4.99998 11.8333C4.99998 6.96162 8.9616 3 13.8333 3C18.705 3 22.6666 6.96162 22.6666 11.8333C22.6666 16.705 18.705 20.6667 13.8333 20.6667M1.33331 9L4.63998 12.1795C4.85331 12.3846 5.17331 12.3846 5.35998 12.1795L8.66665 9"
      stroke="white"
      strokeMiterlimit="10"
    />
    <path d="M13.6666 10V12H15.6666" stroke="white" strokeMiterlimit="10" />
  </svg>
);

export type ConnectionInfoFavorite = ConnectionInfo &
  Required<Pick<ConnectionInfo, 'favorite'>>;

function ConnectionList({
  activeConnectionId,
  connections,
  createNewConnection,
  setActiveConnectionId,
  onDoubleClick,
  removeAllRecentsConnections,
  duplicateConnection,
  removeConnection,
}: {
  activeConnectionId?: string;
  connections: ConnectionInfo[];
  createNewConnection: () => void;
  setActiveConnectionId: (connectionId: string) => void;
  onDoubleClick: (connectionInfo: ConnectionInfo) => void;
  removeAllRecentsConnections: () => void;
  duplicateConnection: (connectionInfo: ConnectionInfo) => void;
  removeConnection: (connectionInfo: ConnectionInfo) => void;
}): React.ReactElement {
  const [recentHeaderHover, setRecentHover] = useState(false);
  const favoriteConnections = connections
    .filter(
      (connectionInfo): connectionInfo is ConnectionInfoFavorite =>
        !!connectionInfo.favorite
    )
    .sort((a: ConnectionInfoFavorite, b: ConnectionInfoFavorite) => {
      return b.favorite.name.toLocaleLowerCase() <
        a.favorite.name.toLocaleLowerCase()
        ? 1
        : -1;
    });

  const recentConnections = connections
    .filter((connectionInfo) => !connectionInfo.favorite)
    .sort((a, b) => {
      // The `lastUsed` value hasn't always existed, so we assign
      // them a date in 2016 for sorting if it isn't there.
      const aLastUsed = a.lastUsed ? a.lastUsed.getTime() : 1463658247465;
      const bLastUsed = b.lastUsed ? b.lastUsed.getTime() : 1463658247465;
      return bLastUsed - aLastUsed;
    });

  return (
    <Fragment>
      <div className={newConnectionButtonContainerStyles}>
        <Button
          className={newConnectionButtonStyles}
          darkMode
          onClick={createNewConnection}
        >
          <div className={newConnectionButtonContent}>
            <span>New Connection</span>
            <Icon fill={uiColors.white} glyph="Plus" />
          </div>
        </Button>
      </div>
      <div className={connectionListSectionStyles}>
        <div className={sectionHeaderStyles}>
          <div className={sectionHeaderIconStyles}>
            <FavoriteIcon darkMode />
          </div>
          <H2 className={sectionHeaderTitleStyles}>Favorites</H2>
        </div>
        <ul className={connectionListStyles}>
          {favoriteConnections.map((connectionInfo, index) => (
            <li
              data-testid="favorite-connection"
              key={`${connectionInfo.id || ''}-${index}`}
            >
              <Connection
                data-testid="favorite-connection"
                key={`${connectionInfo.id || ''}-${index}`}
                isActive={
                  !!activeConnectionId &&
                  activeConnectionId === connectionInfo.id
                }
                connectionInfo={connectionInfo}
                onClick={() => setActiveConnectionId(connectionInfo.id)}
                onDoubleClick={onDoubleClick}
                removeConnection={removeConnection}
                duplicateConnection={duplicateConnection}
              />
            </li>
          ))}
        </ul>
        <div
          className={cx(sectionHeaderStyles, recentHeaderStyles)}
          onMouseEnter={() => setRecentHover(true)}
          onMouseLeave={() => setRecentHover(false)}
        >
          <div className={sectionHeaderIconStyles}>{recentIcon}</div>
          <H2 className={sectionHeaderTitleStyles}>Recents</H2>
          {recentHeaderHover && (
            <Button
              onClick={removeAllRecentsConnections}
              variant="default"
              size="xsmall"
              darkMode
            >
              Clear All
            </Button>
          )}
        </div>
        <ul className={connectionListStyles}>
          {recentConnections.map((connectionInfo, index) => (
            <li
              data-testid="recent-connection"
              key={`${connectionInfo.id || ''}-${index}`}
            >
              <Connection
                isActive={
                  !!activeConnectionId &&
                  activeConnectionId === connectionInfo.id
                }
                connectionInfo={connectionInfo}
                onClick={() => setActiveConnectionId(connectionInfo.id)}
                onDoubleClick={onDoubleClick}
                removeConnection={removeConnection}
                duplicateConnection={duplicateConnection}
              />
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
}

export default ConnectionList;
