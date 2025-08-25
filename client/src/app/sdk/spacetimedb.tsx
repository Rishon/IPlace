/* eslint-disable @typescript-eslint/no-unused-vars */

// SpacetimeDB
import { DbConnection, type ErrorContext } from '@/module_bindings';
import { Identity } from '@clockworklabs/spacetimedb-sdk';

interface Tile {
    latitude: number;
    longitude: number;
}

let connection: DbConnection | null = null;
let connectionIdentity: Identity | null = null;
let activeConnection: boolean | null = null;

const subscribeToQueries = (connection: DbConnection, queries: string[]) => {
    connection
        ?.subscriptionBuilder()
        .onApplied(() => {
            console.log('SDK client cache initialized.');
        })
        .subscribe(queries);
};

const onConnect = (
    conn: DbConnection,
    identity: Identity,
    token: string
) => {

    connectionIdentity = identity;
    activeConnection = true;

    localStorage.setItem('auth_token', token);
    console.log(
        'Connected to WS with identity:',
        identity.toHexString()
    );

    subscribeToQueries(conn, ['SELECT * FROM tile']);
};

const onDisconnect = () => {
    console.log('Disconnected from WS!');
    activeConnection = false;
};

const onConnectError = (_ctx: ErrorContext, err: Error) => {
    console.log('Error connecting to WS:', err);
};

export function connect() {
    connection =
        DbConnection.builder()
            .withUri(process.env.NEXT_PUBLIC_SPACETIMEDB_URI || 'ws://127.0.0.1:3001')
            .withModuleName('iplace-live')
            .withToken(localStorage.getItem('auth_token') || '')
            .onConnect(onConnect)
            .onDisconnect(onDisconnect)
            .onConnectError(onConnectError)
            .build()
}

export function addTile(tile: Tile) {
    getConnection().reducers.addTile(tile.latitude, tile.longitude);
}

function getConnection() {
    if (connection) {
        return connection;
    }

    throw new Error('Not connected to WS!');
}