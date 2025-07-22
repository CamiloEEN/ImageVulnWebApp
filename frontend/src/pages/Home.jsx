import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Home() {
  return (
     <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <h1>Bienvenido a ImageContrastApp</h1>
        <p>Transforma el contraste de tus imágenes directamente desde tu navegador.</p>
        {/* Aquí puedes agregar más secciones como hero, features, etc. */}
      </main>
      <Footer />
    </>
  );
}

export default Home;
