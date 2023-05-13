import {Metadata} from "next";
import {ReactNode} from "react";

import "~/styles/globals.css";

export const metadata: Metadata = {
    title: 'Food Quiz',
    description: 'Find Out Which Food You Are',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
