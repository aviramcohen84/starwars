import React from 'react';

export default function Loading({ value, text}) {
    return (
        <div className={`loading${!value ? " hide" : ""}`}>{ text }</div>
    )
}
