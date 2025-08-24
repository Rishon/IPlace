// React
import { useEffect, useState } from 'react';

// SpacetimeDB
import { DbConnection, type ErrorContext, type EventContext } from '@/module_bindings';
import { Identity } from '@clockworklabs/spacetimedb-sdk';

export default function SpacetimeDB() {
    const [connected, setConnected] = useState<boolean>(false);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [conn, setConn] = useState<DbConnection | null>(null);

    useEffect(() => {
        const onConnect = (
            conn: DbConnection,
            identity: Identity,
            token: string
        ) => {
            setIdentity(identity);
            setConnected(true);
            localStorage.setItem('auth_token', token);
            console.log(
                'Connected to SpacetimeDB with identity:',
                identity.toHexString()
            );
        };

        const onDisconnect = () => {
            console.log('Disconnected from SpacetimeDB');
            setConnected(false);
        };

        const onConnectError = (_ctx: ErrorContext, err: Error) => {
            console.log('Error connecting to SpacetimeDB:', err);
        };

        setConn(
            DbConnection.builder()
                .withUri('ws://iplace-ws.rishon.systems')
                .withModuleName('iplace-live')
                .withToken(localStorage.getItem('auth_token') || '')
                .onConnect(onConnect)
                .onDisconnect(onDisconnect)
                .onConnectError(onConnectError)
                .build()
        );
    }, []);
}