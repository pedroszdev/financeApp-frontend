export default function Skeleton({ className = '', height, width, rounded = 'rounded-sm' }) {
  const style = {};
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  return <div className={`skeleton ${rounded} ${className}`} style={style} />;
}
