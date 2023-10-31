import Specific from './Specific';
import Global from './Gobal';
import Stats from './Stats';
import World from './World';

import './styles/Content.css';

const Content = () => {
    return (
        <div className="content">
            {/* Gotta have display BEHIND the topical
                elements! */}
            <div className='overlay'>
                <fieldset className='spfc' >
                    <legend>Premade Commands</legend>
                    <Specific />
                </fieldset>
                <fieldset className='gbl'>
                    <legend>Custom Commands</legend>
                    <Global />
                </fieldset>
                <fieldset className='stts'>
                    <legend>Turtle Data</legend>
                    <Stats />
                </fieldset>
                <div className='display'><World></World></div>
            </div>
        </div>
    );
}

export default Content;