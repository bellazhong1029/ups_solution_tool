import './Header.css'
import deltaLogo from '../assets/delta-electronics-logo.svg'

function Header(){
    return (
        <div className='Header'>
            <img src={deltaLogo} alt='Delta Logo'/>
            <h>UPS Solution Tool</h>
            <div/>
        </div>
    )
}

export default Header;