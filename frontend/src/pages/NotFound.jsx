import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NotFound() {
  return (<>
  <h1>Error 404</h1>

  <div>
    <img src="/Salem.jpg" alt="Salem" width={300}  />
    <h2>¿Que busca mijo?</h2>
    <p>La página que busca no se encuentra. ¿Has escrito bien la URL?</p>
  </div>
  <Footer/>
  </>
  );
}

export default NotFound;