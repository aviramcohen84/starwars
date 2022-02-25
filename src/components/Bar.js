import React from 'react'

export default function Bar({ value, height, label }) {
    return (
        <div className="bar">
            <div className="label">{ label }</div>
            <div className="value" style={{ height: `${height}%` }}></div>
            <div className="label">{ value }</div>
        </div>
    )
}
