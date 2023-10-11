import React from 'react';
import {
    Stack,
} from '@fluentui/react';
import {AuthForm} from "@/components/Auth/AuthForm";

const styles = {
    authContainer: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export const AuthLandingPage: React.FC = () => {
    return (
        <div style={styles.authContainer}>
            <Stack
                horizontalAlign="center"
                verticalAlign="center"
                verticalFill
                tokens={{
                    childrenGap: 20,
                }}
            >
                <h3>If you don't know, you don't know</h3>
                <AuthForm />
            </Stack>
        </div>
    );
};
