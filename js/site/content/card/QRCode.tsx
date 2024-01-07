import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    text: string;
    size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text, size = 128 }) => {
    return <QRCode value={text} size={size} />;
}

export default QRCodeGenerator;
