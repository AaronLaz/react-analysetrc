import Spinner from 'react-bootstrap/Spinner';
import '../App.css';

function Loading() {
    return (
        <div className='loader'>
            <Spinner animation="border" role="status" style={{ width: "4rem", height: "4rem" }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default Loading;