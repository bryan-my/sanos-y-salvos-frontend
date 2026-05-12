import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const featuredPets = useMemo(
    () => [
      {
        title: 'Luna',
        estado: 'PERDIDA',
        location: 'Ñuñoa, Santiago',
        imageUrl:
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=70',
      },
      {
        title: 'Max',
        estado: 'EN_CASA',
        location: 'Providencia, Santiago',
        imageUrl:
          'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=70',
      },
      {
        title: 'Milo',
        estado: 'ENCONTRADA',
        location: 'Maipú, Santiago',
        imageUrl:
          'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=1200&q=70',
      },
      {
        title: 'Kiara',
        estado: 'PERDIDA',
        location: 'Valparaíso',
        imageUrl:
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=70',
      },
      {
        title: 'Toby',
        estado: 'EN_CASA',
        location: 'La Florida, Santiago',
        imageUrl:
          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=70',
      },
      {
        title: 'Nala',
        estado: 'ENCONTRADA',
        location: 'Concepción',
        imageUrl:
          'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=1200&q=70',
      },
    ],
    []
  );

  const handleScrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getEstadoLabel = (estado) => {
    if (estado === 'PERDIDA') return 'Perdida';
    if (estado === 'ENCONTRADA') return 'Encontrada';
    if (estado === 'EN_CASA') return 'En casa';
    return estado;
  };

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span className="brand-text">Sanos y Salvos</span>
          </Link>

          <nav className="nav">
            <a href="#inicio" className="nav-link" onClick={handleScrollTo('inicio')}>Inicio</a>
            <Link to="/registrar-mascota" className="nav-link">Registrar mascota</Link>
            <Link to="/mascotas" className="nav-link">Mascotas</Link>
            <a href="#como-funciona" className="nav-link" onClick={handleScrollTo('como-funciona')}>Cómo funciona</a>
            <a href="#informacion" className="nav-link" onClick={handleScrollTo('informacion')}>Información</a>
            <a href="#contacto" className="nav-link" onClick={handleScrollTo('contacto')}>Contacto</a>
          </nav>

          <div className="auth-area">
            {isAuthenticated ? (
              <>
                <div className="auth-user">
                  <div className="auth-user-label">Conectado</div>
                  <div className="auth-user-value">{user?.nombreCompleto || user?.email}</div>
                </div>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-primary">
                  {isAdmin ? 'Panel Admin' : 'Mi Panel'}
                </Link>
                <button type="button" onClick={logout} className="btn btn-ghost">Cerrar sesión</button>
              </>
            ) : (
              <div className="auth-cta">
                <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                <div className="auth-secondary">
                  <span>¿Primera vez?</span> <Link to="/register" className="inline-link">Regístrate</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="hero-badge">Red de apoyo • Reportes en tiempo real</div>
              <h1>Ayudamos a que vuelvan a casa</h1>
              <p className="lead">
                Publica y revisa reportes de mascotas perdidas o encontradas. La lectura es abierta; para registrar mascotas necesitas una cuenta.
              </p>

              <div className="hero-actions">
                <Link to="/mascotas" className="btn btn-primary">Ver mascotas</Link>
                <Link to="/registrar-mascota" className="btn btn-outline">Registrar una mascota</Link>
              </div>
            </div>

            <div className="hero-media" aria-hidden="true">
              <div className="photo-grid">
                <div className="photo-card photo-card-lg" />
                <div className="photo-card photo-card-sm photo-card-1" />
                <div className="photo-card photo-card-sm photo-card-2" />
              </div>
            </div>
          </div>
        </section>

        <section id="mascotas" className="section">
          <div className="container">
            <div className="section-head">
              <h2>Mascotas destacadas</h2>
              <p>Algunos ejemplos. Para ver todas las mascotas registradas, abre el listado.</p>
            </div>

            <div className="card-grid">
              {featuredPets.map((p) => (
                <article key={`${p.title}-${p.location}`} className="pet-card">
                  <div className="pet-image" style={{ backgroundImage: `url(${p.imageUrl})` }} />
                  <div className="pet-body">
                    <div className="pet-top">
                      <h3 className="pet-title">{p.title}</h3>
                      <span className={`pill pill-${p.estado.toLowerCase()}`}>{getEstadoLabel(p.estado)}</span>
                    </div>
                    <div className="pet-meta">{p.location}</div>
                    <div className="pet-actions">
                      <Link to="/mascotas" className="btn btn-ghost btn-sm">Ver todas</Link>
                      <Link to="/registrar-mascota" className="btn btn-outline btn-sm">Registrar</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2>Cómo funciona</h2>
              <p>Un flujo simple para que la comunidad pueda ayudar rápido.</p>
            </div>

            <div className="feature-grid">
              <div className="feature">
                <div className="feature-number">1</div>
                <div className="feature-title">Crea tu cuenta</div>
                <div className="feature-text">Regístrate con tu información para poder administrar tus reportes.</div>
              </div>
              <div className="feature">
                <div className="feature-number">2</div>
                <div className="feature-title">Registra tu mascota</div>
                <div className="feature-text">Agrega ficha, foto y estado: perdida, encontrada o en casa.</div>
              </div>
              <div className="feature">
                <div className="feature-number">3</div>
                <div className="feature-title">Difunde y encuentra</div>
                <div className="feature-text">Comparte el reporte y revisa coincidencias/avisos cuando exista el módulo.</div>
              </div>
            </div>
          </div>
        </section>

        <section id="informacion" className="section">
          <div className="container split">
            <div>
              <h2>Información</h2>
              <p className="muted">
                Sanos y Salvos sirve para publicar y encontrar reportes de mascotas perdidas o encontradas, para que más personas puedan ayudar a que vuelvan con su familia. Está pensado para dueños, clínicas y refugios, con foco en claridad y rapidez.
              </p>
              <div className="stat-row">
                <div className="stat">
                  <div className="stat-value">Reporta</div>
                  <div className="stat-label">Una mascota</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Busca</div>
                  <div className="stat-label">En el listado</div>
                </div>
                <div className="stat">
                  <div className="stat-value">Difunde</div>
                  <div className="stat-label">Para sumar ayuda</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-title">Accesos rápidos</div>
              <div className="info-card-links">
                <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
                <Link to="/register" className="btn btn-outline">Registrarse</Link>
                {isAuthenticated && (
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn btn-ghost">
                    Ir a mi panel
                  </Link>
                )}
              </div>
              <div className="info-card-note">
                Revisa reportes y, si necesitas publicar, crea una cuenta para administrar tus publicaciones.
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="section section-alt">
          <div className="container">
            <div className="contact-card">
              <div>
                <h2>Contacto</h2>
                <p className="muted">¿Eres clínica o refugio y quieres colaborar? Podemos agregar roles y flujos específicos.</p>
              </div>
              <div className="contact-actions">
                <a className="btn btn-primary" href="mailto:contacto@sanosysalvos.cl">Escribir correo</a>
                <a className="btn btn-outline" href="#inicio" onClick={handleScrollTo('inicio')}>Volver arriba</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-col">
            <div className="footer-brand">Sanos y Salvos</div>
            <div className="footer-text">Plataforma de apoyo para reportar y localizar mascotas.</div>
          </div>
          <div className="footer-col">
            <div className="footer-title">Secciones</div>
            <a href="#inicio" className="footer-link" onClick={handleScrollTo('inicio')}>Inicio</a>
            <a href="#mascotas" className="footer-link" onClick={handleScrollTo('mascotas')}>Mascotas</a>
            <a href="#informacion" className="footer-link" onClick={handleScrollTo('informacion')}>Información</a>
            <a href="#contacto" className="footer-link" onClick={handleScrollTo('contacto')}>Contacto</a>
          </div>
          <div className="footer-col">
            <div className="footer-title">Cuenta</div>
            <Link to="/login" className="footer-link">Iniciar sesión</Link>
            <Link to="/register" className="footer-link">Registrarse</Link>
            {isAuthenticated && (
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="footer-link">Mi panel</Link>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} Sanos y Salvos</span>
            <span className="footer-bottom-muted">Hecho con foco en claridad y rapidez</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
