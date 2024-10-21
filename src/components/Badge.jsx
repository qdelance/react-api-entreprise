import './Badge.css'

function Badge({children, danger}) {
    const className = danger ? 'danger' : 'success';
    return (
        <span className={`badge ${className}`}>{children}</span>
    )
}

export default Badge;