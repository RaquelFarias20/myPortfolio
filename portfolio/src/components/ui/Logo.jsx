import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Raquel Farías — home">
      RF<span>.</span>G
    </Link>
  )
}
