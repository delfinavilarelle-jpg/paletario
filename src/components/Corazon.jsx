export default function Corazon({ lleno, size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 6 4 4 7.5C19 16.65 12 21 12 21z"
        fill={lleno ? '#5c0000' : 'none'} stroke="#5c0000" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}
