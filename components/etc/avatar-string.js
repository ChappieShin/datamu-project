import { Avatar } from 'antd';

const string2color = (string) => {
    let hash = 0;
    let color = '#';
    let i;

    for (i = 0 ; i < string.length ; i+=1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (i = 0 ; i < 3 ; i+=1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export default function StringAvatar({ fname, lname, size='default' }) {
    return (
        <Avatar size={size} style={{ backgroundColor: string2color(fname + ' ' + lname) }}>
            {fname.charAt(0) + lname.charAt(0)}
        </Avatar>
    );
}