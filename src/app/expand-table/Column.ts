export interface Column {
    id: string;
    name: string;
    isDesktopOnly?: boolean;
    width: string;
    type: string;
    mobileWidth?: string;
    action?: string,
    iconName?: string;
    isCenter?: boolean,
    style?: any;
}