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
  <div style={{ marginTop: '40px', fontSize: '0.75rem', color: '#666', maxWidth: '600px', margin: '40px auto' }}>
          <hr style={{ border: '0.5px solid #eee', marginBottom: '20px' }} />
          <p>
            <strong>Legal Notice:</strong> The character <em>Salem Saberhagen</em> is a 
            copyrighted property of <strong>Archie Comic Publications, Inc.</strong> and 
            <strong> Viacom/Paramount Global</strong>. 
          </p>
          <p>
            This image is used for <strong>educational and transformative purposes</strong> 
            under the <strong>Fair Use</strong> doctrine (Section 107 of the U.S. Copyright Act), 
            specifically for non-commercial commentary and instructional illustration.
          </p>
    </div>
  <Footer/>
  </>
  );
}

export default NotFound;

