import React from 'react';
import { Image, Text, Stack, Persona, IconButton } from '@fluentui/react';

type CardProps = {
    imageUrl: string;
    title: string;
    username: string;
    userProfilePic: string;
};

const PinterestCard: React.FC<CardProps> = ({ imageUrl, title, username, userProfilePic }) => {
    return (
        <Stack tokens={{ childrenGap: 10, padding: 10 }}>
            <Image src={imageUrl} alt={title} width={200} />
            <Text>{title}</Text>
            <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
                <Persona imageUrl={userProfilePic} text={username} size={24} />
                <IconButton iconProps={{ iconName: 'Save' }} title="Save" ariaLabel="Save" />
            </Stack>
        </Stack>
    );
};

type PinterestGridViewProps = {
    cards: CardProps[];
};

export const PinterestGridView: React.FC<PinterestGridViewProps> = ({ cards }) => {
    return (
        <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
            {cards.map((card, index) => (
                <PinterestCard key={index} {...card} />
            ))}
        </Stack>
    );
};
