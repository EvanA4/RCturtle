import Move from './Move';
import Actions from './Actions';

import './styles/Specific.css';

const Specific = () => {
    return (
        <div className='specific'>
            <div className='mv'><Move /></div>
            <div className='act'><Actions /></div>
        </div>
    );
}

export default Specific;